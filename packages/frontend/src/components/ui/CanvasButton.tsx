import { Button } from "#components/MUIDsfr.tsx";
import { fr, FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";
import { ButtonProps } from "@mui/material";
import { ReactNode } from "react";

export const CanvasButton = ({
  children,
  sx,
  iconId,
  onClick,
  title,
  isSelected,
}: {
  children?: ReactNode;
  sx?: ButtonProps["sx"];
  iconId?: FrIconClassName | RiIconClassName;
  onClick?: () => void;
  title?: string;
  isSelected?: boolean;
}) => {
  return (
    <Button
      type="button"
      priority="tertiary no outline"
      iconId={iconId!}
      onClick={onClick}
      title={title}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        padding: 0,
        cursor: "pointer",
        bgcolor: isSelected ? "#EAEAEA" : "white",
        border: "1px solid",
        borderColor: fr.colors.decisions.background.active.blueFrance.default,
        color: fr.colors.decisions.background.active.blueFrance.default,
        borderRadius: 0,
        fontSize: "1.1rem",
        boxShadow: 1,
        "::before": {
          "--icon-size": "20px !important",
          margin: "0 !important",
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};
