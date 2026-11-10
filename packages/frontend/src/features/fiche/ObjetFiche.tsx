import { Button } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Box, Dialog, Stack, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { PopImage } from "../../db/AppSchema";
import { db, useDbQuery } from "../../db/db";
import { useIsOnline } from "../../hooks/useIsOnline";
import { ModalCloseButton } from "../menu/MenuTitle";
import { getUpRoot, useMonumentUpTree, type UnitePatrimoniale, type UpTree } from "../up/upApi";
import { useMonumentAlerts, type MonumentAlertContext } from "./alerts/monumentAlerts";
import { corrected, useCorrection } from "./corrections";
import { CorrectionForm } from "./CorrectionForm";
import { EnsemblePatrimonial } from "./EnsemblePatrimonial";
import { FicheActions } from "./FicheActions";
import { buildHistory, FicheHistory, type HistoryItem } from "./FicheHistory";
import { FicheField, FicheFields, FicheLayout, FicheSectionTitle, getPopUrl, PopReference } from "./FicheLayout";
import { useObjetImages } from "./FicheObjets";
import { countConstatsByUp, useMonumentConstats } from "./useMonumentConstats";

const colors = fr.colors.decisions;

/** First Mérimée reference (PA…) of an objet's monument field, which may hold several references. */
const getMonumentReference = (value: string | null | undefined) =>
  value
    ?.split(/[\s,;]+/)
    .map((reference) => reference.trim())
    .find(Boolean) ?? null;

/** Fiche of an objet mobilier: its monument, its POP information and photos, alerts and annotations. */
export const ObjetFiche = ({ reference }: { reference: string }) => {
  const objetQuery = useDbQuery(db.selectFrom("pop_objets").selectAll().where("reference", "=", reference), [reference]);
  const objet = objetQuery.data?.[0];
  const referencePop = getMonumentReference(objet?.reference_a_une_notice_merimee_mh);

  const monumentQuery = useDbQuery(
    db
      .selectFrom("pop_immeubles")
      .selectAll()
      .where("id", "=", referencePop ?? "__none__"),
    [referencePop],
  );
  const monument = monumentQuery.data?.[0];

  const isOnline = useIsOnline();
  const treeQuery = useMonumentUpTree(referencePop, isOnline);
  const tree = treeQuery.data ?? null;

  const { correction } = useCorrection(referencePop ? { target: "objet", referencePop, objetReference: reference } : null);
  const { alerts } = useMonumentAlerts(referencePop);
  const { rows: constats } = useMonumentConstats(referencePop);
  const constatAlertsQuery = useDbQuery(
    db
      .selectFrom("state_report_alert")
      .innerJoin("state_report", "state_report.id", "state_report_alert.state_report_id")
      .select([
        "state_report_alert.id",
        "state_report_alert.probleme",
        "state_report_alert.commentaires",
        "state_report.created_at",
        "state_report.redacted_by",
      ])
      .where("state_report_alert.objet_ou_mobilier", "=", reference)
      .where("state_report.attachment_id", "is not", null),
    [reference],
  );
  const images = useObjetImages([reference]);
  const [isEditing, setIsEditing] = useState(false);

  if (objetQuery.isLoading) {
    return (
      <Flex justifyContent="center" py="120px">
        <Spinner />
      </Flex>
    );
  }

  if (!objet) {
    return (
      <FicheLayout title="Objet introuvable" actions={null}>
        <Typography>
          Cet objet mobilier n’est pas disponible sur cet appareil : il n’est peut-être pas dans les départements de
          votre service, ou les données sont encore en cours de synchronisation.
        </Typography>
      </FicheLayout>
    );
  }

  const titre = objet.titre_editorial || reference;
  const titreEdifice = monument?.titre_editorial_de_la_notice ?? objet.nom_de_l_edifice ?? null;
  const emplacement = corrected(objet.emplacement_de_l_oeuvre_dans_l_edifice, correction?.emplacement);

  const context: MonumentAlertContext = {
    referencePop: referencePop ?? reference,
    titreEdifice,
    commune: monument?.commune_forme_editoriale ?? objet.commune_forme_index ?? null,
    objetReference: reference,
    objetTitre: titre,
  };

  const extra: HistoryItem[] = (constatAlertsQuery.data ?? []).map((alert) => ({
    type: "constat-alert",
    date: alert.created_at,
    probleme: alert.probleme,
    commentaires: alert.commentaires,
    constatLabel: `Constat d’état${alert.redacted_by ? ` par ${alert.redacted_by}` : ""}`,
  }));

  // the objet hangs from its monument: with no unités patrimoniales, the monument alone makes the tree
  const objetTree: UpTree | null = referencePop
    ? (tree ?? {
        rootId: referencePop,
        ups: [{ id: referencePop, intitule: titreEdifice ?? referencePop, enfantsIds: [] } as unknown as UnitePatrimoniale],
      })
    : null;

  return (
    <FicheLayout
      title={titre}
      actions={<FicheActions context={context} tree={tree} isTreeLoading={false} />}
      popUrl={getPopUrl(reference, "palissy")}
    >
      <Stack>
        <Gallery images={images} />

        {isEditing && referencePop ? (
          <Box mt="40px">
            <FicheSectionTitle mb="24px !important">Emplacement de l’objet</FicheSectionTitle>
            <Box mt="24px">
              <CorrectionForm
                target={{ target: "objet", referencePop, objetReference: reference }}
                originals={{ emplacement: objet.emplacement_de_l_oeuvre_dans_l_edifice }}
                correction={correction}
                onDone={() => setIsEditing(false)}
              />
            </Box>
          </Box>
        ) : (
          <>
            <FicheSectionTitle mt={images.length ? "40px" : 0}>Édifice de conservation</FicheSectionTitle>
            <FicheFields mt="24px">
              <FicheField
                label="Titre courant"
                value={
                  referencePop && monument ? (
                    <Link to="/monument/$reference" params={{ reference: referencePop }} search={{}} className="fr-link">
                      {titreEdifice}
                    </Link>
                  ) : (
                    titreEdifice
                  )
                }
              />
              <FicheField label="Référence Mérimée" value={<PopReference reference={referencePop} base="merimee" />} />
              <FicheField
                label="Identifiant AgrÉgée"
                value={tree ? getUpRoot(tree).identifiant : monument?.identifiant_agregee}
              />
              <FicheField label="Commune" value={monument?.commune_forme_editoriale ?? objet.commune_forme_index} />
              <FicheField label="Adresse" value={monument?.adresse_forme_index ?? objet.adresse_forme_index} />
              <FicheField label="Emplacement de l’objet" value={emplacement} />
            </FicheFields>
          </>
        )}

        <FicheSectionTitle mt="48px">Informations de l’objet</FicheSectionTitle>
        <FicheFields mt="24px">
          <FicheField label="Titre courant" value={titre} />
          <FicheField label="Référence Palissy" value={<PopReference reference={reference} base="palissy" />} />
          <FicheField label="Identifiant AgrÉgée" value={objet.identifiant_agregee} />
          <FicheField label="Nature de la protection" value={objet.typologie_de_la_protection} />
          {objet.description ? <FicheField fullWidth label="Description" value={objet.description} /> : null}
          {objet.historique ? <FicheField fullWidth label="Historique" value={objet.historique} /> : null}
        </FicheFields>

        <Box mt="40px">
          <FicheHistory
            items={buildHistory({ alerts: alerts.filter((a) => a.objet_reference === reference), extra })}
          />
        </Box>

        {objetTree && referencePop ? (
          <Box mt="48px">
            <EnsemblePatrimonial
              key={objetTree.rootId}
              tree={objetTree}
              referencePop={referencePop}
              currentUpId={objetTree.rootId}
              constatCounts={countConstatsByUp(constats)}
              leaf={{ label: titre }}
            />
          </Box>
        ) : null}

        {!isEditing && referencePop ? (
          <Box mt="48px">
            <Button
              priority="secondary"
              size="large"
              iconId="ri-pencil-fill"
              type="button"
              onClick={() => {
                setIsEditing(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
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

/** One large photo and up to four small ones; « Afficher les N photos » opens them all. */
const Gallery = ({ images }: { images: PopImage[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const withUrl = images.filter((image) => !!image.url);
  if (!withUrl.length) return null;

  const [first, ...rest] = withUrl;
  const small = rest.slice(0, 4);

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", lg: small.length ? "2fr 1fr 1fr" : "1fr" }}
        gridTemplateRows={{ lg: small.length > 2 ? "1fr 1fr" : "1fr" }}
        gap="8px"
        height={{ xs: "auto", lg: "266px" }}
      >
        <GalleryImage image={first!} sx={{ gridRow: { lg: "1 / -1" }, height: { xs: "220px", lg: "100%" } }} />
        {small.map((image, index) => (
          <Box key={image.id} position="relative" display={{ xs: "none", lg: "block" }}>
            <GalleryImage image={image} sx={{ height: "100%" }} />
            {index === small.length - 1 && withUrl.length > 1 ? (
              <Button
                priority="tertiary"
                size="small"
                iconId="fr-icon-gallery-line"
                type="button"
                onClick={() => setIsOpen(true)}
                sx={{ position: "absolute", right: "8px", bottom: "8px", bgcolor: "white !important" }}
              >
                Afficher les {withUrl.length} photos
              </Button>
            ) : null}
          </Box>
        ))}
      </Box>
      {withUrl.length > 1 ? (
        <Box display={{ xs: "block", lg: "none" }} mt="8px">
          <Button priority="tertiary" size="small" iconId="fr-icon-gallery-line" type="button" onClick={() => setIsOpen(true)}>
            Afficher les {withUrl.length} photos
          </Button>
        </Box>
      ) : null}

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth maxWidth="lg">
        <Box p="16px">
          <Flex justifyContent="flex-end">
            <ModalCloseButton onClose={() => setIsOpen(false)} />
          </Flex>
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap="16px" mt="8px">
            {withUrl.map((image) => (
              <Box key={image.id} component="figure" m="0 !important">
                <GalleryImage image={image} sx={{ width: "100%", height: "auto", maxHeight: "480px", objectFit: "contain" }} />
                {image.label || image.copyright ? (
                  <Typography component="figcaption" fontSize="12px" color={colors.text.mention.grey.default} mt="4px">
                    {[image.label, image.copyright].filter(Boolean).join(" — ")}
                  </Typography>
                ) : null}
              </Box>
            ))}
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

const GalleryImage = ({ image, sx }: { image: PopImage; sx?: object }) => (
  <Box
    component="img"
    src={image.url!}
    alt={image.label ?? ""}
    width="100%"
    sx={{ objectFit: "cover", display: "block", bgcolor: colors.background.alt.grey.default, ...sx }}
  />
);
