import type { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { cx } from "@codegouvfr/react-dsfr/fr/cx";

export const InfoText = ({ children }: { children: React.ReactNode }) => {
  return <div className={cx("fr-info-text", "fr-text--md")}>{children}</div>;
};
