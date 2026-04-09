import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
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

const formatAverage = (value: number, total: number): string => {
  if (total === 0) return "—";
  return (value / total).toFixed(1);
};

// ---------------------------------------------------------------------------
// KPI card
// ---------------------------------------------------------------------------

const KpiCard = ({ label, value }: { label: ReactNode; value: string | number }) => (
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
        deployedUdapCount: number;
        deployedCrmhCount: number;
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
        totalConstats: number;
        totalUsers: number;
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
  const totalDocuments = (data?.totalConstats ?? 0) + (data?.totalReports ?? 0);
  const deployedUdapCount = data?.deployedUdapCount ?? 0;
  const deployedCrmhCount = data?.deployedCrmhCount ?? 0;
  console.log(adminQuery.data?.totalUsers);
  const usersShare = adminQuery.isSuccess ? formatPercent(adminQuery.data.totalUsers, 1102) : null;
  const abandonmentRate = adminQuery.isSuccess
    ? formatPercent(adminQuery.data.abandonedConstats, adminQuery.data.totalConstats)
    : null;

  return (
    <Stack maxWidth="960px" mx="auto" px="1.5rem" py="2rem" gap="2rem">
      <Typography variant="h1" component="h1">
        Statistiques
      </Typography>

      {/* ------------------------------------------------------------------ */}
      {/* Public stats                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Stack gap="1.5rem">
        <Typography variant="h2" component="h2">
          🏰 Patrinotes : le suivi en chiffres
        </Typography>

        <Typography>
          Patrinotes permet d'établir <b>rapidement</b> des documents <b>en mobilité</b> qui facilitent la bonne{" "}
          <b>compréhension de l'expertise</b> et permet la fiabilité et la ré-utilisation des informations, sans
          ressaisie.
        </Typography>

        <Typography>
          Il permet actuellement :
          <ul>
            <li style={{ fontWeight: "bold", marginTop: "16px" }}>
              La réalisation de constats d’état sur des immeubles monuments historiques
            </li>
            Le suivi de près de 46 000 immeubles classés et inscrits est opéré par les agents en charge du contrôle
            scientifique et technique des DRAC (CRMH et UDAP), dans le cadre de la “veille sanitaire”. Celle-ci repose
            principalement sur la saisie de constats d’état. Relativement peu de constats d’état étaient réalisés (Moins
            de 2% des monuments historiques ont fait l’objet d’une fiche de visite ou d’un état sanitaire dans AgrÉgée
            en 2024 avec 181 états sanitaires sur un objectif de 8 000/an), car, sans outil adapté, cette tâche est
            difficile et chronophage. L’objectif est d’augmenter la réalisation de constats d’état par un outil
            numérique en mobilité.
            <li style={{ fontWeight: "bold", marginTop: "16px" }}>La réalisation de compte-rendus sur site</li>
            L’outil permet de rendre compte des dires de l’état aux demandeurs rencontrés pour une demande
            d’autorisation de travaux. Ce n’est pas une pratique obligatoire réglementaire mais cela permet d’éviter les
            quiproquos et le rallongement du traitement des dossiers des demandeurs. Notre objectif est donc l’adoption
            de cette pratique par les agents pour réduire les délais de traitement et le mécontentement potentiel des
            demandeurs.
          </ul>
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
              <KpiCard label="Nombre de constats créés en 2026" value={data.totalConstats} />
              <KpiCard label="Nombre de compte-rendus crées en 2026" value={data.totalReports} />
              <KpiCard label="Nombre d’utilisateurs actifs" value={usersWithDocs} />
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
                <KpiCard label="Taux d'adoption" value={formatPercent(usersWithDocs, totalUsers)} />
              </Box>
            </Stack>

            <Typography variant="h2" component="h2">
              L'utilisation de Patrinotes
            </Typography>

            <Typography>
              L'objectif est de comprendre si l'outil est utilisé régulièrement. Vous pouvez utiliser la sélection de
              dates pour comparer des périodes variées.
            </Typography>

            {/* Retention */}
            <Stack gap="0.5rem">
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
                  label={
                    <Box>
                      Utilisateurs ayant envoyé un document <br />
                      <Typography fontWeight="bold">
                        Soit {formatPercent(activeUsers, totalUsers)} d'utilisateurs actifs
                      </Typography>
                    </Box>
                  }
                  value={`${activeUsers}`}
                />
                <KpiCard
                  label="Nombre de documents réalisés par utilisateur"
                  value={formatAverage(totalDocuments, activeUsers)}
                />
                {abandonmentRate !== null && <KpiCard label="Taux d'abandon" value={abandonmentRate} />}
              </Box>
            </Stack>
            <Typography variant="h2" component="h2">
              Le déploiement de Patrinotes
            </Typography>

            <Typography>
              L’objectif est d’être déployé sur tout le territoire d'ici le courant de l'année 2027.
            </Typography>

            <Box display="flex" flexWrap="wrap" gap="1rem">
              <KpiCard label="Nombre de départements déployés en UDAP" value={deployedUdapCount} />
              <KpiCard label="Nombre de départements déployés en CRMH" value={deployedCrmhCount} />
              {usersShare !== null && (
                <KpiCard label="Part d'utilisateurs sur l'ensemble des agents (1102)" value={usersShare} />
              )}
            </Box>
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
              caption="Taux d'adoption par service"
              noCaption={false}
              headers={["Service", "Constats envoyés"]}
              data={adminQuery.data.constatsByService.map((s) => [s.serviceName ?? s.serviceId, s.sentConstats])}
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
