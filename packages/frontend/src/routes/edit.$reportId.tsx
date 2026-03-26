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
import { db, useDbQuery } from "../db/db";
import { Report, StateReport } from "../db/AppSchema";
import { Flex } from "#components/ui/Flex.tsx";
import { Box } from "@mui/material";
import Button from "@codegouvfr/react-dsfr/Button";
import { Tabs } from "#components/Tabs.tsx";
import { Center } from "#components/MUIDsfr.tsx";
import { useStatus } from "@powersync/react";
import { useFormWithFocus, useRefreshForm } from "../hooks/useFormWithFocus";

const EditReport = () => {
  const { reportId } = Route.useParams();

  const reportQuery = useDbQuery(db.selectFrom("report").where("id", "=", reportId).selectAll());

  const report = reportQuery.data?.[0];

  return <Flex flexDirection="column">{report ? <WithReport report={report} /> : null}</Flex>;
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
        position: "absolute" as const,
        left: "16px",
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SyncFormBanner newObject={newObject} />
            <Tabs control={[tab ?? "info", setTab]} options={options} />
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
