import { Box, Dialog, DialogTitle, Typography } from "@mui/material";
import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode, useEffect, useId, useMemo, useState } from "react";
import { Alert, Button } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { ModalCloseButton } from "../menu/MenuTitle";
import {
  getUpLevel,
  getUpRoot,
  type UnitePatrimoniale,
  type UpCheminItem,
  type UpLevel,
  type UpSelection,
  type UpTree,
} from "./upApi";

const ALREADY_IN_RAPPORT = "Déjà constatée dans ce rapport";

const colors = fr.colors.decisions;
const separator = `1px solid ${colors.border.default.grey.default}`;

/** The chosen part: up null = ensemble du monument; chemin = its ancestors below the monument root. */
type Selected = { up: UnitePatrimoniale | null; chemin: UpCheminItem[] };

/** Ids from the monument root down to (and including) the given UP, or undefined when it is not in the tree. */
const getPathToUp = (tree: UpTree, upId: string): string[] | undefined => {
  const parentOf = new Map<string, string>();
  for (const up of tree.ups) {
    for (const childId of up.enfantsIds) if (!parentOf.has(childId)) parentOf.set(childId, up.id);
  }
  const path = [upId];
  const seen = new Set(path);
  while (path[0] !== tree.rootId) {
    const parentId = parentOf.get(path[0]!);
    if (!parentId || seen.has(parentId)) return undefined;
    seen.add(parentId);
    path.unshift(parentId);
  }
  return path;
};

/**
 * "Pour quelle partie du monument … souhaitez-vous réaliser un constat ?"
 * Lets the user pick the whole monument or one unité patrimoniale, browsing the hierarchy one level at a time:
 * an UP that has sub-UP shows a chevron that opens its own level, with a « Retour » link back up.
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
  const rootLevel = useMemo(() => getUpLevel(tree, tree.rootId), [tree]);

  const [stack, setStack] = useState<UpLevel[]>([rootLevel]);
  const [selected, setSelected] = useState<Selected | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    setStack([rootLevel]);
    if (initialUpId === null) return setSelected(excludedUpIds?.has(null) ? undefined : { up: null, chemin: [] });

    // open the level that lists the initial UP, so that its radio is visible and checked
    const path = initialUpId ? getPathToUp(tree, initialUpId) : undefined;
    if (!initialUpId || !path || path.length < 2 || excludedUpIds?.has(initialUpId)) return setSelected(undefined);
    const byId = new Map(tree.ups.map((up) => [up.id, up]));
    const levelIds = path.slice(0, -1);
    setStack(levelIds.map((id) => (id === tree.rootId ? rootLevel : getUpLevel(tree, id))));
    setSelected({
      up: byId.get(initialUpId)!,
      chemin: levelIds.slice(1).map((id) => ({ id, intitule: byId.get(id)!.intitule })),
    });
  }, [open, tree, rootLevel, initialUpId]);

  const isRoot = stack.length === 1;
  const current = stack[stack.length - 1]!;
  // ancestors below the monument root, up to and including the current level's UP
  const cheminToCurrent = stack.slice(1).map((level) => ({ id: level.parent.id, intitule: level.parent.intitule }));

  // the « Ensemble » option of the current level: the whole monument at root, the current UP below
  const wholeUp = isRoot ? null : current.parent;
  const wholeChecked = selected !== undefined && (selected.up?.id ?? null) === (wholeUp?.id ?? null);
  const selectWhole = () => setSelected({ up: wholeUp, chemin: cheminToCurrent.slice(0, -1) });
  const selectChild = (up: UnitePatrimoniale) => setSelected({ up, chemin: cheminToCurrent });

  // an UP already in the rapport is hidden, unless its sub-UP can still be chosen
  const visibleEnfants = current.enfants.filter((up) => !excludedUpIds?.has(up.id) || up.enfantsIds.length > 0);

  const openChild = (up: UnitePatrimoniale) => setStack((st) => [...st, getUpLevel(tree, up.id)]);
  const goBack = () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));

  const confirm = () => {
    if (!selected) return;
    onConfirm({ up: selected.up, chemin: selected.chemin, monument: getUpRoot(tree) });
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
        <DialogTitle px="0 !important" pb="0 !important" whiteSpace="wrap">
          {title}
        </DialogTitle>

        <Flex flexDirection="column" gap="24px" mt="24px">
          {isRoot ? (
            <>
              {showIntro ? (
                <Alert
                  severity="info"
                  small
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
                <Typography fontSize="14px" color={colors.text.mention.grey.default}>
                  Partie actuellement sélectionnée : {currentUpLabel}
                </Typography>
              ) : null}
            </>
          ) : (
            <Box>
              <button
                type="button"
                className={fr.cx("fr-link", "fr-icon-arrow-left-line", "fr-link--icon-left")}
                // DSFR only underlines a[href]
                style={{ textDecoration: "underline", textUnderlineOffset: "6px", textDecorationThickness: "1px" }}
                onClick={goBack}
              >
                Retour
              </button>
            </Box>
          )}

          <Box component="fieldset" display="block" border="0" p="0" m="0" minWidth="0">
            <Box
              component="legend"
              p="0"
              mb="24px"
              color={colors.text.label.grey.default}
              fontWeight={isRoot ? undefined : "bold"}
            >
              {isRoot
                ? (question ?? (
                    <>
                      Pour quelle partie du monument <b>{monumentTitle}</b> souhaitez-vous réaliser un constat ?
                    </>
                  ))
                : current.parent.intitule}
            </Box>

            <UpRadio
              name={groupName}
              id={`${groupName}-whole-${current.parent.id}`}
              label={isRoot ? "Ensemble du monument" : "Ensemble de l’UP"}
              checked={wholeChecked}
              onSelect={selectWhole}
              disabledHint={excludedUpIds?.has(wholeUp?.id ?? null) ? ALREADY_IN_RAPPORT : undefined}
            />

            {visibleEnfants.length ? (
              <Flex flexDirection="column" gap="16px" mt="24px">
                <Typography color={colors.text.mention.grey.default}>UP de niveau inférieur :</Typography>
                <Box component="ul" p="0" m="0" sx={{ listStyle: "none" }}>
                  {visibleEnfants.map((up) => (
                    <Box
                      component="li"
                      key={up.id}
                      display="flex"
                      alignItems="center"
                      gap="12px"
                      minHeight="48px"
                      py="8px"
                      m="0"
                      borderTop={separator}
                      sx={{ "&:last-of-type": { borderBottom: separator } }}
                    >
                      <UpRadio
                        name={groupName}
                        id={`${groupName}-${up.id}`}
                        label={up.intitule}
                        checked={selected?.up?.id === up.id}
                        onSelect={() => selectChild(up)}
                        disabledHint={excludedUpIds?.has(up.id) ? ALREADY_IN_RAPPORT : undefined}
                      />
                      {up.enfantsIds.length ? (
                        <button
                          type="button"
                          className={fr.cx(
                            "fr-btn",
                            "fr-btn--tertiary-no-outline",
                            "fr-btn--sm",
                            "fr-icon-arrow-right-s-line",
                          )}
                          style={{ marginLeft: "auto", marginRight: "8px", flexShrink: 0 }}
                          title={`Voir les UP de niveau inférieur de ${up.intitule}`}
                          onClick={() => openChild(up)}
                        >
                          Voir les UP de niveau inférieur de {up.intitule}
                        </button>
                      ) : null}
                    </Box>
                  ))}
                </Box>
              </Flex>
            ) : null}
          </Box>
        </Flex>

        <Flex
          justifyContent="flex-end"
          gap="16px"
          mt="48px"
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

/** DSFR radio whose label is in blue France, as in the Figma « Créer un constat d’état » modal. */
const UpRadio = ({
  name,
  id,
  label,
  checked,
  onSelect,
  disabledHint,
}: {
  name: string;
  id: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
  /** the option cannot be chosen; the hint says why */
  disabledHint?: string;
}) => (
  <Box
    className="fr-radio-group"
    minWidth="0"
    sx={{
      margin: "0 !important",
      // 12px between the 24px circle and the label
      "& input[type=radio] + label": {
        paddingLeft: "36px",
        ...(disabledHint ? {} : { color: colors.text.actionHigh.blueFrance.default }),
      },
    }}
  >
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
      {disabledHint ? <span className="fr-hint-text">{disabledHint}</span> : null}
    </label>
  </Box>
);
