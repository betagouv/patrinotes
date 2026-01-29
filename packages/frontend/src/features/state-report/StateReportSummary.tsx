import { Accordion } from "#components/MUIDsfr.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Box } from "@mui/material";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { StateReportStep } from "./utils";
import { SideMenu } from "@codegouvfr/react-dsfr/SideMenu";
import { Flex } from "#components/ui/Flex.tsx";
import { useState } from "react";

export const StateReportSummary = () => {
  const isDesktop = useIsDesktop();
  const { step } = routeApi.useSearch();
  const [expanded, setExpanded] = useState<boolean>(false);

  if (isDesktop) return <SummaryContent />;

  const currentStepString = stepsLabel[step];

  return (
    <Accordion
      expanded={expanded}
      onExpandedChange={(newExpanded) => setExpanded(newExpanded)}
      label={
        <Flex
          alignItems="center"
          className="fr-icon fr-icon-menu-2-fill fr-icon--sm"
          sx={{
            "::before": { mr: "8px" },
          }}
        >
          {currentStepString}
        </Flex>
      }
      sx={{
        ".fr-collapse--expanded": { paddingTop: "0", px: { xs: "0", lg: "16px" }, pb: { xs: 0, lg: undefined } },
        borderBottom: "1px solid",
      }}
    >
      <SummaryContent onClick={() => setExpanded(false)} />
    </Accordion>
  );
};

const stepsLabel = {
  informations: "Informations",
  "contexte-visite": "Contexte de la visite",
  "constat-general": "Constat général",
  "constat-detaille": "Constat détaillé",
  documents: "Documents",
};

export const scrollToTop = () => {
  document.getElementsByClassName("MuiBox-root")?.[0]?.scrollTo(0, 0);
};

const routeApi = getRouteApi("/constat/$constatId");
const SummaryContent = ({ onClick }: { onClick?: () => void }) => {
  const navigate = useNavigate();
  const { constatId } = routeApi.useParams();
  const { step } = routeApi.useSearch();

  const navigateToStep = (step: StateReportStep) => {
    navigate({ to: "/constat/$constatId", params: { constatId }, search: { step } });
    onClick?.();
    scrollToTop();
  };

  const activeProps = {
    color: fr.colors.decisions.text.actionHigh.blueFrance.default,
    "::before": {
      content: "''",
      position: "absolute",
      top: "0.75rem",
      bottom: "0.75rem",
      left: 0,
      width: "2px",
      backgroundColor: fr.colors.decisions.border.actionHigh.blueFrance.default,
    },
  };

  const isActive = (targetStep: StateReportStep) => step === targetStep;
  return (
    <Box
      component="ul"
      sx={{
        "> li": { fontWeight: "bold", fontSize: "16px" },
        "> ul > li": {
          borderBottom: "1px solid",
          borderBottomColor: fr.colors.decisions.border.default.grey.default,
          cursor: "pointer",
          userSelect: "none",
          pl: "8px",
        },
        li: {
          px: { xs: "16px", lg: "0" },
          listStyleType: "none",
          py: "12px",
          "&.active": { ...activeProps },
        },
        ul: {
          px: { xs: "16px", lg: "0" },
          marginTop: "0",
          marginBottom: "0",
        },
        "> ul:last-child > li:last-child": {
          borderBottom: "none",
        },
      }}
      pl="0"
      mr={{ xs: "0", lg: "16px" }}
    >
      <Box component="li">Le monument historique</Box>
      <Box component="ul" pl="0">
        <Box
          position="relative"
          component="li"
          className={isActive("informations") ? "active" : ""}
          onClick={() => navigateToStep("informations")}
        >
          Informations
        </Box>
      </Box>

      <Box component="li" mt="4px">
        Saisie du constat d'état
      </Box>
      <Box component="ul" pl="0">
        <Box
          position="relative"
          component="li"
          className={isActive("contexte-visite") ? "active" : ""}
          onClick={() => navigateToStep("contexte-visite")}
        >
          Contexte de la visite
        </Box>
        <Box
          position="relative"
          component="li"
          className={isActive("constat-detaille") ? "active" : ""}
          onClick={() => navigateToStep("constat-detaille")}
        >
          Constat détaillé
        </Box>
        <Box
          position="relative"
          component="li"
          className={isActive("constat-general") ? "active" : ""}
          onClick={() => navigateToStep("constat-general")}
        >
          Constat général
        </Box>
      </Box>
    </Box>
  );
};
