import { SimpleBanner } from "#components/Banner.tsx";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Box, Typography } from "@mui/material";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { db, useDbQuery } from "../db/db";
import { StateReportForm } from "../features/state-report/StateReportForm";
import { stateReportStepSchema } from "../features/state-report/utils";
import z from "zod";

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
          <Link to="/" style={{ textDecoration: "underline" }} search={{ document: "constats" }}>
            <Typography fontSize="12px" color={fr.colors.decisions.text.mention.grey.default}>
              Retour à l'accueil
            </Typography>
          </Link>

          <Typography fontSize="28px" variant="h2" mt="24px">
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
  const reportQuery = useDbQuery(db.selectFrom("state_report").where("id", "=", constatId).selectAll());

  if (reportQuery.isLoading) {
    return (
      <Center mt="100px" height="100%">
        <Spinner />
      </Center>
    );
  }
  const report = reportQuery.data?.[0];

  if (!report) {
    return <Navigate to="/" search={{ document: "constats" }} />;
  }

  return (
    <Flex flexDirection="column" width="100%" height="100%">
      <StateReportForm report={report} />
    </Flex>
  );
};
