import { EnsureUser } from "#components/EnsureUser.tsx";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Summary from "@codegouvfr/react-dsfr/Summary";
import Download from "@codegouvfr/react-dsfr/Download";
import { useUserSettings } from "../hooks/useUserSettings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { db, useDbQuery } from "../db/db";
import { useLiveUser, useSetService, useUser } from "../contexts/AuthContext";
import { v4 } from "uuid";
import { Spinner } from "#components/Spinner";
import { EmailInput } from "../components/EmailInput";
import { Delegation, User } from "../db/AppSchema";
import { Chip } from "#components/Chip";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { api, AuthUser } from "../api";
import JSZip from "jszip";
import { downloadFile } from "../utils";
import { datePresets, DateRangePicker, SuccessAlert } from "./service";
import React, { ReactNode, useEffect, useState } from "react";
import { format } from "date-fns";
import { getPDFInMailName } from "@cr-vif/pdf";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, Stack, Typography } from "@mui/material";
import { Divider } from "#components/ui/Divider.tsx";
import { Accordion, Button, Center, Input, Select } from "#components/MUIDsfr.tsx";
import { useStyles } from "tss-react";
import { getStateReportMailName } from "@cr-vif/pdf/constat";
import { fr } from "@codegouvfr/react-dsfr";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";

const AccountPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const setService = useSetService();
  const onSuccess = (service: AuthUser["service"]) => {
    setService(service);
    setIsSuccess(true);
    document.getElementsByClassName("MuiBox-root")?.[0]?.scrollTo(0, 0);
  };

  return (
    <Flex
      gap={{ xs: "0", lg: "80px" }}
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="center"
      alignItems={{ lg: "flex-start", xs: "center" }}
      width="100%"
      mb="40px"
    >
      <Stack width={{ xs: "100%", lg: "auto" }}>
        <Box mt="32px" mb={{ xs: "16px", lg: "32px" }} px={{ xs: "16px", lg: "0" }}>
          <GoHomeButton />
        </Box>
        <Typography variant="h1" display={{ lg: "none" }} mt="16px" mb="32px" px={{ xs: "16px" }}>
          Mon compte
        </Typography>
        <AccordionIfMobile>
          <Summary
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              backgroundColor: "transparent",
            }}
            links={[
              { linkProps: { href: "#profile" }, text: "Mon profil" },
              { linkProps: { href: "#default-recipient" }, text: "Destinataires par défaut" },
              { linkProps: { href: "#validation" }, text: "Validation hiérarchique" },
              { linkProps: { href: "#share" }, text: "Droit d'édition partagé" },
              { linkProps: { href: "#download-ce" }, text: "Télécharger mes constats" },
              { linkProps: { href: "#download-cr" }, text: "Télécharger mes CR" },
              { linkProps: { href: "#change-service" }, text: "Changer de service" },
            ]}
          />
        </AccordionIfMobile>
      </Stack>
      <Divider display={{ lg: "none" }} width="90%" ml="5%" color="background-action-low-blue-france-hover" />
      <Center
        flex="1"
        flexDirection="column"
        alignItems="flex-start"
        maxWidth="900px"
        mt="32px"
        px={{ xs: "16px", lg: "0" }}
        textAlign="left"
      >
        <Typography variant="h1" display={{ xs: "none", lg: "block" }} mt="16px" mb="32px">
          Mon compte
        </Typography>
        {isSuccess ? <SuccessAlert /> : null}
        <DefaultRecipient />
        <Divider my={{ xs: "48px", lg: "80px" }} color="background-action-low-blue-france-hover" />
        <HierarchicalValidation />
        <Divider my={{ xs: "48px", lg: "80px" }} color="background-action-low-blue-france-hover" />
        <Share />
        <Divider my={{ xs: "48px", lg: "80px" }} color="background-action-low-blue-france-hover" />
        <DownloadCRs />
        <Divider my={{ xs: "48px", lg: "80px" }} color="background-action-low-blue-france-hover" />
        <DownloadCEs />
        <Divider my={{ xs: "48px", lg: "80px" }} color="background-action-low-blue-france-hover" />
        <ChangeService onSuccess={onSuccess} />
      </Center>
    </Flex>
  );
};

export const AccordionIfMobile = ({ children }: { children: NonNullable<ReactNode> }) => {
  return (
    <>
      <Accordion
        sx={{
          display: { lg: "none" },
          mx: "16px",
          "& .fr-summary__title": { display: "none" },
          "& .fr-summary": { pt: "0" },
        }}
        label="Sommaire"
      >
        {children}
      </Accordion>

      <Box
        sx={{
          "& .fr-summary": { p: 0, m: 0 },
        }}
        display={{ xs: "none", lg: "block" }}
        mb="32px"
        px={{ xs: "16px", lg: "0" }}
      >
        {children}
      </Box>
    </>
  );
};

const DefaultRecipient = () => {
  const user = useUser()!;
  const { userSettings, isLoading: isUserSettingsLoading, existing } = useUserSettings();

  const selectedEmails =
    userSettings.default_emails
      ?.split(",")
      .map((email: string) => email.trim())
      .filter(Boolean) ?? [];

  const saveEmailsMutation = useMutation(async (emails: string[]) => {
    const doesUserSettingExist =
      existing ||
      !!(await db.selectFrom("user_settings").where("user_id", "=", user.id).selectAll().executeTakeFirst());

    if (doesUserSettingExist) {
      return db
        .updateTable("user_settings")
        .set({ default_emails: emails.join(",") })
        .where("user_id", "=", user.id)
        .execute();
    }

    return db
      .insertInto("user_settings")
      .values({ id: v4(), user_id: user.id, default_emails: emails.join(","), service_id: user.service_id })
      .execute();
  });

  return (
    <Flex gap="0px" flexDirection="column" width="100%">
      <Title anchor="default-recipient">1. Destinataire par défaut</Title>
      <Box>
        {isUserSettingsLoading ? (
          <Spinner size={100} />
        ) : (
          <EmailInput
            label="Courriel en copie par défaut :"
            hintText="Pour tous mes CRs envoyés"
            value={selectedEmails}
            onValueChange={(e) => saveEmailsMutation.mutate(e)}
          />
        )}
      </Box>
    </Flex>
  );
};

const HierarchicalValidation = () => {
  const user = useUser()!;
  const { userSettings, isLoading: isUserSettingsLoading, existing } = useUserSettings();

  const [isEnabled, setIsEnabled] = useState(false);
  const [supervisorEmail, setSupervisorEmail] = useState("");

  useEffect(() => {
    if (userSettings) {
      setIsEnabled(!!userSettings.hierarchical_validation_enabled);
      setSupervisorEmail(userSettings.supervisor_email || "");
    }
  }, [userSettings]);

  const saveSettingsMutation = useMutation(async ({ enabled, email }: { enabled: boolean; email: string }) => {
    const doesUserSettingExist =
      existing ||
      !!(await db.selectFrom("user_settings").where("user_id", "=", user.id).selectAll().executeTakeFirst());

    if (doesUserSettingExist) {
      return db
        .updateTable("user_settings")
        .set({
          hierarchical_validation_enabled: enabled ? 1 : 0,
          supervisor_email: email || null,
        })
        .where("user_id", "=", user.id)
        .execute();
    }

    return db
      .insertInto("user_settings")
      .values({
        id: v4(),
        user_id: user.id,
        default_emails: userSettings.default_emails || "",
        service_id: user.service_id,
        hierarchical_validation_enabled: enabled ? 1 : 0,
        supervisor_email: email || null,
      })
      .execute();
  });

  const handleToggleChange = (checked: boolean) => {
    setIsEnabled(checked);
    saveSettingsMutation.mutate({ enabled: checked, email: supervisorEmail });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setSupervisorEmail(newEmail);
  };

  const handleEmailBlur = () => {
    if (isEnabled) {
      saveSettingsMutation.mutate({ enabled: isEnabled, email: supervisorEmail });
    }
  };

  return (
    <Flex gap="0px" flexDirection="column" width="100%">
      <Title anchor="validation">2. Validation hiérarchique</Title>
      <Box>
        {isUserSettingsLoading ? (
          <Spinner size={100} />
        ) : (
          <>
            <Box mb="16px">
              <ToggleSwitch
                label="Activer la validation hiérarchique"
                helperText="Quand cette option est activée, vos constats d'état seront d'abord envoyés à votre responsable pour validation avant d'être transmis aux destinataires."
                checked={isEnabled}
                onChange={handleToggleChange}
              />
            </Box>
            {isEnabled && (
              <Input
                label="Courriel du responsable hiérarchique"
                hintText="Cette personne recevra vos constats pour validation"
                nativeInputProps={{
                  type: "email",
                  value: supervisorEmail,
                  onChange: handleEmailChange,
                  onBlur: handleEmailBlur,
                  placeholder: "responsable@example.com",
                }}
              />
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};

const Share = () => {
  const user = useUser()!;

  const coworkersQuery = useDbQuery(
    db.selectFrom("user").where("service_id", "=", user.service_id).where("id", "!=", user.id).selectAll(),
  );

  const delegationsQuery = useDbQuery(db.selectFrom("delegation").where("createdBy", "=", user.id).selectAll());

  const delegatedToMeQuery = useDbQuery(
    db
      .selectFrom("delegation")
      .where("delegatedTo", "=", user.id)
      .innerJoin("user", "delegation.createdBy", "user.id")
      .selectAll(["delegation"])
      .select(["user.name as createdByName"]),
  );

  const coworkers = coworkersQuery.data ?? [];
  const delegations = delegationsQuery.data ?? [];
  const delegatedToMe = delegatedToMeQuery.data ?? [];

  return (
    <Flex gap="0px" flexDirection="column" width="100%">
      <Title anchor="share">3. Droit d'édition partagé</Title>
      {coworkers.length ? (
        <Box>
          <Box mb="16px">Ces personnes peuvent créer, modifier et supprimer vos CR : </Box>
          <ManageDelegations coworkers={coworkers} delegations={delegations} />
          {delegatedToMe.length ? (
            // @ts-ignore alert needs a title ?
            <Alert
              style={{
                marginTop: "16px",
              }}
              small={false}
              closable={false}
              severity="info"
              description={
                delegatedToMe.map((user) => user.createdByName).join(", ") +
                ` vous autorise${delegatedToMe.length > 1 ? "nt" : ""} à créer, modifier et supprimer ${delegatedToMe.length > 1 ? "leurs" : "ses"} CRs.`
              }
            />
          ) : null}
        </Box>
      ) : (
        // @ts-ignore alert needs a title ?
        <Alert
          small={false}
          severity="info"
          description={
            "Aucun autre utilisateur de votre UDAP n'est enregistré sur Compte rendu VIF. Vous ne pouvez donc pas autoriser d'autres personnes à créer, modifier et supprimer vos CR."
          }
        />
      )}
    </Flex>
  );
};

export const BreadcrumbNav = ({ label }: { label: string }) => {
  return (
    <>
      <Box component="nav" width="100%" mt="32px" mb={{ xs: "0", lg: "32px" }} px={{ xs: "16px", lg: "8px" }}>
        <ol className="fr-breadcrumb__list">
          <li>
            <a href="/" className="fr-breadcrumb__link">
              Accueil
            </a>
          </li>
          <li>
            <a className="fr-breadcrumb__link" aria-current="page">
              {label}
            </a>
          </li>
        </ol>
      </Box>

      {/* <Accordion className={css({ hideFrom: "lg", mx: "16px" })} label="Sommaire">
        <styled.nav mb="0 !important" pl="calc(2rem + 8px)">
          <ol className="fr-breadcrumb__list">
            <li>
              <a href="/" className="fr-breadcrumb__link">
                Accueil
              </a>
            </li>
            <li>
              <a className="fr-breadcrumb__link" aria-current="page">
                {label}
              </a>
            </li>
          </ol>
        </styled.nav>
      </Accordion> */}
    </>
  );
};

const ManageDelegations = ({ coworkers, delegations }: { coworkers: User[]; delegations: Delegation[] }) => {
  const user = useUser()!;

  const createMutation = useMutation((delegation: Omit<Delegation, "id">) =>
    db
      .insertInto("delegation")
      .values({ ...delegation, id: v4() })
      .execute(),
  );
  const removeMutation = useMutation((delegation: Delegation) =>
    db.deleteFrom("delegation").where("id", "=", delegation.id).execute(),
  );

  return (
    <Flex gap="8px" flexWrap="wrap">
      {coworkers.map((coworker) => {
        const delegation = delegations.find((del) => del.delegatedTo === coworker.id);
        return (
          <Chip
            style={{
              whiteSpace: "nowrap",
            }}
            key={coworker.id}
            onCheckChange={(e) =>
              e
                ? createMutation.mutate({ createdBy: user.id, delegatedTo: coworker.id })
                : removeMutation.mutate(delegation!)
            }
            isChecked={!!delegation}
          >
            {coworker.name!}
          </Chip>
        );
      })}
    </Flex>
  );
};

const DownloadCRs = () => {
  const [startDate, setStartDate] = useState(datePresets[0].startDate);
  const [endDate, setEndDate] = useState(datePresets[0].endDate);

  const user = useUser()!;

  const downloadMutation = useMutation(async (reports: { id: string; name: string }[]) => {
    if (!reports?.length) {
      return;
    }
    const zip = new JSZip();

    for (const report of reports) {
      // TODO: use local attachments since they are already downloaded
      const pdf = await api.get("/api/pdf/report", { query: { reportId: report.id } });
      zip.file(report.name, pdf as string, { base64: true });
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    downloadFile(url, getZipFilename(startDate, endDate));
    URL.revokeObjectURL(url);
  });

  const crs = useDbQuery(
    db
      .selectFrom("report")
      .where("createdBy", "=", user.id)
      .where("service_id", "=", user.service_id)
      .where((eb) => eb.or([eb("pdf", "is not", null), eb("attachment_id", "is not", null)]))
      .where("disabled", "!=", 1)
      .where("createdAt", ">=", startDate.toISOString())
      .where("createdAt", "<=", endDate.toISOString())
      .selectAll(),
  );

  const reports = crs.data?.map((cr) => ({ id: cr.id, name: getPDFInMailName(cr) })) ?? [];

  return (
    <Flex gap="0px" flexDirection="column" width="100%">
      <Title anchor="download-cr">4. Télécharger mes CR</Title>
      <DateRangePicker startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
      <Box mb="16px">
        Pour une expérience optimale, nous vous invitons à <b>privilégier le mode Wi-Fi</b> pour le téléchargement de
        vos comptes-rendus dont le poids peut être important.
      </Box>
      <Box bgcolor={fr.colors.decisions.background.alt.blueFrance.default + " !important"} px="24px" pt="18px" pb="4px">
        {reports.length ? (
          <Download
            label={getZipFilename(startDate, endDate)}
            details={`ZIP - ${reports.length} compte${reports.length > 1 ? "s" : ""} rendu${reports.length > 1 ? "s" : ""}`}
            linkProps={{
              onClick: () => downloadMutation.mutate(reports),
              disabled: downloadMutation.isPending || reports.length === 0,
            }}
          />
        ) : (
          <Box pb="14px">Aucun CR disponible sur la période sélectionnée.</Box>
        )}
      </Box>
    </Flex>
  );
};

const DownloadCEs = () => {
  const [startDate, setStartDate] = useState(datePresets[0].startDate);
  const [endDate, setEndDate] = useState(datePresets[0].endDate);

  const user = useUser()!;

  const downloadMutation = useMutation(async (reports: { id: string; name: string }[]) => {
    if (!reports?.length) {
      return;
    }
    const zip = new JSZip();

    for (const report of reports) {
      // TODO: use local attachments since they are already downloaded
      const pdf = await api.get("/api/pdf/state-report", { query: { stateReportId: report.id } });
      zip.file(report.name, pdf as string, { base64: true });
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    downloadFile(url, getCEZipFilename(startDate, endDate));
    URL.revokeObjectURL(url);
  });

  const crs = useDbQuery(
    db
      .selectFrom("state_report")
      .where("created_by", "=", user.id)
      .where("service_id", "=", user.service_id)
      .where((eb) => eb.or([eb("attachment_id", "is not", null), eb("attachment_id", "is not", null)]))
      .where("disabled", "!=", 1)
      .where("created_at", ">=", startDate.toISOString())
      .where("created_at", "<=", endDate.toISOString())
      .selectAll(),
  );

  const reports = crs.data?.map((cr) => ({ id: cr.id, name: getStateReportMailName(cr) })) ?? [];

  return (
    <Flex gap="0px" flexDirection="column" width="100%">
      <Title anchor="download-ce">5. Télécharger mes CE</Title>
      <DateRangePicker startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
      <Box mb="16px">
        Pour une expérience optimale, nous vous invitons à <b>privilégier le mode Wi-Fi</b> pour le téléchargement de
        vos comptes-rendus dont le poids peut être important.
      </Box>
      <Box bgcolor={fr.colors.decisions.background.alt.blueFrance.default + " !important"} px="24px" pt="18px" pb="4px">
        {reports.length ? (
          <Download
            label={getCEZipFilename(startDate, endDate)}
            details={`ZIP - ${reports.length} constat${reports.length > 1 ? "s" : ""} d'état`}
            linkProps={{
              onClick: () => downloadMutation.mutate(reports),
              disabled: downloadMutation.isPending || reports.length === 0,
            }}
          />
        ) : (
          <Box pb="14px">Aucun CR disponible sur la période sélectionnée.</Box>
        )}
      </Box>
    </Flex>
  );
};

const ChangeService = ({ onSuccess }: { onSuccess: (service: AuthUser["service"]) => void }) => {
  const user = useUser()!;
  const service = user.service;

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const servicesQuery = useQuery({
    queryKey: ["services", service.id],
    queryFn: async () => {
      const response = await api.get("/api/services");
      const filteredResponse = response.filter((u) => u.id !== service.id);
      if (filteredResponse.length === 1) {
        setSelectedServiceId(filteredResponse[0].id);
      }
      return filteredResponse;
    },
    onError: (error) => console.error(error),
  });

  const changeServiceMutation = useMutation(async (service_id: string) => {
    const service = servicesQuery.data?.find((u) => u.id === service_id);
    if (!service) return;
    await api.post("/api/change-service", {
      body: { service_id },
    });

    onSuccess?.(service as AuthUser["service"]);
  });

  const { css } = useStyles();

  return (
    <Flex gap="0px" flexDirection="column" width="100%">
      <Title anchor="change-service">6. Changer de service</Title>
      {/* @ts-ignore */}
      <Alert
        style={{
          marginTop: "16px",
          marginBottom: "16px",
        }}
        small={false}
        closable={false}
        severity="warning"
        description={
          <p>
            À noter : si vous changez de service, vous n’aurez plus accès à vos CR actuels et vos paramètres seront ceux
            ceux de votre nouvelle équipe. Cette action reste néanmoins réversible, vous pourrez changer à nouveau de
            service et retrouver vos CR.
            <br />
            <br />
            N’oubliez pas d’enregistrer pour mettre à jour vos paramètres.
          </p>
        }
      />

      <Flex gap={{ xs: 0, lg: "16px" }} flexDirection={{ xs: "column", lg: "row" }} width="100%">
        <Input
          classes={{
            nativeInputOrTextArea: css({ pr: "32px" }),
          }}
          label="Mon service"
          disabled
          nativeInputProps={{ value: service.name! }}
        />
        <Select
          label="Nouveau service"
          nativeSelectProps={{
            onChange: (e) => {
              setSelectedServiceId(e.target.value);
            },
            value: selectedServiceId ?? undefined,
          }}
        >
          <option value="" disabled hidden>
            Sélectionnez un service
          </option>
          {servicesQuery.data?.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </Select>
      </Flex>

      <Flex justifyContent="flex-end" width="100%" mt="24px">
        <Button
          iconId="ri-save-3-line"
          iconPosition="left"
          disabled={!selectedServiceId}
          type="button"
          onClick={() => {
            if (!selectedServiceId) return;

            changeServiceMutation.mutate(selectedServiceId!);
          }}
        >
          Enregistrer
        </Button>
      </Flex>
    </Flex>
  );
};

/*
 */

const getZipFilename = (startDate: Date, endDate: Date) => {
  const formatDate = (date: Date) => format(date, "ddMMyy");

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  return `mes-CR-${start}-${end}.zip`;
};

const getCEZipFilename = (startDate: Date, endDate: Date) => {
  const formatDate = (date: Date) => format(date, "ddMMyy");

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  return `mes-CE-${start}-${end}.zip`;
};

const Title = ({ children, anchor }: { children: React.ReactNode; anchor?: string }) => {
  return (
    <Typography variant="h3" id={anchor} mb="24px" fontSize="26px">
      {children}
    </Typography>
  );
};

export const GoHomeButton = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate({ to: "/", search: { document: "compte-rendus" } });
  };

  return (
    <Box
      component="a"
      href={""}
      onClick={(e) => {
        e.preventDefault();
        goBack();
      }}
      sx={{
        "::before": {
          width: "16px !important",
          mr: "4px",
        },
        px: { lg: "16px", xs: 0 },
      }}
      whiteSpace="nowrap"
    >
      <Typography component="span" fontSize="12px" sx={{ textDecoration: "underline" }}>
        Retour à l'accueil
      </Typography>
    </Box>
  );
};

export const TitleH3 = Title;

export const Route = createFileRoute("/account")({
  component: () => (
    <EnsureUser>
      <AccountPage />
    </EnsureUser>
  ),
});
