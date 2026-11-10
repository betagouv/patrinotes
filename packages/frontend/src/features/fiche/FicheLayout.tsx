import { BackHomeButton } from "#components/BackHomeButton.tsx";
import { SimpleBanner } from "#components/Banner.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Box, BoxProps, Typography } from "@mui/material";
import { ReactNode } from "react";

const colors = fr.colors.decisions;

/** Links that must look like links at rest (DSFR only underlines some of them), without a second underline on hover. */
export const underlinedLink = { textDecoration: "underline", textUnderlineOffset: "4px", backgroundImage: "none" } as const;

/**
 * Page of a fiche (monument historique, unité patrimoniale or objet mobilier): blue banner with the title,
 * actions on the left (above the content on mobile), information on the right, and a link to the POP notice.
 */
export const FicheLayout = ({
  title,
  actions,
  children,
  popUrl,
}: {
  title: ReactNode;
  actions: ReactNode;
  children: ReactNode;
  popUrl?: string | null;
}) => {
  return (
    <Flex flexDirection="column" width="100%" flex="1">
      <SimpleBanner width="100%" alignItems="flex-start" pt={{ xs: "24px", lg: "24px" }} pb={{ xs: "24px", lg: "40px" }}>
        <Flex width={{ xs: "100%", lg: "1200px" }} maxWidth="100%" flexDirection="column" px="16px">
          <BackHomeButton />
          <Typography component="h1" fontSize="20px !important" lineHeight="28px" fontWeight="bold" mt="24px" mb="0 !important">
            {title}
          </Typography>
        </Flex>
      </SimpleBanner>

      <Flex width="100%" justifyContent="center" flex="1">
        <Flex width={{ xs: "100%", lg: "1200px" }} maxWidth="100%" flexDirection={{ xs: "column", lg: "row" }}>
          <Box
            width={{ xs: "100%", lg: "344px" }}
            flexShrink={0}
            px="16px"
            pt={{ xs: "24px", lg: "40px" }}
            pb={{ xs: "8px", lg: "40px" }}
          >
            <Flex
              flexDirection="column"
              gap="8px"
              width={{ xs: "100%", lg: "282px" }}
              position={{ xs: "static", lg: "sticky" }}
              top="16px"
            >
              {actions}
            </Flex>
          </Box>
          <Flex
            flexDirection="column"
            flex="1"
            minWidth={0}
            borderLeft={{ xs: "none", lg: `1px solid ${colors.border.default.grey.default}` }}
          >
            <Flex flexDirection="column" px={{ xs: "16px", lg: "64px" }} pt={{ xs: "16px", lg: "40px" }} pb="48px" maxWidth={{ lg: "920px" }}>
              {children}
            </Flex>
            {popUrl ? <PopBand url={popUrl} /> : null}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const PopBand = ({ url }: { url: string }) => (
  <Box
    bgcolor={colors.background.contrast.info.default}
    py="20px"
    px={{ xs: "16px", lg: "64px" }}
    mt="auto"
    // the band runs to the right edge of the page, past the centered content
    sx={{
      boxShadow: `0 0 0 100vw ${colors.background.contrast.info.default}`,
      clipPath: "inset(0 -100vw 0 0)",
    }}
  >
    <a
      className="fr-link fr-link--sm"
      href={url}
      target="_blank"
      rel="noopener external"
      title="Consulter la page POP du monument - ouvre une nouvelle fenêtre"
    >
      Consulter la page POP du monument
    </a>
  </Box>
);

export const FicheSectionTitle = ({ children, ...props }: { children: ReactNode } & BoxProps) => (
  <Typography
    component="h2"
    fontSize="20px !important"
    lineHeight="28px !important"
    fontWeight="bold"
    color={colors.text.label.grey.default}
    mb="0 !important"
    {...(props as any)}
  >
    {children}
  </Typography>
);

export const FicheSectionIntro = ({ children }: { children: ReactNode }) => (
  <Typography fontSize="14px" lineHeight="24px" color={colors.text.mention.grey.default} mt="8px">
    {children}
  </Typography>
);

/** Two columns of label / value fields on desktop, one on mobile. */
export const FicheFields = ({ children, ...props }: { children: ReactNode } & BoxProps) => (
  <Box
    display="grid"
    gridTemplateColumns={{ xs: "1fr", lg: "1fr 1fr" }}
    columnGap="24px"
    rowGap={{ xs: "16px", lg: "24px" }}
    {...props}
  >
    {children}
  </Box>
);

export const FicheField = ({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: ReactNode;
  /** spans both columns */
  fullWidth?: boolean;
}) => (
  <Box gridColumn={fullWidth ? { lg: "1 / span 2" } : undefined} minWidth={0}>
    <Typography fontWeight="bold" lineHeight="24px">
      {label}
    </Typography>
    {typeof value === "string" || value === null || value === undefined ? (
      <Typography mt="4px" lineHeight="24px" sx={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
        {value || "Non renseigné"}
      </Typography>
    ) : (
      <Box mt="4px">{value}</Box>
    )}
  </Box>
);

export const FicheDivider = () => <Divider my={{ xs: "16px", lg: "32px" }} />;

/** "PA00079952 voir sur POP ↗" */
export const PopReference = ({ reference, base }: { reference: string | null | undefined; base: "merimee" | "palissy" }) => {
  if (!reference) return <Typography lineHeight="24px">Non renseigné</Typography>;
  return (
    <Flex alignItems="center" gap="8px" flexWrap="wrap">
      <Typography lineHeight="24px">{reference}</Typography>
      <a
        className="fr-link fr-icon-external-link-line fr-link--icon-right"
        href={getPopUrl(reference, base)}
        target="_blank"
        rel="noopener external"
        title={`Voir ${reference} sur POP - ouvre une nouvelle fenêtre`}
        style={underlinedLink}
      >
        voir sur POP
      </a>
    </Flex>
  );
};

export const getPopUrl = (reference: string, base: "merimee" | "palissy") =>
  `https://pop.culture.gouv.fr/notice/${base}/${reference}`;
