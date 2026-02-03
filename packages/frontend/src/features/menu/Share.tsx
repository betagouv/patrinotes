import { useUser } from "../../contexts/AuthContext";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useMutation } from "@tanstack/react-query";
import { MenuTitle } from "./MenuTitle";
import { ClauseFormBanner } from "./ClauseMenu";
import { fr } from "@codegouvfr/react-dsfr";
import { db, useDbQuery } from "../../db/db";
import { Delegation, User } from "../../db/AppSchema";
import { v4 } from "uuid";
import { EmailInput } from "#components/EmailInput.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { useUserSettings } from "../../hooks/useUserSettings";
import { Box, Stack, Typography } from "@mui/material";
import { Center } from "#components/MUIDsfr.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { Flex } from "#components/ui/Flex.tsx";

export const ShareReport = ({ backButtonOnClick }: { backButtonOnClick: () => void }) => {
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

  const { userSettings, isLoading: isUserSettingsLoading, existing } = useUserSettings();

  const selectedEmails =
    userSettings.default_emails
      ?.split(",")
      .map((email: string) => email.trim())
      .filter(Boolean) ?? [];

  const saveEmailsMutation = useMutation({
    mutationFn: async (emails: string[]) => {
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
        .values({ id: v4(), user_id: user.id, default_emails: emails.join(",") })
        .execute();
    },
  });

  return (
    <>
      <MenuTitle
        backButtonOnClick={backButtonOnClick}
        alert={
          <ClauseFormBanner
            status="idle"
            icon={fr.cx("fr-icon-alert-fill")}
            text={`Tous les agents de l'UDAP peuvent voir et télécharger les compte-rendus envoyés. Seuls ceux à qui vous avez donné le droit peuvent créer, modifier, et supprimer vos compte-rendus. Le compte-rendu est attribué à un agent via le champ "rédigé par" du formulaire.`}
          />
        }
      >
        Partage des CR
      </MenuTitle>

      <Stack width="100%" px="20px">
        <Typography variant="h4" mb="16px">
          Envois
        </Typography>
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
      </Stack>
      <Center>
        <Divider mx="24px" mt="16px" mb="24px" />
      </Center>

      <Stack width="100%" px="20px">
        <Typography variant="h4" mb="16px">
          Droits d'édition
        </Typography>
        <Box>Ces personnes peuvent créer, modifier et supprimer vos CR : </Box>
        <ManageDelegations coworkers={coworkers ?? []} delegations={delegations ?? []} />
      </Stack>

      {delegatedToMe?.length ? (
        <Stack mt="49px" px="20px" color="#757575">
          <Box>Ces personnes vous permettent de créer, modifier et supprimer leurs CR :</Box>
          <Box component="ul">
            {delegatedToMe?.map((delegation) => (
              <Box component="li" key={delegation.createdBy}>
                {(delegation as any).user_delegation_createdByTouser?.name}
              </Box>
            ))}
          </Box>
        </Stack>
      ) : null}
    </>
  );
};

const ManageDelegations = ({ coworkers, delegations }: { coworkers: User[]; delegations: Delegation[] }) => {
  const user = useUser()!;

  const createMutation = useMutation({
    mutationFn: (delegation: Omit<Delegation, "id">) =>
      db
        .insertInto("delegation")
        .values({ ...delegation, id: v4() })
        .execute(),
  });
  const removeMutation = useMutation({
    mutationFn: (delegation: Delegation) => db.deleteFrom("delegation").where("id", "=", delegation.id).execute(),
  });

  return (
    <>
      {coworkers.map((coworker) => {
        const delegation = delegations.find((del) => del.delegatedTo === coworker.id);
        return (
          <Flex key={coworker.id} width="100%">
            <ToggleSwitch
              style={{
                width: "100%",
              }}
              label={coworker.name!}
              showCheckedHint={false}
              inputTitle={coworker.name!}
              checked={!!delegation}
              onChange={(e) =>
                e
                  ? createMutation.mutate({ createdBy: user.id, delegatedTo: coworker.id })
                  : removeMutation.mutate(delegation!)
              }
            />
            {/* <styled.div>{coworker.name}</styled.div> */}
          </Flex>
        );
      })}
    </>
  );
};
