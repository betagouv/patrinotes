import { Chip, ControlledChip } from "#components/Chip";
import { EnsureUser } from "#components/EnsureUser";
import { Button, Center, Input, Summary } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner";
import { Divider } from "#components/ui/Divider.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { Box, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { endOfYear, startOfYear } from "date-fns";
import { omit, pick } from "pastable";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useLiveService, useRefreshUser, useService, useUser } from "../contexts/AuthContext";
import { ServiceInstructeurs, Service, Clause_v2 } from "../db/AppSchema";
import { db, useDbQuery } from "../db/db";
import { AccordionIfMobile, BreadcrumbNav, GoHomeButton } from "./account";
import { useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import { scrollToTop } from "../features/state-report/StateReportSummary";
import { useActiveSection } from "../hooks/useActiveSection";

const serviceSections = [
  { linkProps: { href: "#service-informations" }, text: "Informations service" },
  { linkProps: { href: "#services-instructeurs" }, text: "Services instructeurs pour les CR" },
  { linkProps: { href: "#clauses-departementales" }, text: "Clauses départementales pour les CR" },
  { linkProps: { href: "#alertes-mh" }, text: "Alertes visites Monuments Historiques" },
  { linkProps: { href: "#rapport-activite" }, text: "Rapport d'activité" },
];

const sectionIds = serviceSections.map((section) => section.linkProps.href.replace("#", ""));

const ServicePage = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const onSuccess = () => {
    setIsSuccess(true);
    scrollToTop();
  };

  const activeSection = useActiveSection(sectionIds);
  console.log("activeSection", activeSection);
  return (
    <Flex
      gap={{ xs: "0", lg: "40px" }}
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent={"center"}
      alignItems={{ lg: "flex-start", xs: "center" }}
      width="100%"
      mb="40px"
    >
      <Stack width={{ xs: "100%", lg: "auto" }} position={{ xs: undefined, lg: "sticky" }} top={{ lg: "0" }}>
        <Box mt="32px" mb={{ xs: "16px", lg: "32px" }} px={{ xs: "16px", lg: "0" }}>
          <GoHomeButton />
        </Box>
        <Typography variant="h1" display={{ lg: "none" }} mt="16px" mb="32px" px={{ xs: "16px" }}>
          Service
        </Typography>
        <AccordionIfMobile>
          <Summary
            sx={{
              ".fr-summary__link": {
                color: fr.colors.decisions.text.actionHigh.blueFrance.default,
              },
              [`.fr-summary__link[href='#${activeSection}']`]: {
                textDecoration: "underline",
              },
            }}
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              backgroundColor: "transparent",
            }}
            links={serviceSections}
          />
        </AccordionIfMobile>
      </Stack>
      <Divider display={{ lg: "none" }} width="90%" ml="5%" color="background-action-low-blue-france-hover" />
      <Stack
        flexDirection="column"
        alignItems="flex-start"
        maxWidth="900px"
        width={{ lg: "100%", xs: "100%" }}
        mt="32px"
        px={{ xs: "16px", lg: "0" }}
        textAlign="left"
      >
        <Typography alignSelf="start" variant="h1" display={{ xs: "none", lg: "block" }} mt="16px" mb="32px">
          Service
        </Typography>
        {isSuccess ? <SuccessAlert /> : null}
        <ServiceForm onSuccess={onSuccess} />
        <Divider my={{ xs: "48px", lg: "48px" }} color="background-action-low-blue-france-hover" />
        <ServicesList />
        <Divider my={{ xs: "48px", lg: "48px" }} color="background-action-low-blue-france-hover" />
        <Clauses />
        <Divider my={{ xs: "48px", lg: "48px" }} color="background-action-low-blue-france-hover" />
        <AlertesMH />
        <Divider my={{ xs: "48px", lg: "48px" }} color="background-action-low-blue-france-hover" />
        <Activity />
      </Stack>
    </Flex>
  );
};

const replaceCarriageReturn = (text: string) => {
  return text.replaceAll("\n", " ");
};

const format = {
  marianne_text: (text: string) => {
    const [firstLine, ...rest] = text.split(" ");
    const threeWords = rest.slice(0, 3).join(" ");
    const restText = rest.slice(3).join(" ");

    return `${firstLine}\n${threeWords}\n${restText}`;
  },
  drac_text: (text: string) => {
    const splitted = text.split(" ");
    const fourWords = splitted.slice(0, 4).join(" ");
    const restText = splitted.slice(4).join(" ");
    return `${fourWords}\n${restText}`;
  },
  service_text: (text: string) => {
    const splitted = text.split(" ");
    const threeWords = splitted.slice(0, 3).join(" ");
    const restText = splitted.slice(3).join(" ");
    return `${threeWords}\n${restText}`;
  },
};

const ServiceForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const service = useUser()!.service;
  const [serviceData, setServiceData] = useState({
    ...service,
    marianne_text: replaceCarriageReturn(service.marianne_text ?? ""),
    drac_text: replaceCarriageReturn(service.drac_text ?? ""),
    service_text: replaceCarriageReturn(service.service_text ?? ""),
  });

  const refreshServiceMutation = useRefreshUser();

  const saveServiceMutation = useMutation({
    mutationFn: async (serviceData: Partial<Service>) => {
      const value = {
        ...omit(serviceData, ["id"]),
        marianne_text: format.marianne_text(serviceData.marianne_text ?? ""),
        drac_text: format.drac_text(serviceData.drac_text ?? ""),
        service_text: format.service_text(serviceData.service_text ?? ""),
      };

      await db.updateTable("service").set(value).where("id", "=", service.id).execute();
      await refreshServiceMutation.mutateAsync();
      onSuccess?.();
    },
  });

  return (
    <Flex gap="0px" flexDirection="column" width="100%" maxWidth="690px">
      <Title anchor="service-informations">1. Informations du service</Title>
      <Input
        sx={{ width: "100%", mt: "16px" }}
        label="Intitulé du préfet (bloc Marianne)"
        hintText="Ex : Préfet de la région Nouvelle-Aquitaine"
        nativeInputProps={{
          value: serviceData.marianne_text ?? "",
          onChange: (e) => setServiceData({ ...serviceData, marianne_text: e.target.value }),
        }}
      />
      <Input
        sx={{ width: "100%" }}
        label="Intitulé DRAC"
        hintText="Ex : Direction régionale des affaires culturelles de Nouvelle-Aquitaine"
        nativeInputProps={{
          value: serviceData.drac_text ?? "",
          onChange: (e) => setServiceData({ ...serviceData, drac_text: e.target.value }),
        }}
      />
      <Input
        sx={{ width: "100%" }}
        label="Intitulé service"
        hintText="Ex : Unité départementale de l'architecture et du patrimoine des Deux-Sèvres"
        nativeInputProps={{
          value: serviceData.service_text ?? "",
          onChange: (e) => setServiceData({ ...serviceData, service_text: e.target.value }),
        }}
      />

      <Flex gap={{ xs: 0, lg: "24px" }} flexDirection={{ xs: "column", lg: "row" }} width="100%">
        <Input
          sx={{ width: "100%" }}
          label="Téléphone"
          nativeInputProps={{
            value: serviceData.phone ?? "",
            onChange: (e) => setServiceData({ ...serviceData, phone: e.target.value }),
          }}
        />
        <Input
          sx={{ width: "100%" }}
          label="Courriel"
          nativeInputProps={{
            value: serviceData.email ?? "",
            onChange: (e) => setServiceData({ ...serviceData, email: e.target.value }),
          }}
        />
      </Flex>

      {/* TODO: set this */}
      {/* <Input className={css({ w: "100%" })} label="Lien où déposer l'avant projet" hintText="Figurera dans le CR" /> */}

      <Flex gap="16px" justifyContent="flex-end" width="100%" mt="24px">
        <Button
          iconId="ri-save-3-line"
          iconPosition="left"
          type="button"
          onClick={() => {
            saveServiceMutation.mutate(serviceData);
          }}
        >
          Enregistrer
        </Button>
      </Flex>
    </Flex>
  );
};

const ServicesList = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Partial<ServiceInstructeurs> | null>(null);
  const service = useUser()!.service;

  return (
    <Flex gap="16px" flexDirection="column" width="100%" maxWidth="690px">
      <Title anchor="services-instructeurs">2. Services instructeurs de comptes-rendus</Title>
      <Flex gap="16px" alignItems="center">
        <div>
          <Button
            priority="secondary"
            iconId="ri-add-line"
            iconPosition="left"
            type="button"
            onClick={() => {
              setSelected({ full_name: "", short_name: "", tel: "", email: "", service_id: service.id });
            }}
          >
            Ajouter
          </Button>
        </div>
        <Input
          sx={{ mb: "8px" }}
          nativeInputProps={{ placeholder: "Rechercher", value: search, onChange: (e) => setSearch(e.target.value) }}
          iconId="ri-search-line"
          label={null}
        />
      </Flex>
      <ServicePicker search={search} selected={selected} setSelected={setSelected} />
      <ServiceInstructeurForm selected={selected} setSelected={setSelected} />
    </Flex>
  );
};

const ServicePicker = ({
  search,
  selected,
  setSelected,
}: {
  search: string;
  selected: Partial<ServiceInstructeurs> | null;
  setSelected: (item: Partial<ServiceInstructeurs> | null) => void;
}) => {
  const services = useDbQuery(db.selectFrom("service_instructeurs").selectAll());

  if (services.isLoading) return <Spinner />;

  const rawItems = services.data ?? [];
  const items = rawItems.filter((item) => item.short_name?.toLowerCase().includes(search.toLowerCase()));

  const byFirstLetter = items.reduce(
    (acc, item) => {
      const name = item.short_name?.startsWith("CC ") ? item.short_name.slice(3) : item.short_name;

      const firstLetter = name?.charAt(0).toUpperCase() ?? "";
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(item);
      return acc;
    },
    {} as Record<string, ServiceInstructeurs[]>,
  );

  return (
    <Flex gap="24px" flexDirection="column" width="100%" maxWidth="690px">
      {Object.entries(byFirstLetter)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, items]) => (
          <Flex key={letter} gap="8px">
            <Box width="34px" minWidth="34px" mt="2px" color="text-action-high-blue-france" fontSize="24px">
              {letter}
            </Box>
            <Flex gap="8px" flexWrap="wrap">
              {items.map((item) => (
                <Chip
                  style={{
                    whiteSpace: "nowrap",
                  }}
                  key={item.id}
                  onCheckChange={() => setSelected(selected === item ? null : item)}
                  isChecked={selected?.id === item.id}
                >
                  {item.short_name}
                </Chip>
              ))}
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
};

export const useScrollToRef = () => {
  const scrollToRef = (element: any) => {
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  return scrollToRef;
};

const ServiceInstructeurForm = ({
  selected,
  setSelected,
}: {
  selected: Partial<ServiceInstructeurs> | null;
  setSelected: (item: Partial<ServiceInstructeurs> | null) => void;
}) => {
  const scrollToRef = useScrollToRef();
  if (!selected) return null;
  const isNew = !selected.id;

  const createOrEditServiceMutation = useMutation({
    mutationFn: async (service: Partial<ServiceInstructeurs>) => {
      if (!service.service_id) throw new Error("service_id is required");
      if (!service.short_name) throw new Error("short_name is required");

      if (service.id) {
        await db.updateTable("service_instructeurs").set(service).where("id", "=", service.id).execute();
      } else {
        await db
          .insertInto("service_instructeurs")
          .values({ ...service, id: v4() })
          .execute();
      }

      setSelected(null);
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (service: Partial<ServiceInstructeurs>) => {
      if (!service.id) throw new Error("id is required");
      await db.deleteFrom("service_instructeurs").where("id", "=", service.id).execute();
      setSelected(null);
    },
  });

  return (
    <Flex ref={scrollToRef} gap="16px" flexDirection="column" width="100%" maxWidth="690px">
      <Input
        sx={{ width: "100%" }}
        label="Intitulé service instructeur"
        nativeInputProps={{
          value: selected.full_name ?? "",
          onChange: (e) => setSelected({ ...selected, full_name: e.target.value }),
        }}
      />

      <Flex gap="24px" width="100%">
        <Input
          sx={{ width: "100%" }}
          label="Abréviation"
          nativeInputProps={{
            value: selected.short_name ?? "",
            onChange: (e) => setSelected({ ...selected, short_name: e.target.value }),
          }}
        />
        <Input
          sx={{ width: "100%" }}
          label="Téléphone"
          nativeInputProps={{
            value: selected.tel ?? "",
            onChange: (e) => setSelected({ ...selected, tel: e.target.value }),
          }}
        />
      </Flex>
      <Input
        sx={{ w: "100%" }}
        label="Courriel"
        nativeInputProps={{
          value: selected.email ?? "",
          onChange: (e) => setSelected({ ...selected, email: e.target.value }),
        }}
      />

      <Flex gap="16px" justifyContent="flex-end" width="100%">
        {!isNew ? (
          <Button
            sx={{
              color: "background-flat-error",
              boxShadow: "inset 0 0 0 1px var(--colors-background-flat-error)",
            }}
            priority="secondary"
            type="button"
            onClick={() => deleteServiceMutation.mutate(selected)}
          >
            Supprimer
          </Button>
        ) : null}
        <Button
          iconId="ri-save-3-line"
          iconPosition="left"
          type="button"
          onClick={() => {
            createOrEditServiceMutation.mutate(selected);
          }}
        >
          Enregistrer
        </Button>
      </Flex>
    </Flex>
  );
};

const Clauses = () => {
  return (
    <Flex gap="16px" flexDirection="column" width="100%" maxWidth="690px">
      <Title anchor="clauses-departementales">3. Clauses départementales pour les comptes-rendus</Title>
      <div>Pensez à faire des contenus courts et explicites pour vos lecteurs.</div>

      <SingleClause clauseKey="contacts-utiles" title="Contacts utiles" />
      <Divider
        width={{ xs: "100%", lg: "calc(100% - 104px)" }}
        my={{ xs: "20px", lg: "40px" }}
        ml={{ xs: "0", lg: "102px" }}
        color="background-action-low-blue-france-hover"
      />
      <SingleClause clauseKey="bonnes-pratiques" title="Bonnes pratiques" />
    </Flex>
  );
};

const SingleClause = ({ clauseKey, title }: { clauseKey: string; title: string }) => {
  const [selected, setSelected] = useState<Partial<Clause_v2> | null>(null);
  const service = useUser()!.service;

  const clausesQuery = useDbQuery(
    db.selectFrom("clause_v2").where("key", "=", clauseKey).where("service_id", "in", ["ALL", service.id]).selectAll(),
  );

  return (
    <Flex gap="16px" flexDirection="column" ml={{ xs: 0, lg: "102px" }}>
      <Box fontSize="20px">{title}</Box>
      <Button
        priority="secondary"
        iconId="ri-add-line"
        iconPosition="left"
        type="button"
        onClick={() => {
          setSelected({ key: clauseKey, text: "", service_id: service.id, value: "", position: 0 });
        }}
      >
        Ajouter
      </Button>
      <div>Sélectionnez pour modifier ou supprimer</div>
      <Flex gap="8px" flexWrap="wrap">
        {clausesQuery.isLoading ? (
          <Spinner />
        ) : (
          clausesQuery.data
            ?.map((c) => ({ ...c, text: c.text?.replaceAll("\\n", "\n") ?? "" }))
            .map((clause) => (
              <Chip
                key={clause.id}
                onCheckChange={() => setSelected(selected?.id === clause?.id ? null : (clause as Clause_v2))}
                isChecked={selected?.id === clause.id}
              >
                {clause.value}
              </Chip>
            ))
        )}
      </Flex>

      {selected ? <ClauseForm selected={selected} setSelected={setSelected} /> : null}
    </Flex>
  );
};

const ClauseForm = ({
  selected,
  setSelected,
}: {
  selected: Partial<Clause_v2> | null;
  setSelected: (item: Partial<Clause_v2> | null) => void;
}) => {
  const scrollToRef = useScrollToRef();
  if (!selected) return null;

  const isNew = !selected.id;

  const createOrEditClauseMutation = useMutation({
    mutationFn: async (clause: Partial<Clause_v2>) => {
      if (!clause.service_id) throw new Error("service_id is required");
      if (!clause.key) throw new Error("key is required");
      if (!clause.value) throw new Error("value is required");

      if (clause.id) {
        await db.updateTable("clause_v2").set(clause).where("id", "=", clause.id).execute();
      } else {
        await db
          .insertInto("clause_v2")
          .values({ ...clause, id: v4() })
          .execute();
      }

      setSelected(null);
    },
  });

  const deleteClauseMutation = useMutation({
    mutationFn: async (clause: Partial<Clause_v2>) => {
      if (!clause.id) throw new Error("id is required");
      await db.deleteFrom("clause_v2").where("id", "=", clause.id).execute();
      setSelected(null);
    },
  });

  return (
    <Flex ref={scrollToRef} gap="16px" flexDirection="column" width="100%" maxWidth="690px">
      <Input
        sx={{ width: "100%" }}
        label="Intitulé clause"
        nativeInputProps={{
          value: selected.value ?? "",
          onChange: (e) => setSelected({ ...selected, value: e.target.value }),
        }}
      />

      <Flex gap="24px" width="100%">
        <Input
          sx={{ width: "100%" }}
          label="Texte"
          nativeTextAreaProps={{
            rows: 5,
            value: selected.text ?? "",
            onChange: (e) => setSelected({ ...selected, text: e.target.value }),
          }}
          textArea
        />
      </Flex>

      <Flex gap="16px" justifyContent="flex-end" width="100%">
        {!isNew ? (
          <Button
            sx={{
              color: "background-flat-error",
              boxShadow: "inset 0 0 0 1px var(--colors-background-flat-error)",
            }}
            priority="secondary"
            type="button"
            onClick={() => deleteClauseMutation.mutate(selected)}
          >
            Supprimer
          </Button>
        ) : null}
        <Button
          iconId="ri-save-3-line"
          iconPosition="left"
          type="button"
          onClick={() => {
            createOrEditClauseMutation.mutate(selected);
          }}
        >
          Enregistrer
        </Button>
      </Flex>
    </Flex>
  );
};

// TODO: ajouter l'activité de CE
const Activity = () => {
  const user = useUser()!;
  const [startDate, setStartDate] = useState(datePresets[0].startDate);
  const [endDate, setEndDate] = useState(datePresets[0].endDate);

  const crQuery = useDbQuery(
    db
      .selectFrom("report")
      .where("service_id", "=", user.service.id)
      .where("createdBy", "=", user.id)
      .where("createdAt", ">=", startDate.toISOString())
      .where("createdAt", "<=", endDate.toISOString())
      .where("pdf", "is not", null)
      .select((eb) => [eb.fn.count("id").as("count")]),
  );

  const ceQuery = useDbQuery(
    db
      .selectFrom("state_report")
      .where("service_id", "=", user.service.id)
      .where("created_by", "=", user.id)
      .where("created_at", ">=", startDate.toISOString())
      .where("created_at", "<=", endDate.toISOString())
      .where("attachment_id", "is not", null)
      .select((eb) => [eb.fn.count("id").as("count")]),
  );

  const udapCrQuery = useDbQuery(
    db
      .selectFrom("report")
      .where("service_id", "=", user.service.id)
      .where("createdAt", ">=", startDate.toISOString())
      .where("createdAt", "<=", endDate.toISOString())
      .where("pdf", "is not", null)
      .select((eb) => [eb.fn.count("id").as("count")]),
  );

  const udapCeQuery = useDbQuery(
    db
      .selectFrom("state_report")
      .where("service_id", "=", user.service.id)
      .where("created_at", ">=", startDate.toISOString())
      .where("created_at", "<=", endDate.toISOString())
      .where("attachment_id", "is not", null)
      .select((eb) => [eb.fn.count("id").as("count")]),
  );

  return (
    <Flex gap="16px" flexDirection="column" width="100%" maxWidth="690px">
      <Title anchor="rapport-activite">5. Rapport d'activité</Title>

      <DateRangePicker startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />

      <Flex gap="8px" flexDirection={{ xs: "column", lg: "row" }} width="100%">
        <Center
          bgcolor={fr.colors.decisions.artwork.background.greenEmeraude.default}
          flexDirection="column"
          alignItems="center"
          borderRadius="5px"
          width="100%"
          height="215px"
          textAlign="center"
        >
          <i className="fr-icon fr-icon-account-circle-fill" style={{ fontSize: "48px", marginBottom: "8px" }}></i>
          <div>CR envoyés par {user.name} :</div>
          <div>{crQuery.isLoading ? <Spinner /> : <div>{crQuery.data?.[0]?.count as any}</div>}</div>
          <Box mt="16px">CE envoyés par {user.name} :</Box>
          <div>{ceQuery.isLoading ? <Spinner /> : <div>{ceQuery.data?.[0]?.count as any}</div>}</div>
        </Center>
        <Center
          bgcolor={fr.colors.decisions.artwork.background.greenEmeraude.default}
          flexDirection="column"
          alignItems="center"
          borderRadius="5px"
          width="100%"
          height="215px"
          textAlign="center"
        >
          <i className="fr-icon fr-icon-france-fill" style={{ fontSize: "48px", marginBottom: "8px" }}></i>
          <div>CR envoyés par l'UDAP :</div>
          <div>{crQuery.isLoading ? <Spinner /> : <div>{udapCrQuery.data?.[0]?.count as any}</div>}</div>
          <Box mt="16px">CE envoyés par l'UDAP :</Box>
          <div>{ceQuery.isLoading ? <Spinner /> : <div>{udapCeQuery.data?.[0]?.count as any}</div>}</div>
        </Center>
      </Flex>
    </Flex>
  );
};

export const datePresets = [
  {
    label: "Dernier mois",
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  },
  {
    label: "3 derniers mois",
    startDate: new Date(new Date().setDate(new Date().getDate() - 90)),
    endDate: new Date(),
  },
  {
    label: "Année " + new Date().getFullYear(),
    startDate: startOfYear(new Date()),
    endDate: endOfYear(new Date()),
  },
];

export const DateRangePicker = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: {
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
}) => {
  const isPresetSelected = (preset: (typeof datePresets)[0]) => {
    return startDate.getTime() === preset.startDate.getTime() && endDate.getTime() === preset.endDate.getTime();
  };

  return (
    <Flex gap={{ xs: 0, lg: "16px" }} flexDirection={{ xs: "column", lg: "row" }}>
      <Input
        label="Date de début"
        nativeInputProps={{
          type: "date",
          value: startDate.toISOString().split("T")[0],
          onChange: (e) => {
            if (new Date(e.target.value) > endDate) {
              setEndDate(new Date(e.target.value));
            }
            setStartDate(new Date(e.target.value));
          },
        }}
      />
      <Input
        label="Date de fin"
        nativeInputProps={{
          type: "date",
          value: endDate.toISOString().split("T")[0],
          onChange: (e) => {
            if (new Date(e.target.value) < startDate) {
              setStartDate(new Date(e.target.value));
            }
            setEndDate(new Date(e.target.value));
          },
        }}
      />

      <Flex gap="8px" flexDirection="row" alignItems="flex-end">
        {datePresets.map((preset) => (
          <Box key={preset.label} mb="1.5rem">
            <ControlledChip
              onClick={() => {
                setStartDate(preset.startDate);
                setEndDate(preset.endDate);
              }}
              isChecked={isPresetSelected(preset)}
            >
              {preset.label}
            </ControlledChip>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

const Title = ({ children, anchor }: { children: React.ReactNode; anchor?: string }) => {
  return (
    <Typography variant="h3" id={anchor} mb="0" fontSize="26px">
      {children}
    </Typography>
  );
};

export const Route = createFileRoute("/service")({
  component: () => (
    <EnsureUser>
      <ServicePage />
    </EnsureUser>
  ),
});

export const SuccessAlert = () => {
  return (
    // @ts-ignore title is required by DSFR
    <Alert
      style={{ marginBottom: "32px" }}
      severity="success"
      closable={false}
      small={false}
      description={"Vos modifications ont bien été prises en compte."}
    />
  );
};

const AlertesMH = () => {
  const service = useService();
  return <AlertesForm service={service as any} />;
};

const AlertesForm = ({ service }: { service: Service }) => {
  const form = useForm({
    defaultValues: pick(service, [
      "courriel_caoa",
      "courriel_crmh",
      "courriel_dreal",
      "courriel_ofb",
      "courriel_sra",
      "courriel_udap",
    ]),
  });

  const refreshUser = useRefreshUser();

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Service>) => {
      await db.updateTable("service").set(data).where("id", "=", service.id).execute();
      await refreshUser.mutateAsync();
    },
  });

  return (
    <Stack
      component="form"
      gap="0px"
      flexDirection="column"
      onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
      width="100%"
      maxWidth="690px"
    >
      <Title anchor="alertes-mh">4. Alertes visites Monuments Historiques</Title>

      <Input sx={{ mt: "16px" }} label="Courriel CRMH" nativeInputProps={{ ...form.register("courriel_crmh") }} />
      <Input label="Courriel CAOA" nativeInputProps={{ ...form.register("courriel_caoa") }} />
      <Input label="Courriel DREAL" nativeInputProps={{ ...form.register("courriel_dreal") }} />
      <Input label="Courriel SRA" nativeInputProps={{ ...form.register("courriel_sra") }} />
      <Input label="Courriel UDAP" nativeInputProps={{ ...form.register("courriel_udap") }} />
      <Input label="Courriel OFB" nativeInputProps={{ ...form.register("courriel_ofb") }} />

      <Flex>
        <Button
          sx={{ mt: "24px", ml: "auto" }}
          iconId="ri-save-3-line"
          iconPosition="left"
          type="submit"
          disabled={saveMutation.isPending}
        >
          Enregistrer
        </Button>
      </Flex>
    </Stack>
  );
};
