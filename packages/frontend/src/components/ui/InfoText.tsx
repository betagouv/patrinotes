import type { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { cx } from "@codegouvfr/react-dsfr/fr/cx";
import { Box, type BoxProps } from "@mui/material";

export const InfoText = ({ children, sx }: { children: React.ReactNode; sx?: BoxProps["sx"] }) => {
  return (
    <Box
      className={cx("fr-info-text", "fr-text--md")}
      sx={{ alignItems: "flex-start", "&::before": { position: "relative", top: "3px" }, ...sx }}
    >
      {children}
    </Box>
  );
};
