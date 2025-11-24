import { Button as DsfrButton } from "@codegouvfr/react-dsfr/Button";
import { Select as DsfrSelect } from "@codegouvfr/react-dsfr/Select";
import { Input as DsfrInput } from "@codegouvfr/react-dsfr/Input";
import { Accordion as DsfrAccordion } from "@codegouvfr/react-dsfr/Accordion";
import { Alert as DsfrAlert } from "@codegouvfr/react-dsfr/Alert";
import { Badge as DsfrBadge } from "@codegouvfr/react-dsfr/Badge";
import { Tile as DsfrTile } from "@codegouvfr/react-dsfr/Tile";
import { Box, styled } from "@mui/material";
import { Link as RouterLink } from "@tanstack/react-router";
import { Checkbox as DsfrCheckbox } from "@codegouvfr/react-dsfr/Checkbox";

export const Center = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const Button = styled(DsfrButton)();
export const Select = styled(DsfrSelect)();
export const Input = styled(DsfrInput)();
export const Accordion = styled(DsfrAccordion)();
export const Alert = styled(DsfrAlert)();
export const Badge = styled(DsfrBadge)();
export const Tile = styled(DsfrTile)();
export const Link = styled(RouterLink)();
export const Checkbox = styled(DsfrCheckbox)();
