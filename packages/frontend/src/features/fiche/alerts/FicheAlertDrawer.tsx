import { FullWidthButton } from "#components/FullWidthButton.tsx";
import { Alert, Select, Tile } from "#components/MUIDsfr.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { alertSectionStaticData } from "@patrinotes/pdf/constat";
import { OBJET_PROBLEMES, OBJETS_MOBILIERS_SECTION } from "@patrinotes/pdf/utils";
import { Box, Drawer, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useLiveService, useLiveUser } from "../../../contexts/AuthContext";
import { db, useDbQuery } from "../../../db/db";
import { useIsDesktop } from "../../../hooks/useIsDesktop";
import { MenuTitle, ModalBackButton } from "../../menu/MenuTitle";
import {
  createMonumentAlertDraft,
  discardMonumentAlertDraft,
  MonumentAlertContext,
  submitMonumentAlert,
} from "./monumentAlerts";
import {
  AlertPhotosField,
  CommentairesField,
  getRecipientsError,
  RecipientsField,
  RecipientsValue,
} from "./MonumentAlertFields";
import { useIsOnline } from "../../../hooks/useIsOnline";

type Step = { name: "sections" } | { name: "form"; alertId: string; section: string } | { name: "done" };

/**
 * « Signaler une alerte » from a fiche, outside any constat. On a monument or an UP the user first picks the
 * kind of problem (the sections of constats); on an objet mobilier the alert is about that objet.
 * The alert is saved offline and emailed once synced.
 */
export const FicheAlertDrawer = ({
  open,
  onClose,
  context,
}: {
  open: boolean;
  onClose: () => void;
  context: MonumentAlertContext;
}) => {
  const user = useLiveUser()!;
  const service = useLiveService() ?? null;
  const isObjet = !!context.objetReference;
  const [step, setStep] = useState<Step>({ name: "sections" });
  const draftIdRef = useRef<string | null>(null);

  const startMutation = useMutation({
    mutationFn: async (section: string) => {
      const alertId = await createMonumentAlertDraft({ kind: "alerte", alert: section, context, user, service });
      draftIdRef.current = alertId;
      setStep({ name: "form", alertId, section });
    },
  });

  // an objet mobilier has a single kind of alert: open its form directly (once, even if effects run twice)
  const isStartingRef = useRef(false);
  useEffect(() => {
    if (open && isObjet && step.name === "sections" && !isStartingRef.current) {
      isStartingRef.current = true;
      startMutation.mutateAsync(OBJETS_MOBILIERS_SECTION).finally(() => (isStartingRef.current = false));
    }
  }, [open, isObjet, step.name]);

  const discardDraft = async () => {
    const draftId = draftIdRef.current;
    draftIdRef.current = null;
    if (draftId) await discardMonumentAlertDraft(draftId);
  };

  const close = async () => {
    await discardDraft();
    setStep({ name: "sections" });
    onClose();
  };

  return (
    <Drawer open={open} onClose={close} anchor="right">
      <Box width={{ xs: "100vw", lg: "708px" }} px={{ xs: "16px", lg: "60px" }} pt={{ xs: "16px", lg: "24px" }} pb="48px">
        {step.name === "done" ? (
          <AlertSent onClose={close} />
        ) : step.name === "form" ? (
          <AlertForm
            key={step.alertId}
            alertId={step.alertId}
            section={step.section}
            context={context}
            onBack={
              isObjet
                ? undefined
                : async () => {
                    await discardDraft();
                    setStep({ name: "sections" });
                  }
            }
            onClose={close}
            onSubmitted={() => {
              draftIdRef.current = null;
              setStep({ name: "done" });
            }}
          />
        ) : isObjet ? (
          <Flex justifyContent="center" mt="80px">
            <Spinner />
          </Flex>
        ) : (
          <AlertSections onClose={close} onSelect={(section) => startMutation.mutate(section)} />
        )}
      </Box>
    </Drawer>
  );
};

const AlertSections = ({ onClose, onSelect }: { onClose: () => void; onSelect: (section: string) => void }) => {
  const isDesktop = useIsDesktop();
  return (
    <Stack>
      <MenuTitle hideDivider onClose={onClose}>
        Signaler une alerte
      </MenuTitle>
      <Typography mb="24px">
        Vous avez remarqué un problème lié au monument historique ?<br />
        Signalez une alerte auprès du service concerné :
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={isDesktop ? "1fr 1fr" : "1fr"}
        gap="8px"
        sx={{ ".fr-tile__content": { paddingBottom: "0 !important" } }}
      >
        {alertSectionStaticData.map(({ title, services }) => (
          <Tile
            key={title}
            title={<Box fontSize="16px">{title}</Box>}
            detail={services.join(", ")}
            buttonProps={{ onClick: () => onSelect(title) }}
            sx={{ width: "100%" }}
          />
        ))}
      </Box>
    </Stack>
  );
};

const AlertForm = ({
  alertId,
  section,
  context,
  onBack,
  onClose,
  onSubmitted,
}: {
  alertId: string;
  section: string;
  context: MonumentAlertContext;
  onBack?: () => void;
  onClose: () => void;
  onSubmitted: () => void;
}) => {
  const isObjet = !!context.objetReference;
  const isObjetsSection = section === OBJETS_MOBILIERS_SECTION;
  const isOnline = useIsOnline();

  const draftQuery = useDbQuery(db.selectFrom("monument_alert").selectAll().where("id", "=", alertId), [alertId]);
  const draft = draftQuery.data?.[0];

  const [objetReference, setObjetReference] = useState<string>(context.objetReference ?? "");
  const [probleme, setProbleme] = useState<string>(isObjetsSection ? OBJET_PROBLEMES[0] : "");
  const [commentaires, setCommentaires] = useState("");
  const [recipients, setRecipients] = useState<RecipientsValue | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  // the draft carries the service's emails for this section
  useEffect(() => {
    if (draft && !recipients) {
      setRecipients({
        should_send: !!draft.should_send,
        mandatory_emails: draft.mandatory_emails ?? "",
        additional_emails: draft.additional_emails ?? "",
      });
    }
  }, [draft]);

  const objetsQuery = useDbQuery(
    db
      .selectFrom("pop_objets")
      .select(["reference", "titre_editorial"])
      .where("reference_a_une_notice_merimee_mh", "like", "%" + context.referencePop)
      .orderBy("titre_editorial"),
    [context.referencePop],
  );
  const objets = objetsQuery.data ?? [];

  const recipientsError = recipients ? getRecipientsError(recipients) : null;

  const submitMutation = useMutation({
    mutationFn: async () => {
      const objet = objets.find((o) => o.reference === objetReference);
      await submitMonumentAlert(alertId, {
        commentaires,
        probleme: isObjetsSection ? probleme : null,
        objet_reference: isObjetsSection ? objetReference || null : null,
        objet_titre: isObjetsSection ? (context.objetTitre ?? objet?.titre_editorial ?? null) : null,
        should_send: recipients?.should_send ? 1 : 0,
        mandatory_emails: recipients?.mandatory_emails ?? null,
        additional_emails: recipients?.additional_emails ?? null,
      });
    },
    onSuccess: onSubmitted,
  });

  const onValidate = () => {
    setShowErrors(true);
    if (recipientsError) return;
    submitMutation.mutate();
  };

  return (
    <Stack>
      <MenuTitle hideDivider onClose={onClose} leftButton={onBack ? <ModalBackButton onClick={onBack} /> : undefined}>
        {isObjet ? "Signaler une alerte" : null}
      </MenuTitle>

      {isObjet ? null : (
        <Typography fontSize="16px" fontWeight="bold" mb="16px">
          Alerte : {section}
        </Typography>
      )}

      {isObjetsSection && !isObjet ? (
        <>
          {/* @ts-ignore title is optional */}
          <Alert
            severity="info"
            small
            description="Un constat d’état séparé peut être réalisé pour un objet classé ou inscrit."
            sx={{ mb: "24px" }}
          />
          <Select
            label="Objet ou mobilier concerné"
            nativeSelectProps={{ value: objetReference, onChange: (e) => setObjetReference(e.target.value) }}
          >
            <option value="">Sélectionner une option</option>
            {objets.map((objet) => (
              <option key={objet.reference} value={objet.reference!}>
                {objet.titre_editorial} ({objet.reference})
              </option>
            ))}
          </Select>
        </>
      ) : null}

      {isObjetsSection ? (
        <RadioButtons
          legend="Problème à signaler"
          name={`probleme-${alertId}`}
          options={OBJET_PROBLEMES.map((label) => ({
            label,
            nativeInputProps: { value: label, checked: probleme === label, onChange: () => setProbleme(label) },
          }))}
          style={{ marginBottom: 0 }}
        />
      ) : null}

      <CommentairesField value={commentaires} onChange={setCommentaires} />
      <AlertPhotosField alertId={alertId} />

      <Divider my="24px" />

      {recipients ? (
        <RecipientsField value={recipients} onChange={setRecipients} error={showErrors ? recipientsError : null} />
      ) : null}

      {recipients?.should_send && !isOnline ? (
        <Typography mt="16px" fontSize="14px" color={fr.colors.decisions.text.mention.grey.default}>
          Vous êtes hors ligne : l’alerte sera envoyée dès le retour de la connexion.
        </Typography>
      ) : null}

      <FullWidthButton
        type="button"
        onClick={onValidate}
        disabled={!recipients || submitMutation.isPending}
        style={{ marginTop: "32px" }}
      >
        Valider
      </FullWidthButton>
    </Stack>
  );
};

const AlertSent = ({ onClose }: { onClose: () => void }) => (
  <Stack>
    <MenuTitle hideDivider onClose={onClose}>
      Signaler une alerte
    </MenuTitle>
    <Flex
      flexDirection="column"
      alignItems="center"
      gap="16px"
      py="40px"
      bgcolor={fr.colors.decisions.background.contrast.blueFrance.default}
      role="status"
    >
      <Box
        className={fr.cx("fr-icon-checkbox-circle-line")}
        color={fr.colors.decisions.text.actionHigh.blueFrance.default}
        sx={{ "::before": { width: "56px", height: "56px" } }}
        aria-hidden="true"
      />
      <Typography fontSize="20px" color={fr.colors.decisions.text.actionHigh.blueFrance.default}>
        Alerte signalée
      </Typography>
    </Flex>
  </Stack>
);
