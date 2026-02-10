import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { forwardRef, useState } from "react";
import { useUser } from "../../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { downloadFile } from "../../utils";
import { v4 } from "uuid";
import { omit } from "pastable";
import { ReportWithUser } from "./ReportList";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../../api";
import { useCanEditReport } from "../../hooks/useCanEditReport";
import { db } from "../../db/db";
import { getPDFInMailName } from "@cr-vif/pdf";
import { Flex } from "#components/ui/Flex.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { styled } from "@mui/material";
import { fr } from "@codegouvfr/react-dsfr";
import { ConfirmationModal } from "#components/ui/ConfirmationModal.tsx";

export const ReportActions = forwardRef<HTMLDivElement, { report: ReportWithUser }>(({ report }, ref) => {
  const user = useUser()!;

  const canEdit = useCanEditReport(report);

  const navigate = useNavigate();

  const downloadPdfMutation = useMutation({
    mutationFn: async () => {
      const buffer = (await api.get("/api/upload/attachment", {
        query: { filePath: report.attachment_id! },
      } as any)) as Blob;

      const name = getPDFInMailName(report);
      return downloadFile(window.URL.createObjectURL(buffer), name);
    },
  });

  const [isDeleteWarningOpen, setIsDeleteWarningOpen] = useState(false);
  const deleteMutation = useDeleteMutation();

  const duplicateMutation = useMutation({
    mutationFn: async () => {
      const payload = omit(report, ["id", "createdAt", "pdf", "title", "createdByName"]);

      return db
        .insertInto("report")
        .values({
          ...payload,
          id: `report-${v4()}`,
          title: `${report.title ?? "Sans titre"} - copie`,
          createdAt: new Date().toISOString(),
          redactedBy: user.name,
          redactedById: user.id,
          createdBy: user.id,
          pdf: undefined,
        })
        .execute();
    },
  });

  const canDownload = report.pdf !== null || report.attachment_id !== null;

  return (
    <Flex ref={ref} bgcolor="#ECECFE" gap="0" flexDirection="column">
      {canEdit ? (
        <>
          <ReportAction
            iconId="ri-pencil-line"
            label="Éditer"
            onClick={() => navigate({ to: "/edit/$reportId", params: { reportId: report.id } })}
          />
          <Divider height="1px" color="#DDD" />
        </>
      ) : null}
      {canDownload ? (
        <>
          <ReportAction iconId="ri-download-line" label="Télécharger" onClick={() => downloadPdfMutation.mutate()} />
          <Divider height="1px" color="#DDD" />
        </>
      ) : null}
      <ReportAction iconId="ri-file-add-line" label="Dupliquer" onClick={() => duplicateMutation.mutate()} />
      {canEdit ? (
        <>
          <Divider height="1px" color="#DDD" />

          {isDeleteWarningOpen ? (
            <ConfirmationModal
              title="Supprimer le document"
              content={
                <>
                  <span>Êtes-vous sûr de vouloir supprimer {getReportToDeleteTitle(report)}</span>
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
            color={fr.colors.decisions.text.actionHigh.redMarianne.default}
            iconId="ri-delete-bin-2-line"
            label="Supprimer"
            onClick={() => setIsDeleteWarningOpen(true)}
          />
        </>
      ) : null}
    </Flex>
  );
});

const getReportToDeleteTitle = (report: ReportWithUser) => {
  if (!report.title) return "ce compte-rendu ?";
  return (
    <>
      le compte-rendu "<b>{report.title}</b>" ?
    </>
  );
};

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
      await db.updateTable("report").set({ disabled: 1 }).where("id", "=", id).execute();
    },
  });
