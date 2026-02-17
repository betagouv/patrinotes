import { useWatch } from "react-hook-form";
import { db, useDbQuery } from "../../db/db";
import { StateReportFormType, StateReportStep, useIsStateReportDisabled, useStateReportFormContext } from "./utils";
import { Box, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { scrollToTop, StateReportSummary } from "./StateReportSummary";
import { Tabs } from "#components/Tabs.tsx";
import { MonumentHistorique } from "./steps/MonumentHistorique";
import { fr, FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";
import { getRouteApi, useNavigate, UseNavigateResult } from "@tanstack/react-router";
import { Button, Center } from "#components/MUIDsfr.tsx";
import { ContexteVisite } from "./steps/ContexteVisite";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { ReactNode, useState } from "react";
import { ConstatGeneral } from "./steps/ConstatGeneral";
import { ConstatDetaille } from "./steps/ConstatDetaille";
import { pick } from "pastable";
import { immeubleMapping } from "../ImmeubleAutocomplete";
import { ModalCloseButton } from "../menu/MenuTitle";
import { useStateReportAlerts } from "./alerts/StateReportAlerts.hook";
import { useQueryClient } from "@tanstack/react-query";
import { AlertErrors, checkAlertErrors } from "./alerts/StateReportAlert.utils";
import { stateReportSideMenuStore, useAlertErrors } from "./side-menu/StateReportSideMenu.store";
import { ButtonProps } from "@codegouvfr/react-dsfr/Button";

export const WithReferencePop = () => {
  const form = useStateReportFormContext();
  const referencePop = useWatch({ control: form.control, name: "reference_pop" });
  const immeubleQuery = useDbQuery(db.selectFrom("pop_immeubles").selectAll().where("id", "=", referencePop));

  const hasReferencePop = !!referencePop;
  if (!hasReferencePop) return null;

  console.log(referencePop);

  return (
    <>
      <Box width="100%" height="100%">
        {immeubleQuery.error && (
          <Box>Erreur lors du chargement de l'immeuble : {String(immeubleQuery.error.message)}</Box>
        )}
        {immeubleQuery.data && (
          <Flex flexDirection={"column"} height="100%" alignItems="center">
            <Flex width="100%" mb={{ xs: "24px", lg: "0" }} flexDirection={{ xs: "column", lg: "row" }}>
              <Box
                minWidth="280px"
                width={{ xs: "100%", lg: accordionWidth }}
                marginLeft={{ xs: "0", lg: accordionMarginLeft }}
                paddingX={{ xs: "0", lg: accordionPadding }}
              >
                <Box position={{ xs: "unset", lg: "sticky" }} top={{ xs: "0", lg: "14px" }}>
                  <StateReportSummary />
                </Box>
              </Box>
              <Box
                borderLeft={{ xs: "none", lg: "1px solid" }}
                borderColor={fr.colors.decisions.border.default.grey.default + " !important"}
                width={"100%"}
              >
                <Box width={{ xs: "100%", lg: contentWidth }}>
                  <ContentSwitch />
                </Box>
              </Box>
            </Flex>
          </Flex>
        )}
      </Box>
    </>
  );
};

const fullWidth = "min(100vw, 1200px)";
const accordionWidth = "280px";
const accordionPadding = "16px";
const accordionMarginLeft = `calc((100% - ${fullWidth}) / 2)`;
const contentWidth = `calc(${fullWidth} - ${accordionWidth} - 24px)`;

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
    <Stack gap="12px" width="100%" flexDirection={{ xs: "column", lg: "row" }} justifyContent="space-between">
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
  ...props
}: {
  children: ReactNode;
  onClick: () => void;
  customIcon?: FrIconClassName | RiIconClassName;
} & ButtonProps) => {
  return (
    <Button
      iconPosition="right"
      iconId={customIcon ?? "ri-arrow-right-line"}
      size="large"
      nativeButtonProps={{
        onClick,
      }}
      sx={buttonSxProps}
      {...props}
    >
      {children}
    </Button>
  );
};

export const ButtonsSwitch = ({ isCustom }: { isCustom?: boolean }) => {
  const { step } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const navigateToStep = (step: StateReportStep) => {
    navigate({ search: { step, mode: "view" } });
    scrollToTop();
  };

  const isDesktop = useIsDesktop();

  const buttons: Record<StateReportStep, ReactNode> = {
    informations: <InformationsButtons navigateToStep={navigateToStep} isCustom={isCustom} />,
    "contexte-visite": (
      <ButtonsContainer>
        <LeftButton onClick={() => navigateToStep("informations")}>Informations du MH</LeftButton>
        <RightButton onClick={() => navigateToStep("constat-detaille")}>Constat d'état</RightButton>
      </ButtonsContainer>
    ),
    "constat-detaille": (
      <ButtonsContainer>
        <Flex alignItems="center" gap="8px" flexDirection={{ xs: "column", lg: "row" }}>
          <LeftButton onClick={() => navigateToStep("contexte-visite")}>Contexte de la visite</LeftButton>
          <RightButton
            priority="secondary"
            onClick={() => navigateToStep("constat-general")}
            customIcon="fr-icon-edit-fill"
          >
            Constat général
          </RightButton>
        </Flex>

        <CreateButton />
      </ButtonsContainer>
    ),
    "constat-general": (
      <ButtonsContainer>
        <Flex alignItems="center" gap="8px" flexDirection={{ xs: "column", lg: "row" }}>
          <LeftButton onClick={() => navigateToStep("contexte-visite")}>Contexte de la visite</LeftButton>
          <RightButton
            priority="secondary"
            onClick={() => navigateToStep("constat-detaille")}
            customIcon="fr-icon-edit-fill"
          >
            Constat détaillé
          </RightButton>
        </Flex>
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
  const [missingFields, setMissingFields] = useState<string[] | null>(null);
  const [alertErrors, setAlertErrors] = useAlertErrors();

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const { constatId } = routeApi.useParams();
  const navigate = routeApi.useNavigate();

  const form = useStateReportFormContext();
  const isDisabled = useIsStateReportDisabled();

  const alertsQuery = useStateReportAlerts(constatId);

  const onSubmit = () => {
    const values = form.getValues();
    const missingFields = Object.entries(formValuesChecker)
      .filter(([key, checker]) => {
        return !checker(values[key as keyof StateReportFormType]);
      })
      .map(([key]) => key);

    const alertErrors = alertsQuery.data
      ?.map((alert) => {
        const errors = checkAlertErrors(alert);

        return {
          alert: alert.alert!,
          errors,
        };
      })
      .filter((alertErrors) => alertErrors.errors.email.length);

    if (!missingFields.length && !alertErrors?.length) {
      navigate({
        to: "/constat/$constatId/pdf",
        params: {
          constatId,
        },
        search: { mode: "view" },
      });
      return;
    }

    setAlertErrors(alertErrors ?? []);
    setMissingFields(missingFields);

    setIsErrorModalOpen(true);
  };

  const formErrors = {
    missingFields: missingFields ?? [],
    alertErrors: alertErrors ?? [],
  };

  return (
    <>
      {isErrorModalOpen ? <FormErrorModal formErrors={formErrors} onClose={() => setIsErrorModalOpen(false)} /> : null}
      <RightButton customIcon="fr-icon-article-fill" onClick={() => onSubmit()}>
        {isDisabled ? "Voir le constat" : "Finaliser le constat"}
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

const FormErrorModal = ({
  formErrors,
  onClose,
}: {
  formErrors: { missingFields: string[]; alertErrors: { alert: string; errors: AlertErrors }[] } | null;
  onClose: () => void;
}) => {
  const contextErrors = formErrors?.missingFields.filter((field) => contextFields.includes(field));
  const generalErrors = formErrors?.missingFields.filter((field) => generalFields.includes(field));

  const keepOnlyOneAlertOfEachType = (alerts: { alert: string; errors: AlertErrors }[]) => {
    const uniqueAlertTypes = Array.from(new Set<string>(alerts.map(({ alert }) => alert)));

    return uniqueAlertTypes.map((alertType) => {
      const alert = alerts.find(({ alert: a }) => a === alertType);
      return alert!;
    });
  };

  const alertErrors = formErrors?.alertErrors ? keepOnlyOneAlertOfEachType(formErrors.alertErrors) : [];

  const navigate = routeApi.useNavigate();
  const navigateToField = (field: string) => {
    (formErrorsNavigate as any)[field]?.({ navigate });
    onClose();
  };

  const navigateToAlert = (alert: string) => {
    stateReportSideMenuStore.send({ type: "openAlertSection", section: alert });
    onClose();
  };

  return (
    <Dialog
      open={!!formErrors?.missingFields.length || !!formErrors?.alertErrors.length}
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
            {alertErrors && alertErrors.length ? (
              <>
                <Typography mt="16px" fontWeight="600">
                  Alertes
                </Typography>
                <ul style={{ listStyleType: "none" }}>
                  {alertErrors.map(({ alert, errors }) => (
                    <li key={alert}>
                      <Typography
                        onClick={() => navigateToAlert(alert)}
                        sx={{ cursor: "pointer", textDecoration: "underline", "::before": { color: "red" } }}
                        className="fr-link fr-link--icon-left fr-icon-error-fill"
                      >
                        {alert}
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
const InformationsButtons = ({
  navigateToStep,
  isCustom,
}: {
  navigateToStep: (step: StateReportStep) => void;
  isCustom?: boolean;
}) => {
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
      {isCustom ? null : isEditing ? (
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
      {isCustom ? <div></div> : null}
      <Button
        iconPosition="right"
        iconId="ri-arrow-right-line"
        size="large"
        sx={{ ...buttonSxProps }}
        disabled={(isEditing && !isCustom) || isDisabled}
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
