import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { Alert, Button, Input, Pagination, Table } from "#components/MUIDsfr.tsx";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { Tabs } from "#components/Tabs.tsx";
import { api, getErrorMessage } from "../api";
import useDebounce from "react-use/lib/useDebounce";

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

const adminKeys = {
  whitelist: (page: number) => ["admin", "whitelist", page] as const,
  users: (page: number, search: string) => ["admin", "users", page, search] as const,
};

// ---------------------------------------------------------------------------
// Whitelist panel
// ---------------------------------------------------------------------------

const WhitelistPanel = () => {
  const [page, setPage] = useState(1);
  const [newEmail, setNewEmail] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: adminKeys.whitelist(page),
    queryFn: () => api.get("/api/admin/whitelist", { query: { page, limit: PAGE_SIZE } }),
  });

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  const addMutation = useMutation({
    mutationFn: (email: string) => api.post("/api/admin/whitelist", { body: { email } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "whitelist"] });
      setNewEmail("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (email: string) => api.delete("/api/admin/whitelist", { body: { email } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "whitelist"] });
    },
  });

  const tableData =
    data?.emails.map((email) => [
      email,
      <Button
        key={email}
        priority="tertiary no outline"
        iconId="ri-delete-bin-line"
        iconPosition="left"
        size="small"
        onClick={() => deleteMutation.mutate(email)}
        disabled={deleteMutation.isPending && deleteMutation.variables === email}
      >
        {deleteMutation.isPending && deleteMutation.variables === email ? "Suppression..." : "Supprimer"}
      </Button>,
    ]) ?? [];

  return (
    <Stack gap="1.5rem" pt="1.5rem">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newEmail.trim()) addMutation.mutate(newEmail.trim());
        }}
      >
        <Stack flexDirection="row" gap="1rem" alignItems="flex-end">
          <Input
            label="Adresse email"
            style={{ flex: 1, marginBottom: 0 }}
            state={addMutation.isError ? "error" : "default"}
            stateRelatedMessage={addMutation.isError ? getErrorMessage(addMutation.error) : undefined}
            nativeInputProps={{
              type: "email",
              placeholder: "email@example.com",
              value: newEmail,
              onChange: (e) => setNewEmail(e.target.value),
              disabled: addMutation.isPending,
            }}
          />
          <Button
            type="submit"
            iconId="ri-add-line"
            iconPosition="left"
            disabled={addMutation.isPending || !newEmail.trim()}
            style={{ marginBottom: "1.5rem" }}
          >
            {addMutation.isPending ? "Ajout..." : "Ajouter"}
          </Button>
        </Stack>
      </form>

      {error && <Alert severity="error" title={getErrorMessage(error)} />}

      {isLoading ? (
        <Center py="3rem">
          <Spinner />
        </Center>
      ) : tableData.length === 0 ? (
        <Alert severity="info" title="Aucun email dans la whitelist." />
      ) : (
        <Table
          caption={`${data?.total ?? 0} email${(data?.total ?? 0) !== 1 ? "s" : ""} autorisé${(data?.total ?? 0) !== 1 ? "s" : ""}`}
          headers={["Email", ""]}
          data={tableData}
          noCaption={false}
        />
      )}

      {totalPages > 1 && (
        <Center>
          <Pagination
            key={page}
            count={totalPages}
            defaultPage={page}
            getPageLinkProps={(nb) => ({
              onClick: (e) => {
                e.preventDefault();
                setPage(nb);
              },
              href: "#",
              key: `page-${nb}`,
            })}
          />
        </Center>
      )}
    </Stack>
  );
};

// ---------------------------------------------------------------------------
// Users panel
// ---------------------------------------------------------------------------

const UsersPanel = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useDebounce(
    () => {
      setSearch(searchInput);
      setPage(1);
    },
    300,
    [searchInput],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: adminKeys.users(page, search),
    queryFn: () => api.get("/api/admin/users", { query: { page, limit: PAGE_SIZE, search: search || undefined } }),
  });

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  const tableData =
    data?.users.map((u) => [
      u.name,
      u.email,
      u.job ?? "—",
      u.serviceName ?? u.serviceId,
      u.serviceDepartment ?? "—",
      u.role ?? "—",
    ]) ?? [];

  return (
    <Stack gap="1.5rem" pt="1.5rem">
      <Input
        label="Rechercher"
        nativeInputProps={{
          placeholder: "Nom, email, service...",
          value: searchInput,
          onChange: (e) => setSearchInput(e.target.value),
        }}
        style={{ maxWidth: "400px" }}
      />

      {error && <Alert severity="error" title={getErrorMessage(error)} />}

      {isLoading ? (
        <Center py="3rem">
          <Spinner />
        </Center>
      ) : tableData.length === 0 ? (
        <Alert severity="info" title="Aucun utilisateur trouvé." />
      ) : (
        <Table
          caption={`${data?.total ?? 0} utilisateur${(data?.total ?? 0) !== 1 ? "s" : ""}`}
          headers={["Nom", "Email", "Fonction", "Service", "Département", "Rôle"]}
          data={tableData}
          noCaption={false}
        />
      )}

      {totalPages > 1 && (
        <Center>
          <Pagination
            key={`${page}-${search}`}
            count={totalPages}
            defaultPage={page}
            getPageLinkProps={(nb) => ({
              onClick: (e) => {
                e.preventDefault();
                setPage(nb);
              },
              href: "#",
              key: `page-${nb}`,
            })}
          />
        </Center>
      )}
    </Stack>
  );
};

// ---------------------------------------------------------------------------
// Admin page
// ---------------------------------------------------------------------------

const AdminPage = () => {
  const navigate = useNavigate();
  const meQuery = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => api.get("/api/admin/me"),
    retry: false,
  });

  if (meQuery.isLoading) {
    return (
      <Center height="50vh">
        <Spinner />
      </Center>
    );
  }

  if (meQuery.isError) {
    const status = (meQuery.error as any)?.response?.status;
    const message =
      status === 403 ? "Vous n'avez pas les droits pour accéder à cette page." : getErrorMessage(meQuery.error);

    return (
      <Center flexDirection="column" gap="1.5rem" height="50vh">
        <Alert severity="error" title={message} />
        <Button
          iconId="ri-arrow-left-line"
          iconPosition="left"
          onClick={() => navigate({ to: "/", search: { document: "constats" } })}
        >
          Retour à l'accueil
        </Button>
      </Center>
    );
  }

  return (
    <Stack maxWidth="960px" mx="auto" px="1.5rem" py="2rem" gap="1.5rem">
      <Typography variant="h4" component="h1">
        Administration
      </Typography>

      <Tabs
        options={[
          {
            id: "whitelist",
            label: "Whitelist",
            props: {},
            component: <WhitelistPanel />,
          },
          {
            id: "users",
            label: "Utilisateurs",
            props: {},
            component: <UsersPanel />,
          },
        ]}
      />
    </Stack>
  );
};

export const Route = createLazyFileRoute("/admin")({
  component: () => <AdminPage />,
});
