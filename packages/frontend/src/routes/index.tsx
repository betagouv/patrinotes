import { Banner, SimpleBanner } from "#components/Banner";
import { EnsureUser } from "#components/EnsureUser";
import { SearchResults } from "#components/ReportSearch.tsx";
import { Status } from "#components/SyncForm";
import { useStatus } from "@powersync/react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { v4 } from "uuid";
import { useUser } from "../contexts/AuthContext";
import { db, useDbQuery } from "../db/db";
import { AllReports, MyReports } from "../features/report/ReportList";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, BoxProps, Typography } from "@mui/material";
import { Center, Input, Tile } from "#components/MUIDsfr.tsx";
import { useStyles } from "tss-react";
import { Tabs } from "#components/Tabs.tsx";
import { Button } from "#components/MUIDsfr.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { HomeImageSvg } from "#components/HomeImageSvg.tsx";
import { DocumentTypeSelector } from "#components/DocumentTypeSelector.tsx";
import z from "zod";
import { appDocumentEnum } from "../utils";

const Index = () => {
  const [search, setSearch] = useState("");
  const user = useUser()!;
  const navigate = useNavigate();

  const createReportMutation = useMutation({
    mutationFn: async () => {
      const id = "report-" + v4();
      await db
        .insertInto("report")
        .values({
          id,
          createdBy: user.id,
          createdAt: new Date().toISOString(),
          meetDate: new Date().toISOString(),
          disabled: 0,
          service_id: user.service_id,
          redactedBy: user.name,
          redactedById: user.id,
        })
        .execute();

      return id;
    },
    onSuccess: (id) => {
      id && navigate({ to: "/edit/$reportId", params: { reportId: id } });
    },
  });

  const createStateReportMutation = useMutation({
    mutationFn: async () => {
      const id = v4();
      await db
        .insertInto("state_report")
        .values({
          id,
          created_by: user.id,
          created_at: new Date().toISOString(),
          disabled: 0,
          service_id: user.service_id,
          redacted_by: user.name,
          date_visite: new Date().toISOString(),
        })
        .execute();

      return id;
    },
    onSuccess: (id) => {
      id &&
        navigate({
          to: "/constat/$constatId",
          params: { constatId: id },
          search: { step: "informations", mode: "view" },
        });
    },
  });

  return (
    <Flex flexDirection="column" color="text-label-grey">
      <SimpleBanner pt={{ xs: "15px", lg: "82px" }} pb={{ xs: "49px", lg: "82px" }} alignItems="flex-start">
        <Flex width={{ xs: "100%", lg: "926px" }} flexDirection="column">
          <Typography
            variant="h2"
            fontSize="32px"
            color={fr.colors.decisions.text.actionHigh.blueFrance.default}
            px={{ lg: 0, xs: "16px" }}
          >
            Les outils du patrimoine en mobilité
          </Typography>

          <Flex alignItems="center" width="100%" flexDirection={{ xs: "column-reverse", lg: "row" }}>
            <Flex
              width={{ xs: "100%", lg: "588px" }}
              mt="48px"
              flexDirection="column"
              py="16px"
              px={{ lg: 0, xs: "16px" }}
            >
              <Typography variant="body1" px="16px" fontSize="20px">
                Que souhaitez-vous faire ?
              </Typography>
              <Tile
                sx={{ h3: { margin: "0 !important", fontSize: "18px !important" }, mt: "32px" }}
                small
                title="Créer un constat d'état"
                buttonProps={{
                  onClick: () => createStateReportMutation.mutate(),
                }}
                noIcon
              />
              <Tile
                sx={{ h3: { margin: "0 !important", fontSize: "18px !important" }, mt: "16px" }}
                small
                title="Créer un compte-rendu"
                buttonProps={{
                  onClick: () => createReportMutation.mutate(),
                }}
                noIcon
              />
            </Flex>
            <Box alignSelf={{ xs: "center", lg: "flex-end" }} ml={{ xs: "0", lg: "126px" }}>
              <HomeImageSvg />
            </Box>
          </Flex>
        </Flex>
      </SimpleBanner>

      {search ? <SearchResults hideEmpty search={search} /> : <MainContentTabs />}
    </Flex>
  );
};

const MainContentTabs = () => {
  const options = [
    {
      id: "my",
      label: "Mes documents",
      props: {
        position: "absolute" as const,
        left: { xs: "24px", lg: "calc((100vw - 400px * 2 - 134px) / 2)" },
      },
      component: (
        <>
          <MyReports />
        </>
      ),
    },
    {
      id: "service",
      label: "Service",
      props: {
        position: "absolute" as const,
        left: { xs: "16px", lg: "58px" },
      },
      component: (
        <>
          <AllReports />
        </>
      ),
    },
  ];

  return (
    <Flex flex="1" flexDirection="column" pb={{ xs: "16px", lg: "0" }} width="100%">
      <Tabs options={options} />
    </Flex>
  );
};

export const Route = createFileRoute("/")({
  component: () => (
    <EnsureUser>
      <Index />
    </EnsureUser>
  ),
  validateSearch: (search) => {
    const parsed = appDocumentEnum.safeParse(search?.document);

    return {
      document: parsed.success ? parsed.data : "constats",
    };
  },
});
