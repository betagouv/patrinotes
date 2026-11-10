import { Spinner } from "#components/Spinner.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Box, IconButton } from "@mui/material";
import { useSyncStream } from "@powersync/react";
import { useNavigate } from "@tanstack/react-router";
import Fuse, { IFuseOptions } from "fuse.js";
import { useEffect, useId, useMemo, useState } from "react";
import Highlighter from "react-highlight-words";
import { PopImmeuble, PopObjet } from "../../db/AppSchema";
import { db, useDbQuery } from "../../db/db";
import { MonumentMapModal } from "../map/MonumentMapModal";

type Edifice = Pick<
  PopImmeuble,
  | "id"
  | "reference"
  | "titre_editorial_de_la_notice"
  | "commune_forme_editoriale"
  | "departement_format_numerique"
  | "adresse_forme_index"
>;
type Mobilier = Pick<
  PopObjet,
  | "reference"
  | "titre_editorial"
  | "denomination"
  | "commune_forme_editoriale"
  | "departement_format_numerique"
  | "edifice_actuel"
  | "nom_de_l_edifice"
>;

type Tab = "edifices" | "mobiliers";
type Suggestion = { key: string; title: string; subtitle: string; open: () => void };

const MAX_RESULTS = 8;

const edificeFuseOptions: IFuseOptions<Edifice> = {
  keys: ["titre_editorial_de_la_notice", "commune_forme_editoriale", "id", "adresse_forme_index"],
  shouldSort: true,
  distance: 1000,
  threshold: 0.4,
};

const mobilierFuseOptions: IFuseOptions<Mobilier> = {
  keys: ["titre_editorial", "denomination", "commune_forme_editoriale", "edifice_actuel", "nom_de_l_edifice", "reference"],
  shouldSort: true,
  distance: 1000,
  threshold: 0.4,
};

const withDepartement = (commune: string | null, departement: string | null) =>
  [commune, departement ? `(${departement})` : null].filter(Boolean).join(" ");

const highlightStyle = { fontWeight: "bold", backgroundColor: "transparent", color: "inherit" };

/**
 * Home page entry point to the fiches: search a monument historique (édifice) or an objet mobilier,
 * or pick an édifice on the map, then open its fiche.
 */
export const HomeMonumentSearch = () => {
  const navigate = useNavigate();
  const inputId = useId();
  const listboxId = useId();
  const [inputValue, setInputValue] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [tab, setTab] = useState<Tab>("edifices");
  const [isMapOpen, setIsMapOpen] = useState(false);

  const edificesQuery = useDbQuery(
    db
      .selectFrom("pop_immeubles")
      .select([
        "id",
        "reference",
        "titre_editorial_de_la_notice",
        "commune_forme_editoriale",
        "departement_format_numerique",
        "adresse_forme_index",
      ]),
  );
  const mobiliersQuery = useDbQuery(
    db
      .selectFrom("pop_objets")
      .select([
        "reference",
        "titre_editorial",
        "denomination",
        "commune_forme_editoriale",
        "departement_format_numerique",
        "edifice_actuel",
        "nom_de_l_edifice",
      ]),
  );
  const edifices = edificesQuery.data ?? [];
  const mobiliers = mobiliersQuery.data ?? [];
  const edificeSearch = useMemo(() => new Fuse(edifices, edificeFuseOptions), [edifices]);
  const mobilierSearch = useMemo(() => new Fuse(mobiliers, mobilierFuseOptions), [mobiliers]);
  const popSynced = useSyncStream({ name: "pop_stream" })?.subscription.hasSynced;

  const query = inputValue.trim();

  const openEdifice = (id: string | null) => {
    if (!id) return;
    navigate({ to: "/monument/$reference", params: { reference: id }, search: {} });
  };
  const openMobilier = (reference: string | null) => {
    if (!reference) return;
    navigate({ to: "/objet/$reference", params: { reference } });
  };

  const suggestions = useMemo<Suggestion[]>(() => {
    if (!query) return [];
    const isReference = /^(PA|PM)/i.test(query);
    if (tab === "edifices") {
      let results = edificeSearch.search(query).map((r) => r.item);
      if (isReference) results = results.filter((r) => r.id?.toLowerCase().startsWith(query.toLowerCase()));
      return results.slice(0, MAX_RESULTS).map((item) => ({
        key: item.id ?? item.reference ?? "",
        title: item.titre_editorial_de_la_notice || item.id || "",
        subtitle: withDepartement(item.commune_forme_editoriale, item.departement_format_numerique),
        open: () => openEdifice(item.id),
      }));
    }
    let results = mobilierSearch.search(query).map((r) => r.item);
    if (isReference) results = results.filter((r) => r.reference?.toLowerCase().startsWith(query.toLowerCase()));
    return results.slice(0, MAX_RESULTS).map((item) => ({
      key: item.reference ?? "",
      title: item.titre_editorial || item.denomination || item.reference || "",
      subtitle: [
        withDepartement(item.commune_forme_editoriale, item.departement_format_numerique),
        item.edifice_actuel || item.nom_de_l_edifice,
      ]
        .filter(Boolean)
        .join(" - "),
      open: () => openMobilier(item.reference),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tab, edificeSearch, mobilierSearch]);

  const isOpen = isListOpen && !!query;
  const isLoading = tab === "edifices" ? edificesQuery.isLoading : mobiliersQuery.isLoading;
  const optionId = (index: number) => `${listboxId}-option-${index}`;

  // a new search or another tab starts again from the input
  useEffect(() => setActiveIndex(-1), [query, tab]);

  const openSuggestion = (index: number) => suggestions[index]?.open();

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsListOpen(true);
        setActiveIndex((i) => Math.min(suggestions.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(-1, i - 1));
        break;
      case "Enter":
        e.preventDefault();
        openSuggestion(activeIndex >= 0 ? activeIndex : 0);
        break;
      case "Escape":
        // first closes the list, then clears the search
        if (isOpen) setIsListOpen(false);
        else setInputValue("");
        setActiveIndex(-1);
        break;
    }
  };

  const tabs = [
    ["edifices", "Édifices"],
    ["mobiliers", "Mobiliers"],
  ] as const;
  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next: Tab = e.key === "ArrowLeft" || e.key === "Home" ? "edifices" : "mobiliers";
    setTab(next);
    document.getElementById(`${listboxId}-tab-${next}`)?.focus();
  };

  return (
    <Box width="100%">
      <div className="fr-input-group" style={{ marginBottom: 0 }}>
        <label className="fr-label" htmlFor={inputId}>
          Rechercher un monument historique :
        </label>
        <Flex alignItems="flex-end" gap="8px" mt="8px">
          <Box
            flex="1"
            position="relative"
            // the list stays open while the focus is in the input or the tabs
            onFocus={() => setIsListOpen(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsListOpen(false);
            }}
          >
            <input
              id={inputId}
              className="fr-input"
              style={{ backgroundColor: "white", marginTop: 0 }}
              type="text"
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
              aria-describedby={`${listboxId}-help`}
              autoComplete="off"
              placeholder="édifice, objet mobilier..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsListOpen(true);
              }}
              onKeyDown={onInputKeyDown}
            />
            <span id={`${listboxId}-help`} className="fr-sr-only">
              Flèches haut et bas pour parcourir les suggestions, Entrée pour ouvrir la fiche, Échap pour fermer.
              Les onglets Édifices et Mobiliers suivent le champ.
            </span>
            <span className="fr-sr-only" aria-live="polite">
              {isOpen && !isLoading ? `${suggestions.length || "Aucun"} résultat${suggestions.length > 1 ? "s" : ""}` : ""}
            </span>

            {isOpen ? (
              <Box
                position="absolute"
                top="calc(100% + 4px)"
                left={0}
                right="-48px"
                zIndex={1000}
                bgcolor="white"
                boxShadow="0px 4px 12px rgba(0, 0, 18, 0.16)"
              >
                <Flex role="tablist" aria-label="Type de monument">
                  {tabs.map(([value, label]) => (
                    <SuggestionTab
                      key={value}
                      id={`${listboxId}-tab-${value}`}
                      controls={listboxId}
                      selected={tab === value}
                      // a click keeps the focus in the input
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setTab(value)}
                      onKeyDown={onTabKeyDown}
                    >
                      {label}
                    </SuggestionTab>
                  ))}
                  <Box flex="1" borderTop={`2px solid ${fr.colors.decisions.border.active.blueFrance.default}`} />
                </Flex>
                <Box
                  component="ul"
                  id={listboxId}
                  role="listbox"
                  aria-label={tab === "edifices" ? "Édifices" : "Mobiliers"}
                  m="0"
                  p="0"
                  sx={{ listStyle: "none" }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {suggestions.length ? (
                    suggestions.map((suggestion, index) => (
                      <Box
                        component="li"
                        key={suggestion.key}
                        id={optionId(index)}
                        role="option"
                        aria-selected={index === activeIndex}
                        onClick={suggestion.open}
                        onMouseEnter={() => setActiveIndex(index)}
                        px="16px"
                        py="12px"
                        color={fr.colors.decisions.text.title.blueFrance.default}
                        bgcolor={index === activeIndex ? fr.colors.decisions.background.default.grey.hover : undefined}
                        sx={{
                          cursor: "pointer",
                          outline: index === activeIndex ? "2px solid #0a76f6" : "none",
                          outlineOffset: "-2px",
                        }}
                      >
                        <Box fontSize="16px" lineHeight="24px">
                          {/* @ts-ignore */}
                          <Highlighter
                            searchWords={query.split(/\s+/)}
                            autoEscape
                            textToHighlight={suggestion.title}
                            highlightStyle={highlightStyle}
                          />
                        </Box>
                        {suggestion.subtitle ? (
                          <Box fontSize="12px" lineHeight="20px">
                            {suggestion.subtitle}
                          </Box>
                        ) : null}
                      </Box>
                    ))
                  ) : (
                    <Box component="li" role="presentation" px="16px" py="24px" display="flex" justifyContent="center">
                      {isLoading || !popSynced ? <Spinner size={40} /> : "Aucun résultat"}
                    </Box>
                  )}
                </Box>
              </Box>
            ) : null}
          </Box>
          <IconButton
            type="button"
            title="Choisir sur la carte"
            aria-label="Choisir sur la carte"
            onClick={() => setIsMapOpen(true)}
            sx={{
              flexShrink: 0,
              width: "40px",
              height: "40px",
              borderRadius: 0,
              color: "white",
              backgroundColor: fr.colors.decisions.background.actionHigh.blueFrance.default,
              "&:hover": { backgroundColor: fr.colors.decisions.background.actionHigh.blueFrance.hover },
            }}
          >
            <span className={fr.cx("fr-icon-road-map-line")} aria-hidden="true" />
          </IconButton>
        </Flex>
      </div>

      <MonumentMapModal
        open={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelect={(item) => {
          setIsMapOpen(false);
          openEdifice(item.id);
        }}
      />
    </Box>
  );
};

const SuggestionTab = ({
  id,
  controls,
  selected,
  onClick,
  onMouseDown,
  onKeyDown,
  children,
}: {
  id: string;
  controls: string;
  selected: boolean;
  onClick: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) => (
  <Box
    component="button"
    type="button"
    role="tab"
    id={id}
    aria-selected={selected}
    aria-controls={controls}
    // roving tabindex: Tab reaches the selected tab, arrows switch
    tabIndex={selected ? 0 : -1}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onKeyDown={onKeyDown}
    px="16px"
    py="8px"
    fontSize="16px"
    lineHeight="24px"
    fontWeight="bold"
    border="none"
    borderTop={selected ? "2px solid transparent" : `2px solid ${fr.colors.decisions.border.active.blueFrance.default}`}
    borderLeft={selected ? "none" : `1px solid ${fr.colors.decisions.border.default.grey.default}`}
    bgcolor={selected ? fr.colors.decisions.background.actionLow.blueFrance.default : "white"}
    color={selected ? fr.colors.decisions.text.actionHigh.grey.default : fr.colors.decisions.text.active.blueFrance.default}
    sx={{ cursor: "pointer", "&:focus-visible": { outline: "2px solid #0a76f6", outlineOffset: "-2px" } }}
  >
    {children}
  </Box>
);
