import { Alert, Button } from "#components/MUIDsfr.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { OBJET_ANNOTATION_OPTIONS, OBJETS_MOBILIERS_SECTION } from "@patrinotes/pdf/utils";
import { Box, Dialog, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useLiveService, useLiveUser } from "../../../contexts/AuthContext";
import { db, useDbQuery } from "../../../db/db";
import { ModalCloseButton } from "../../menu/MenuTitle";
import { getPopUrl } from "../FicheLayout";
import {
  AlertPhotosField,
  CommentairesField,
  getRecipientsError,
  RecipientsField,
  RecipientsValue,
} from "./MonumentAlertFields";
import {
  createMonumentAlertDraft,
  discardMonumentAlertDraft,
  MonumentAlertContext,
  submitMonumentAlert,
} from "./monumentAlerts";

type Answers = { presence: string; etat: string; securite: string; commentaires: string };
const emptyAnswers: Answers = { presence: "", etat: "", securite: "", commentaires: "" };

/**
 * « Annotations de visite » of an objet mobilier: presence, state, security, comments and photos, kept on the
 * objet's fiche and optionally emailed (to the services in charge of objets mobiliers).
 */
export const ObjetAnnotationModal = ({
  open,
  onClose,
  context,
  showFicheLink = true,
  existingAlertId = null,
}: {
  open: boolean;
  onClose: () => void;
  context: MonumentAlertContext & { objetReference: string; objetTitre: string | null };
  /** « Consulter sa page » (not on the objet's own fiche) */
  showFicheLink?: boolean;
  /** an annotation already made (in the same constat): it is reopened instead of starting a new one */
  existingAlertId?: string | null;
}) => {
  const user = useLiveUser()!;
  const service = useLiveService() ?? null;
  const [alertId, setAlertId] = useState<string | null>(existingAlertId);
  const isStartingRef = useRef(false);

  // a draft holds the photos while the modal is open
  useEffect(() => {
    if (!open || alertId || existingAlertId || isStartingRef.current) return;
    isStartingRef.current = true;
    createMonumentAlertDraft({ kind: "annotation", alert: OBJETS_MOBILIERS_SECTION, context, user, service })
      .then(setAlertId)
      .finally(() => (isStartingRef.current = false));
  }, [open, alertId]);

  const close = async () => {
    // an existing annotation is kept as it was saved (photos added meanwhile included)
    if (alertId && !existingAlertId) await discardMonumentAlertDraft(alertId);
    setAlertId(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      sx={{ ".MuiPaper-root": { maxWidth: { xs: "100%", sm: "792px" }, width: "100%", margin: { xs: 0, sm: "32px" } } }}
    >
      <Box p={{ xs: "16px", sm: "32px" }}>
        <Flex justifyContent="flex-end">
          <ModalCloseButton onClose={close} />
        </Flex>
        {alertId ? (
          <AnnotationForm
            key={alertId}
            alertId={alertId}
            context={context}
            showFicheLink={showFicheLink}
            onSubmitted={() => {
              setAlertId(null);
              onClose();
            }}
          />
        ) : (
          <Flex justifyContent="center" py="80px">
            <Spinner />
          </Flex>
        )}
      </Box>
    </Dialog>
  );
};

const AnnotationForm = ({
  alertId,
  context,
  showFicheLink,
  onSubmitted,
}: {
  alertId: string;
  context: MonumentAlertContext & { objetReference: string; objetTitre: string | null };
  showFicheLink: boolean;
  onSubmitted: () => void;
}) => {
  const draftQuery = useDbQuery(db.selectFrom("monument_alert").selectAll().where("id", "=", alertId), [alertId]);
  const draft = draftQuery.data?.[0];

  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [recipients, setRecipients] = useState<RecipientsValue | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (draft && !recipients) {
      setRecipients({
        should_send: !!draft.should_send,
        mandatory_emails: draft.mandatory_emails ?? "",
        additional_emails: draft.additional_emails ?? "",
      });
      // a reopened annotation shows what was saved (a new draft keeps what the user is already typing)
      if (draft.status === "submitted")
        setAnswers({
          presence: draft.presence ?? "",
          etat: draft.etat ?? "",
          securite: draft.securite ?? "",
          commentaires: draft.commentaires ?? "",
        });
    }
  }, [draft]);

  const isSaved = draft?.status === "submitted";
  // once emailed, the annotation is kept as sent
  const isReadOnly = !!draft?.sent_at;

  const recipientsError = recipients ? getRecipientsError(recipients) : null;
  const isEmpty = !answers.presence && !answers.etat && !answers.securite && !answers.commentaires.trim();

  const submitMutation = useMutation({
    mutationFn: () =>
      submitMonumentAlert(alertId, {
        presence: answers.presence || null,
        etat: answers.etat || null,
        securite: answers.securite || null,
        commentaires: answers.commentaires,
        should_send: recipients?.should_send ? 1 : 0,
        mandatory_emails: recipients?.mandatory_emails ?? null,
        additional_emails: recipients?.additional_emails ?? null,
      }),
    onSuccess: onSubmitted,
  });

  const onValidate = () => {
    setShowErrors(true);
    if (recipientsError || isEmpty) return;
    submitMutation.mutate();
  };

  const radio = (key: "presence" | "etat" | "securite", legend: string) => (
    <RadioButtons
      legend={legend}
      orientation="horizontal"
      name={`${key}-${alertId}`}
      options={OBJET_ANNOTATION_OPTIONS[key].map((option) => ({
        label: option.label,
        nativeInputProps: {
          value: option.value,
          checked: answers[key] === option.value,
          disabled: isReadOnly,
          onChange: () => setAnswers((a) => ({ ...a, [key]: option.value })),
        },
      }))}
      style={{ marginBottom: "8px" }}
    />
  );

  // the saved answers are loaded before anything can be typed
  if (!draft || !recipients) {
    return (
      <Flex justifyContent="center" py="80px">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Stack>
      <Typography component="h2" fontSize="28px !important" lineHeight="36px" fontWeight="bold" mb="16px !important">
        {context.objetTitre || context.objetReference}
      </Typography>
      {/* « Palissy : PM61000888 voir sur POP ↗ » as in the mockup */}
      <Flex alignItems="center" gap="8px" flexWrap="wrap" mb="24px">
        <Typography lineHeight="24px">Palissy : {context.objetReference}</Typography>
        <a
          className="fr-link fr-icon-external-link-line fr-link--icon-right"
          href={getPopUrl(context.objetReference, "palissy")}
          target="_blank"
          rel="noopener external"
          title={`Voir ${context.objetReference} sur POP - ouvre une nouvelle fenêtre`}
        >
          voir sur POP
        </a>
      </Flex>
      {isSaved ? (
        // @ts-ignore title is optional
        <Alert
          severity={isReadOnly ? "warning" : "success"}
          small
          sx={{ mb: "16px" }}
          description={
            isReadOnly
              ? `Annotation enregistrée et envoyée par courriel le ${formatDate(draft?.sent_at)} : elle ne peut plus être modifiée.`
              : `Annotation enregistrée le ${formatDate(draft?.submitted_at)}. Vous pouvez la compléter.`
          }
        />
      ) : null}
      {/* @ts-ignore title is optional */}
      <Alert
        severity="info"
        small
        sx={{ mb: "24px" }}
        description={
          <>
            Vos annotations seront conservées sur la page de l’objet.
            <br />
            Un constat d’état séparé peut être réalisé.{" "}
            {showFicheLink ? (
              <Link to="/objet/$reference" params={{ reference: context.objetReference }} className="fr-link">
                Consulter sa page
              </Link>
            ) : null}
          </>
        }
      />

      {/* a fieldset disables every field of an annotation already emailed */}
      <fieldset disabled={isReadOnly} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        {radio("presence", "Présence de l’objet")}
        {radio("etat", "État général de l’objet")}
        {radio("securite", "L’objet est-il en sécurité ?")}

        <CommentairesField
          value={answers.commentaires}
          onChange={(commentaires) => setAnswers((a) => ({ ...a, commentaires }))}
        />
        <AlertPhotosField alertId={alertId} />

        <Divider my="24px" />
        {recipients ? (
          <RecipientsField value={recipients} onChange={setRecipients} error={showErrors ? recipientsError : null} />
        ) : null}
      </fieldset>

      {showErrors && isEmpty ? (
        <Typography mt="16px" fontSize="14px" color={fr.colors.decisions.text.default.error.default}>
          Renseignez au moins une observation ou un commentaire.
        </Typography>
      ) : null}

      {isReadOnly ? null : (
        <Flex justifyContent="flex-end" alignItems="center" gap="16px" mt="32px" flexWrap="wrap">
          <Button
            priority="tertiary no outline"
            iconId="ri-arrow-go-back-line"
            type="button"
            onClick={() => setAnswers(emptyAnswers)}
          >
            Effacer les informations
          </Button>
          <Button type="button" onClick={onValidate} disabled={!recipients || submitMutation.isPending}>
            Valider
          </Button>
        </Flex>
      )}
    </Stack>
  );
};

const formatDate = (date: string | null | undefined) =>
  date ? new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";
