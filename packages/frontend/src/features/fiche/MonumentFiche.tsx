import { Alert, Button } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { formatUpNiveau, formatUpProtection } from "@patrinotes/pdf/utils";
import { Box, Stack, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { ReactNode, useState } from "react";
import { db, useDbQuery } from "../../db/db";
import { useIsOnline } from "../../hooks/useIsOnline";
import { getUpRoot, useMonumentUpTree } from "../up/upApi";
import { useMonumentAlerts, type MonumentAlertContext } from "./alerts/monumentAlerts";
import { corrected, CorrectionTarget, useCorrection } from "./corrections";
import { CorrectionForm } from "./CorrectionForm";
import { EnsemblePatrimonial } from "./EnsemblePatrimonial";
import { FicheActions } from "./FicheActions";
import { buildHistory, FicheHistory } from "./FicheHistory";
import {
  FicheDivider,
  FicheField,
  FicheFields,
  FicheLayout,
  FicheSectionIntro,
  FicheSectionTitle,
  getPopUrl,
  PopReference,
} from "./FicheLayout";
import { FicheObjets } from "./FicheObjets";
import { countConstatsByUp, useMonumentConstats } from "./useMonumentConstats";

/**
 * Fiche of a monument historique, or of one of its unités patrimoniales (`upId`) when it is a MH complexe:
 * its information (with the service's corrections), constats and alerts, objets mobiliers and hierarchy.
 */
export const MonumentFiche = ({ reference, upId }: { reference: string; upId?: string }) => {
  const isOnline = useIsOnline();
  const monumentQuery = useDbQuery(db.selectFrom("pop_immeubles").selectAll().where("id", "=", reference), [reference]);
  const monument = monumentQuery.data?.[0];

  const treeQuery = useMonumentUpTree(reference, isOnline);
  const tree = treeQuery.data ?? null;
  const isTreeLoading = treeQuery.isLoading && treeQuery.fetchStatus !== "idle";
  const up = upId && tree ? (tree.ups.find((u) => u.id === upId) ?? null) : null;
  const isUpFiche = !!upId && upId !== tree?.rootId;

  const { correction: mhCorrection } = useCorrection({ target: "mh", referencePop: reference });
  const upTarget: CorrectionTarget | null = isUpFiche ? { target: "up", referencePop: reference, upId: upId! } : null;
  const { correction: upCorrection } = useCorrection(upTarget);

  const { rows: constats } = useMonumentConstats(reference);
  const { alerts } = useMonumentAlerts(reference);
  const [isEditing, setIsEditing] = useState(false);

  if (monumentQuery.isLoading) {
    return (
      <Flex justifyContent="center" py="120px">
        <Spinner />
      </Flex>
    );
  }

  if (!monument) {
    return (
      <FicheLayout title="Monument introuvable" actions={null}>
        <Typography>
          Ce monument historique n’est pas disponible sur cet appareil : il n’est peut-être pas dans les départements de
          votre service, ou les données sont encore en cours de synchronisation.
        </Typography>
        <Box mt="24px">
          <Link to="/monument" className="fr-link">
            Rechercher un monument
          </Link>
        </Box>
      </FicheLayout>
    );
  }

  const titre = monument.titre_editorial_de_la_notice ?? reference;
  const mh = {
    nature_edifice: corrected(monument.denomination_de_l_edifice, mhCorrection?.nature_edifice),
    adresse: corrected(monument.adresse_forme_index, mhCorrection?.adresse),
    commune: corrected(monument.commune_forme_editoriale, mhCorrection?.commune),
    commune_historique: corrected(monument.commune_forme_index, mhCorrection?.commune_historique),
    reference_cadastrale: corrected(monument.cadastre, mhCorrection?.reference_cadastrale),
    periode_construction: corrected(
      monument.siecle_de_la_campagne_principale_de_construction,
      mhCorrection?.periode_construction,
    ),
    nature_protection: corrected(monument.typologie_de_la_protection, mhCorrection?.nature_protection),
    parties_protegees: corrected(monument.precision_de_la_protection, mhCorrection?.parties_protegees),
    description: corrected(monument.description_de_l_edifice, mhCorrection?.description),
  };

  // an UP has its own address in the dataspace; what it lacks comes from the monument
  const upOriginals = {
    adresse: up?.adresse?.rue ?? null,
    commune: up?.adresse?.commune ?? monument.commune_forme_editoriale,
    commune_historique: monument.commune_forme_index,
    reference_cadastrale: null,
  };
  const upValues = {
    adresse: corrected(upOriginals.adresse, upCorrection?.adresse),
    commune: corrected(upOriginals.commune, upCorrection?.commune),
    commune_historique: corrected(upOriginals.commune_historique, upCorrection?.commune_historique),
    reference_cadastrale: corrected(upOriginals.reference_cadastrale, upCorrection?.reference_cadastrale),
  };

  const context: MonumentAlertContext = {
    referencePop: reference,
    titreEdifice: titre,
    commune: monument.commune_forme_editoriale,
    upId: isUpFiche ? upId : null,
    upIntitule: isUpFiche ? (up?.intitule ?? null) : null,
  };

  const historyConstats = isUpFiche ? constats.filter((c) => c.up_id === upId) : constats;
  const historyAlerts = isUpFiche ? alerts.filter((a) => a.up_id === upId) : alerts;
  const correctionTarget: CorrectionTarget = upTarget ?? { target: "mh", referencePop: reference };

  const infos = isEditing ? (
    <CorrectionForm
      target={correctionTarget}
      originals={
        isUpFiche
          ? upOriginals
          : {
              nature_edifice: monument.denomination_de_l_edifice,
              adresse: monument.adresse_forme_index,
              commune: monument.commune_forme_editoriale,
              commune_historique: monument.commune_forme_index,
              reference_cadastrale: monument.cadastre,
              periode_construction: monument.siecle_de_la_campagne_principale_de_construction,
              nature_protection: monument.typologie_de_la_protection,
              parties_protegees: monument.precision_de_la_protection,
              description: monument.description_de_l_edifice,
            }
      }
      correction={isUpFiche ? upCorrection : mhCorrection}
      onDone={() => setIsEditing(false)}
    />
  ) : isUpFiche ? (
    <UpInfos
      titre={titre}
      reference={reference}
      monumentIdentifiant={tree ? getUpRoot(tree).identifiant : null}
      up={up}
      values={upValues}
    />
  ) : (
    <MonumentInfos reference={reference} values={mh} />
  );

  return (
    <FicheLayout
      title={isUpFiche ? (up?.intitule ?? titre) : titre}
      actions={<FicheActions context={context} tree={tree} isTreeLoading={isTreeLoading} />}
      popUrl={getPopUrl(reference, "merimee")}
    >
      <Stack gap="0">
        {isUpFiche && !up ? (
          // @ts-ignore title is optional
          <Alert
            severity="info"
            small
            sx={{ mb: "24px" }}
            description={
              isTreeLoading
                ? "Récupération de l’unité patrimoniale…"
                : isOnline
                  ? "Cette unité patrimoniale n’a pas pu être récupérée."
                  : "Les unités patrimoniales ne sont pas disponibles hors ligne."
            }
          />
        ) : null}

        <Box id="fiche-informations">{infos}</Box>

        <Box mt="40px">
          <FicheHistory items={buildHistory({ constats: historyConstats, alerts: historyAlerts })} />
        </Box>

        <Box mt="48px">
          {isUpFiche ? (
            <>
              <FicheSectionTitle>Objets mobiliers conservés</FicheSectionTitle>
              <FicheSectionIntro>
                Les objets mobiliers sont rattachés au monument :{" "}
                <Link to="/monument/$reference" params={{ reference }} search={{}} className="fr-link fr-text--sm">
                  consultez-les depuis sa fiche
                </Link>
                .
              </FicheSectionIntro>
            </>
          ) : (
            <FicheObjets context={context} />
          )}
        </Box>

        {tree ? (
          <Box mt="48px">
            <EnsemblePatrimonial
              key={upId ?? tree.rootId}
              tree={tree}
              referencePop={reference}
              currentUpId={isUpFiche ? upId! : tree.rootId}
              constatCounts={countConstatsByUp(constats)}
            />
          </Box>
        ) : null}

        {!isEditing ? (
          <Box mt="48px">
            <Button
              priority="secondary"
              size="large"
              iconId="ri-pencil-fill"
              type="button"
              onClick={() => {
                setIsEditing(true);
                document.getElementById("fiche-informations")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Compléter les infos
            </Button>
          </Box>
        ) : null}
      </Stack>
    </FicheLayout>
  );
};

type MonumentValues = Record<
  | "nature_edifice"
  | "adresse"
  | "commune"
  | "commune_historique"
  | "reference_cadastrale"
  | "periode_construction"
  | "nature_protection"
  | "parties_protegees"
  | "description",
  string | null
>;

const MonumentInfos = ({ reference, values }: { reference: string; values: MonumentValues }) => (
  <>
    <FicheSectionTitle mb="24px !important">Informations</FicheSectionTitle>
    <FicheFields mt="24px">
      <FicheField label="Nature de l’édifice" value={values.nature_edifice} />
      <FicheField label="Référence Mérimée" value={<PopReference reference={reference} base="merimee" />} />
    </FicheFields>
    <FicheDivider />
    <FicheFields>
      <FicheField label="Adresse" value={values.adresse} />
      <FicheField label="Commune" value={values.commune} />
      <FicheField label="Commune historique" value={values.commune_historique} />
      <FicheField label="Référence cadastrale" value={values.reference_cadastrale} />
    </FicheFields>
    <FicheDivider />
    <FicheFields>
      <FicheField label="Périodes de construction" value={values.periode_construction} />
      <FicheField label="Nature de la protection" value={values.nature_protection} />
      <FicheField label="Parties protégées" value={values.parties_protegees} />
      <FicheField label="Description" value={values.description} />
    </FicheFields>
  </>
);

const UpInfos = ({
  titre,
  reference,
  monumentIdentifiant,
  up,
  values,
}: {
  titre: string;
  reference: string;
  monumentIdentifiant: string | null;
  up: { intitule: string; identifiant: string | null; niveau: string | null; protection: string | null } | null;
  values: Record<"adresse" | "commune" | "commune_historique" | "reference_cadastrale", string | null>;
}): ReactNode => (
  <>
    <FicheSectionTitle>Monument historique</FicheSectionTitle>
    <FicheFields mt="24px">
      <FicheField
        fullWidth
        label="Nom de l’édifice"
        value={
          <Link to="/monument/$reference" params={{ reference }} search={{}} className="fr-link">
            {titre}
          </Link>
        }
      />
      <FicheField label="Référence Mérimée" value={<PopReference reference={reference} base="merimee" />} />
      <FicheField label="Identifiant AgrÉgée" value={monumentIdentifiant} />
    </FicheFields>

    <FicheSectionTitle mt="40px">Unité patrimoniale</FicheSectionTitle>
    <FicheFields mt="24px">
      <FicheField label="Nom de l’UP" value={up?.intitule} />
      <FicheField label="Identifiant AgrÉgée" value={up?.identifiant} />
      <FicheField label="Niveau" value={formatUpNiveau(up?.niveau ?? null)} />
      <FicheField label="Protection" value={formatUpProtection(up?.protection ?? null)} />
    </FicheFields>
    <FicheDivider />
    <FicheFields>
      <FicheField label="Adresse" value={values.adresse} />
      <FicheField label="Commune" value={values.commune} />
      <FicheField label="Commune historique" value={values.commune_historique} />
      <FicheField label="Référence cadastrale" value={values.reference_cadastrale} />
    </FicheFields>
  </>
);
