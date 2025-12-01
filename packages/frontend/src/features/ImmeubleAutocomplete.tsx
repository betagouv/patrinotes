import { Autocomplete, Box, Dialog, DialogTitle, Typography } from "@mui/material";
import { db, useDbQuery } from "../db/db";
import { useState } from "react";
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
import { Button } from "#components/MUIDsfr.tsx";

type FilterablePopImmeubles = Pick<
  PopImmeuble,
  "reference" | "id" | "titre_editorial_de_la_notice" | "commune_forme_editoriale"
>;
const fuseOptions: IFuseOptions<FilterablePopImmeubles> = {
  keys: ["titre_editorial_de_la_notice", "commune_forme_editoriale", "id"],
  shouldSort: true,
};

const mapping: Partial<Record<keyof PopImmeuble, keyof StateReportFormType>> = {
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
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const form = useStateReportFormContext();
  const [value] = useWatch({ control: form.control, name: ["reference_pop"] });
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
    if (!item) return;
    const immeubleDetails = await db
      .selectFrom("pop_immeubles")
      .selectAll()
      .where("id", "=", item ? item.id : "")
      .executeTakeFirst();
    if (!immeubleDetails) return;

    for (const [key, formField] of Object.entries(mapping)) {
      const value = immeubleDetails[key as keyof PopImmeuble] || null;
      form.setValue(formField as keyof StateReportFormType, value);
    }
  };

  const hasValue = !!value;

  const handleChanging = (changing: boolean) => {
    if (isDisabled) return;
    setIsChanging(changing);
    if (changing) {
      setIsWarningOpen(false);
      for (const formField of Object.values(mapping)) {
        form.setValue(formField as keyof StateReportFormType, null);
      }
    }
  };

  if (hasValue && !isChanging)
    return (
      <Flex flexDirection="column">
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
            <Box p="16px" width="800px">
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
          <IconLink icon="fr-icon-edit-fill" sx={{ fontSize: "14px" }} onClick={() => setIsWarningOpen(true)}>
            Changer de monument
          </IconLink>
        </Box>
      </Flex>
    );

  return (
    <Box
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
        open
        clearOnBlur={false}
        disablePortal
        options={rawItems}
        getOptionLabel={(item) => item.titre_editorial_de_la_notice || ""}
        getOptionKey={(item) => item.reference!}
        value={value ? rawItems.find((item) => item.id == value) : null}
        // TODO: use coordinates to sort results
        filterOptions={(x, state) =>
          state.inputValue ? searchEngine.search(state.inputValue).map((result) => result.item) : []
        }
        onChange={(_e, item) => {
          setValue(item);
        }}
        inputValue={inputValue}
        onInputChange={(_e, newInputValue) => {
          setInputValue(newInputValue);
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
          <div className="fr-input-group">
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
          !value && inputValue ? <Box>{immeubleQuery.isLoading ? <Spinner size={20} /> : "Aucun résultat"}</Box> : null
        }
      />
    </Box>
  );
};
