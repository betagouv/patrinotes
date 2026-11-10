import { Button } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "../../api";
import { PopImage, PopObjet } from "../../db/AppSchema";
import { db, useDbQuery } from "../../db/db";
import { useIsOnline } from "../../hooks/useIsOnline";
import { MonumentAlertContext } from "./alerts/monumentAlerts";
import { ObjetAnnotationModal } from "./alerts/ObjetAnnotationModal";
import { FicheSectionIntro, FicheSectionTitle } from "./FicheLayout";

const colors = fr.colors.decisions;
const FIRST_PAGE = 2;
const PAGE = 6;

type ObjetCard = Pick<PopObjet, "id" | "reference" | "titre_editorial">;

/** « Objets mobiliers conservés » of a monument: cards to their fiche, with a quick annotation. */
export const FicheObjets = ({ context }: { context: MonumentAlertContext }) => {
  const reference = context.referencePop.trim();
  const [shown, setShown] = useState(FIRST_PAGE);
  const [annotated, setAnnotated] = useState<ObjetCard | null>(null);

  const objetsQuery = useDbQuery(
    db
      .selectFrom("pop_objets")
      .select(["id", "reference", "titre_editorial"])
      .where("reference_a_une_notice_merimee_mh", "like", "%" + reference)
      .orderBy("titre_editorial"),
    [reference],
  );
  const objets = objetsQuery.data ?? [];
  const visible = objets.slice(0, shown);

  return (
    <Box>
      <FicheSectionTitle>Objets mobiliers conservés</FicheSectionTitle>
      {objetsQuery.isLoading ? null : objets.length ? (
        <>
          <FicheSectionIntro>Consultez la fiche d’un objet, annotez-le rapidement ou déclenchez une alerte.</FicheSectionIntro>
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", lg: "1fr 1fr" }} gap="24px" mt="16px">
            <ObjetCards objets={visible} onAnnotate={setAnnotated} />
          </Box>
          {shown < objets.length ? (
            <Button
              priority="tertiary"
              type="button"
              onClick={() => setShown((s) => s + PAGE)}
              sx={{ mt: "24px", width: { xs: "100%", lg: "calc(50% - 12px)" }, justifyContent: "center" }}
            >
              Voir plus de mobiliers
            </Button>
          ) : null}
        </>
      ) : (
        <FicheSectionIntro>Cet édifice ne contient pas d’objets mobiliers.</FicheSectionIntro>
      )}

      {annotated ? (
        <ObjetAnnotationModal
          open
          onClose={() => setAnnotated(null)}
          context={{ ...context, objetReference: annotated.reference!, objetTitre: annotated.titre_editorial }}
        />
      ) : null}
    </Box>
  );
};

const ObjetCards = ({ objets, onAnnotate }: { objets: ObjetCard[]; onAnnotate: (objet: ObjetCard) => void }) => {
  const images = useObjetImages(objets.map((o) => o.reference!).filter(Boolean));
  return (
    <>
      {objets.map((objet) => (
        <ObjetCardItem
          key={objet.id}
          objet={objet}
          image={images.find((image) => image.reference === objet.reference)?.url ?? null}
          onAnnotate={() => onAnnotate(objet)}
        />
      ))}
    </>
  );
};

/** POP images of objets (online only; a placeholder is shown otherwise). */
export const useObjetImages = (references: string[]) => {
  const isOnline = useIsOnline();
  const query = useQuery({
    queryKey: ["fiche-objets-images", references],
    queryFn: async () =>
      (await api.get("/api/state-report/objets-images", { query: { references: references.join(",") as any } })) as PopImage[],
    enabled: isOnline && references.length > 0,
    refetchOnWindowFocus: false,
  });
  return query.data ?? [];
};

const ObjetCardItem = ({ objet, image, onAnnotate }: { objet: ObjetCard; image: string | null; onAnnotate: () => void }) => (
  <Flex
    flexDirection="column"
    border="1px solid"
    borderColor={colors.border.default.grey.default}
    position="relative"
    sx={{ "&:hover": { bgcolor: colors.background.default.grey.hover } }}
  >
    <Box
      component="img"
      height="216px"
      width="100%"
      src={image ?? "/objet-sans-image.png"}
      alt=""
      sx={{ objectFit: "cover", bgcolor: colors.background.alt.blueFrance.default }}
    />
    <Flex flexDirection="column" gap="8px" p="24px" flex="1">
      <Link
        to="/objet/$reference"
        params={{ reference: objet.reference! }}
        style={{ backgroundImage: "none", color: colors.text.actionHigh.blueFrance.default }}
      >
        <Typography component="span" fontSize="20px" lineHeight="28px" fontWeight="bold">
          {objet.titre_editorial || objet.reference}
        </Typography>
        {/* the whole card opens the fiche */}
        <Box component="span" position="absolute" sx={{ inset: 0 }} />
      </Link>
      <Flex alignItems="center" justifyContent="space-between" mt="auto" pt="8px">
        <Typography fontSize="12px" color={colors.text.mention.grey.default}>
          {objet.reference}
        </Typography>
        <Box color={colors.text.actionHigh.blueFrance.default} className="fr-icon fr-icon-arrow-right-line fr-icon--sm" />
      </Flex>
      <Box position="relative" zIndex={1}>
        <Button priority="tertiary no outline" size="small" iconId="fr-icon-edit-line" type="button" onClick={onAnnotate}>
          Annoter
        </Button>
      </Box>
    </Flex>
  </Flex>
);
