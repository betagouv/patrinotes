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
import { stateReportStepSchema } from "../features/state-report/utils";
import z from "zod";
import { useSyncStream } from "@powersync/react/lib/hooks/streams";
import { BackHomeButton } from "#components/BackHomeButton.tsx";

export const Route = createFileRoute("/constat/$constatId")({
  component: RouteComponent,
  validateSearch: (search: { step?: string; mode?: "view" | "edit" }) => ({
    step: stateReportStepSchema.optional().default("informations").safeParse(search.step)?.data ?? "informations",
    mode: z.enum(["view", "edit"]).optional().default("view").safeParse(search.mode)?.data ?? "view",
  }),
});

function RouteComponent() {
  return (
    <Flex width="100%" height="100%" flexDirection="column" alignItems="center">
      <SimpleBanner width="100%" alignItems="flex-start" pt="20px">
        <Flex width={{ xs: "100%", lg: "1200px" }} maxWidth="100%" flexDirection="column" px="16px">
          <BackHomeButton />

          <Typography fontSize="20px !important" fontWeight="normal" component="h1" mt="24px" mb="0 !important">
            Constat d'état
          </Typography>
        </Flex>
      </SimpleBanner>
      <Box width="100%" flex="1">
        <WithStateReport />
      </Box>
    </Flex>
  );
}

const WithStateReport = () => {
  const { constatId } = Route.useParams();
  const stream = useSyncStream({ name: "state_report_attachments_stream", parameters: { state_report_id: constatId } });

  // Once the attachment records for this constat have synced down, force an immediate
  // download pass instead of waiting for the queue's periodic 30s retry poll.
  useEffect(() => {
    if (stream?.subscription.hasSynced) {
      attachmentQueue.syncStorage().catch(console.error);
    }
  }, [stream?.subscription.hasSynced, constatId]);

  const reportQuery = useDbQuery(db.selectFrom("state_report").where("id", "=", constatId).selectAll());

  if (reportQuery.isLoading) {
    return (
      <Center flexDirection="column">
        <Box bgcolor={fr.colors.decisions.background.open.blueFrance.default} height="60px" width="100%"></Box>
        <Center height="100%" mt="100px" mb="160px">
          <Spinner />
        </Center>
      </Center>
    );
  }
  const report = reportQuery.data?.[0];

  if (!report) {
    return <Navigate to="/" />;
  }

  return (
    <Flex flexDirection="column" width="100%" height="100%">
      <StateReportForm report={report} />
    </Flex>
  );
};
