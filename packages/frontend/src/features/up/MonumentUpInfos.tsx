import { Box, Typography } from "@mui/material";
import { fr } from "@codegouvfr/react-dsfr";
import { useWatch } from "react-hook-form";
import { formatUpNiveau, formatUpProtection } from "@patrinotes/pdf/utils";
import { Flex } from "#components/ui/Flex.tsx";
import { useStateReportFormContext } from "../state-report/utils";
import { parseUpChemin } from "./upApi";

/** True when the constat's monument is a "MH complexe" (split into unités patrimoniales). */
export const useIsMonumentComplexe = () => {
  const form = useStateReportFormContext();
  const [upId, monumentIdentifiant] = useWatch({
    control: form.control,
    name: ["up_id", "up_monument_identifiant"],
  });
  return !!upId || !!monumentIdentifiant;
};

/**
 * "Monument historique" and "Unité patrimoniale" blocks of the Informations step (MH complexes only).
 * Values come from the dataspace API, copied in the constat when the UP was chosen: they are not editable.
 */
export const MonumentUpInfos = () => {
  const form = useStateReportFormContext();
  const [titre, referencePop, monumentIdentifiant, upId, intitule, identifiant, niveau, protection, chemin] = useWatch({
    control: form.control,
    name: [
      "titre_edifice",
      "reference_pop",
      "up_monument_identifiant",
      "up_id",
      "up_intitule",
      "up_identifiant",
      "up_niveau",
      "up_protection",
      "up_chemin",
    ],
  });

  const parents = parseUpChemin(chemin).map((c) => c.intitule);

  return (
    <Flex flexDirection="column" gap="16px" mb="8px">
      <SectionTitle>Monument historique</SectionTitle>
      <Row>
        <InfoField label="Appellation" value={titre} />
      </Row>
      <Row>
        <InfoField
          label="Référence Mérimée"
          value={
            referencePop ? (
              <Typography
                mt="4px"
                className="fr-link"
                component="a"
                href={`https://pop.culture.gouv.fr/notice/merimee/${referencePop}`}
                target="_blank"
                title="pop.culture.gouv.fr - ouvre une nouvelle fenêtre"
                rel="noopener external"
              >
                {referencePop}
              </Typography>
            ) : null
          }
        />
        <InfoField label="Identifiant AgrÉgée" value={monumentIdentifiant} />
      </Row>

      {upId ? (
        <>
          <SectionTitle mt="16px">Unité patrimoniale</SectionTitle>
          <Row>
            <InfoField label="Appellation" value={intitule} />
            <InfoField label="Identifiant AgrÉgée" value={identifiant} />
          </Row>
          {parents.length ? (
            <Row>
              <InfoField label="Fait partie de" value={parents.join(" › ")} />
            </Row>
          ) : null}
          <Row>
            <InfoField label="Niveau" value={formatUpNiveau(niveau)} />
            <InfoField label="Protection" value={formatUpProtection(protection)} />
          </Row>
        </>
      ) : (
        <Typography color={fr.colors.decisions.text.mention.grey.default}>
          Constat portant sur l’ensemble du monument.
        </Typography>
      )}
    </Flex>
  );
};

const SectionTitle = ({ children, mt }: { children: React.ReactNode; mt?: string }) => (
  <Typography component="h4" fontSize="22px" fontWeight="bold" mt={mt} mb="0 !important">
    {children}
  </Typography>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <Flex flexDirection={{ xs: "column", lg: "row" }} width="100%" gap="16px">
    {children}
  </Flex>
);

const InfoField = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box flex="1">
    <Typography variant="subtitle1" fontWeight="bold">
      {label}
    </Typography>
    {typeof value === "string" || value == null ? <Typography mt="4px">{value || "Non renseigné"}</Typography> : value}
  </Box>
);
