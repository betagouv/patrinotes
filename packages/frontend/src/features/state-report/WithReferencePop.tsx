import { useWatch } from "react-hook-form";
import { db, useDbQuery } from "../../db/db";
import { StateReportFormType, StateReportStep, useIsStateReportDisabled, useStateReportFormContext } from "./utils";
import { Box, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { scrollToTop, StateReportSummary } from "./StateReportSummary";
import { Tabs } from "#components/Tabs.tsx";
import { MonumentHistorique } from "./steps/MonumentHistorique";
import { fr, FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";
import { getRouteApi, UseNavigateResult } from "@tanstack/react-router";
import { Button, Center } from "#components/MUIDsfr.tsx";
import { ContexteVisite } from "./steps/ContexteVisite";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { ReactNode, useState } from "react";
import { ConstatGeneral } from "./steps/ConstatGeneral";
import { ConstatDetaille } from "./steps/ConstatDetaille";
import { pick } from "pastable";
import { immeubleMapping } from "../ImmeubleAutocomplete";
import { ModalCloseButton } from "../menu/MenuTitle";

export const WithReferencePop = () => {
  const form = useStateReportFormContext();
  const isDesktop = useIsDesktop();
  const referencePop = useWatch({ control: form.control, name: "reference_pop" });
  const immeubleQuery = useDbQuery(db.selectFrom("pop_immeubles").selectAll().where("id", "=", referencePop));

  const { step } = routeApi.useSearch();

  const hasReferencePop = !!referencePop;
  if (!hasReferencePop) return null;

  return (
    <>
      <Box width="100%" height="100%">
        {immeubleQuery.error && (
          <div>Erreur lors du chargement de l'immeuble : {String(immeubleQuery.error.message)}</div>
        )}
        {immeubleQuery.data && (
          <Flex height="100%" width="100%" flexDirection={{ xs: "column", lg: "row" }} gap={{ xs: "0", lg: "24px" }}>
            <Box minWidth="280px">
              <StateReportSummary />
            </Box>
            <Box
              borderLeft={{ xs: "none", lg: "1px solid" }}
              borderColor={fr.colors.decisions.border.default.grey.default + " !important"}
              flex="1"
            >
              <ContentSwitch />
              {/* {isDesktop || step === "informations" ? null : <ButtonsSwitch />} */}
            </Box>
          </Flex>
        )}
      </Box>
    </>
  );
};

const routeApi = getRouteApi("/constat/$constatId");

const ContentSwitch = () => {
  const { step } = routeApi.useSearch();

  const content: Record<StateReportStep, ReactNode> = {
    informations: <MonumentHistorique />,
    "contexte-visite": <ContexteVisite />,
    "constat-detaille": <ConstatDetaille />,
    "constat-general": <ConstatGeneral />,
    documents: null,
  };

  return <>{content[step]}</>;
};

const ButtonsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Stack gap="8px" width="100%" flexDirection={{ xs: "column", lg: "row" }} justifyContent="space-between">
      {children}
    </Stack>
  );
};

const LeftButton = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
  return (
    <Button
      iconPosition="left"
      iconId="ri-arrow-left-line"
      priority="secondary"
      size="large"
      nativeButtonProps={{
        onClick,
      }}
      sx={buttonSxProps}
    >
      {children}
    </Button>
  );
};

const RightButton = ({
  children,
  onClick,
  customIcon,
}: {
  children: ReactNode;
  onClick: () => void;
  customIcon?: FrIconClassName | RiIconClassName;
}) => {
  return (
    <Button
      iconPosition="right"
      iconId={customIcon ?? "ri-arrow-right-line"}
      size="large"
      nativeButtonProps={{
        onClick,
      }}
      sx={buttonSxProps}
    >
      {children}
    </Button>
  );
};

export const ButtonsSwitch = () => {
  const { step } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const navigateToStep = (step: StateReportStep) => {
    navigate({ search: { step, mode: "view" } });
    scrollToTop();
  };

  const { constatId } = routeApi.useParams();

  const buttons: Record<StateReportStep, ReactNode> = {
    informations: <InformationsButtons navigateToStep={navigateToStep} />,
    "contexte-visite": (
      <ButtonsContainer>
        <LeftButton onClick={() => navigateToStep("informations")}>Information du MH</LeftButton>
        <RightButton onClick={() => navigateToStep("constat-general")}>Constat général</RightButton>
      </ButtonsContainer>
    ),
    "constat-detaille": (
      <ButtonsContainer>
        <LeftButton onClick={() => navigateToStep("contexte-visite")}>Contexte de la visite</LeftButton>
        <RightButton onClick={() => navigateToStep("constat-general")}>Constat général</RightButton>
      </ButtonsContainer>
    ),
    "constat-general": (
      <ButtonsContainer>
        <LeftButton onClick={() => navigateToStep("contexte-visite")}>Contexte de la visite</LeftButton>
        <CreateButton />
      </ButtonsContainer>
    ),

    documents: null,
  };

  return (
    <Center mt={{ xs: "16px", lg: "24px" }} mb={{ xs: "16px", lg: "0" }}>
      {buttons[step]}
    </Center>
  );
};

const formValuesChecker: Partial<Record<keyof StateReportFormType, (val: any) => boolean>> = {
  nature_visite: (val) => !!val,
  date_visite: (val) => !!val,
  redacted_by: (val) => !!val,
  proprietaire: (val) => !!val,
  proprietaire_email: (val) => !!val,
  etat_general: (val) => !!val,
  proportion_dans_cet_etat: (val) => val !== null && val !== undefined,
};

const formErrorsNavigate: Partial<
  Record<keyof StateReportFormType, (args: { navigate: ReturnType<typeof routeApi.useNavigate> }) => void>
> = {
  nature_visite: ({ navigate }) =>
    navigate({ search: { step: "contexte-visite", mode: "edit" }, hash: "nature-visite" }),
  date_visite: ({ navigate }) => navigate({ search: { step: "contexte-visite", mode: "edit" }, hash: "date-visite" }),
  redacted_by: ({ navigate }) => navigate({ search: { step: "contexte-visite", mode: "edit" }, hash: "redacted-by" }),
  proprietaire: ({ navigate }) => navigate({ search: { step: "contexte-visite", mode: "edit" }, hash: "proprietaire" }),
  proprietaire_email: ({ navigate }) =>
    navigate({ search: { step: "contexte-visite", mode: "edit" }, hash: "proprietaire-email" }),

  etat_general: ({ navigate }) => navigate({ search: { step: "constat-general", mode: "edit" }, hash: "etat-general" }),
  proportion_dans_cet_etat: ({ navigate }) =>
    navigate({ search: { step: "constat-general", mode: "edit" }, hash: "proportion-dans-cet-etat" }),
};

const CreateButton = () => {
  const [formErrors, setFormErrors] = useState<string[] | null>(null);
  const { constatId } = routeApi.useParams();
  const navigate = routeApi.useNavigate();

  const form = useStateReportFormContext();
  const attachmentId = useWatch({ control: form.control, name: "attachment_id" });

  const onSubmit = () => {
    const values = form.getValues();
    const missingFields = Object.entries(formValuesChecker)
      .filter(([key, checker]) => {
        return !checker(values[key as keyof StateReportFormType]);
      })
      .map(([key]) => key);

    if (!missingFields.length) {
      navigate({
        to: "/constat/$constatId/pdf",
        params: {
          constatId,
        },
        search: { mode: "view" },
      });
      return;
    }

    setFormErrors(missingFields);
  };

  return (
    <>
      <FormErrorModal formErrors={formErrors} onClose={() => setFormErrors(null)} />
      <RightButton customIcon="fr-icon-article-fill" onClick={() => onSubmit()}>
        {attachmentId ? "Voir le constat" : "Finaliser le constat"}
      </RightButton>
    </>
  );
};

const contextFields = ["proprietaire", "proprietaire_email", "redacted_by", "date_visite", "nature_visite"];
const generalFields = ["etat_general", "proportion_dans_cet_etat"];
const labelsByField: Record<string, string> = {
  proprietaire: "Propriétaire",
  proprietaire_email: "Courriel du propriétaire",
  redacted_by: "Rédacteur du constat",
  date_visite: "Date de la visite",
  nature_visite: "Nature de la visite",
  etat_general: "État général",
  proportion_dans_cet_etat: "Proportion dans cet état",
};

const FormErrorModal = ({ formErrors, onClose }: { formErrors: string[] | null; onClose: () => void }) => {
  const contextErrors = formErrors?.filter((field) => contextFields.includes(field));
  const generalErrors = formErrors?.filter((field) => generalFields.includes(field));

  const navigate = routeApi.useNavigate();
  const navigateToField = (field: string) => {
    (formErrorsNavigate as any)[field]?.({ navigate });
    onClose();
  };
  return (
    <Dialog
      open={!!formErrors?.length}
      sx={{
        ".MuiPaper-root": {
          maxWidth: { xs: "100%", sm: "800px" },
          margin: { xs: 0, lg: "auto" },
        },
      }}
    >
      <Box p="16px" mb="16px">
        <ModalCloseButton onClose={() => onClose()} />
        <DialogTitle
          color="red"
          sx={{
            "::before": {
              marginRight: "8px",
            },
          }}
          className="fr-icon fr-icon-error-warning-fill"
        >
          Saisie en erreur
        </DialogTitle>

        <Box px="24px">
          <Typography>
            Les champs suivants présentent des erreurs, veuillez les corriger avant de créer le PDF :
          </Typography>

          <Stack>
            {contextErrors && contextErrors.length ? (
              <>
                <Typography mt="16px" fontWeight="600">
                  Contexte de la visite
                </Typography>
                <ul style={{ listStyleType: "none" }}>
                  {contextErrors.map((field) => (
                    <li key={field}>
                      <Typography
                        onClick={() => navigateToField(field)}
                        sx={{ cursor: "pointer", textDecoration: "underline", "::before": { color: "red" } }}
                        className="fr-link fr-link--icon-left fr-icon-error-fill"
                      >
                        {labelsByField[field]}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {generalErrors && generalErrors.length ? (
              <>
                <Typography mt="16px" fontWeight="600">
                  Constat général
                </Typography>
                <ul style={{ listStyleType: "none" }}>
                  {generalErrors.map((field) => (
                    <li key={field}>
                      <Typography
                        onClick={() => navigateToField(field)}
                        sx={{ cursor: "pointer", textDecoration: "underline", "::before": { color: "red" } }}
                        className="fr-link fr-link--icon-left fr-icon-error-fill"
                      >
                        {labelsByField[field]}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
};
const InformationsButtons = ({ navigateToStep }: { navigateToStep: (step: StateReportStep) => void }) => {
  const [internalValues, setInternalValues] = useState<Partial<StateReportFormType>>({});

  const { mode } = routeApi.useSearch();
  const isEditing = mode === "edit";
  const isDisabled = useIsStateReportDisabled();
  const navigate = routeApi.useNavigate();

  const form = useStateReportFormContext();

  const onEdit = () => {
    setInternalValues(pick(form.getValues(), Object.values(immeubleMapping)));
    navigate({ search: { step: "informations", mode: "edit" } });
  };

  const onCancel = () => {
    form.reset({ ...form.getValues(), ...internalValues });
    setInternalValues({});
    navigate({ search: { step: "informations", mode: "view" } });
  };

  const onSave = () => {
    setInternalValues({});
    navigate({ search: { step: "informations", mode: "view" } });
  };

  return (
    <Stack
      gap="8px"
      width="100%"
      mx={{ xs: "16px", lg: "0" }}
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
    >
      {isEditing ? (
        <Flex alignItems="center" gap="8px" flexDirection={{ xs: "column", lg: "row" }}>
          <Button
            size="large"
            sx={buttonSxProps}
            priority="secondary"
            nativeButtonProps={{
              onClick: () => onCancel(),
            }}
          >
            Annuler
          </Button>
          <Button
            size="large"
            sx={buttonSxProps}
            priority="secondary"
            iconId="ri-save-fill"
            iconPosition="right"
            nativeButtonProps={{
              onClick: () => onSave(),
            }}
          >
            Valider les modifications
          </Button>
        </Flex>
      ) : (
        <Button
          iconPosition="right"
          iconId="ri-pencil-fill"
          size="large"
          priority="secondary"
          sx={buttonSxProps}
          disabled={isDisabled || isEditing}
          nativeButtonProps={{
            onClick: () => onEdit(),
          }}
        >
          Compléter les infos
        </Button>
      )}
      <Button
        iconPosition="right"
        iconId="ri-arrow-right-line"
        size="large"
        sx={buttonSxProps}
        nativeButtonProps={{
          onClick: () => navigateToStep("contexte-visite"),
        }}
      >
        Contexte de la visite
      </Button>
    </Stack>
  );
};

const buttonSxProps = {
  width: { xs: "100%", lg: "auto" },
  alignItems: "center",
  justifyContent: "center",
};
