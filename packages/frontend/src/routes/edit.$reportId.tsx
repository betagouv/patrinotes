import { EnsureUser } from "#components/EnsureUser";
import { SyncFormBanner, useSyncForm, syncObject } from "#components/SyncForm";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { FormProvider } from "react-hook-form";
import { InfoForm } from "../features/InfoForm";
import { NotesForm } from "../features/NotesForm";
import { DisabledContext } from "../features/DisabledContext";
import { useQuery } from "@tanstack/react-query";
import { useCanEditReport } from "../hooks/useCanEditReport";
import { attachmentQueue, db, useDbQuery } from "../db/db";
import { Report, StateReport } from "../db/AppSchema";
import { Flex } from "#components/ui/Flex.tsx";
import { Box } from "@mui/material";
import { Tabs } from "#components/Tabs.tsx";
import { Alert, Center } from "#components/MUIDsfr.tsx";
import { useStatus, useSyncStream } from "@powersync/react";
import { useFormWithFocus, useRefreshForm } from "../hooks/useFormWithFocus";
import { Spinner } from "#components/Spinner.tsx";
import { GoHomeButton } from "./compte.tsx";
import { fr } from "@codegouvfr/react-dsfr";

const EditReport = () => {
  const { reportId } = Route.useParams();
  const stream = useSyncStream({ name: "report_attachments_stream", parameters: { report_id: reportId } });

  // Once the attachment records for this report have synced down, force an immediate
  // download pass instead of waiting for the queue's periodic 30s retry poll.
  useEffect(() => {
    if (stream?.subscription.hasSynced) {
      attachmentQueue.syncStorage().catch(console.error);
    }
  }, [stream?.subscription.hasSynced, reportId]);

  const reportQuery = useDbQuery(db.selectFrom("report").where("id", "=", reportId).selectAll());
  const report = reportQuery.data?.[0];

  if (reportQuery.isLoading) {
    return (
      <Box mt="120px">
        <Spinner />
      </Box>
    );
  }

  if (!report) {
    return (
      <Center mt="16px" px="16px" flexDirection="column" gap="16px">
        <Box alignSelf="flex-start">
          <GoHomeButton />
        </Box>
        <Alert
          small={false}
          severity="error"
          description="Impossible de trouver le compte-rendu. Si le problème persiste veuillez vous déconnecter puis vous reconnecter."
        />
      </Center>
    );
  }

  return (
    <Flex flexDirection="column">
      <WithReport report={report} />
    </Flex>
  );
};

const WithReport = ({ report }: { report: Report }) => {
  const { tab } = Route.useSearch();
  const setTab = (tab: string) => {
    navigate({ search: { tab } as any, replace: true });
    document.getElementById("root")!.scrollTo(0, 0);
  };

  const [form, getFocused] = useFormWithFocus<Report>({
    defaultValues: report!,
    resetOptions: {},
  });

  const canEdit = useCanEditReport(report);
  const { newObject, syncMutation, cancelSync } = useSyncForm({
    form,
    baseObject: report,
    disabled: !canEdit,
    syncObject,
  });

  const navigate = useNavigate();

  // @ts-ignore
  const isChrome = !!window.chrome;

  const options = [
    {
      id: "info",
      label: "RDV",
      props: {
        color: fr.colors.decisions.text.actionHigh.blueFrance.default,
        position: "absolute" as const,
        // there is a difference in padding between chrome and other browsers due to scrollbar width (i guess)
        left: isChrome ? "max(calc((100vw - 800px) / 2 + 8px), 16px)" : "max(calc((100vw - 800px) / 2 + 16px), 16px)",
      },
      component: (
        <Center>
          <InfoForm />
        </Center>
      ),
    },
    {
      id: "notes",
      label: "Bilan",
      props: {
        color: fr.colors.decisions.text.actionHigh.blueFrance.default,
        position: "absolute" as const,
        left: { lg: "104px", xs: "16px" },
      },
      component: (
        <Center>
          <NotesForm />
        </Center>
      ),
    },
  ];

  useRefreshForm<Report>({ values: report, getFocused, form });

  const onSubmit = async (_values: Report) => {
    cancelSync();
    await syncMutation.mutateAsync();
    navigate({ to: "/pdf/$reportId", params: { reportId: report.id }, search: { mode: "view" } });
  };

  return (
    <DisabledContext.Provider value={!canEdit}>
      <Flex flexDirection="column">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") e.preventDefault();
            }}
          >
            <SyncFormBanner newObject={newObject} />
            <Tabs control={[tab ?? "my", setTab]} options={options} />
          </form>
        </FormProvider>
      </Flex>
    </DisabledContext.Provider>
  );
};

export const Route = createFileRoute("/edit/$reportId")({
  component: () => (
    <EnsureUser>
      <EditReport />
    </EnsureUser>
  ),
  validateSearch: (search: Record<string, unknown>) => {
    const tab = search?.tab as string;
    const isTabValid = ["info", "notes"].includes(tab);

    return {
      tab: isTabValid ? tab : "info",
    } as { tab?: string };
  },
});
