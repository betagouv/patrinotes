import { Alert, Button, Center } from "#components/MUIDsfr.tsx";
import { SimpleBanner } from "#components/Banner.tsx";
import { BackHomeButton } from "#components/BackHomeButton.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Autocomplete, Box, IconButton, Typography } from "@mui/material";
import { useSyncStream } from "@powersync/react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import Fuse, { IFuseOptions } from "fuse.js";
import { useMemo, useState } from "react";
import Highlighter from "react-highlight-words";
import { useStyles } from "tss-react";
import { v4 } from "uuid";
import { useUser } from "../../contexts/AuthContext";
import { PopImmeuble } from "../../db/AppSchema";
import { db, useDbQuery } from "../../db/db";
import { MonumentMapModal } from "../map/MonumentMapModal";

type SearchItem = Pick<
  PopImmeuble,
  "reference" | "id" | "titre_editorial_de_la_notice" | "commune_forme_editoriale" | "adresse_forme_index"
>;

const fuseOptions: IFuseOptions<SearchItem> = {
  keys: ["titre_editorial_de_la_notice", "commune_forme_editoriale", "id", "adresse_forme_index"],
  shouldSort: true,
  distance: 1000,
  threshold: 0.5,
};

const highlightStyle = {
  fontWeight: "bold",
  backgroundColor: "transparent",
  color: fr.colors.decisions.text.actionHigh.blueFrance.default,
};

/**
 * First step of a constat d'état: find the monument historique (name, reference or map), which opens its fiche;
 * the constat is created from there. A constat may also be started without monument.
 */
export const MonumentSearch = () => {
  const navigate = useNavigate();
  const user = useUser()!;
  const { cx } = useStyles();
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const immeublesQuery = useDbQuery(
    db
      .selectFrom("pop_immeubles")
      .select(["reference", "id", "titre_editorial_de_la_notice", "commune_forme_editoriale", "adresse_forme_index"]),
  );
  const items = immeublesQuery.data ?? [];
  const searchEngine = useMemo(() => new Fuse(items, fuseOptions), [items]);
  const popSynced = useSyncStream({ name: "pop_stream" })?.subscription.hasSynced;

  const openFiche = (item: { id: string | null } | null) => {
    if (!item?.id) return;
    navigate({ to: "/monument/$reference", params: { reference: item.id }, search: {} });
  };

  // as before the fiche: an empty constat, linked to a monument later or never
  const createWithoutMonumentMutation = useMutation({
    mutationFn: async () => {
      const id = v4();
      await db
        .insertInto("state_report")
        .values({
          id,
          created_by: user.id,
          created_at: new Date().toISOString(),
          disabled: 0,
          version: 2,
          service_id: user.service_id,
          redacted_by: user.name,
          date_visite: new Date().toISOString(),
          reference_pop: "CUSTOM",
        })
        .execute();
      return id;
    },
    onSuccess: (constatId) =>
      navigate({ to: "/constat/$constatId", params: { constatId }, search: { step: "informations", mode: "view" } }),
  });

  return (
    <Flex flexDirection="column" width="100%">
      <SimpleBanner width="100%" alignItems="flex-start" pt="24px" pb={{ xs: "40px", lg: "72px" }}>
        <Flex width={{ xs: "100%", lg: "1200px" }} maxWidth="100%" flexDirection="column" px="16px">
          <BackHomeButton />
          <Typography component="h1" fontSize="20px !important" fontWeight="bold" mt="24px" mb="8px !important">
            Constat d’état
          </Typography>
          <Typography mb="32px">
            Recherchez un monument historique pour consulter sa fiche, puis créez votre constat :
          </Typography>

          <Box width={{ xs: "100%", lg: "792px" }} maxWidth="100%">
            <Autocomplete
              open={isOpen && !!inputValue}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
              disablePortal
              clearOnBlur={false}
              options={items}
              value={null}
              getOptionLabel={(item) => item.titre_editorial_de_la_notice || ""}
              getOptionKey={(item) => item.id!}
              filterOptions={(_options, state) => {
                if (!state.inputValue) return [];
                const results = searchEngine
                  .search(state.inputValue)
                  .map((result) => result.item)
                  .slice(0, 15);
                if (state.inputValue.trim().toUpperCase().startsWith("PA")) {
                  return results.filter((r) => r.reference?.toLowerCase().startsWith(state.inputValue.trim().toLowerCase()));
                }
                return results;
              }}
              onChange={(_e, item) => openFiche(item)}
              inputValue={inputValue}
              onInputChange={(_e, value) => setInputValue(value)}
              noOptionsText={
                inputValue ? (
                  <Center height="80px">{immeublesQuery.isLoading || !popSynced ? <Spinner size={50} /> : "Aucun résultat"}</Center>
                ) : null
              }
              renderOption={({ key, ...props }, option, state) => (
                <Box
                  component="li"
                  {...props}
                  key={key}
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start !important"
                  color={fr.colors.decisions.text.actionHigh.blueFrance.default}
                >
                  <Box component="span" fontSize="16px">
                    {/* @ts-ignore */}
                    <Highlighter
                      searchWords={state.inputValue.split(" ")}
                      autoEscape
                      textToHighlight={option.titre_editorial_de_la_notice ?? ""}
                      highlightStyle={highlightStyle}
                    />
                  </Box>
                  <Box component="span" fontSize="12px">
                    {[option.commune_forme_editoriale, option.adresse_forme_index, option.reference].filter(Boolean).join(" - ")}
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor={params.id}>
                    Nom ou référence du monument
                  </label>
                  <Flex alignItems="center" gap="8px" mt="8px">
                    <Box ref={params.InputProps.ref} flex="1">
                      <input
                        {...params.inputProps}
                        className={cx(params.inputProps.className, "fr-input")}
                        style={{ backgroundColor: "white" }}
                        type="text"
                      />
                    </Box>
                    <IconButton
                      type="button"
                      title="Choisir sur la carte"
                      aria-label="Choisir sur la carte"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMapOpen(true);
                      }}
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
              )}
            />

            <Flex alignItems="center" gap="16px" mt="32px" flexDirection={{ xs: "column", lg: "row" }}>
              <Button
                priority="secondary"
                type="button"
                disabled={createWithoutMonumentMutation.isPending}
                onClick={() => createWithoutMonumentMutation.mutate()}
                sx={{ width: { xs: "100%", lg: "unset" }, justifyContent: { xs: "center", lg: "unset" } }}
              >
                Créer un constat sans lien MH
              </Button>
              {/* @ts-ignore title is optional */}
              <Alert
                severity="info"
                small
                description="Vous pouvez commencer un constat d'état et le relier plus tard à un monument."
                sx={{ width: { xs: "100%", lg: "unset" } }}
              />
            </Flex>
          </Box>
        </Flex>
      </SimpleBanner>

      <MonumentMapModal
        open={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelect={(item) => {
          setIsMapOpen(false);
          openFiche(item);
        }}
      />
    </Flex>
  );
};
