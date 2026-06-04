import "../../dsfr-chart/DSFRChart.css";
import "../../dsfr-chart/DSFRChart.js";

import { api } from "../api";
import { useQuery } from "@tanstack/react-query";
import { Center } from "./MUIDsfr";
import { Spinner } from "./Spinner";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import { useState } from "react";
import { Flex } from "./ui/Flex";
import Tag from "@codegouvfr/react-dsfr/Tag";

const generateMockData = () => {
  const data = [];
  const now = new Date();
  for (let i = 12; i > 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    data.push({
      month: date.toLocaleString("default", { month: "short" }),
      year: date.getFullYear(),
      count: Math.floor(Math.random() * 100),
    });
  }
  return data;
};

const mockData = generateMockData();

export const AccountsCharts = ({ range }: { range: { from: string; to: string } }) => {
  const query = useQuery({
    queryKey: ["stats", range],
    queryFn: async () => {
      const resp = await api.get("/api/stats/accounts", {
        query: { from: range.from, to: range.to },
      });
      return resp;
    },
  });

  if (query.isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  if (!query.data) return null;

  const x = query.data.map(({ month, year }) => `${month}-${year}`);
  const y = query.data.map(({ count }) => count);

  return (
    <figure aria-label="Nombre de comptes créés par mois" role="figure">
      <line-chart name='["Nombre de comptes créés"]' x={JSON.stringify([x])} y={JSON.stringify([y])}></line-chart>
      <figcaption className="fr-sr-only">
        <table>
          <thead>
            <tr>
              <th>Mois</th>
              <th>Comptes créés</th>
            </tr>
          </thead>
          <tbody>
            {query.data.map(({ month, year, count }) => (
              <tr key={`${month}-${year}`}>
                <td>
                  {month} {year}
                </td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
};

export const JobsChart = () => {
  const query = useQuery({
    queryKey: ["stats", "jobs"],
    queryFn: () => api.get("/api/stats/jobs"),
    retry: false,
  });

  if (query.isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  if (!query.data) return null;

  const labels = query.data.map((r) => r.job ?? "Non renseigné");
  const values = query.data.map((r) => r.count);

  return (
    <figure aria-label="Répartition des utilisateurs par métier" role="figure">
      <pie-chart
        x={JSON.stringify([labels])}
        y={JSON.stringify([values])}
        name={JSON.stringify(labels)}
        selected-palette="categorical"
        unit-tooltip="utilisateurs"
      ></pie-chart>
      <figcaption className="fr-sr-only">
        <table>
          <thead>
            <tr>
              <th>Métier</th>
              <th>Nombre d'utilisateurs</th>
            </tr>
          </thead>
          <tbody>
            {query.data.map(({ job, count }) => (
              <tr key={job ?? "null"}>
                <td>{job ?? "Non renseigné"}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
};

type UdapMetric = "totalStateReports" | "sentStateReports" | "totalReports" | "sentReports" | "usersCount";

const UDAP_METRICS: { key: UdapMetric; label: string; color: string }[] = [
  { key: "totalStateReports", label: "CE créés", color: "#EFB900" },
  { key: "sentStateReports", label: "CE envoyés", color: "#298641" },
  { key: "totalReports", label: "CR créés", color: "#c39300" },
  { key: "sentReports", label: "CR envoyés", color: "#00611f" },
  { key: "usersCount", label: "Utilisateurs", color: "#0063CB" },
];

export const UdapMapChart = () => {
  const [activeMetric, setActiveMetric] = useState<UdapMetric>("totalStateReports");

  const query = useQuery({
    queryKey: ["stats", "udap"],
    queryFn: async () => {
      return api.get("/api/stats/udap");
    },
    retry: false,
  });

  if (query.isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  if (!query.data) return null;

  const data = {
    ...departements.reduce((acc, dep) => ({ ...acc, [dep]: 0 }), {} as Record<string, number>),
    ...Object.fromEntries(query.data.map((row) => [row.department, row[activeMetric]])),
  };
  const metricMeta = UDAP_METRICS.find((m) => m.key === activeMetric)!;

  return (
    <Stack gap="16px">
      <Flex gap="8px" flexWrap="wrap">
        {UDAP_METRICS.map((m) => (
          <Tag
            key={m.key}
            pressed={activeMetric === m.key}
            aria-pressed={activeMetric === m.key}
            nativeButtonProps={{
              type: "button",
              onClick: () => setActiveMetric(m.key),
            }}
          >
            {m.label}
          </Tag>
        ))}
      </Flex>
      <Box sx={{}}>
        <map-chart
          data={JSON.stringify(data)}
          name={metricMeta.label + " par département"}
          level="dep"
          selected-palette="sequentialAscending"
        ></map-chart>
      </Box>
    </Stack>
  );
};

type CRMHMetric = "totalStateReports" | "sentStateReports" | "totalReports" | "sentReports" | "usersCount";

const CRMH_METRICS: { key: CRMHMetric; label: string; color: string }[] = [
  { key: "totalStateReports", label: "CE créés", color: "#EFB900" },
  { key: "sentStateReports", label: "CE envoyés", color: "#298641" },
  { key: "totalReports", label: "CR créés", color: "#c39300" },
  { key: "sentReports", label: "CR envoyés", color: "#00611f" },
  { key: "usersCount", label: "Utilisateurs", color: "#0063CB" },
];

export const CRMHMapChart = () => {
  const [activeMetric, setActiveMetric] = useState<CRMHMetric>("totalStateReports");

  const query = useQuery({
    queryKey: ["stats", "crmh"],
    queryFn: async () => {
      return api.get("/api/stats/crmh");
    },
    retry: false,
  });

  if (query.isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  if (!query.data) return null;

  const data = {
    ...regions.reduce((acc, region) => ({ ...acc, [region]: 0 }), {}),
    ...Object.fromEntries(query.data.map((row) => [row.region, row[activeMetric]])),
  };
  const metricMeta = CRMH_METRICS.find((m) => m.key === activeMetric)!;

  return (
    <Stack gap="16px">
      <Flex gap="8px" flexWrap="wrap">
        {CRMH_METRICS.map((m) => (
          <Tag
            key={m.key}
            pressed={activeMetric === m.key}
            aria-pressed={activeMetric === m.key}
            nativeButtonProps={{
              type: "button",
              onClick: () => setActiveMetric(m.key),
            }}
          >
            {m.label}
          </Tag>
        ))}
      </Flex>
      <Box sx={{}}>
        <map-chart
          data={JSON.stringify(data)}
          name={metricMeta.label + " par région"}
          level="reg"
          selected-palette="sequentialAscending"
        ></map-chart>
      </Box>
    </Stack>
  );
};

export const DocumentsCharts = ({ range }: { range: { from: string; to: string } }) => {
  const [documentsFilter, setDocumentsFilter] = useState<("Compte-rendus" | "Constats")[]>([
    "Compte-rendus",
    "Constats",
  ]);
  const toggleDocumentFilter = (type: "Compte-rendus" | "Constats") => {
    setDocumentsFilter((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };
  const query = useQuery({
    queryKey: ["stats", "documents", range],
    queryFn: async () => {
      const resp = await api.get("/api/stats/documents", {
        query: { from: range.from, to: range.to },
      });
      return resp;
    },
  });

  if (query.isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  if (!query.data) return null;

  const x = query.data.map(({ month, year }) => `${month}/${year}`);

  const columns = [] as number[][];
  if (documentsFilter.includes("Compte-rendus")) {
    columns.push(query.data.map((r) => r.totalReports));
    columns.push(query.data.map((r) => r.sentReports));
  }

  if (documentsFilter.includes("Constats")) {
    columns.push(query.data.map((r) => r.totalStateReports));
    columns.push(query.data.map((r) => r.sentStateReports));
  }

  const y = columns;

  return (
    <Stack>
      <Flex alignItems="center" gap="8px" mb="16px">
        {["Constats", "Compte-rendus"].map((type) => (
          <Tag
            key={type}
            pressed={documentsFilter.includes(type as any)}
            aria-pressed={documentsFilter.includes(type as any)}
            nativeButtonProps={{
              type: "button",
              onClick: () => toggleDocumentFilter(type as any),
            }}
          >
            {type}
          </Tag>
        ))}
      </Flex>
      <Box
        component="figure"
        aria-label="Documents créés et envoyés par mois"
        role="figure"
        sx={{
          ".tooltip_place": {
            mt: ".25rem",
          },
        }}
      >
        <bar-chart
          x={JSON.stringify([x])}
          y={JSON.stringify(y)}
          name='["CR créés", "CR envoyés", "CE créés", "CE envoyés"]'
          stacked="true"
          selected-palette="divergentAscending"
          unit-tooltip={JSON.stringify(["CR créés", "CR envoyés", "CE créés", "CE envoyés"])}
          colors={JSON.stringify(["#c39300", "#00611f", "#EFB900", "#298641"])}
        ></bar-chart>
        <figcaption className="fr-sr-only">
          <table>
            <thead>
              <tr>
                <th>Mois</th>
                <th>CR créés</th>
                <th>CR envoyés</th>
                <th>Constats créés</th>
                <th>Constats envoyés</th>
              </tr>
            </thead>
            <tbody>
              {query.data.map(({ month, year, totalReports, sentReports, totalStateReports, sentStateReports }) => (
                <tr key={`${month}-${year}`}>
                  <td>
                    {month} {year}
                  </td>
                  <td>{totalReports}</td>
                  <td>{sentReports}</td>
                  <td>{totalStateReports}</td>
                  <td>{sentStateReports}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </figcaption>
      </Box>
    </Stack>
  );
};

const departements = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "2A",
  "2B",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
  "60",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "67",
  "68",
  "69",
  "70",
  "71",
  "72",
  "73",
  "74",
  "75",
  "76",
  "77",
  "78",
  "79",
  "80",
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "971",
  "972",
  "973",
  "974",
  "976",
];

const regions = [
  "IDF",
  "CVL",
  "BFC",
  "NOR",
  "HDF",
  "GES",
  "PDL",
  "BRE",
  "NAQ",
  "OCC",
  "ARA",
  "PAC",
  "20R",
  "971",
  "972",
  "973",
  "974",
  "976",
];
