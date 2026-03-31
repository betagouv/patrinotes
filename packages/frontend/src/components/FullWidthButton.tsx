import Button, { type ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { useStyles } from "tss-react";

// TODO: refactor using MUI (in MuiDsfr.tsx)
export const FullWidthButton = ({ className, type, linkProps, size, ...props }: ButtonProps) => {
  const { cx, css } = useStyles();

  return (
    <Button
      {...(props as any)}
      className={cx(css({ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }), className)}
      linkProps={linkProps ? { ...linkProps, className: cx(css({ width: "100%" })) } : undefined}
      size={size}
    />
  );
};
// type HTMLAnchorProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

// type LinkPropsWithoutChildren<LinkProps> =
//     | Omit<LinkProps, "children">
//     | (Omit<HTMLAnchorProps, "children" | "href"> & {
//           href: string;
//       });
