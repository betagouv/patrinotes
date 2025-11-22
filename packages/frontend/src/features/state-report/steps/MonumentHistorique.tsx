import { Flex } from "#components/ui/Flex.tsx";
import { Box, BoxProps, LinkBaseProps, LinkProps, styled, Typography } from "@mui/material";
import { StateReportFormType, useStateReportFormContext } from "../utils";
import { useWatch } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "#components/MUIDsfr.tsx";
import { PropsWithChildren, useState } from "react";
import { IconLink } from "#components/ui/IconLink.tsx";
import { ButtonsSwitch } from "../WithReferencePop";
import { useIsDesktop } from "../../../hooks/useIsDesktop";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api";
import { db, useDbQuery } from "../../../db/db";
import { PopImage, PopObjet } from "../../../db/AppSchema";

export const MonumentHistorique = () => {
  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: "reference_pop" });
  const isDesktop = useIsDesktop();

  return (
    <Flex flexDirection="column" height="100%">
      <Flex
        flexDirection="column"
        gap={{ xs: "8px", lg: "16px" }}
        px={{ xs: "16px", lg: "64px" }}
        pt={{ xs: "0", lg: "32px" }}
        width="100%"
        flex="1"
      >
        <ContentBlock mt={{ xs: "16px", lg: "0" }}>
          <EditableField label="Nature de l'édifice" field="nature_edifice" />
          <EditableField label="Référence pop" field="reference_pop" />
        </ContentBlock>
        <ContentBlock>
          <EditableField label="Adresse" field="adresse" />
          <EditableField label="Commune" field="commune" />
          <EditableField label="Commune historique" field="commune_historique" />
          <EditableField label="Référence cadastrale" field="reference_cadastrale" />
        </ContentBlock>
        <ContentBlock>
          <EditableField label="Nature de la protection" field="nature_protection" />
          <EditableField label="Période de construction" field="periode_construction" />
          <EditableField label="Parties protégées" field="parties_protegees" />
          <EditableField label="Description de l'édifice" field="description" />
        </ContentBlock>
      </Flex>

      <Box mt="24px" px={{ xs: "16px", lg: "64px" }}>
        <MonumentObjets />
      </Box>
      {isDesktop ? null : <ButtonsSwitch />}

      <Box position="relative" height="60px" width="100%" mt={{ xs: "16px", lg: "32px" }}>
        <Box
          height="60px"
          bgcolor={fr.colors.decisions.background.contrast.info.default}
          py="18px"
          position="absolute"
          top="0"
          left="0"
          right="calc(-100vw + 100%)"
          bottom="0"
        >
          <Box
            component="a"
            href={`https://pop.culture.gouv.fr/notice/merimee/${value}`}
            title="En savoir plus sur l'édifice - Nouvelle fenêtre"
            target="_blank"
            rel="noopener external"
            sx={{
              marginLeft: { lg: "64px", xs: "16px" },
              color: fr.colors.decisions.text.actionHigh.blueFrance.default,
              textDecoration: "underline",
              textUnderlineOffset: "5px",
            }}
          >
            En savoir plus sur l'édifice
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

const MonumentObjets = () => {
  const form = useStateReportFormContext();
  const monumentReference = useWatch({ control: form.control, name: "reference_pop" });
  const [nbToShow, setNbToShow] = useState(2);

  const objetsQuery = useQuery({
    queryKey: ["pop-objets", monumentReference, nbToShow],
    queryFn: async () => {
      if (!monumentReference) return { objets: [], images: [] };
      const objetsResponse = await db
        .selectFrom("pop_objets")
        .selectAll()
        .where("reference_a_une_notice_merimee_mh", "like", "%" + monumentReference)
        .limit(nbToShow)
        .execute();

      return { objets: objetsResponse };
    },
    enabled: !!monumentReference,
  });

  const imagesQuery = useQuery({
    queryKey: ["pop-images-for-objets", objetsQuery.data?.objets.map((o) => o.reference)],
    queryFn: async () => {
      const references = objetsQuery.data!.objets.map((o) => o.reference);
      const images = await api.get("/api/state-report/objets-images", {
        query: { references: references.join(",") as any },
      });
      return { images: images as PopImage[] };
    },
    refetchOnWindowFocus: false,
    enabled: !!objetsQuery.data?.objets.length,
  });

  const { objets } = objetsQuery.data ?? { objets: [] };
  const { images } = imagesQuery.data ?? { images: [] };
  if (!objets?.length) return null;

  return (
    <>
      <Typography variant="subtitle1" fontWeight="bold" mb="16px">
        Objets mobiliers conservés
      </Typography>
      <Flex width="100%" gap="16px" flexDirection={{ xs: "column", lg: "row" }}>
        {objets.map((obj) => (
          <MonumentObjetItem
            key={obj.id}
            popObjet={obj}
            images={images.filter((img) => img.reference === obj.reference)}
          />
        ))}
      </Flex>
    </>
  );
};

const MonumentObjetItem = ({ popObjet, images }: { popObjet: PopObjet; images: PopImage[] }) => {
  return (
    <Flex
      component="a"
      // @ts-ignore mui error
      href={`https://pop.culture.gouv.fr/notice/palissy/${popObjet.reference}`}
      target="_blank"
      rel="noopener external"
      flexDirection="column"
      flex="1"
      border="1px solid"
      borderColor={fr.colors.decisions.border.default.grey.default}
      gap="8px"
      maxWidth={{ xs: "100%", lg: "50%" }}
      sx={{
        "::after": {
          display: "none",
        },
      }}
    >
      <Box
        component="img"
        height="216px"
        src={images?.[0]?.url ? images[0].url : "/objet-sans-image.png"}
        sx={{
          objectFit: "cover",
        }}
      />
      <Flex flexDirection="column" justifyContent="space-between" px="16px" gap={"8px"} py="16px" height="100%">
        <Typography fontSize="20px" color={fr.colors.decisions.text.actionHigh.blueFrance.default} fontWeight="bold">
          {popObjet.titre_editorial}
        </Typography>
        <Flex alignItems="center" justifyContent="space-between">
          <Typography fontSize="12px" color={fr.colors.decisions.text.mention.grey.default}>
            {popObjet.reference}
          </Typography>
          <Box
            color={fr.colors.decisions.text.actionHigh.blueFrance.default}
            className="fr-icon fr-icon-arrow-right-line"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export const ContentBlock = (props: PropsWithChildren<BoxProps>) => {
  return (
    <Flex
      flexDirection={{ xs: "column", lg: "row" }}
      borderBottom={{ xs: "1px solid", lg: "1px solid" }}
      gap={{ xs: "8px", lg: "0" }}
      pb="16px"
      borderColor={fr.colors.decisions.border.default.grey.default + " !important"}
      sx={{ "> div": { width: { xs: "auto", lg: "50%" } }, "> div:nth-child(n+3)": { mt: { xs: "0", lg: "16px" } } }}
      flexWrap={{ lg: "wrap" }}
      {...props}
    >
      {props.children}
    </Flex>
  );
};

const EditableField = ({ label, field }: { label: string; field: keyof StateReportFormType }) => {
  const isEditable = false;

  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: field });

  return (
    <Flex flexDirection="column">
      <Typography variant="subtitle1" fontWeight="bold">
        {label}
      </Typography>
      <Typography mt="4px">{value ?? "Non renseigné"}</Typography>
    </Flex>
  );
};
