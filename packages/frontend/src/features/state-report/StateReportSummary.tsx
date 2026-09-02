import { Accordion } from "#components/MUIDsfr.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Box } from "@mui/material";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { getRouteApi, Link } from "@tanstack/react-router";
import { StateReportStep } from "./utils";
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
  const { constatId } = routeApi.useParams();
  const { step } = routeApi.useSearch();

  const onNavigate = () => {
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
        // Invisible stretched links so each row is keyboard-focusable and
        // activatable without altering the visual layout.
        "li > a": {
          position: "absolute",
          inset: 0,
          borderRadius: 0,
        },
      }}
      pl="0"
      mr={{ xs: "0", lg: "16px" }}
    >
      <Box component="li">Le monument historique</Box>
      <Box component="ul" pl="0">
        <Box position="relative" component="li" className={isActive("informations") ? "active" : ""}>
          Informations
          <Link
            to="/constat/$constatId"
            params={{ constatId }}
            search={{ step: "informations", mode: "view" }}
            onClick={onNavigate}
            aria-label="Informations"
            aria-current={isActive("informations") ? "page" : undefined}
          />
        </Box>
      </Box>

      <Box component="li" mt="4px">
        Saisie du constat d'état
      </Box>
      <Box component="ul" pl="0">
        <Box position="relative" component="li" className={isActive("contexte-visite") ? "active" : ""}>
          Contexte de la visite
          <Link
            to="/constat/$constatId"
            params={{ constatId }}
            search={{ step: "contexte-visite", mode: "view" }}
            onClick={onNavigate}
            aria-label="Contexte de la visite"
            aria-current={isActive("contexte-visite") ? "page" : undefined}
          />
        </Box>
        <Box position="relative" component="li" className={isActive("constat-detaille") ? "active" : ""}>
          Constat détaillé
          <Link
            to="/constat/$constatId"
            params={{ constatId }}
            search={{ step: "constat-detaille", mode: "view" }}
            onClick={onNavigate}
            aria-label="Constat détaillé"
            aria-current={isActive("constat-detaille") ? "page" : undefined}
          />
        </Box>
        <Box position="relative" component="li" className={isActive("constat-general") ? "active" : ""}>
          Constat général
          <Link
            to="/constat/$constatId"
            params={{ constatId }}
            search={{ step: "constat-general", mode: "view" }}
            onClick={onNavigate}
            aria-label="Constat général"
            aria-current={isActive("constat-general") ? "page" : undefined}
          />
        </Box>
      </Box>
    </Box>
  );
};
