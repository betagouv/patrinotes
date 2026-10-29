import { Box, Dialog, DialogTitle, Typography } from "@mui/material";
import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode, useEffect, useId, useMemo, useState } from "react";
import { Alert, Button } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { ModalCloseButton } from "../menu/MenuTitle";
import { getUpRoot, type UnitePatrimoniale, type UpCheminItem, type UpSelection, type UpTree } from "./upApi";

const WHOLE = "__whole__";
const ALREADY_IN_RAPPORT = "Déjà constatée dans ce rapport";

/** An UP of the monument with its ancestors below the root. */
type FlatUp = { up: UnitePatrimoniale; chemin: UpCheminItem[] };

/** Every UP below the monument root, depth-first: each UP is followed by its own sub-UP. */
const flattenUpTree = (tree: UpTree): FlatUp[] => {
  const byId = new Map(tree.ups.map((up) => [up.id, up]));
  const result: FlatUp[] = [];
  const seen = new Set<string>([tree.rootId]);
  const visit = (parent: UnitePatrimoniale, chemin: UpCheminItem[]) => {
    for (const childId of parent.enfantsIds) {
      const child = byId.get(childId);
      if (!child || seen.has(child.id)) continue;
      seen.add(child.id);
      result.push({ up: child, chemin });
      visit(child, [...chemin, { id: child.id, intitule: child.intitule }]);
    }
  };
  const root = byId.get(tree.rootId);
  if (root) visit(root, []);
  return result;
};

/**
 * "Pour quelle partie du monument … souhaitez-vous réaliser un constat ?"
 * Lets the user pick the whole monument or any unité patrimoniale, all levels listed one under the other.
 */
export const UpSelectionModal = ({
  open,
  monumentTitle,
  tree,
  initialUpId,
  currentUpLabel,
  showIntro = true,
  title = "Créer un constat d’état",
  confirmLabel = "Créer un constat",
  question,
  excludedUpIds,
  secondaryAction,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  monumentTitle: string;
  tree: UpTree;
  initialUpId?: string | null;
  /** e.g. "Corps de logis › Aile nord", shown when changing the UP of an existing constat */
  currentUpLabel?: string;
  showIntro?: boolean;
  title?: string;
  confirmLabel?: string;
  /** replaces « Pour quelle partie du monument … souhaitez-vous réaliser un constat ? » */
  question?: ReactNode;
  /** UP that cannot be chosen (null = ensemble du monument), e.g. those already in the rapport groupé */
  excludedUpIds?: Set<string | null>;
  /** replaces the « Annuler » button */
  secondaryAction?: { label: string; onClick: () => void };
  onCancel: () => void;
  onConfirm: (selection: UpSelection) => void;
}) => {
  const groupName = useId();
  const allUps = useMemo(() => flattenUpTree(tree), [tree]);
  // an UP already in the rapport cannot be chosen again
  const visibleUps = allUps.filter(({ up }) => !excludedUpIds?.has(up.id));

  /** WHOLE, or the id of the chosen UP */
  const [selected, setSelected] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    if (initialUpId === null) setSelected(excludedUpIds?.has(null) ? undefined : WHOLE);
    else setSelected(initialUpId && visibleUps.some(({ up }) => up.id === initialUpId) ? initialUpId : undefined);
  }, [open, allUps, initialUpId]);

  const confirm = () => {
    if (!selected) return;
    const monument = getUpRoot(tree);
    if (selected === WHOLE) return onConfirm({ up: null, chemin: [], monument });
    const choice = allUps.find(({ up }) => up.id === selected);
    if (choice) onConfirm({ up: choice.up, chemin: choice.chemin, monument });
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      sx={{
        ".MuiPaper-root": {
          overflowY: "auto",
          maxHeight: { xs: "unset", lg: "calc(100% - 64px)" },
          maxWidth: { xs: "unset", lg: "unset" },
          width: { xs: "100%", lg: "960px" },
          height: { xs: "100%", lg: "unset" },
          margin: { xs: "0", lg: undefined },
        },
      }}
    >
      <Box p={{ xs: "16px", lg: "16px 32px 32px" }}>
        <ModalCloseButton onClose={onCancel} />
        <DialogTitle px="0 !important" whiteSpace="wrap">
          {title}
        </DialogTitle>

        {showIntro ? (
          <Alert
            severity="info"
            small
            sx={{ mb: "24px" }}
            description={
              <>
                Vous pouvez réaliser un constat pour l’ensemble du monument ou pour ses unités patrimoniales (UP).
                <br />
                Les constats de chaque UP pourront ensuite être réunis dans un même rapport.
              </>
            }
          />
        ) : null}
        {currentUpLabel ? (
          <Typography mb="16px" fontSize="14px" color={fr.colors.decisions.text.mention.grey.default}>
            Partie actuellement sélectionnée : {currentUpLabel}
          </Typography>
        ) : null}
        <Typography mb="24px">
          {question ?? (
            <>
              Pour quelle partie du monument <b>{monumentTitle}</b> souhaitez-vous réaliser un constat ?
            </>
          )}
        </Typography>

        <Box component="fieldset" display="block" border="0" p="0" m="0" minWidth="0">
          <legend className="fr-sr-only">Partie du monument concernée par le constat</legend>
          <RadioRow
            name={groupName}
            id={`${groupName}-whole`}
            label="Ensemble du monument"
            checked={selected === WHOLE}
            onSelect={() => setSelected(WHOLE)}
            disabledHint={excludedUpIds?.has(null) ? ALREADY_IN_RAPPORT : undefined}
          />

          {visibleUps.length ? (
            <>
              <Typography mt="20px" mb="12px" color={fr.colors.decisions.text.mention.grey.default}>
                UP de niveau inférieur :
              </Typography>

              <Box
                component="ul"
                p="0"
                m="0"
                display="flex"
                flexDirection="column"
                gap="14px"
                sx={{ listStyle: "none" }}
              >
                {visibleUps.map(({ up, chemin }) => (
                  <Box component="li" key={up.id} p="0" m="0">
                    <RadioRow
                      name={groupName}
                      id={`${groupName}-${up.id}`}
                      label={up.intitule}
                      hint={chemin.length ? chemin.map((c) => c.intitule).join(" › ") : undefined}
                      checked={selected === up.id}
                      onSelect={() => setSelected(up.id)}
                    />
                  </Box>
                ))}
              </Box>
            </>
          ) : null}
        </Box>

        <Flex
          justifyContent="flex-end"
          gap="16px"
          mt="32px"
          flexDirection={{ xs: "column-reverse", lg: "row" }}
          sx={{ button: { justifyContent: "center", width: { xs: "100%", lg: "auto" } } }}
        >
          <Button priority="secondary" type="button" onClick={secondaryAction?.onClick ?? onCancel}>
            {secondaryAction?.label ?? "Annuler"}
          </Button>
          <Button type="button" disabled={!selected} onClick={confirm}>
            {confirmLabel}
          </Button>
        </Flex>
      </Box>
    </Dialog>
  );
};

const RadioRow = ({
  name,
  id,
  label,
  hint,
  checked,
  onSelect,
  disabledHint,
}: {
  name: string;
  id: string;
  label: string;
  /** e.g. the parent UP of a sub-UP */
  hint?: string;
  checked: boolean;
  onSelect: () => void;
  /** the option cannot be chosen; the hint says why */
  disabledHint?: string;
}) => (
  <div className="fr-radio-group" style={{ margin: 0 }}>
    <input
      type="radio"
      id={id}
      name={name}
      checked={checked && !disabledHint}
      disabled={!!disabledHint}
      onChange={onSelect}
    />
    <label className="fr-label" htmlFor={id}>
      {label}
      {disabledHint || hint ? <span className="fr-hint-text">{disabledHint ?? hint}</span> : null}
    </label>
  </div>
);
