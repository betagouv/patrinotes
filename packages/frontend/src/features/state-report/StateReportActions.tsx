import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { forwardRef, ReactNode, useState } from "react";
import { useUser } from "../../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { downloadFile } from "../../utils";
import { v4 } from "uuid";
import { omit } from "pastable";
import { ReportWithUser, StateReportWithUser } from "../report/ReportList";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../../api";
import { useCanEditReport } from "../../hooks/useCanEditReport";
import { db } from "../../db/db";
import { getPDFInMailName } from "@cr-vif/pdf";
import { Flex } from "#components/ui/Flex.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { useStyles } from "tss-react";
import { Box, Dialog, DialogTitle, styled } from "@mui/material";
import { StateReport } from "../../db/AppSchema";
import { ModalCloseButton } from "../menu/MenuTitle";
import { ConfirmationModal } from "#components/ui/ConfirmationModal.tsx";
import { fr } from "@codegouvfr/react-dsfr";

const getStateReportMailName = (stateReport: StateReport) => {
  return `constat-d-etat-${cleanString(stateReport.titre_edifice || "")}.pdf`;
};

function cleanString(str: string): string {
  return str
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]/g, "") // Remove special characters (keep letters, numbers, hyphens)
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export const StateReportActions = forwardRef<HTMLDivElement, { report: StateReportWithUser }>(({ report }, ref) => {
  const user = useUser()!;

  const navigate = useNavigate();

  const hasAccess = report.created_by === user.id;
  const isDraft = !report.attachment_id;

  const [isDeleteWarningOpen, setIsDeleteWarningOpen] = useState(false);
  const deleteMutation = useDeleteMutation();

  const downloadPdfMutation = useMutation({
    mutationFn: async () => {
      const buffer = (await api.get("/api/upload/attachment", {
        query: { filePath: report.attachment_id! },
      } as any)) as Blob;

      const name = getStateReportMailName(report);
      return downloadFile(window.URL.createObjectURL(buffer), name);
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async () => {
      const payload = omit(report, [
        "id",
        "created_at",
        "created_by",
        "disabled",
        "redacted_by",
        "service_id",
        "attachment_id",
      ]);

      return db
        .insertInto("state_report")
        .values({
          ...payload,
          id: v4(),
          titre_edifice: `${report.titre_edifice ?? "Sans titre"}`,
          created_at: new Date().toISOString(),
          created_by: user.id,
          disabled: 0,
          service_id: user.service_id,
          redacted_by: user.name,
          date_visite: new Date().toISOString(),
        })
        .execute();
    },
  });

  return (
    <Flex ref={ref} bgcolor="#ECECFE" gap="0" flexDirection="column">
      {isDraft ? (
        <>
          <ReportAction
            iconId="ri-edit-line"
            label="Éditer"
            onClick={() =>
              navigate({
                to: "/constat/$constatId",
                params: { constatId: report.id },
                search: { mode: "view", step: "constat-general" },
              })
            }
          />
          <Divider height="1px" color="#DDD" />
        </>
      ) : null}

      <ReportAction iconId="ri-file-add-line" label="Dupliquer" onClick={() => duplicateMutation.mutate()} />

      {!isDraft ? (
        <>
          <Divider height="1px" color="#DDD" />
          <ReportAction label="Télécharger" onClick={() => downloadPdfMutation.mutate()} iconId="ri-download-line" />
        </>
      ) : null}

      {hasAccess ? (
        <>
          <Divider height="1px" color="#DDD" />
          {isDeleteWarningOpen ? (
            <ConfirmationModal
              title="Supprimer le document"
              content={
                <>
                  <span>
                    Êtes-vous sûr de vouloir supprimer le constat{" "}
                    {report.titre_edifice ? <b>"{report.titre_edifice}"</b> : ""} ?
                  </span>
                  <br />
                  <span>Cette action est irréversible.</span>
                </>
              }
              buttonLabel="Supprimer"
              onConfirm={() => deleteMutation.mutate(report.id)}
              onClose={() => setIsDeleteWarningOpen(false)}
            />
          ) : null}
          <ReportAction
            label="Supprimer"
            onClick={() => setIsDeleteWarningOpen(true)}
            iconId="ri-delete-bin-2-line"
            color={fr.colors.decisions.text.actionHigh.redMarianne.default}
          />
        </>
      ) : null}
    </Flex>
  );
});

const ReportAction = ({
  iconId,
  label,
  onClick,
  color,
}: {
  iconId: ButtonProps["iconId"];
  label: string;
  onClick: () => void;
  color?: string;
}) => {
  return (
    <ReportActionButton iconId={iconId as any} onClick={onClick} priority="tertiary no outline" sx={{ color }}>
      {label}
    </ReportActionButton>
  );
};

const ReportActionButton = styled(Button)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("lg")]: {
    height: "56px",
  },
}));

const useDeleteMutation = () =>
  useMutation({
    mutationFn: async (id: string) => {
      await db.updateTable("state_report").set({ disabled: 1 }).where("id", "=", id).execute();
    },
  });
