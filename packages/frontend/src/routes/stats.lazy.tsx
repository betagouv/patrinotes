import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Stack, Typography, Box } from "@mui/material";
import { Alert, Input, Table } from "#components/MUIDsfr.tsx";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { ofetch } from "ofetch";
import { ENV } from "../envVars";
import { getTokenOrRefresh } from "../db/Connector";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const subMonths = (date: Date, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
};

const formatPercent = (value: number, total: number): string => {
  if (total === 0) return "—";
  return `${Math.round((value / total) * 100)} %`;
};

// ---------------------------------------------------------------------------
// KPI card
// ---------------------------------------------------------------------------

const KpiCard = ({ label, value }: { label: string; value: string | number }) => (
  <Box
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 1,
      p: "1.5rem",
      flex: "1 1 200px",
      minWidth: 0,
    }}
  >
    <Typography variant="h4" component="p" mb="0.25rem">
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

// ---------------------------------------------------------------------------
// Stats page
// ---------------------------------------------------------------------------

const StatsPage = () => {
  const now = new Date();
  const [from, setFrom] = useState(() => subMonths(now, 3).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => now.toISOString().slice(0, 10));

  const publicQuery = useQuery({
    queryKey: ["stats", "public", from, to],
    queryFn: () =>
      ofetch<{
        totalConstats: number;
        totalReports: number;
        totalUsers: number;
        usersWithNoDocuments: number;
        activeUsersInPeriod: number;
        periodFrom: string;
        periodTo: string;
      }>(`${ENV.VITE_BACKEND_URL}/api/stats/public`, {
        query: { from, to },
      }),
  });

  const adminQuery = useQuery({
    queryKey: ["stats", "admin"],
    queryFn: async () => {
      const token = await getTokenOrRefresh();
      if (!token) throw new Error("No token");
      return ofetch<{
        constatsByService: Array<{ serviceId: string; serviceName: string | null; sentConstats: number }>;
        abandonedConstats: number;
      }>(`${ENV.VITE_BACKEND_URL}/api/stats/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    retry: false,
  });

  const data = publicQuery.data;
  const totalUsers = data?.totalUsers ?? 0;
  const activeUsers = data?.activeUsersInPeriod ?? 0;
  const usersWithDocs = totalUsers - (data?.usersWithNoDocuments ?? 0);

  return (
    <Stack maxWidth="960px" mx="auto" px="1.5rem" py="2rem" gap="2rem">
      <Typography variant="h4" component="h1">
        Statistiques
      </Typography>

      {/* ------------------------------------------------------------------ */}
      {/* Public stats                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Stack gap="1.5rem">
        <Typography variant="h5" component="h2">
          Statistiques globales
        </Typography>

        {publicQuery.isLoading ? (
          <Center py="3rem">
            <Spinner />
          </Center>
        ) : publicQuery.isError ? (
          <Alert severity="error" title="Impossible de charger les statistiques." />
        ) : data ? (
          <>
            {/* Totals row */}
            <Box display="flex" flexWrap="wrap" gap="1rem">
              <KpiCard label="Constats d'état créés" value={data.totalConstats} />
              <KpiCard label="Comptes rendus créés" value={data.totalReports} />
              <KpiCard label="Utilisateurs inscrits" value={data.totalUsers} />
            </Box>

            {/* Adoption */}
            <Stack gap="0.5rem">
              <Typography variant="h6" component="h3">
                Taux d'adoption
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Utilisateurs ayant créé au moins un document (brouillon ou envoyé)
              </Typography>
              <Box display="flex" flexWrap="wrap" gap="1rem">
                <KpiCard
                  label="Utilisateurs actifs"
                  value={`${usersWithDocs} / ${totalUsers}`}
                />
                <KpiCard
                  label="Taux d'adoption"
                  value={formatPercent(usersWithDocs, totalUsers)}
                />
              </Box>
            </Stack>

            {/* Retention */}
            <Stack gap="0.5rem">
              <Typography variant="h6" component="h3">
                Taux de rétention à 3 mois
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Utilisateurs ayant envoyé au moins un document sur la période sélectionnée
              </Typography>
              <Box display="flex" flexWrap="wrap" gap="1rem" alignItems="flex-end">
                <Input
                  label="Du"
                  style={{ marginBottom: 0 }}
                  nativeInputProps={{
                    type: "date",
                    value: from,
                    max: to,
                    onChange: (e) => setFrom(e.target.value),
                  }}
                />
                <Input
                  label="Au"
                  style={{ marginBottom: 0 }}
                  nativeInputProps={{
                    type: "date",
                    value: to,
                    min: from,
                    onChange: (e) => setTo(e.target.value),
                  }}
                />
              </Box>
              <Box display="flex" flexWrap="wrap" gap="1rem">
                <KpiCard
                  label="Utilisateurs ayant envoyé un document"
                  value={`${activeUsers} / ${totalUsers}`}
                />
                <KpiCard
                  label="Taux de rétention"
                  value={formatPercent(activeUsers, totalUsers)}
                />
              </Box>
            </Stack>
          </>
        ) : null}
      </Stack>

      {/* ------------------------------------------------------------------ */}
      {/* Admin stats (only visible when admin request succeeds)              */}
      {/* ------------------------------------------------------------------ */}
      {adminQuery.isSuccess && adminQuery.data && (
        <Stack gap="1.5rem">
          <Typography variant="h5" component="h2">
            Statistiques par service (admin)
          </Typography>

          {/* Abandoned constats */}
          <Box display="flex" flexWrap="wrap" gap="1rem">
            <KpiCard
              label="Constats abandonnés (brouillon depuis + de 3 semaines)"
              value={adminQuery.data.abandonedConstats}
            />
          </Box>

          {/* Constats sent per service */}
          {adminQuery.data.constatsByService.length === 0 ? (
            <Alert severity="info" title="Aucune donnée par service." />
          ) : (
            <Table
              id="constats-by-service-table"
              caption="Taux d'adoption par service — constats d'état envoyés"
              noCaption={false}
              headers={["Service", "Constats envoyés"]}
              data={adminQuery.data.constatsByService.map((s) => [
                s.serviceName ?? s.serviceId,
                s.sentConstats,
              ])}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};

export const Route = createLazyFileRoute("/stats")({
  component: StatsPage,
});
