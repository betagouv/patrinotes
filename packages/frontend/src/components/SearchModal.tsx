import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { Box, Dialog, Stack, Typography } from "@mui/material";
import { AppSearchBar } from "../features/report/AppSearchBar";
import { ModalCloseButton } from "../features/menu/MenuTitle";
import { Flex } from "./ui/Flex";
import { useEffect, useRef } from "react";
import { DocumentTypeSelector } from "./DocumentTypeSelector";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSearchReportQueries, getSearchStateReportQueries } from "../features/useDocumentQueries";
import { useUser } from "../contexts/AuthContext";
import { Center } from "./MUIDsfr";
import { Spinner } from "./Spinner";
import { ReportListItem } from "../features/report/ReportListItem";
import { StateReportListItem } from "../features/state-report/StateReportListItem";

export const SearchModal = () => {
  const isModalOpen = useSelector(searchStore, (state) => state.context.modalOpen);
  const onClose = () => searchStore.send({ type: "closeModal" });
  const search = useSelector(searchStore, (state) => state.context.search);

  const isDesktop = useIsDesktop();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => searchStore.send({ type: "closeModal" });
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [isModalOpen]);

  if (isDesktop || !isModalOpen) return null;

  return (
    <Dialog
      open
      onClose={onClose}
      sx={{
        ".MuiPaper-root": {
          width: "100%",
          height: "100%",
          maxHeight: "100%",
          margin: 0,
          p: "16px",
        },
        ".MuiDialog-container": {
          transition: "none !important",
        },
      }}
    >
      <Flex flexDirection="column" gap="16px">
        <ModalCloseButton onClose={onClose} />
        <AppSearchBar inputRef={inputRef} onClick={() => {}} />
        <DocumentTypeSelector />
      </Flex>
      <Stack>
        <SearchResults search={search} />
      </Stack>
    </Dialog>
  );
};
const routeApi = getRouteApi("/");
const SearchResults = ({ search }: { search: string }) => {
  const document = routeApi.useSearch().document;
  const isCR = document === "compte-rendus";

  const user = useUser();

  const query = useQuery({
    queryKey: ["searchResults", document, search],
    queryFn: async () => {
      const isCR = document === "compte-rendus";
      const dbQuery = isCR
        ? getSearchReportQueries(search!, "all", user!)
        : getSearchStateReportQueries(search!, "all", user!);

      return dbQuery.baseQuery.execute();
    },
    enabled: search.length > 0,
  });

  if (query.isLoading) {
    return (
      <Center mt="100px">
        <Spinner />
      </Center>
    );
  }

  const results = query.data ?? [];
  if (results.length === 0) {
    return <Center mt="100px">Aucun résultat trouvé</Center>;
  }

  const Item = ({ report }: any) =>
    isCR ? <ReportListItem report={report} /> : <StateReportListItem report={report} />;

  const getCreatedBy = (report: any) => (isCR ? report.createdBy : report.created_by);

  const myReports = results.filter((report) => getCreatedBy(report) === user?.id);
  const otherReports = results.filter((report) => getCreatedBy(report) !== user?.id);

  return (
    <Center width="100%">
      <Stack flexDirection={{ xs: "column", lg: "row" }} width={{ xs: "100%", lg: "unset" }} mt="24px">
        <Typography variant="h6" mb="16px">
          Mes documents :
        </Typography>
        {myReports.length > 0 ? (
          myReports.map((report) => <Item key={report.id} report={report} />)
        ) : (
          <Typography>Aucun résultat trouvé</Typography>
        )}

        <Typography variant="h6" mb="16px" mt={{ xs: "32px", lg: "32px" }}>
          Documents de mon service :
        </Typography>
        {otherReports.length > 0 ? (
          otherReports.map((report) => <Item key={report.id} report={report} />)
        ) : (
          <Typography>Aucun résultat trouvé</Typography>
        )}
      </Stack>
    </Center>
  );
};

export const searchStore = createStore(
  {
    search: "",
    modalOpen: false,
  },
  {
    setSearch: (ctx, event: { search: string }) => ({
      ...ctx,
      search: event.search,
      modalOpen: ctx.modalOpen || !!event.search.length,
    }),
    openModal: (ctx) => ({ ...ctx, modalOpen: true }),
    closeModal: (ctx) => ({ ...ctx, modalOpen: false, search: "" }),
  },
);
