import { Box, Drawer, Stack, Typography } from "@mui/material";
import { Button, Input, Select } from "#components/MUIDsfr.tsx";
import { useIsStateReportDisabled, useStateReportFormContext } from "../utils";
import { ReactNode, useId, useState } from "react";
import { EmailInput } from "#components/EmailInput.tsx";
import { MenuTitle, ModalBackButton } from "../../menu/MenuTitle";
import { SectionItem } from "../steps/ConstatDetaille";
import { fr } from "@codegouvfr/react-dsfr";
import { useLiveService, useLiveUser, useService } from "../../../contexts/AuthContext";
import { useSpeechToTextV2 } from "../../audio-record/SpeechRecorder.hook";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import { Flex } from "#components/ui/Flex.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { FullWidthButton } from "#components/FullWidthButton.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { attachmentQueue, attachmentStorage, db, useDbQuery } from "../../../db/db";
import { v7 } from "uuid";
import { getRouteApi } from "@tanstack/react-router";
import { Service, StateReportAlert } from "../../../db/AppSchema";
import { Spinner } from "#components/Spinner.tsx";
import { alertSections } from "@cr-vif/pdf/constat";
import { SectionCommentaires, SectionPhotos, ShowInReportToggle } from "./SectionCommentaires";
import { useConstatPdfContext } from "../pdf/ConstatPdfContext";
import { uppercaseFirstLetterIf } from "../../../utils";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";

const routeApi = getRouteApi("/constat/$constatId");

export const OBJETS_MOBILIERS_SECTION = "Objets et mobiliers";

export const getEmailsForSection = (sectionTitle: string, service: Service) => {
  const sectionStaticData = alertSections.find((s) => s.title === sectionTitle);
  if (!sectionStaticData || !service) return [];

  const emailKeys = sectionStaticData.services.map((svc) => "courriel_" + svc.toLowerCase().replace(/\s+/g, "_"));
  const emails = emailKeys
    .map((key) => service[key as keyof typeof service])
    .filter((email): email is string => typeof email === "string" && email.trim().length > 0);

  return emails;
};

export const ObjetsEtMobiliersPage = ({
  onClose,
  onBack,
  items,
  isLoading,
}: {
  onClose: () => void;
  onBack: () => void;
  items: StateReportAlert[];
  isLoading: boolean;
}) => {
  const isFormDisabled = useIsStateReportDisabled();
  const [pendingNewItems, setPendingNewItems] = useState<string[]>([]);
  const { constatId } = routeApi.useParams();

  const sectionStaticData = alertSections.find((s) => s.title === OBJETS_MOBILIERS_SECTION);
  const service = useLiveService();

  const emails = getEmailsForSection(OBJETS_MOBILIERS_SECTION, service!);
  const servicesNames = sectionStaticData?.services.join(", ") || "";

  const addNewItem = () => {
    setPendingNewItems((prev) => [...prev, v7()]);
  };

  const removePendingItem = (tempId: string) => {
    setPendingNewItems((prev) => prev.filter((id) => id !== tempId));
  };

  const onItemSaved = (tempId: string) => {
    removePendingItem(tempId);
  };

  return (
    <Stack px={{ xs: "16px", lg: 0 }}>
      <MenuTitle onClose={onClose} hideDivider>
        <ModalBackButton onClick={onBack} />
      </MenuTitle>

      <Typography fontSize="16px" fontWeight="bold">
        Alerte : {OBJETS_MOBILIERS_SECTION}
      </Typography>
      <Typography mt="8px" mb="16px" fontSize="14px" color={fr.colors.decisions.text.mention.grey.default}>
        Service destinataire : {servicesNames}
        {emails.length > 0 ? (
          <>
            <br />
            {emails.join(", ")}
          </>
        ) : null}
      </Typography>

      {isLoading ? (
        <Box mt="24px">
          <Spinner />
        </Box>
      ) : (
        <>
          {items.map((item, index) => (
            <Box key={item.id}>
              {index > 0 && <Divider my="24px" />}
              <ObjetMobilierItemForm item={item} constatId={constatId} />
            </Box>
          ))}

          {pendingNewItems.map((tempId, index) => (
            <Box key={tempId}>
              {(items.length > 0 || index > 0) && <Divider my="24px" />}
              <ObjetMobilierItemForm
                item={undefined}
                constatId={constatId}
                onSaved={() => onItemSaved(tempId)}
                onCancel={() => removePendingItem(tempId)}
                isNew
              />
            </Box>
          ))}

          {items.length === 0 && pendingNewItems.length === 0 && (
            <ObjetMobilierItemForm item={undefined} constatId={constatId} isNew />
          )}

          {(items.length > 0 || pendingNewItems.length > 0) && (
            <>
              <Divider my="24px" />
              <Button
                priority="secondary"
                iconId="ri-add-line"
                onClick={addNewItem}
                disabled={isFormDisabled}
                sx={{ width: "100%" }}
              >
                Ajouter objet ou mobilier
              </Button>
            </>
          )}
        </>
      )}
    </Stack>
  );
};

type ObjetMobilierForm = {
  objet_ou_mobilier: string;
  objet_ou_mobilier_name: string;
  commentaires: string;
  show_in_report: boolean;
  probleme: string;
};

const ObjetMobilierItemForm = ({
  item,
  constatId,
  onSaved,
  onCancel,
  isNew,
}: {
  item: StateReportAlert | undefined;
  constatId: string;
  onSaved?: () => void;
  onCancel?: () => void;
  isNew?: boolean;
}) => {
  const formId = useId();
  const service = useLiveService();
  const isFormDisabled = useIsStateReportDisabled();
  const [savedId, setSavedId] = useState<string | undefined>(item?.id);

  const emails = getEmailsForSection(OBJETS_MOBILIERS_SECTION, service!);
  const servicesNames = alertSections.find((s) => s.title === OBJETS_MOBILIERS_SECTION)?.services.join(", ") || "";

  const createOrUpdateAlertMutation = useMutation({
    mutationFn: async ({
      objet_ou_mobilier,
      objet_ou_mobilier_name,
      commentaires,
      show_in_report,
      probleme,
    }: ObjetMobilierForm) => {
      const showInReportValue = show_in_report ? 1 : 0;

      if (savedId) {
        await db
          .updateTable("state_report_alert")
          .where("id", "=", savedId)
          .set({ objet_ou_mobilier, objet_ou_mobilier_name, commentaires, show_in_report: showInReportValue, probleme })

          .execute();
        return savedId;
      }

      const newId = v7();
      await db
        .insertInto("state_report_alert")
        .values({
          id: newId,
          alert: OBJETS_MOBILIERS_SECTION,
          state_report_id: constatId,
          objet_ou_mobilier,
          objet_ou_mobilier_name,
          commentaires,
          probleme,
          show_in_report: showInReportValue,
          service_id: service?.id ?? null,
          email: emails.join(",") || null,
          nom_service_contacte: servicesNames || null,
        })
        .execute();

      setSavedId(newId);
      onSaved?.();
      return newId;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!savedId) {
        onCancel?.();
        return;
      }

      const attachments = await db
        .selectFrom("state_report_alert_attachment")
        .selectAll()
        .where("state_report_alert_id", "=", savedId)
        .execute();

      for (const attachment of attachments) {
        await attachmentStorage.deleteFile(attachment.id);
        await db.deleteFrom("state_report_alert_attachment").where("id", "=", attachment.id).execute();
      }

      await db.deleteFrom("state_report_alert").where("id", "=", savedId).execute();
    },
  });

  const form = useForm<ObjetMobilierForm>({
    defaultValues: {
      objet_ou_mobilier: item?.objet_ou_mobilier ?? "",
      objet_ou_mobilier_name: item?.objet_ou_mobilier_name ?? "",
      commentaires: item?.commentaires ?? "",
      show_in_report: !!item?.show_in_report,
      probleme: item?.probleme ?? "",
    },
  });

  const itemTitle =
    isNew && !savedId ? "Nouvel objet ou mobilier" : item?.objet_ou_mobilier_name || "Objet ou mobilier";

  return (
    <Stack
      component="form"
      onSubmit={form.handleSubmit((values) => createOrUpdateAlertMutation.mutate(values))}
      id={formId}
      sx={{
        p: "16px",
        border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
        borderRadius: "4px",
        backgroundColor: fr.colors.decisions.background.default.grey.default,
      }}
    >
      <Typography fontSize="14px" fontWeight="bold" mb="16px">
        {itemTitle}
      </Typography>

      {/* <Input
        disabled={isFormDisabled}
        label="Nom de l'objet ou mobilier"
        nativeInputProps={form.register("objet_ou_mobilier")}
      /> */}

      <ObjetEtMobilierSelect form={form} />
      <ProblemeRadioButtons form={form} />
      <SectionCommentaires form={form} />

      <SectionPhotos
        alertId={savedId}
        section={OBJETS_MOBILIERS_SECTION}
        constatId={constatId}
        form={form}
        isDisabled={isFormDisabled}
      />

      <Divider my="16px" />

      <ShowInReportToggle form={form} />

      <Flex gap="8px" mt="16px">
        <Button type="submit" priority="primary" disabled={isFormDisabled || createOrUpdateAlertMutation.isPending}>
          Enregistrer
        </Button>
        {(savedId || isNew) && (
          <Button
            type="button"
            priority="secondary"
            iconId="ri-delete-bin-line"
            disabled={isFormDisabled || deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}
          >
            Supprimer
          </Button>
        )}
      </Flex>
    </Stack>
  );
};

const ProblemeRadioButtons = ({ form }: { form: UseFormReturn<ObjetMobilierForm> }) => {
  const isFormDisabled = useIsStateReportDisabled();

  const value = useWatch({ control: form.control, name: "probleme" });

  const handleChange = (newValue: string) => {
    form.setValue("probleme", newValue);
  };

  const options = ["Objet absent", "Dégradation importante"].map((label) => ({
    label,
    nativeInputProps: {
      checked: value === label,
      onChange: () => handleChange(label),
    },
  }));

  return <RadioButtons style={{ marginBottom: 0 }} legend="Problème à signaler" options={options} />;
};

const ObjetEtMobilierSelect = ({ form }: { form: UseFormReturn<ObjetMobilierForm> }) => {
  const isFormDisabled = useIsStateReportDisabled();
  const stateReportForm = useStateReportFormContext();

  const referencePop = useWatch({ control: stateReportForm.control, name: "reference_pop" });

  const objetsEtMobiliersQuery = useQuery({
    queryKey: ["stateReportAlerts", "objetsEtMobiliers", referencePop],
    enabled: !!referencePop,
    queryFn: async () => {
      const objets = await db
        .selectFrom("pop_objets")
        .select(["titre_editorial", "reference"])
        .where("reference_a_une_notice_merimee_mh", "like", "%" + referencePop?.trim() + "%")
        .execute();
      return objets;
    },
  });

  return (
    <Select
      label="Objet ou mobilier"
      disabled={isFormDisabled}
      nativeSelectProps={{
        ...form.register("objet_ou_mobilier"),
        onChange: (e) => {
          form.setValue("objet_ou_mobilier", e.target.value);
          const selectedObj = objetsEtMobiliersQuery.data?.find((obj) => obj.reference === e.target.value);
          form.setValue(
            "objet_ou_mobilier_name",
            selectedObj ? uppercaseFirstLetterIf(selectedObj.titre_editorial!, true) : "",
          );
        },
      }}
    >
      <option value="" disabled>
        -- Sélectionner un objet ou mobilier --
      </option>
      {objetsEtMobiliersQuery.data?.map((obj) => (
        <option key={obj.reference} value={obj.reference!}>
          {uppercaseFirstLetterIf(obj.titre_editorial!, true)} ({obj.reference})
        </option>
      ))}
    </Select>
  );
};
