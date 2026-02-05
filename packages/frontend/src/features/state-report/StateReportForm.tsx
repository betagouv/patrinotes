import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { StateReport } from "../../db/AppSchema";
import { ImmeubleAutocomplete } from "../ImmeubleAutocomplete";
import { Flex } from "#components/ui/Flex.tsx";
import { StateReportFormType, useIsStateReportDisabled, useStateReportFormContext } from "./utils";
import { WithReferencePop } from "./WithReferencePop";
import { Box, Typography } from "@mui/material";
import { useBannerBgColor } from "#components/Banner.tsx";
import { useSyncForm } from "#components/SyncForm.tsx";
import { db } from "../../db/db";
import { useFormWithFocus, useRefreshForm } from "../../hooks/useFormWithFocus";
import { StateReportSideMenu } from "./StateReportSideMenu";

export const StateReportForm = ({ report }: { report: StateReport }) => {
  const [form, getFocused] = useFormWithFocus<StateReportFormType>({
    defaultValues: { ...emptyStateReport, ...report },
  });
  const bgColor = useBannerBgColor();
  const onSubmit = (data: StateReportFormType) => {
    console.log(data);
  };

  useRefreshForm({
    form,
    values: { ...emptyStateReport, ...report },
    getFocused,
  });

  return (
    <Flex flexDirection="column" alignItems={"center"} width="100%" height="100%">
      <FormProvider {...form}>
        <SyncForm report={report} />
        <Flex bgcolor={bgColor} width="100%" justifyContent="space-between">
          <Flex
            component="form"
            alignItems="center"
            flexDirection="column"
            pt="32px"
            pb="32px"
            width="100%"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Flex width="100%" maxWidth="1200px" flexDirection="column">
              <EmptyImmeubleMessage />
              <Flex
                maxWidth="100%"
                px="16px"
                justifyContent="space-between"
                flexDirection={{ xs: "column", lg: "row" }}
              >
                <ImmeubleAutocomplete />
                <StateReportSideMenu />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Box width={{ xs: "100%", lg: "1200px" }} maxWidth="100%" px={{ xs: "0", lg: "16px" }} height="100%">
          <WithReferencePop />
        </Box>
      </FormProvider>
    </Flex>
  );
};

const EmptyImmeubleMessage = () => {
  const form = useStateReportFormContext();

  const referencePop = form.watch("reference_pop");
  if (referencePop) return null;
  return (
    <Typography width={{ xs: "100%", lg: "100%" }} px="16px" mb="32px">
      Récupérez les informations d'un monument historique puis saisissez votre constat :
    </Typography>
  );
};

const SyncForm = ({ report }: { report: StateReport }) => {
  const form = useFormContext<StateReportFormType>();

  useSyncForm({
    form,
    baseObject: report,
    syncObject: async (id, diff) => {
      console.log("saving", id, diff);
      await db.updateTable("state_report").where("id", "=", id).set(diff).execute();
    },
  });

  return null;
};

const emptyStateReport: StateReport = {
  id: "",
  notes: "",
  nature_edifice: null,
  reference_pop: null,
  adresse: null,
  commune: null,
  code_postal: null,
  commune_historique: null,
  reference_cadastrale: null,
  periode_construction: null,
  nature_protection: null,
  parties_protegees: null,
  description: null,
  observations: null,
  service_id: null,
  created_by: null,
  created_at: null,
  disabled: null,
  titre_edifice: null,
  date_visite: null,
  nature_visite: null,
  personnes_presentes: null,
  redacted_by: null,
  proprietaire: null,
  proprietaire_email: null,
  proprietaire_representant: null,
  proprietaire_representant_email: null,
  etat_general: null,
  proportion_dans_cet_etat: null,
  etat_commentaires: "",
  plan_situation: null,
  plan_edifice: null,
  vue_generale: null,
  preconisations: null,
  preconisations_commentaires: "",
  bilan_quinquennal: null,
  visite_partielle_details: null,
  attachment_id: null,
};
