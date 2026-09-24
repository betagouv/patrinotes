import { Typography, TypographyProps } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { fr } from "@codegouvfr/react-dsfr";

export const BackHomeButton = (props: TypographyProps) => {
  return (
    <Link to="/" style={{ textDecoration: "underline" }} search={{ document: "constats" }}>
      <Typography fontSize="12px" color={fr.colors.decisions.text.mention.grey.default} {...props}>
        Retour à l'accueil
      </Typography>
    </Link>
  );
};
