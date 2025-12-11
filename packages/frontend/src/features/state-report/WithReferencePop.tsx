import { useWatch } from "react-hook-form";
import { db, useDbQuery } from "../../db/db";
import { StateReportFormType, StateReportStep, useIsStateReportDisabled, useStateReportFormContext } from "./utils";
import { Box, Stack } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { scrollToTop, StateReportSummary } from "./StateReportSummary";
import { Tabs } from "#components/Tabs.tsx";
import { MonumentHistorique } from "./steps/MonumentHistorique";
import { fr } from "@codegouvfr/react-dsfr";
import { getRouteApi } from "@tanstack/react-router";
import { Button, Center } from "#components/MUIDsfr.tsx";
import { ContexteVisite } from "./steps/ContexteVisite";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { ReactNode, useState } from "react";
import { ConstatGeneral } from "./steps/ConstatGeneral";
import { ConstatDetaille } from "./steps/ConstatDetaille";
import { pick } from "pastable";
import { immeubleMapping } from "../ImmeubleAutocomplete";

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
              {isDesktop ? <ButtonsSwitch /> : null}
            </Box>
            <Box
              borderLeft={{ xs: "none", lg: "1px solid" }}
              borderColor={fr.colors.decisions.border.default.grey.default + " !important"}
              flex="1"
            >
              <ContentSwitch />
              {isDesktop || step === "informations" ? null : <ButtonsSwitch />}
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
    "constat-general": <ConstatGeneral />,
    "constat-detaille": <ConstatDetaille />,
    documents: null,
  };

  return <>{content[step]}</>;
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
      <Stack gap="8px" width="100%" mx="16px">
        <Button
          iconPosition="left"
          iconId="ri-arrow-left-line"
          priority="secondary"
          size="large"
          nativeButtonProps={{
            onClick: () => navigateToStep("informations"),
          }}
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Information du MH
        </Button>
        <Button
          iconPosition="right"
          iconId="ri-arrow-right-line"
          size="large"
          nativeButtonProps={{
            onClick: () => navigateToStep("constat-general"),
          }}
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Constat général
        </Button>
      </Stack>
    ),
    "constat-general": (
      <Stack gap="8px" width="100%" mx="16px">
        <Button
          iconPosition="left"
          iconId="ri-arrow-left-line"
          priority="secondary"
          size="large"
          nativeButtonProps={{
            onClick: () => navigateToStep("contexte-visite"),
          }}
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Contexte de la visite
        </Button>
        <Button
          iconPosition="right"
          iconId="ri-arrow-right-line"
          size="large"
          nativeButtonProps={{
            onClick: () => navigateToStep("constat-detaille"),
          }}
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Constat détaillé
        </Button>
        <CreateButton />
      </Stack>
    ),
    "constat-detaille": (
      <Stack gap="8px" width="100%" mx="16px">
        <Button
          iconPosition="left"
          iconId="ri-arrow-left-line"
          priority="secondary"
          size="large"
          nativeButtonProps={{
            onClick: () => navigateToStep("constat-general"),
          }}
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Constat général
        </Button>
        <CreateButton />
      </Stack>
    ),
    documents: null,
  };

  return (
    <Center mt={{ xs: "16px", lg: "24px" }} mb={{ xs: "16px", lg: "0" }}>
      {buttons[step]}
    </Center>
  );
};

const CreateButton = () => {
  const { constatId } = routeApi.useParams();
  const navigate = routeApi.useNavigate();

  const form = useStateReportFormContext();
  const attachmentId = useWatch({ control: form.control, name: "attachment_id" });

  return (
    <Button
      iconPosition="left"
      iconId="fr-icon-article-fill"
      size="large"
      nativeButtonProps={{
        onClick: () =>
          navigate({
            to: "/constat/$constatId/pdf",
            params: {
              constatId,
            },
            search: { mode: "view" },
          }),
      }}
      sx={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {attachmentId ? "Voir le constat" : "Finaliser le constat"}
    </Button>
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
    <Stack gap="8px" width="100%" mx="16px">
      {isEditing ? (
        <>
          <Button
            size="large"
            sx={{
              width: "100%",
              mx: "16px",
              alignItems: "center",
              justifyContent: "center",
            }}
            priority="secondary"
            nativeButtonProps={{
              onClick: () => onCancel(),
            }}
          >
            Annuler
          </Button>
          <Button
            size="large"
            sx={{
              width: "100%",
              mx: "16px",
              alignItems: "center",
              justifyContent: "center",
            }}
            priority="secondary"
            nativeButtonProps={{
              onClick: () => onSave(),
            }}
          >
            Valider les modifications
          </Button>
        </>
      ) : (
        <Button
          iconPosition="right"
          iconId="ri-pencil-fill"
          size="large"
          priority="secondary"
          sx={{
            width: "100%",
            mx: "16px",
            alignItems: "center",
            justifyContent: "center",
          }}
          disabled={isDisabled}
          nativeButtonProps={{
            onClick: () => onEdit(),
          }}
        >
          Compléter
        </Button>
      )}
      <Button
        iconPosition="right"
        iconId="ri-arrow-right-line"
        size="large"
        sx={{
          width: "100%",
          mx: "16px",
          alignItems: "center",
          justifyContent: "center",
        }}
        nativeButtonProps={{
          onClick: () => navigateToStep("contexte-visite"),
        }}
      >
        Contexte de la visite
      </Button>
    </Stack>
  );
};
