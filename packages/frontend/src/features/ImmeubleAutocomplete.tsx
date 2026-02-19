import { Autocomplete, Box, Dialog, DialogTitle, Typography } from "@mui/material";
import { db, useDbQuery } from "../db/db";
import { useMemo, useState } from "react";
import { useStyles } from "tss-react";
import Fuse, { IFuseOptions } from "fuse.js";
import { PopImmeuble } from "../db/AppSchema";
import { useFormContext, useWatch } from "react-hook-form";
import { StateReportFormType, useIsStateReportDisabled, useStateReportFormContext } from "./state-report/utils";
import { Spinner } from "#components/Spinner.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import Highlighter from "react-highlight-words";
import { Flex } from "#components/ui/Flex.tsx";
import { IconLink } from "#components/ui/IconLink.tsx";
import { ModalCloseButton } from "./menu/MenuTitle";
import { Alert, Button } from "#components/MUIDsfr.tsx";

type FilterablePopImmeubles = Pick<
  PopImmeuble,
  "reference" | "id" | "titre_editorial_de_la_notice" | "commune_forme_editoriale"
>;
const fuseOptions: IFuseOptions<FilterablePopImmeubles> = {
  keys: ["titre_editorial_de_la_notice", "commune_forme_editoriale", "id"],
  shouldSort: true,
  distance: 1000,
  threshold: 0.5,
};

export const immeubleMapping: Partial<Record<keyof PopImmeuble, keyof StateReportFormType>> = {
  reference: "reference_pop",
  denomination_de_l_edifice: "nature_edifice",
  adresse_forme_editoriale: "adresse",
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

  const form = useStateReportFormContext();
  const [referencePop, titreEdifice] = useWatch({ control: form.control, name: ["reference_pop", "titre_edifice"] });
  const [inputValue, setInputValue] = useState(titreEdifice || "");

  const { cx } = useStyles();

  const isDisabled = useIsStateReportDisabled();

  const immeubleQuery = useDbQuery(
    db
      .selectFrom("pop_immeubles")
      .select(["reference", "id", "titre_editorial_de_la_notice", "commune_forme_editoriale"]),
  );
  const rawItems = immeubleQuery.data ?? [null];
  const searchEngine = new Fuse(rawItems, fuseOptions);

  const setValue = async (item: FilterablePopImmeubles | null) => {
    if (isDisabled) return;
    form.setValue("reference_pop", item ? item.id : null);

    setIsChanging(false);
    setAreSuggestionsShown(false);

    if (!item) return;
    if (item.id === "CUSTOM") return;
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
  };

  const hasValue = !!referencePop;

  const handleChanging = (changing: boolean) => {
    if (isDisabled) return;

    setIsChanging(changing);

    if (changing) {
      setIsWarningOpen(false);
      for (const formField of Object.values(immeubleMapping)) {
        form.setValue(formField as keyof StateReportFormType, null);
      }
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

  if (hasValue && !isChanging && !isCustom)
    return (
      <Flex flexDirection="column" flex="1">
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
              <DialogTitle>Changer de monument</DialogTitle>
              <Box p="24px">
                <Typography mb="16px">
                  Attention, les informations concernant le monument historique seront supprimées de votre constat.
                  <br />
                  <br />
                  La saisie du constat d'état sera conservée.
                </Typography>
              </Box>
              <Flex justifyContent="flex-end" gap="16px" px="24px" pb="16px">
                <Button priority="secondary" onClick={() => setIsWarningOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => handleChanging(true)}>Continuer</Button>
              </Flex>
            </Box>
          </Dialog>
        ) : null}
        <Typography fontSize="20px">{form.watch("titre_edifice")}</Typography>
        <Box mt="8px">
          <IconLink
            icon="fr-icon-edit-fill"
            disabled={isDisabled}
            sx={{ fontSize: "14px" }}
            onClick={() => (isDisabled ? null : setIsWarningOpen(true))}
          >
            Changer de monument
          </IconLink>
        </Box>
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
      <Autocomplete
        classes={{
          popper: "immeubles-autocomplete-popper",
          noOptions: "immeubles-autocomplete-no-options",
        }}
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

          return [
            ...(isCustom
              ? [
                  {
                    commune_forme_editoriale: "",
                    id: "CUSTOM",
                    reference: "CUSTOM",
                    titre_editorial_de_la_notice: state.inputValue,
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
                <Highlighter
                  searchWords={state.inputValue.split(" ")}
                  autoEscape
                  textToHighlight={option.commune_forme_editoriale ?? ""}
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
            <Box ref={params.InputProps.ref} mt="8px">
              <input
                {...params.inputProps}
                className={cx(params.inputProps.className, "fr-input")}
                style={{ backgroundColor: "white" }}
                type={"text"}
              />
            </Box>
          </div>
        )}
        noOptionsText={
          !referencePop && inputValue ? (
            <Box>{immeubleQuery.isLoading ? <Spinner size={20} /> : "Aucun résultat"}</Box>
          ) : null
        }
      />

      {shouldShowUnlinkedButton ? (
        <Flex alignItems="center" gap="16px" mt="32px" flexDirection={{ xs: "column", lg: "row" }}>
          <Button
            priority="secondary"
            sx={{ width: { xs: "100%", lg: "unset" }, justifyContent: { xs: "center", lg: "unset" } }}
            onClick={() => form.setValue("reference_pop", "CUSTOM")}
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
    </Box>
  );
};
