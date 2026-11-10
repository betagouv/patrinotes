import { Button } from "#components/MUIDsfr.tsx";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLiveUser } from "../../contexts/AuthContext";
import { UpSelectionModal } from "../up/UpSelectionModal";
import { getUpRoot, getUpSelection, type UpSelection, type UpTree } from "../up/upApi";
import { FicheAlertDrawer } from "./alerts/FicheAlertDrawer";
import type { MonumentAlertContext } from "./alerts/monumentAlerts";
import { ObjetAnnotationModal } from "./alerts/ObjetAnnotationModal";
import { createConstatFromFiche } from "./createConstat";

const fullWidth = { width: "100%", justifyContent: "center" };

/** « Signaler une alerte… », « Créer un constat d'état » (and « Annoter l'objet » on an objet's fiche). */
export const FicheActions = ({
  context,
  tree,
  isTreeLoading,
}: {
  context: MonumentAlertContext;
  /** unités patrimoniales of the monument, when it is a MH complexe */
  tree: UpTree | null;
  isTreeLoading: boolean;
}) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);
  const isObjet = !!context.objetReference;

  return (
    <>
      <Button priority="secondary" iconId="ri-alarm-warning-fill" type="button" onClick={() => setIsAlertOpen(true)} sx={fullWidth}>
        Signaler une alerte…
      </Button>
      <CreateConstatButton context={context} tree={tree} isTreeLoading={isTreeLoading} />
      {isObjet ? (
        <Button
          priority="tertiary"
          iconId="fr-icon-edit-line"
          type="button"
          onClick={() => setIsAnnotationOpen(true)}
          sx={fullWidth}
        >
          Annoter l’objet
        </Button>
      ) : null}

      <FicheAlertDrawer open={isAlertOpen} onClose={() => setIsAlertOpen(false)} context={context} />
      {isObjet && isAnnotationOpen ? (
        <ObjetAnnotationModal
          open
          onClose={() => setIsAnnotationOpen(false)}
          showFicheLink={false}
          context={{ ...context, objetReference: context.objetReference!, objetTitre: context.objetTitre ?? null }}
        />
      ) : null}
    </>
  );
};

/**
 * Creates the constat from the fiche. On a MH complexe's own fiche the user chooses the part of the monument;
 * on an UP's fiche the constat is about that UP.
 */
const CreateConstatButton = ({
  context,
  tree,
  isTreeLoading,
}: {
  context: MonumentAlertContext;
  tree: UpTree | null;
  isTreeLoading: boolean;
}) => {
  const user = useLiveUser()!;
  const navigate = useNavigate();
  const [isChoosingUp, setIsChoosingUp] = useState(false);

  const createMutation = useMutation({
    mutationFn: (selection: UpSelection | null) =>
      createConstatFromFiche({
        referencePop: context.referencePop,
        selection,
        user: { id: user.id, name: user.name, service_id: user.service_id },
      }),
    onSuccess: (constatId) =>
      navigate({ to: "/constat/$constatId", params: { constatId }, search: { step: "informations", mode: "view" } }),
  });

  const onClick = () => {
    if (!tree) return createMutation.mutate(null);
    // the fiche of an UP (or of an objet, whose UP is unknown) leaves no choice
    if (context.upId) return createMutation.mutate(getUpSelection(tree, context.upId));
    setIsChoosingUp(true);
  };

  return (
    <>
      <Button
        iconId="fr-icon-draft-fill"
        type="button"
        onClick={onClick}
        disabled={isTreeLoading || createMutation.isPending}
        sx={fullWidth}
      >
        Créer un constat d’état
      </Button>
      {tree && isChoosingUp ? (
        <UpSelectionModal
          open
          monumentTitle={context.titreEdifice ?? getUpRoot(tree).intitule}
          tree={tree}
          onCancel={() => setIsChoosingUp(false)}
          // the modal stays open until the constat opens
          onConfirm={(selection) => (createMutation.isPending ? null : createMutation.mutate(selection))}
        />
      ) : null}
    </>
  );
};
