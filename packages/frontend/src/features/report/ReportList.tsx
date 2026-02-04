import { Button, Center } from "#components/MUIDsfr.tsx";
import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import { Box, Stack } from "@mui/material";
import { chunk } from "pastable";
import { useState } from "react";
import welcomeImage from "../../assets/welcome.svg?url";
import { useLiveUser, useUser } from "../../contexts/AuthContext";
import { Report, StateReport } from "../../db/AppSchema";
import { db, useDbQuery } from "../../db/db";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { ReportListItem } from "./ReportListItem";
import { getRouteApi } from "@tanstack/react-router";
import { getReportQueries, getStateReportQueries } from "../useDocumentQueries";
import { StateReportListItem } from "../state-report/StateReportListItem";
import { AppDocument } from "../../utils";
import { DocumentTypeSelector } from "#components/DocumentTypeSelector.tsx";
import { fr } from "@codegouvfr/react-dsfr";

export type ReportWithUser = Report & { createdByName: string | null };
export type StateReportWithUser = StateReport & { createdByName: string | null };

const routeApi = getRouteApi("/");

export const MyReports = () => {
  const [page, setPage] = useState(0);
  const document = routeApi.useSearch().document;

  const { baseQuery, countQuery } = useRightQueries({ page, document, scope: "my" });
  const reports = baseQuery.data;

  const reportsCount = countQuery.data?.[0]?.count as number;

  const hasError = baseQuery.error || countQuery.error;
  const isLoading = baseQuery.isLoading || countQuery.isLoading;

  if (hasError) {
    console.error(baseQuery.error, countQuery.error);
    return <Center>Une erreur s'est produite</Center>;
  }

  if (isLoading) return null;

  if (document === "compte-rendus") {
    return (
      <ReportList
        reports={(reports ?? []) as ReportWithUser[]}
        setPage={setPage}
        count={reportsCount ?? 0}
        page={page}
      />
    );
  } else
    return (
      <StateReportList
        reports={(reports ?? []) as StateReportWithUser[]}
        setPage={setPage}
        count={reportsCount ?? 0}
        page={page}
      />
    );
};

export const AllReports = () => {
  const [page, setPage] = useState(0);
  const document = routeApi.useSearch().document;

  const { baseQuery, countQuery } = useRightQueries({ page, document, scope: "all" });
  const reports = baseQuery.data;
  const reportsCount = countQuery.data?.[0]?.count as number;

  const hasError = baseQuery.error || countQuery.error;
  const isLoading = baseQuery.isLoading || countQuery.isLoading;

  if (hasError) {
    console.error(baseQuery.error, countQuery.error);
    return <Center>Une erreur s'est produite</Center>;
  }

  if (isLoading) return null;

  if (document === "compte-rendus") {
    return (
      <ReportList
        reports={(reports ?? []) as ReportWithUser[]}
        setPage={setPage}
        count={reportsCount ?? 0}
        page={page}
      />
    );
  } else
    return (
      <StateReportList
        reports={(reports ?? []) as StateReportWithUser[]}
        setPage={setPage}
        count={reportsCount ?? 0}
        page={page}
      />
    );
};

const useRightQueries = <Document extends AppDocument>({
  page,
  document,
  scope,
}: {
  page: number;
  document: Document;
  scope: "my" | "all";
}) => {
  const user = useUser()!;
  if (document === "compte-rendus") {
    const queries = getReportQueries(scope, page, user);
    return { baseQuery: useDbQuery(queries.baseQuery), countQuery: useDbQuery(queries.countQuery) };
  }

  const queries = getStateReportQueries(scope, page, user);
  return { baseQuery: useDbQuery(queries.baseQuery), countQuery: useDbQuery(queries.countQuery) };
};

const NoReport = () => {
  return (
    <Center flexDirection="column" mt="66px" p="16px" color="text-title-blue-france" fontSize="26px">
      <Box lineHeight="36px">Bienvenue !</Box>
      <Box textAlign="center" lineHeight="36px">
        Pour commencer, créez votre premier document ci-dessus.
      </Box>
      <Box component="img" src={welcomeImage} alt="Bienvenue" mt="46px" />
    </Center>
  );
};

export const ReportList = ({
  reports,
  page,
  setPage,
  count,
  hidePagination,
  onClick,
  hideEmpty,
}: {
  reports: ReportWithUser[];
  page?: number;
  setPage?: (page: number) => void;
  count?: number;
  hidePagination?: boolean;
  onClick?: () => void;
  hideEmpty?: boolean;
}) => {
  const error = reports.length === 0 ? <NoReport /> : null;
  const isDesktop = useIsDesktop();
  const columns = reports.length < 6 ? [reports] : chunk(reports, Math.ceil(reports.length / 2));

  return (
    <Stack component="div" width="100%" mt={{ xs: "20px", lg: "30px" }} px="16px">
      <Center mb="24px">
        <Box width="926px">
          <DocumentTypeSelector />
        </Box>
      </Center>
      {!hideEmpty && error ? (
        error
      ) : (
        <Stack>
          <Stack gap={{ xs: 0, lg: "126px" }} flexDirection={{ xs: "column", lg: "row" }} justifyContent="center">
            {columns.slice(0, 2).map((reports, columnIndex) => {
              return (
                <Stack key={columnIndex} flexDirection="column" width={{ xs: "100%", lg: "400px" }}>
                  {reports.map((report, index) => (
                    <ReportListItem
                      onClick={onClick}
                      key={report.id}
                      report={report}
                      isLast={
                        isDesktop
                          ? index === reports.length - 1
                          : index === reports.length - 1 && columnIndex === columns.length - 1
                      }
                    />
                  ))}
                </Stack>
              );
            })}
            {columns.length === 1 ? <Stack width="400px" /> : null}
          </Stack>
        </Stack>
      )}
      <Center
        flexDirection={{ xs: "column", lg: "row" }}
        width="100%"
        mt={{ xs: "48px", lg: "85px" }}
        mb={{ xs: "48px", lg: "110px" }}
      >
        {hidePagination || error ? null : (
          <>
            <Pagination
              count={count === 0 ? 0 : Math.ceil(count! / 20)}
              getPageLinkProps={(nb) => ({
                key: `page-${nb}`,
                onClick: () => setPage!(nb - 1),
              })}
              defaultPage={page! + 1}
            />
            {/* <Button
              sx={{
                ml: { xs: "0", lg: "80px" },
                mt: { xs: "40px", lg: "0" },
                mb: "16px",
                "::after": { display: "none !important" },
              }}
              priority="secondary"
              iconId="ri-chat-3-fill"
              linkProps={{
                target: "_blank",
                to: "https://adtk8x51mbw.eu.typeform.com/to/ejUj012R",
              }}
            >
              Je donne mon avis
            </Button> */}
          </>
        )}
      </Center>
    </Stack>
  );
};

export const StateReportList = ({
  reports,
  page,
  setPage,
  count,
  hidePagination,
  onClick,
  hideEmpty,
}: {
  reports: StateReportWithUser[];
  page?: number;
  setPage?: (page: number) => void;
  count?: number;
  hidePagination?: boolean;
  onClick?: () => void;
  hideEmpty?: boolean;
}) => {
  const error = reports.length === 0 ? <NoReport /> : null;
  const isDesktop = useIsDesktop();
  const columns = reports.length < 6 ? [reports] : chunk(reports, Math.ceil(reports.length / 2));
  return (
    <Stack component="div" width="100%" mt={{ xs: "20px", lg: "30px" }} px="16px">
      <Center mb="24px">
        <Box width="926px">
          <DocumentTypeSelector />
        </Box>
      </Center>
      {!hideEmpty && error ? (
        error
      ) : (
        <Stack gap={{ xs: 0, lg: "126px" }} flexDirection={{ xs: "column", lg: "row" }} justifyContent="center">
          {columns.slice(0, 2).map((reports, columnIndex) => {
            return (
              <Stack key={columnIndex} flexDirection="column" width={{ xs: "100%", lg: "400px" }}>
                {reports.map((report, index) => (
                  <StateReportListItem
                    onClick={onClick}
                    key={report.id}
                    report={report}
                    isLast={
                      isDesktop
                        ? index === reports.length - 1
                        : index === reports.length - 1 && columnIndex === columns.length - 1
                    }
                  />
                ))}
              </Stack>
            );
          })}
          {columns.length === 1 ? <Stack width="400px" /> : null}
        </Stack>
      )}
      <Center
        flexDirection={{ xs: "column", lg: "row" }}
        width="100%"
        mt={{ xs: "48px", lg: "85px" }}
        mb={{ xs: "48px", lg: "110px" }}
        sx={{
          [`.fr-pagination__link[title='Page ${page! + 1}']`]: {
            color: fr.colors.decisions.text.disabled.grey.default + " !important",
          },
          ".fr-pagination__link[aria-current]:not([aria-current=false])": {
            color: "unset",
          },
        }}
      >
        {hidePagination || error ? null : (
          <>
            <Pagination
              count={count === 0 ? 0 : Math.ceil(count! / 20)}
              getPageLinkProps={(nb) => ({
                key: `page-${nb}`,
                onClick: () => setPage!(nb - 1),
              })}
              defaultPage={page! + 1}
            />
            {/* <Button
              sx={{
                ml: { xs: "0", lg: "80px" },
                mt: { xs: "40px", lg: "0" },
                mb: "16px",
                "::after": { display: "none !important" },
              }}
              priority="secondary"
              iconId="ri-chat-3-fill"
              linkProps={{
                target: "_blank",
                to: "https://adtk8x51mbw.eu.typeform.com/to/ejUj012R",
              }}
            >
              Je donne mon avis
            </Button> */}
          </>
        )}
      </Center>
    </Stack>
  );
};
