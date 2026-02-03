import { useMutation, useQuery } from "@tanstack/react-query";
import { useConstatPdfContext } from "./ConstatPdfContext";
import { getStateReportHtmlString, StateReportPDFDocument, StateReportPDFDocumentProps } from "@cr-vif/pdf/constat";
import { pdf } from "@react-pdf/renderer";
import { Accordion, Center, Checkbox, Input } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { PdfCanvas } from "../../../routes/pdf.$reportId";
import { useService, useUser } from "../../../contexts/AuthContext";
import { addSIfPlural } from "../../../utils";
import { Box, Stack, Typography } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../db/db";
import { StateReportAlert } from "../../../db/AppSchema";

export const SendConstatPdf = () => {
  const { localHtmlString, setSelectedAlerts, alerts = [] } = useConstatPdfContext()!;
  const user = useUser()!;

  return (
    <Stack>
      <Center>
        <Center width="800px" flexDirection="column">
          <View
            htmlString={localHtmlString!}
            images={{ marianne: "/marianne.png", marianneFooter: "/marianne_footer.png" }}
            service={user.service as any}
          />
        </Center>
      </Center>
    </Stack>
  );
};

type AlertWithEmail = StateReportAlert & { email: string };

const AlertRow = ({
  alert,
  inputRef,
  checked,
  onToggle,
}: {
  alert: AlertWithEmail;
  inputRef: (el: HTMLInputElement | null) => void;
  checked: boolean;
  onToggle: () => void;
}) => {
  const service = useService();
  const [email, setEmail] = useState(alert.email || "");

  const emailKey = "courriel_" + (alert.alert ?? "").toLowerCase();
  const hasServiceEmail = !!service?.[emailKey as keyof typeof service];

  const saveEmailMutation = useMutation({
    mutationFn: async (newEmail: string) => {},
  });

  const handleBlur = () => {
    if (email !== alert.email) {
      saveEmailMutation.mutate(email);
    }
  };

  return (
    <Checkbox
      options={[
        {
          label: alert.alert,
          hintText: hasServiceEmail ? (
            <Typography>{alert.email}</Typography>
          ) : (
            <Box sx={{ mt: "4px" }}>
              <Input
                label=""
                nativeInputProps={{
                  ref: inputRef as React.LegacyRef<HTMLInputElement>,
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  onBlur: handleBlur,
                  placeholder: "Courriel",
                }}
                hintText={
                  !email ? (
                    <Typography color={fr.colors.decisions.text.actionHigh.redMarianne.default}>
                      Veuillez renseigner un courriel
                    </Typography>
                  ) : undefined
                }
              />
            </Box>
          ),
          nativeInputProps: {
            checked,
            onChange: onToggle,
          },
        },
      ]}
    />
  );
};

const View = (props: StateReportPDFDocumentProps) => {
  const query = useQuery({
    queryKey: ["report-pdf", props.htmlString],
    queryFn: async () => {
      const blob = await pdf(<StateReportPDFDocument {...props} />).toBlob();
      return blob;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,

    enabled: !!props.htmlString,
  });

  if (query.isLoading)
    return (
      <Center height="100%">
        <Spinner />
      </Center>
    );

  return <PdfCanvas blob={query.data as Blob} />;
};
