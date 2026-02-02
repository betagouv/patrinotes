import { Button } from "#components/MUIDsfr.tsx";
import { ButtonProps } from "@mui/material";
import { ReactNode } from "react";

export const LinkButton = ({ children, ...props }: ButtonProps & { children: ReactNode }) => {
  return (
    //@ts-ignore
    <Button
      type="button"
      priority="tertiary no outline"
      {...props}
      sx={{
        minHeight: "auto",
        fontSize: "14px",
        fontWeight: "normal",
        textDecoration: "underline",
        textUnderlineOffset: "8px",
        padding: { xs: "0", lg: "0 8px" },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
};
