import { Autocomplete, Box, CircularProgress, Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
import { db, useDbQuery } from "../db/db";
import { useMemo, useState } from "react";
import { useStyles } from "tss-react";
import Fuse, { IFuseOptions } from "fuse.js";
import { PopImmeuble } from "../db/AppSchema";
import { useFormContext, useWatch } from "react-hook-form";
import { StateReportFormType, useIsStateReportDisabled, useStateReportFormContext } from "./state-report/utils";
import { Spinner } from "#components/Spinner.tsx";
import { useStatus, useSyncStream } from "@powersync/react";
import { fr } from "@codegouvfr/react-dsfr";
import Highlighter from "react-highlight-words";
import { Flex } from "#components/ui/Flex.tsx";
import { IconLink } from "#components/ui/IconLink.tsx";
import { ModalCloseButton } from "./menu/MenuTitle";
import { Alert, Button, Center } from "#components/MUIDsfr.tsx";
import { MonumentMapModal } from "./map/MonumentMapModal";
import { useQueryClient } from "@tanstack/react-query";
import { UpSelectionModal } from "./up/UpSelectionModal";
import {
  applyUpSelection,
  fetchMonumentUpTree,
  getUpRoot,
  parseUpChemin,
  upQueryKeys,
  upStaleTime,
  useMonumentUpTree,
  type UpTree,
  type UpSelection,
} from "./up/upApi";
import { useIsOnline } from "../hooks/useIsOnline";
import { RapportGroupeNotice } from "./up/RapportGroupeNotice";
import { scrollToTop } from "./state-report/StateReportSummary";
import { getCorrectedMonumentValues, getCorrection } from "./fiche/corrections";

type FilterablePopImmeubles = Pick<
  PopImmeuble,
  "reference" | "id" | "titre_editorial_de_la_notice" | "commune_forme_editoriale" | "adresse_forme_index"
>;
const fuseOptions: IFuseOptions<FilterablePopImmeubles> = {
  keys: ["titre_editorial_de_la_notice", "commune_forme_editoriale", "id", "adresse_forme_index"],
  shouldSort: true,
  distance: 1000,
  threshold: 0.5,
};

export const immeubleMapping: Partial<Record<keyof PopImmeuble, keyof StateReportFormType>> = {
  reference: "reference_pop",
  denomination_de_l_edifice: "nature_edifice",
  adresse_forme_index: "adresse",
  commune_forme_editoriale: "commune",
  commune_forme_index: "commune_historique",
  cadastre: "reference_cadastrale",
  siecle_de_la_campagne_principale_de_construction: "periode_construction",
  typologie_de_la_protection: "nature_protection",
  precision_de_la_protection: "parties_protegees",
  description_de_l_edifice: "description",
  titre_editorial_de_la_notice: "titre_edifice",
};

export const ImmeubleAutocomplete = () => {
  const [isChanging, setIsChanging] = useState(false);

  const [areSuggestionsShown, setAreSuggestionsShown] = useState(false);

  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const form = useStateReportFormContext();
  const [referencePop, titreEdifice] = useWatch({ control: form.control, name: ["reference_pop", "titre_edifice"] });
  const [inputValue, setInputValue] = useState(titreEdifice || "");

  const { cx } = useStyles();

  const isDisabled = useIsStateReportDisabled();

  const immeubleQuery = useDbQuery(
    db
      .selectFrom("pop_immeubles")
      .select(["reference", "id", "titre_editorial_de_la_notice", "commune_forme_editoriale", "adresse_forme_index"]),
  );
  const rawItems = immeubleQuery.data ?? [null];
  const searchEngine = new Fuse(rawItems, fuseOptions);

  const popSynced = useSyncStream({ name: "pop_stream" })?.subscription.hasSynced;

  const queryClient = useQueryClient();
  const isOnline = useIsOnline();
  // monument picked in the search, waiting for the user to choose one of its unités patrimoniales
  const [pendingUpChoice, setPendingUpChoice] = useState<{ item: FilterablePopImmeubles; tree: UpTree } | null>(null);
  const [isChangingUp, setIsChangingUp] = useState(false);
  const [isLoadingUps, setIsLoadingUps] = useState(false);
  const [upWarning, setUpWarning] = useState<string | null>(null);

  const [upId, upIntitule, upChemin] = useWatch({
    control: form.control,
    name: ["up_id", "up_intitule", "up_chemin"],
  });
  const monumentUpTreeQuery = useMonumentUpTree(referencePop, isOnline && !!referencePop);
  const monumentHasUps = !!monumentUpTreeQuery.data || !!upId;

  const applyMonument = async (item: FilterablePopImmeubles | null) => {
    form.setValue("disabled", 0);
    form.setValue("reference_pop", item ? item.id : null);

    setIsChanging(false);
    setAreSuggestionsShown(false);

    if (!item) return;
    if (item.id === "CUSTOM") return;

    // Once a monument is picked (search field or map), bring the user back to the top of the form;
    // wait a frame so the layout has switched to the selected-monument view first.
    requestAnimationFrame(() => scrollToTop());

    const immeubleDetails = await db
      .selectFrom("pop_immeubles")
      .selectAll()
      .where("id", "=", item ? item.id : "")
      .executeTakeFirst();
    if (!immeubleDetails) return;

    for (const [key, formField] of Object.entries(immeubleMapping)) {
      // @ts-ignore mismatch between PopImmeuble and StateReportFormType keys
      const value = immeubleDetails[key as keyof PopImmeuble] || null;
      form.setValue(formField as keyof StateReportFormType, value);
    }

    // the service's corrections of the monument (« Compléter les infos » on its fiche) prefill its constats
    const correction = await getCorrection({ target: "mh", referencePop: item.id! });
    if (correction) {
      for (const [field, value] of Object.entries(getCorrectedMonumentValues(immeubleDetails, correction))) {
        form.setValue(field as keyof StateReportFormType, value as any);
      }
    }
  };

  const setValue = async (item: FilterablePopImmeubles | null) => {
    if (isDisabled) return;
    setUpWarning(null);
    applyUpSelection(form, null);

    if (!item || item.id === "CUSTOM") return applyMonument(item);

    // MH complexe: ask which unité patrimoniale the constat is about
    setAreSuggestionsShown(false);
    (document.activeElement as HTMLElement | null)?.blur();
    setIsLoadingUps(true);
    try {
      const tree = navigator.onLine
        ? await queryClient.fetchQuery({
            queryKey: upQueryKeys.monument(item.id),
            queryFn: () => fetchMonumentUpTree(item.id),
            staleTime: upStaleTime,
          })
        : null;
      if (!navigator.onLine) setUpWarning(UP_OFFLINE_WARNING);
      if (tree) return setPendingUpChoice({ item, tree });
    } catch (e) {
      console.error(e);
      setUpWarning(UP_ERROR_WARNING);
    } finally {
      setIsLoadingUps(false);
    }

    return applyMonument(item);
  };

  const onUpChoice = async (selection: UpSelection) => {
    const pending = pendingUpChoice;
    setPendingUpChoice(null);
    if (pending) await applyMonument(pending.item);
    applyUpSelection(form, selection);
  };

  const hasValue = !!referencePop;

  const handleChanging = (changing: boolean) => {
    if (isDisabled) return;

    setIsChanging(changing);

    if (changing) {
      setIsWarningOpen(false);
      setUpWarning(null);
      for (const formField of Object.values(immeubleMapping)) {
        form.setValue(formField as keyof StateReportFormType, null);
      }
      applyUpSelection(form, null);
      // another monument: the constat leaves its rapport groupé, which is about the previous monument
      form.setValue("rapport_id", null);
      setInputValue("");
    }
  };

  const isCustom = referencePop === "CUSTOM";
  const shouldShowUnlinkedButton = !referencePop;

  const valueItem = useMemo(() => {
    if (!referencePop) return null;
    if (referencePop === "CUSTOM") {
      return {
        id: "CUSTOM",
        reference: "CUSTOM",
        titre_editorial_de_la_notice: inputValue,
      } as FilterablePopImmeubles;
    }

    return rawItems.find((item) => item?.id == referencePop) || null;
  }, [inputValue, rawItems]);

  const upModals = (
    <>
      {pendingUpChoice ? (
        <UpSelectionModal
          open
          monumentTitle={pendingUpChoice.item.titre_editorial_de_la_notice ?? getUpRoot(pendingUpChoice.tree).intitule}
          tree={pendingUpChoice.tree}
          onCancel={() => setPendingUpChoice(null)}
          onConfirm={onUpChoice}
        />
      ) : null}
      {isChangingUp && monumentUpTreeQuery.data ? (
        <UpSelectionModal
          open
          title="Changer d’unité patrimoniale"
          confirmLabel="Valider"
          showIntro={false}
          currentUpLabel={
            upId
              ? [...parseUpChemin(upChemin).map((c) => c.intitule), upIntitule].filter(Boolean).join(" › ")
              : "Ensemble du monument"
          }
          monumentTitle={titreEdifice ?? getUpRoot(monumentUpTreeQuery.data).intitule}
          tree={monumentUpTreeQuery.data}
          initialUpId={upId ?? null}
          onCancel={() => setIsChangingUp(false)}
          onConfirm={(selection) => {
            setIsChangingUp(false);
            setUpWarning(null);
            applyUpSelection(form, selection);
          }}
        />
      ) : null}
    </>
  );

  if (hasValue && !isChanging && !isCustom)
    return (
      <Flex flexDirection="column" flex="1">
        {upModals}
        {isWarningOpen ? (
          <Dialog
            open
            onClose={() => setIsWarningOpen(false)}
            sx={{
              ".MuiPaper-root": {
                maxWidth: { xs: "100%", sm: "800px" },
              },
            }}
          >
            <Box p="16px" width={"100%"}>
              <ModalCloseButton onClose={() => setIsWarningOpen(false)} />
              <DialogTitle>{monumentHasUps ? "Changer de monument ou d’UP" : "Changer de monument"}</DialogTitle>
              <Box p="24px">
                {monumentHasUps ? (
                  <Typography mb="16px">
                    Vous pouvez choisir une autre unité patrimoniale de ce monument : la saisie du constat d'état sera
                    conservée.
                    <br />
                    <br />
                    Si vous changez de monument, les informations concernant le monument historique seront supprimées de
                    votre constat. La saisie du constat d'état sera conservée.
                  </Typography>
                ) : (
                  <Typography mb="16px">
                    Attention, les informations concernant le monument historique seront supprimées de votre constat.
                    <br />
                    <br />
                    La saisie du constat d'état sera conservée.
                  </Typography>
                )}
                {monumentHasUps && !monumentUpTreeQuery.data ? (
                  <Alert
                    severity="warning"
                    small
                    description={
                      monumentUpTreeQuery.isLoading
                        ? "Récupération des unités patrimoniales…"
                        : "Les unités patrimoniales ne sont pas disponibles hors ligne."
                    }
                  />
                ) : null}
              </Box>
              <Flex
                justifyContent="flex-end"
                gap="16px"
                px="24px"
                pb="16px"
                flexDirection={{ xs: "column-reverse", sm: "row" }}
              >
                <Button priority="secondary" onClick={() => setIsWarningOpen(false)}>
                  Annuler
                </Button>
                {monumentHasUps ? (
                  <Button
                    priority="secondary"
                    disabled={!monumentUpTreeQuery.data}
                    onClick={() => {
                      setIsWarningOpen(false);
                      setIsChangingUp(true);
                    }}
                  >
                    Changer d’UP
                  </Button>
                ) : null}
                <Button onClick={() => handleChanging(true)}>
                  {monumentHasUps ? "Changer de monument" : "Continuer"}
                </Button>
              </Flex>
            </Box>
          </Dialog>
        ) : null}
        <Typography fontSize="20px" component="h2" fontWeight="bold">
          {[titreEdifice, upIntitule].filter(Boolean).join(" | ")}
        </Typography>
        <Box mt="8px">
          <IconLink
            icon="fr-icon-edit-fill"
            disabled={isDisabled}
            sx={{ fontSize: "14px" }}
            onClick={() => (isDisabled ? null : setIsWarningOpen(true))}
          >
            {monumentHasUps ? "Changer de monument ou d’UP" : "Changer de monument"}
          </IconLink>
        </Box>
        {upWarning ? <Alert severity="info" small sx={{ mt: "16px" }} description={upWarning} /> : null}
        <RapportGroupeNotice />
      </Flex>
    );

  return (
    <Box
      width={{ xs: "100%", lg: "996px" }}
      maxWidth="100%"
      mr="84px"
      sx={{
        ".immeubles-autocomplete-no-options": {
          padding: "0 !important",
        },
      }}
    >
      {upModals}
      <Autocomplete
        classes={{
          popper: "immeubles-autocomplete-popper",
          noOptions: "immeubles-autocomplete-no-options",
        }}
        disabled={isDisabled}
        open={areSuggestionsShown}
        clearOnBlur={false}
        disablePortal
        options={rawItems}
        getOptionLabel={(item) => item.titre_editorial_de_la_notice || ""}
        getOptionKey={(item) => item.reference!}
        value={valueItem}
        onOpen={() => setAreSuggestionsShown(true)}
        onClose={() => setAreSuggestionsShown(false)}
        // TODO: use coordinates to sort results
        filterOptions={(x, state) => {
          if (!state.inputValue) return [];

          const searchResults = searchEngine
            .search(state.inputValue)
            .map((result) => result.item)
            .slice(0, 15);

          const isReferenceSearch = state.inputValue.trim().startsWith("PA");
          if (isReferenceSearch) {
            return searchResults.filter((result) =>
              result.reference?.toLowerCase().startsWith(state.inputValue.trim().toLowerCase()),
            );
          }

          return [
            ...(isCustom
              ? [
                  {
                    commune_forme_editoriale: "",
                    id: "CUSTOM",
                    reference: "CUSTOM",
                    titre_editorial_de_la_notice: state.inputValue,
                    adresse_forme_index: "",
                  },
                ]
              : []),
            ...searchResults,
          ];
        }}
        onChange={(_e, item) => {
          // prevents clearing referencePop when emptying the input
          // in order to keep it = CUSTOM and allow access to the form
          if (isCustom && !item) return;

          setValue(item);
        }}
        inputValue={inputValue}
        onInputChange={(_e, newInputValue) => {
          setInputValue(newInputValue);
          if (isCustom) {
            form.setValue("titre_edifice", newInputValue);
          }
        }}
        onFocus={() => {
          setAreSuggestionsShown(true);
          // prevent scroll to input on focus when the input is custom
          if (isCustom) return;
          document.getElementById("mh-autocomplete")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        renderOption={({ key, ...props }, option, state, _ownerState) =>
          option === null ? (
            <Box>Aucun résultat !</Box>
          ) : (
            <Box
              component="li"
              {...props}
              key={key}
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-start !important"
              flexDirection="column"
              textAlign="left"
              color={fr.colors.decisions.text.actionHigh.blueFrance.default}
            >
              {option.id === "CUSTOM" ? (
                <Box fontSize="12px" color={fr.colors.decisions.text.mention.grey.default}>
                  Titre de votre constat :
                </Box>
              ) : null}
              <Box component="span" fontSize="16px">
                {/* @ts-ignore */}
                <Highlighter
                  searchWords={state.inputValue.split(" ")}
                  autoEscape
                  textToHighlight={option.titre_editorial_de_la_notice ?? ""}
                  activeStyle={{}}
                  unhighlightStyle={{}}
                  highlightStyle={{
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                    color: fr.colors.decisions.text.actionHigh.blueFrance.default,
                  }}
                />
              </Box>
              <Box component="span" fontSize="12px">
                {/* @ts-ignore */}
                <Highlighter
                  searchWords={state.inputValue.split(" ")}
                  autoEscape
                  textToHighlight={getSecondaryText(option)}
                  activeStyle={{}}
                  unhighlightStyle={{}}
                  highlightStyle={{
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                    color: fr.colors.decisions.text.actionHigh.blueFrance.default,
                  }}
                />
              </Box>
            </Box>
          )
        }
        renderInput={(params) => (
          <div className="fr-input-group" id="mh-autocomplete">
            <label className="fr-label" htmlFor={params.id}>
              Nom ou référence du monument
            </label>
            <Flex alignItems="center" gap="8px" mt="8px">
              <Box ref={params.InputProps.ref} flex="1">
                <input
                  {...params.inputProps}
                  className={cx(params.inputProps.className, "fr-input")}
                  style={{ backgroundColor: "white" }}
                  type={"text"}
                />
              </Box>
              <IconButton
                type="button"
                title="Choisir sur la carte"
                aria-label="Choisir sur la carte"
                disabled={isDisabled}
                onClick={(e) => {
                  // The Autocomplete root focuses its input on any click inside it, which runs
                  // onFocus above and scrolls the page to the field (very visible on mobile).
                  e.stopPropagation();
                  setIsMapModalOpen(true);
                }}
                sx={{
                  flexShrink: 0,
                  width: "40px",
                  height: "40px",
                  borderRadius: 0,
                  color: "white",
                  backgroundColor: fr.colors.decisions.background.actionHigh.blueFrance.default,
                  "&:hover": {
                    backgroundColor: fr.colors.decisions.background.actionHigh.blueFrance.hover,
                  },
                }}
              >
                <span className={fr.cx("fr-icon-road-map-line")} aria-hidden="true" />
              </IconButton>
            </Flex>
          </div>
        )}
        noOptionsText={
          !referencePop && inputValue ? (
            <Center height="80px">
              {immeubleQuery.isLoading || !popSynced ? <Spinner size={50} /> : "Aucun résultat"}
            </Center>
          ) : null
        }
      />

      {isLoadingUps ? (
        <Flex alignItems="center" gap="8px" mt="16px">
          <CircularProgress size={16} />
          <Typography fontSize="14px">Recherche des unités patrimoniales…</Typography>
        </Flex>
      ) : null}

      {shouldShowUnlinkedButton ? (
        <Flex alignItems="center" gap="16px" mt="32px" flexDirection={{ xs: "column", lg: "row" }}>
          <Button
            priority="secondary"
            sx={{ width: { xs: "100%", lg: "unset" }, justifyContent: { xs: "center", lg: "unset" } }}
            onClick={() => {
              form.setValue("disabled", 0);
              form.setValue("reference_pop", "CUSTOM");
            }}
            disabled={isDisabled}
          >
            Créer un constat sans lien MH
          </Button>
          <Alert
            sx={{
              width: { xs: "100%", lg: "unset" },
            }}
            severity="info"
            small
            description="Vous pouvez commencer un constat d'état et le relier plus tard à un monument."
          />
        </Flex>
      ) : null}

      <MonumentMapModal
        open={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelect={(item) => {
          setValue(item);
          setIsMapModalOpen(false);
        }}
      />
    </Box>
  );
};

const UP_OFFLINE_WARNING =
  "Hors ligne, les éventuelles unités patrimoniales de ce monument ne peuvent pas être récupérées : le constat porte sur l’ensemble du monument. Vous pourrez préciser l’UP plus tard avec « Changer de monument ou d’UP ».";
const UP_ERROR_WARNING =
  "Les unités patrimoniales de ce monument n’ont pas pu être récupérées : le constat porte sur l’ensemble du monument. Vous pourrez préciser l’UP plus tard avec « Changer de monument ou d’UP ».";

const getSecondaryText = (option: FilterablePopImmeubles) => {
  if (!option.adresse_forme_index) return option.commune_forme_editoriale || "";
  return [option.commune_forme_editoriale, option.adresse_forme_index].filter(Boolean).join(" - ");
};
