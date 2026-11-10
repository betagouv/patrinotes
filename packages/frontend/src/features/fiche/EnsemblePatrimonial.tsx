import { fr } from "@codegouvfr/react-dsfr";
import { Box, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getPathToUp, type UnitePatrimoniale, type UpTree } from "../up/upApi";
import { FicheSectionIntro, FicheSectionTitle } from "./FicheLayout";

const colors = fr.colors.decisions;
const ROW_HEIGHT = 40;
const INDENT = 28;
const lineColor = colors.border.default.grey.default;

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

  const renderNode = (up: UnitePatrimoniale, depth: number): React.ReactNode => {
    const children = up.enfantsIds.map((id) => byId.get(id)).filter((child): child is UnitePatrimoniale => !!child);
    const hasChildren = children.length > 0 || (!!leaf && up.id === currentUpId);
    const isOpen = expanded.has(up.id);
    const count = getCount(up);
    const label = `${up.intitule}${count ? ` (${count})` : ""}`;

    return (
      <Box component="li" key={up.id} sx={{ listStyle: "none", padding: 0 }}>
        <TreeRow depth={depth} isCurrent={isCurrent(up)}>
          {hasChildren ? (
            <ToggleButton isOpen={isOpen} label={up.intitule} onClick={() => toggle(up.id)} />
          ) : (
            <Box width="32px" flexShrink={0} />
          )}
          {isCurrent(up) ? (
            <Typography lineHeight="24px" aria-current="page" sx={{ overflowWrap: "anywhere" }}>
              {label}
            </Typography>
          ) : (
            <Link
              to="/monument/$reference"
              params={{ reference: referencePop }}
              search={up.id === tree.rootId ? {} : { up: up.id }}
              className="fr-link"
              style={{ overflowWrap: "anywhere" }}
            >
              {label}
            </Link>
          )}
        </TreeRow>
        {hasChildren && isOpen ? (
          <TreeChildren depth={depth}>
            {children.map((child) => renderNode(child, depth + 1))}
            {leaf && up.id === currentUpId ? (
              <Box component="li" sx={{ listStyle: "none", padding: 0 }}>
                <TreeRow depth={depth + 1} isCurrent>
                  <Box width="32px" flexShrink={0} />
                  <Typography lineHeight="24px" aria-current="page">
                    {leaf.label}
                  </Typography>
                </TreeRow>
              </Box>
            ) : null}
          </TreeChildren>
        ) : null}
      </Box>
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
        {renderNode(root, 0)}
      </Box>
    </Box>
  );
};

const TreeRow = ({ depth, isCurrent, children }: { depth: number; isCurrent: boolean; children: React.ReactNode }) => (
  <Box
    position="relative"
    display="flex"
    alignItems="center"
    gap="8px"
    minHeight={`${ROW_HEIGHT}px`}
    py="4px"
    pr="12px"
    pl={`${12 + depth * INDENT}px`}
    bgcolor={isCurrent ? "#F5F5FE" : "transparent"}
  >
    {isCurrent ? (
      <Box position="absolute" left={0} top={0} bottom={0} width="3px" bgcolor={colors.artwork.major.blueFrance.default} />
    ) : null}
    {depth > 0 ? (
      // branch from the parent's guide line to this row
      <Box
        position="absolute"
        left={`${27 + (depth - 1) * INDENT}px`}
        top={`${ROW_HEIGHT / 2}px`}
        width={`${INDENT - 15}px`}
        height="1px"
        bgcolor={lineColor}
      />
    ) : null}
    {children}
  </Box>
);

const TreeChildren = ({ depth, children }: { depth: number; children: React.ReactNode }) => (
  <Box component="ul" role="group" position="relative" p="0 !important" m="0 !important">
    {/* guide line of the parent, down to the last child's branch */}
    <Box
      position="absolute"
      left={`${27 + depth * INDENT}px`}
      top={0}
      bottom={`${ROW_HEIGHT / 2}px`}
      width="1px"
      bgcolor={lineColor}
    />
    {children}
  </Box>
);

const ToggleButton = ({ isOpen, label, onClick }: { isOpen: boolean; label: string; onClick: () => void }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    aria-expanded={isOpen}
    title={`${isOpen ? "Replier" : "Déplier"} ${label}`}
    width="32px"
    height="32px"
    flexShrink={0}
    display="flex"
    alignItems="center"
    justifyContent="center"
    color={colors.text.actionHigh.blueFrance.default}
    bgcolor="transparent"
    sx={{ border: "none", cursor: "pointer", "&:hover": { bgcolor: "rgba(0, 0, 145, 0.08)" } }}
  >
    <span className={fr.cx(isOpen ? "fr-icon-subtract-line" : "fr-icon-add-line", "fr-icon--sm")} aria-hidden="true" />
    <span className="fr-sr-only">
      {isOpen ? "Replier" : "Déplier"} {label}
    </span>
  </Box>
);
