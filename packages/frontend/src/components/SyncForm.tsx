import { useMutation } from "@tanstack/react-query";
import { db } from "../db/db";
import { FieldValues, type UseFormReturn, useWatch } from "react-hook-form";
import useDebounce from "react-use/lib/useDebounce";
import { Banner } from "./Banner";
import { useNavigate } from "@tanstack/react-router";
import { fr } from "@codegouvfr/react-dsfr";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useIsFormDisabled } from "../features/DisabledContext";
import { Report, Service, StateReport } from "../db/AppSchema";
import { useAppStatus } from "../hooks/useAppStatus";
import { Box, BoxProps, styled, Typography } from "@mui/material";
import { Flex } from "./ui/Flex";
import { Button, Center, Input } from "./MUIDsfr";
import { useRef } from "react";

export const useSyncForm = <T extends FieldValues>({
  form,
  baseObject,
  disabled,
  syncObject,
}: {
  form: UseFormReturn<T>;
  baseObject: T;
  disabled?: boolean;
  syncObject: (id: string, diff: Partial<T>) => Promise<void>;
}) => {
  const newObject = useWatch({ control: form.control });
  const diff = disabled ? {} : getDiff(newObject, baseObject);
  const syncMutation = useMutation({
    mutationFn: async () => {
      if (Object.keys(diff).length === 0) return;
      await syncObject(baseObject.id, diff);
    },
  });

  useDebounce(() => syncMutation.mutate(), 500, [diff]);

  return { newObject };
};

export function SyncFormBanner({ form, baseObject }: { form: UseFormReturn<Report>; baseObject: Report }) {
  const { newObject } = useSyncForm({ form, baseObject, disabled: useIsFormDisabled(), syncObject });
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/", search: { document: "compte-rendus" } });

  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.999999,
    initialIsIntersecting: true,
  });

  const isCollapsed = !isIntersecting;
  // const styles = syncFormBanner({ isCollapsed });

  const status = useAppStatus();

  return (
    <>
      <Banner
        status={status}
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <Center width="calc((100% - 800px) / 2)">
          <Typography
            className={"ri-arrow-left-line"}
            component="a"
            href={""}
            onClick={(e) => {
              e.preventDefault();

              goBack();
            }}
            display={{ xs: "none", lg: "inline-flex" }}
            flex={isCollapsed ? "1 0 auto" : undefined}
            fontSize="16px"
            {...{
              "::before": {
                width: "16px !important",
                height: "16px !important",
                mb: "4px !important",
                mr: "4px",
              },
            }}
          >
            Retour
          </Typography>
        </Center>
        <Flex
          {...{
            display: "flex",
            zIndex: 3,
            flexDirection: "column",
            justifyContent: "space-between",
            width: { xs: "100%", lg: "800px" },
            py: { xs: 0, lg: "56px" },
            px: "15px",
          }}
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            maxWidth={{ xs: "100%", lg: "800px" }}
            height="100%"
          >
            {!isCollapsed ? (
              <Box display={{ xs: "block", lg: "none" }}>
                {/* @ts-ignore dsfr buttons props must have children */}
                <Button
                  // className={styles.back}
                  sx={{
                    ":hover": { bgColor: "blue" },
                    "::before": {
                      width: "24px !important",
                    },
                    bgcolor: "transparent !important",
                    ml: "-10px",
                    color: "black",
                  }}
                  priority="tertiary no outline"
                  iconId="ri-arrow-left-line"
                  onClick={() => goBack()}
                  size="large"
                />
              </Box>
            ) : null}
            {/* @ts-ignore dsfr buttons props must have children */}
            <Typography textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
              {isCollapsed ? newObject.title : "Titre compte-rendu :"}
            </Typography>
          </Flex>
          <Input
            // className={styles.input}
            {...{
              width: { xs: "100%", lg: "100%" },
              mb: "1em",
            }}
            sx={{
              "& input": {
                bgcolor: "rgba(50, 50, 50, .15) !important",
              },
            }}
            label=""
            nativeInputProps={{ ...form.register("title") }}
          />
          <Status isCollapsed={isCollapsed} display={{ xs: "flex", lg: "none" }} />
        </Flex>
        {/* <div></div> */}
        <Box width="calc((100% - 800px) / 2)"></Box>
      </Banner>
      <Banner ref={ref} status={status} zIndex="3" position="sticky" top="-1px">
        <Flex
          // className={styles.collapsed}
          /**
           * justifyContent: "space-between",
          alignItems: "center",
          h: { xs: "56px", lg: "unset" }
           */
          {...{
            display: "flex",
            zIndex: 5,
            flexDirection: "row",
            justifyContent: isCollapsed ? "space-between" : "flex-end",
            alignItems: isCollapsed ? "center" : undefined,
            height: { xs: isCollapsed ? "56px" : "unset", lg: "unset" },
            width: "100%",
            px: "15px",
          }}
        >
          {isCollapsed ? (
            <>
              {/* @ts-ignore dsfr buttons props must have children */}
              <Button
                {...{
                  ml: "-10px",
                  color: "black",
                  _hover: { bgColor: "transparent" },
                  "::before": {
                    width: "24px !important",
                  },
                }}
                priority="tertiary no outline"
                iconId="ri-arrow-left-line"
                onClick={() => goBack()}
                size="large"
              />
              <Box textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                {newObject.title}
              </Box>
              <Status isCollapsed={isCollapsed} />
            </>
          ) : null}
        </Flex>
      </Banner>
    </>
  );
}

export const Status = ({
  isCollapsed,
  status: baseStatus,
  ...props
}: { isCollapsed?: boolean; status?: SyncFormStatus } & BoxProps) => {
  const status = baseStatus ?? useAppStatus();

  return (
    <Box
      bgcolor={messagesColor[status]}
      display="flex"
      borderRadius="4px"
      height="20px"
      px="6px"
      color="black"
      textTransform="uppercase"
      fontWeight="500"
      {...{
        /**
         * display: "flex",
          alignSelf: "initial",
          mb: "0",
         */
        alignSelf: isCollapsed ? "initial" : "flex-end",
        mb: isCollapsed ? "0" : "16px",
        fontSize: "10px",
      }}
      {...props}
    >
      <Typography
        className={fr.cx("fr-icon-wifi-line")}
        aria-hidden={true}
        height="24px"
        {...{
          "::before": {
            width: "16px !important",
            height: "16px !important",
            verticalAlign: "middle",
          },
        }}
        mr="6px"
      />
      {messages[status]}
    </Box>
  );
};

const messages: Record<SyncFormStatus, string> = {
  offline: "Hors ligne",
  pending: "En attente",
  saved: "Connecté(e)",
  saving: "Sauvegarde",
};

const messagesColor: Record<SyncFormStatus, string> = {
  offline: "red-offline",
  pending: "yellow-waiting",
  saved: "background-open-blue-france",
  saving: "background-open-blue-france",
};

export type SyncFormStatus = "offline" | "pending" | "saved" | "saving";

async function syncObject(id: string, diff: Record<string, any>) {
  console.log("saving", id, diff);

  await db.updateTable("report").where("id", "=", id).set(diff).execute();
}

function isPrimitive(value: any) {
  return value !== Object(value) || value instanceof Date;
}

export function getDiff(a: Record<string, any>, b: Record<string, any>) {
  const diff = Object.entries(a).reduce((acc, [key, value]) => {
    const oldValue = b[key];
    if (!isPrimitive(oldValue) || !isPrimitive(value)) return acc;

    const areDatesAndEqual =
      oldValue instanceof Date && value instanceof Date && oldValue.getTime() === value.getTime();

    if (oldValue !== value && !areDatesAndEqual) {
      acc[key] = value;
    }

    return acc;
  }, {} as any);

  return diff;
}
