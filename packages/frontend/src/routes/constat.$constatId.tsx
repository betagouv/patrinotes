import { SimpleBanner } from "#components/Banner.tsx";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Box, Typography } from "@mui/material";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { attachmentQueue, db, useDbQuery } from "../db/db";
import { StateReportForm } from "../features/state-report/StateReportForm";
import { getIsStateReportDisabled, stateReportStepSchema } from "../features/state-report/utils";
import z from "zod";
import { useSyncStream } from "@powersync/react/lib/hooks/streams";
import { BackHomeButton } from "#components/BackHomeButton.tsx";
import { StateReport } from "../db/AppSchema";
import { StateReportAlertButton } from "../features/state-report/side-menu/StateReportSideMenu";

export const Route = createFileRoute("/constat/$constatId")({
  component: RouteComponent,
  validateSearch: (search: { step?: string; mode?: "view" | "edit" }) => ({
    step: stateReportStepSchema.optional().default("informations").safeParse(search.step)?.data ?? "informations",
    mode: z.enum(["view", "edit"]).optional().default("view").safeParse(search.mode)?.data ?? "view",
  }),
});

function RouteComponent() {
  const { constatId } = Route.useParams();
  const reportQuery = useDbQuery(db.selectFrom("state_report").where("id", "=", constatId).selectAll());
  const report = reportQuery.data?.[0];

  return (
    <Flex width="100%" height="100%" flexDirection="column" alignItems="center">
      <SimpleBanner width="100%" alignItems="flex-start" pt="20px">
        <Flex width={{ xs: "100%", lg: "1200px" }} maxWidth="100%" flexDirection="column" px="16px">
          <BackHomeButton />

          <Flex
            mt="24px"
            gap="16px"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", lg: "center" }}
            flexDirection={{ xs: "column", lg: "row" }}
          >
            <Typography fontSize="20px !important" fontWeight="normal" component="h1" mb="0 !important">
              Constat d'état
            </Typography>
            {report?.reference_pop ? (
              <Box display={{ xs: "none", lg: "block" }}>
                <StateReportAlertButton />
              </Box>
            ) : null}
          </Flex>
        </Flex>
      </SimpleBanner>
      <Box width="100%" flex="1">
        <WithStateReport report={report} isLoading={reportQuery.isLoading} />
      </Box>
    </Flex>
  );
}

const WithStateReport = ({ report, isLoading }: { report: StateReport | undefined; isLoading: boolean }) => {
  const { constatId } = Route.useParams();
  const stream = useSyncStream({ name: "state_report_attachments_stream", parameters: { state_report_id: constatId } });

  // Once the attachment records for this constat have synced down, force an immediate
  // download pass instead of waiting for the queue's periodic 30s retry poll.
  useEffect(() => {
    if (stream?.subscription.hasSynced) {
      attachmentQueue.syncStorage().catch(console.error);
    }
  }, [stream?.subscription.hasSynced, constatId]);

  if (isLoading) {
    return (
      <Center flexDirection="column">
        <Box bgcolor={fr.colors.decisions.background.open.blueFrance.default} height="60px" width="100%"></Box>
        <Center height="100%" mt="100px" mb="160px">
          <Spinner />
        </Center>
      </Center>
    );
  }

  if (!report) {
    return <Navigate to="/" />;
  }

  // A sent report can only be viewed as its PDF: never show the form again
  // (covers links, typed URLs and the browser's back button).
  if (getIsStateReportDisabled(report)) {
    return <Navigate to="/constat/$constatId/pdf" params={{ constatId }} search={{ mode: "view" }} replace />;
  }

  return (
    <Flex flexDirection="column" width="100%" height="100%">
      {/* keyed: going from one constat to another of the same rapport groupé must not reuse the form */}
      <StateReportForm key={report.id} report={report} />
    </Flex>
  );
};
