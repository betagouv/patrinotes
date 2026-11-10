import { fr } from "@codegouvfr/react-dsfr";
import { Box, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getPathToUp, type UnitePatrimoniale, type UpTree } from "../up/upApi";
import { FicheSectionIntro, FicheSectionTitle } from "./FicheLayout";

const colors = fr.colors.decisions;
// geometry of the « Arbre parents-enfants » mockup: 40px rows, 32px toggles, one 32px step per level
const ROW_HEIGHT = 40;
const STEP = 32;
const LINE_COLOR = "#DDDDDD";
const CURRENT_BG = "#F5F5FE";

/**
 * « Ensemble patrimonial »: the hierarchy of a MH complexe, opened down to the current fiche.
 * Every unité patrimoniale links to its fiche, with its number of constats.
 * `leaf` adds the current fiche below its UP when it is not an UP itself (objet mobilier).
 */
export const EnsemblePatrimonial = ({
  tree,
  referencePop,
  currentUpId,
  constatCounts,
  leaf,
}: {
  tree: UpTree;
  referencePop: string;
  /** the fiche's UP (tree.rootId for the monument itself), or the UP the leaf belongs to */
  currentUpId: string;
  constatCounts: Map<string | null, number>;
  leaf?: { label: string };
}) => {
  const byId = useMemo(() => new Map(tree.ups.map((up) => [up.id, up])), [tree]);
  const pathIds = useMemo(() => getPathToUp(tree, currentUpId) ?? [tree.rootId], [tree, currentUpId]);

  // the path to the current fiche is open, and so is the current UP (its children are visible)
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(pathIds));
  const toggle = (id: string) =>
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const root = byId.get(tree.rootId);
  if (!root) return null;

  const isCurrent = (up: UnitePatrimoniale) => !leaf && up.id === currentUpId;
  const getCount = (up: UnitePatrimoniale) => constatCounts.get(up.id === tree.rootId ? null : up.id) ?? 0;

  const renderNode = (up: UnitePatrimoniale, depth: number, isLast: boolean): React.ReactNode => {
    const children = up.enfantsIds.map((id) => byId.get(id)).filter((child): child is UnitePatrimoniale => !!child);
    const hasLeaf = !!leaf && up.id === currentUpId;
    const hasChildren = children.length > 0 || hasLeaf;
    const isOpen = expanded.has(up.id);
    const count = getCount(up);
    const label = `${up.intitule}${count ? ` (${count})` : ""}`;

    return (
      <TreeItem key={up.id} depth={depth} isLast={isLast}>
        <TreeRow depth={depth} isCurrent={isCurrent(up)} hasToggle={hasChildren}>
          {hasChildren ? (
            <ToggleButton isOpen={isOpen} label={up.intitule} onClick={() => toggle(up.id)} />
          ) : (
            <Box width={`${STEP}px`} flexShrink={0} />
          )}
          {isCurrent(up) ? (
            <CurrentLabel>{label}</CurrentLabel>
          ) : (
            <Link
              to="/monument/$reference"
              params={{ reference: referencePop }}
              search={up.id === tree.rootId ? {} : { up: up.id }}
              className="fr-link"
              style={{
                overflowWrap: "anywhere",
                fontSize: "16px",
                lineHeight: "24px",
                textDecoration: "underline",
                textUnderlinePosition: "from-font",
                backgroundImage: "none",
              }}
            >
              {label}
            </Link>
          )}
        </TreeRow>
        {hasChildren && isOpen ? (
          <Box component="ul" role="group" p="0 !important" m="0 !important">
            {children.map((child, index) => renderNode(child, depth + 1, !hasLeaf && index === children.length - 1))}
            {hasLeaf ? (
              <TreeItem depth={depth + 1} isLast>
                <TreeRow depth={depth + 1} isCurrent hasToggle={false}>
                  <Box width={`${STEP}px`} flexShrink={0} />
                  <CurrentLabel>{leaf!.label}</CurrentLabel>
                </TreeRow>
              </TreeItem>
            ) : null}
          </Box>
        ) : null}
      </TreeItem>
    );
  };

  return (
    <Box>
      <FicheSectionTitle>Ensemble patrimonial</FicheSectionTitle>
      <FicheSectionIntro>
        Dépliez les unités patrimoniales pour parcourir la hiérarchie et accéder aux fiches.
        <br />
        Le nombre de constats existants est indiqué par UP.
      </FicheSectionIntro>
      <Box component="ul" role="tree" aria-label="Ensemble patrimonial" mt="24px" p="0 !important" m="0 !important">
        {renderNode(root, 0, true)}
      </Box>
    </Box>
  );
};

/** x of the guide line under a level's toggles (their center) */
const guideX = (depth: number) => STEP / 2 + (depth - 1) * STEP;

/**
 * One node and its open branch. Below the root, it draws its piece of the parent's guide line: down to its own
 * branch when it is the last child, through the whole item otherwise (expanded descendants included).
 */
const TreeItem = ({ depth, isLast, children }: { depth: number; isLast: boolean; children: React.ReactNode }) => (
  <Box component="li" position="relative" sx={{ listStyle: "none", padding: "0 !important" }}>
    {depth > 0 ? (
      <Box
        position="absolute"
        zIndex={1}
        left={`${guideX(depth)}px`}
        top={0}
        width="1px"
        height={isLast ? `${ROW_HEIGHT / 2}px` : "100%"}
        bgcolor={LINE_COLOR}
      />
    ) : null}
    {children}
  </Box>
);

const TreeRow = ({
  depth,
  isCurrent,
  hasToggle,
  children,
}: {
  depth: number;
  isCurrent: boolean;
  hasToggle: boolean;
  children: React.ReactNode;
}) => (
  <Box
    position="relative"
    display="flex"
    // top-aligned: a wrapped label keeps its toggle and branch on its first line
    alignItems="flex-start"
    gap="8px"
    minHeight={`${ROW_HEIGHT}px`}
    py="4px"
    pr="12px"
    pl={`${depth * STEP}px`}
    bgcolor={isCurrent ? CURRENT_BG : "transparent"}
    sx={{ "& > a, & > p": { pt: "4px" } }}
  >
    {isCurrent ? (
      <Box
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        width="3px"
        bgcolor={colors.artwork.major.blueFrance.default}
      />
    ) : null}
    {depth > 0 ? (
      // branch from the guide line to the toggle, or close to the label when there is none
      <Box
        position="absolute"
        zIndex={1}
        left={`${guideX(depth)}px`}
        top={`${ROW_HEIGHT / 2}px`}
        width={hasToggle ? `${STEP / 2}px` : `${STEP / 2 + 24}px`}
        height="1px"
        bgcolor={LINE_COLOR}
      />
    ) : null}
    {children}
  </Box>
);

const CurrentLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography
    lineHeight="24px"
    fontSize="16px"
    color={colors.text.default.grey.default}
    aria-current="page"
    sx={{ overflowWrap: "anywhere" }}
  >
    {children}
  </Typography>
);

const ToggleButton = ({ isOpen, label, onClick }: { isOpen: boolean; label: string; onClick: () => void }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    aria-expanded={isOpen}
    title={`${isOpen ? "Replier" : "Déplier"} ${label}`}
    width={`${STEP}px`}
    height={`${STEP}px`}
    flexShrink={0}
    display="flex"
    alignItems="center"
    justifyContent="center"
    position="relative"
    zIndex={2}
    color={colors.text.actionHigh.blueFrance.default}
    bgcolor="transparent"
    sx={{ border: "none", padding: 0, cursor: "pointer", "&:hover": { bgcolor: "rgba(0, 0, 145, 0.08)" } }}
  >
    <span
      className={fr.cx(isOpen ? "fr-icon-arrow-down-s-line" : "fr-icon-arrow-right-s-line", "fr-icon--sm")}
      aria-hidden="true"
    />
    <span className="fr-sr-only">
      {isOpen ? "Replier" : "Déplier"} {label}
    </span>
  </Box>
);
