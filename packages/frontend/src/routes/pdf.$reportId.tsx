import "@ungap/with-resolvers";
import { Banner } from "../components/Banner";
import { EnsureUser } from "../components/EnsureUser";
import { Spinner } from "../components/Spinner";
import { fr } from "@codegouvfr/react-dsfr";
import { PdfImage, ReportPDFDocument, ReportPDFDocumentProps, getReportHtmlString } from "@cr-vif/pdf";
import { usePdf } from "@mikecousins/react-pdf";
import { pdf } from "@react-pdf/renderer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { Editor } from "@tiptap/react";
import { makeArrayOf } from "pastable";
import { PropsWithChildren, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";
import { v4 } from "uuid";
import { api } from "../api";
import sentImage from "../assets/sent.svg";
import { EmailInput } from "../components/EmailInput";
import { getDiff } from "../components/SyncForm";
import { useUser } from "../contexts/AuthContext";
import { Clause_v2, Pictures, Report, Service } from "../db/AppSchema";
import { attachmentStorage, db, getAttachmentUrl, useDbQuery } from "../db/db";
import { useChipOptions } from "../features/chips/useChipOptions";
import { transformBold } from "../features/menu/ClauseMenu";
import { TextEditor } from "../features/text-editor/TextEditor";
import { TextEditorContext, TextEditorContextProvider } from "../features/text-editor/TextEditorContext";
import { TextEditorToolbar } from "../features/text-editor/TextEditorToolbar";
import { useUserSettings } from "../hooks/useUserSettings";
import { format } from "date-fns";
import { Button, Center } from "#components/MUIDsfr.tsx";
import { Box, Stack, Typography } from "@mui/material";
import { Flex } from "#components/ui/Flex.tsx";

type Mode = "edit" | "view" | "send" | "sent";

export const PDF = () => {
  const user = useUser()!;
  const { service } = user;
  const chipOptions = useChipOptions();

  const { reportId } = Route.useParams();
  const { mode } = Route.useSearch();

  const navigate = useNavigate();
  const generatePdfMutation = useMutation({
    mutationFn: async ({ htmlString, recipients }: { htmlString: string; recipients: string }) => {
      await api.post("/api/pdf/report", { body: { reportId, htmlString, recipients } });
      // downloadFile(url);
    },
    onSuccess: () => {
      navigate({ search: { mode: "sent" } as any });
    },
  });

  const toggleMode = () => {
    navigate({ search: { mode: mode === "edit" ? "view" : "edit" } as any, replace: true });
  };

  const reportQuery = useQuery({
    queryKey: ["report", reportId],
    queryFn: async () => {
      const reportQuery = await db.selectFrom("report").where("id", "=", reportId).selectAll().execute();
      const picturesQuery = await db
        .selectFrom("report_attachment")
        .where("report_id", "=", reportId)
        .where("is_deprecated", "=", 0)
        .orderBy("created_at", "asc")
        .selectAll()
        .execute();

      const pictures = await Promise.all(
        picturesQuery.map((pic) => getAttachmentUrl(pic.attachment_id!).then((url) => ({ ...pic, url }))),
      );

      const report = reportQuery?.[0];

      return { ...report, pictures };
    },
  });

  const report = reportQuery.data;

  const snapshotQuery = useQuery({
    queryKey: ["report-snapshot", reportId],
    queryFn: async () => {
      const snapshotQuery = await db.selectFrom("pdf_snapshot").where("report_id", "=", reportId).selectAll().execute();
      const snapshot = snapshotQuery?.[0];
      if (!snapshot || !snapshot.report) return null;

      try {
        const snapshotReport = JSON.parse(snapshot.report);
        const diff = getDiff(
          {
            ...snapshotReport,
            createdAt: new Date(snapshotReport.createdAt).toISOString(),
            meetDate: new Date(snapshotReport.meetDate).toISOString(),
          },
          {
            ...report,
            createdAt: new Date(report!.createdAt!).toISOString(),
            meetDate: new Date(report!.meetDate!).toISOString(),
          },
        );

        if (Object.keys(diff).length) return null;

        return snapshot.html!;
      } catch (e) {
        return null;
      }
    },
    enabled: !!report,
  });

  const serviceInstructeurQuery = useQuery({
    queryKey: ["service-instructeur", report?.serviceInstructeur],
    queryFn: async () => {
      return await db
        .selectFrom("service_instructeurs")
        .where("id", "=", report!.serviceInstructeur!)
        .selectAll()
        .execute();
    },
    enabled: !!report?.serviceInstructeur,
  });

  const serviceInstructeur = serviceInstructeurQuery.data?.[0];
  const isServiceInstructeurLoaded = report?.serviceInstructeur ? !!serviceInstructeur : true;
  const htmlString = snapshotQuery.data;

  const saveSnapshotMutation = useMutation({
    mutationFn: async ({ report, html }: { report: string; html: string }) => {
      await db.deleteFrom("pdf_snapshot").where("report_id", "=", reportId).where("user_id", "=", user.id).execute();

      await db
        .insertInto("pdf_snapshot")
        .values({
          id: v4(),
          report_id: reportId,
          report,
          html,
          user_id: user.id,
        })
        .execute();
    },
    onSuccess: () => toggleMode(),
  });

  const EditButtons = () => {
    const { editor } = useContext(TextEditorContext);

    return (
      <>
        <TextEditorToolbar />
        <Button
          type="button"
          sx={{
            display: { xs: "none", lg: "inline-flex" },
          }}
          iconId="ri-save-line"
          size="medium"
          onClick={() =>
            saveSnapshotMutation.mutate({
              report: JSON.stringify(report),
              html: editor?.getHTML() ?? "",
            })
          }
        >
          Enregistrer
        </Button>
      </>
    );
  };

  const ViewButtons = () => {
    return (
      <>
        <Button
          sx={{ bgcolor: "white" }}
          type="button"
          iconId="ri-pencil-line"
          priority="secondary"
          onClick={toggleMode}
        >
          Modifier
        </Button>
        <DownloadButton />
      </>
    );
  };

  if (generatePdfMutation.isPending)
    return (
      <Center flexDirection="column" width="100%" height="100%">
        <Spinner />
      </Center>
    );

  const SendButtons = () => {
    return (
      <>
        <Button iconId="ri-send-plane-fill" type="submit" disabled={generatePdfMutation.isPending}>
          Envoyer
        </Button>
      </>
    );
  };

  const buttons = mode === "edit" ? <EditButtons /> : mode === "view" ? <ViewButtons /> : <SendButtons />;

  if (mode === "sent") {
    return (
      <Center flexDirection="column" width="100%" mt="24px">
        <Box component="img" src={sentImage} alt="Courriel envoyé" width={{ xs: "80px", lg: "120px" }} mt="100px" />
        <Box mt="16px" color="text-title-blue-france" textAlign="center" fontSize={{ xs: "18px", lg: "24px" }}>
          Votre compte-rendu a bien été envoyé !
        </Box>
        <Button
          sx={{ mt: { xs: "24px", lg: "48px" } }}
          type="button"
          onClick={() => navigate({ to: "/", search: { document: "compte-rendus" } })}
        >
          Accueil
        </Button>
      </Center>
    );
  }

  return (
    <Box
      bgcolor={mode === "edit" ? fr.colors.decisions.background.open.blueFrance : "unset"}
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
    >
      <Flex bgcolor={"#E8EDFF"} justifyContent="center" py="16px" px="32px">
        <Box className={fr.cx("fr-icon-alert-fill")} component="i" color="#0063CB" />
        <Box
          dangerouslySetInnerHTML={{
            __html: transformBold(`La modification du formulaire ré-initialisera cette mise en page.`),
          }}
          ml="16px"
          pr="24px"
          color={"#0063CB"}
        ></Box>
      </Flex>
      <TextEditorContextProvider>
        {report ? (
          <SendForm generatePdf={(args) => generatePdfMutation.mutate(args)} report={report}>
            <EditBanner
              mode={mode}
              title={
                <Box display="flex" flexDirection="column" alignItems="flex-start" textAlign="left">
                  <Box>
                    <Typography fontWeight="bold">{getModeTitle(mode)}</Typography>
                    {mode !== "send" && report?.title ? ` | ${report?.title}` : ""}
                  </Box>
                  {mode === "view" ? (
                    <Box>
                      <SentEmailInfos report={report} />
                    </Box>
                  ) : null}
                </Box>
              }
              reportId={report?.id}
              buttons={buttons}
            />
            <Center sx={{ overflowY: "auto" }} width="100%" height="100%" maxHeight="100%">
              <Stack width="800px" height="100%">
                {report && snapshotQuery.isSuccess && isServiceInstructeurLoaded ? (
                  <WithReport
                    report={report as any}
                    mode={mode}
                    initialHtmlString={
                      htmlString ??
                      getReportHtmlString(
                        report,
                        chipOptions as Clause_v2[],
                        service as Service,
                        serviceInstructeur ?? undefined,
                      )
                    }
                  />
                ) : null}
              </Stack>
            </Center>
          </SendForm>
        ) : null}
      </TextEditorContextProvider>
    </Box>
  );
};

const SentEmailInfos = ({ report }: { report: Report }) => {
  const query = useDbQuery(
    db.selectFrom("sent_email").where("report_id", "=", report.id).orderBy("sent_at asc").selectAll(),
  );

  const groupedByDay = query.data?.reduce(
    (acc, email) => {
      if (!email.sent_at || !email.sent_to) return acc;

      const day = format(new Date(email.sent_at), "dd/MM/yyyy");
      if (!acc[day]) acc[day] = [];
      acc[day].push(email.sent_to);

      return acc;
    },
    {} as Record<string, string[]>,
  );

  if (!groupedByDay) return null;

  return (
    <Flex flexDirection="column" flexShrink={0} color="text-mention-grey">
      {Object.entries(groupedByDay).map(([day, emails]) => (
        <Box key={day}>
          Envoyé le {day} à {emails.join(", ")}
        </Box>
      ))}
    </Flex>
  );
};

const SendForm = ({
  children,
  generatePdf,
  report,
}: PropsWithChildren<{ report: Report; generatePdf: (args: { htmlString: string; recipients: string }) => void }>) => {
  const { editor } = useContext(TextEditorContext);

  const form = useForm({ defaultValues: { recipients: "" } });
  const userSettings = useUserSettings();

  useQuery({
    queryKey: ["service-instructeur", report.serviceInstructeur, report.applicantEmail],
    queryFn: async () => {
      const defaultRecipients = userSettings.userSettings.default_emails ?? "";
      const recipents = await getBaseRecipients(report, defaultRecipients);

      if (!form.getValues("recipients")) {
        const recipientsArray = recipents.split(",");
        const noDup = Array.from(new Set(recipientsArray)).join(",");

        form.setValue("recipients", noDup ?? "");
      }
      return null;
    },
    enabled: !userSettings.isLoading,
    refetchOnWindowFocus: false,
  });

  const send = (values: { recipients: string }) => {
    const recipients = values.recipients
      .split(/,|\s|;/)
      .filter(Boolean)
      .join(",");

    generatePdf({ htmlString: editor?.getHTML() ?? "", recipients });
  };

  return (
    <Box component="form" onSubmit={form.handleSubmit(send)} display="flex" flex="1" flexDirection="column">
      <FormProvider {...form}>{children}</FormProvider>
    </Box>
  );
};

const getBaseRecipients = async (report: Report, extra?: string) => {
  const serviceEmail = report.serviceInstructeur
    ? (
        await db.selectFrom("service_instructeurs").where("id", "=", report.serviceInstructeur).selectAll().execute()
      )?.[0]?.email
    : null;

  const recipients = [extra, serviceEmail, report.applicantEmail].filter(Boolean).join(",");
  return recipients;
};

const getModeTitle = (mode: Mode) => {
  switch (mode) {
    case "edit":
      return "Mise en page";
    case "view":
      return "Prévisualisation";
    case "send":
      return "Courriels";
  }
};

const DownloadButton = () => {
  const navigate = useNavigate();

  return (
    <Button type="button" onClick={() => navigate({ search: { mode: "send" } as any })} iconId="ri-send-plane-fill">
      Envoyer
    </Button>
  );
};

const EditBanner = ({
  mode,
  title,
  buttons,
  reportId,
}: {
  mode: Mode;
  title: ReactNode;
  buttons: ReactNode;
  reportId?: string;
}) => {
  const router = useRouter();
  const navigate = useNavigate();
  const goBack = () =>
    reportId
      ? navigate({ to: "/edit/$reportId", params: { reportId }, search: { tab: "notes" } })
      : router.history.back();

  const form = useFormContext();
  const recipients = useWatch({ control: form.control, name: "recipients" });

  const isSend = mode === "send";
  const isView = mode === "view";
  const isEdit = mode === "edit";

  return (
    <>
      <Banner
        status="saved"
        zIndex={3}
        position={{ xs: "sticky", lg: "sticky" }}
        top={{ xs: "-1px", lg: "-1px" }}
        flexDirection="column"
        maxWidth={{ xs: "100vw", lg: "unset" }}
        height={{ xs: "56px", lg: "unset" }}
      >
        <Flex flexDirection="row" justifyContent={"center"} width="100%">
          <Flex
            flexDirection={{ xs: isSend ? "column" : "row", lg: "row" }}
            justifyContent={"flex-start"}
            alignItems={isSend ? undefined : "center"}
            width={{ xs: "100%", lg: "1000px" }}
            maxWidth={{ xs: "100%", lg: "1000px" }}
            height={isSend || isView ? undefined : "header-height"}
            px="16px"
          >
            <Flex
              flex={1}
              flexShrink="0"
              justifyContent={{ xs: isSend ? "space-between" : undefined, lg: "flex-start" }}
              alignItems={{ xs: isView ? "flex-start" : "center", lg: "flex-start" }}
              mr={"8px"}
              mt={{ xs: isView ? "32px" : 0, lg: isSend || isView ? "32px" : 0 }}
              mb={isView ? "32px" : 0}
            >
              <Box>
                <Box
                  className={"ri-arrow-left-line"}
                  component="a"
                  href={""}
                  onClick={(e) => {
                    e.preventDefault();
                    goBack();
                  }}
                  sx={{
                    display: { xs: "none", lg: "inline-flex" },
                    "::before": {
                      width: "16px !important",
                      mb: "4px !important",
                      mr: "4px",
                    },
                  }}
                  fontSize="16px"
                  whiteSpace="nowrap"
                >
                  Retour
                </Box>
              </Box>
              <Box
                className={"ri-arrow-left-line"}
                component="a"
                onClick={(e) => {
                  e.preventDefault();
                  goBack();
                }}
                display={{ lg: "none" }}
                mt={isSend ? "8px" : 0}
                pr="8px"
                color="black"
                fontSize="16px"
              ></Box>
              <Box
                display={{ xs: isEdit ? "none" : "block", lg: "block" }}
                flexShrink="0"
                width="100%"
                minWidth="0"
                ml={{ xs: "0", lg: "32px" }}
                mt={{ xs: isSend ? "16px" : 0, lg: 0 }}
                pr="8px"
                textAlign="center"
              >
                {title}
              </Box>
            </Flex>

            {isSend ? (
              <Box width="100%" ml={{ xs: 0, lg: "16px" }} mr="16px" mt="16px" mb="16px">
                <EmailInput
                  value={recipients.split(",")}
                  onValueChange={(value) => form.setValue("recipients", value.join(","))}
                />
              </Box>
            ) : null}
            <Flex
              display={{ xs: isView ? "none" : "flex", lg: "flex" }}
              gap="8px"
              alignItems="center"
              alignSelf={{ xs: "center", lg: "flex-start" }}
              my={{ xs: 0, lg: isSend ? "24px" : "20px" }}
              // mb={{ xs: isSend ? "16px" : 0, lg: 0 }}
            >
              {buttons}
            </Flex>
          </Flex>
        </Flex>
      </Banner>
      {isView ? (
        <Flex
          display={{ lg: "none" }}
          justifyContent="space-between"
          alignSelf="center"
          width="100%"
          mt={{ xs: "16px" }}
          mb={{ xs: isSend ? "16px" : 0, lg: 0 }}
          px="16px"
        >
          {buttons}
        </Flex>
      ) : null}
    </>
  );
};

export const WithReport = ({
  initialHtmlString,
  mode,
  report,
}: {
  initialHtmlString: string;
  mode: Mode;
  report: Report & { pictures: PdfImage[] };
}) => {
  const { editor } = useContext(TextEditorContext);
  const [htmlString] = useState(initialHtmlString);
  useEffect(() => {
    if (!editor) return;

    editor.commands.setContent(htmlString);
  }, [editor]);

  const { service } = useUser()!;

  const ViewDocument = (
    <View
      service={service as Service}
      htmlString={editor?.getHTML() ?? ""}
      images={{ marianne: "/marianne.png", marianneFooter: "/marianne_footer.png" }}
      pictures={report.pictures}
    />
  );

  if (mode === "view") return ViewDocument;

  if (mode === "send") {
    return (
      <SendReportPage>
        <Box>{ViewDocument}</Box>
      </SendReportPage>
    );
  }

  return (
    <Box p="16px">
      <TextEditor />
    </Box>
  );
};

const View = (props: ReportPDFDocumentProps) => {
  const query = useQuery({
    queryKey: ["report-pdf", props.htmlString],
    queryFn: async () => {
      const blob = await pdf(<ReportPDFDocument {...props} />).toBlob();
      return blob;
    },
    refetchOnWindowFocus: false,
    enabled: !!props.htmlString,
  });

  if (query.isLoading)
    return (
      <Center height="100%">
        <Spinner />
      </Center>
    );

  return (
    <Box px="16px">
      <PdfCanvas blob={query.data as Blob} />
    </Box>
  );
};

export const PdfCanvas = ({ blob }: { blob: Blob }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const file = useMemo(() => URL.createObjectURL(blob), [blob]);
  const { pdfDocument } = usePdf({
    file,
    canvasRef,
    workerSrc: "/pdfjs/build/pdf.worker.min.mjs",
  });

  const nbPages = pdfDocument?.numPages;

  return (
    <>
      {makeArrayOf(nbPages ?? 1).map((_, page) => (
        <PdfCanvasPage key={page} file={file} page={page + 1} />
      ))}
    </>
  );
};

const PdfCanvasPage = ({ file, page }: { file: string; page: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  usePdf({
    scale: 1.2,
    file,
    page: page,
    canvasRef,
    workerSrc: "/pdfjs/build/pdf.worker.min.mjs",
  });

  return (
    <Box
      ref={canvasRef}
      component="canvas"
      width={{ xs: "100%", lg: "800px" }}
      my="16px"
      boxShadow="0px 10.18px 30.54px 0px #00001229"
    />
  );
};

const SendReportPage = ({ children }: PropsWithChildren) => {
  const { reportId } = Route.useParams();
  // const reportQuery = useLiveQuery(db.report.liveUnique({ where: { id: reportId } }));
  const reportQuery = useDbQuery(db.selectFrom("report").where("id", "=", reportId).selectAll());

  const form = useFormContext();

  if (reportQuery.isLoading) return null;

  const report = reportQuery.data?.[0];

  if (!report) return <div>Report not found</div>;

  return (
    <Center>
      <Flex flexDirection="column" alignItems="center" width={{ xs: "100%", lg: "800px" }}>
        {/* <Input
          className={css({ w: "100%", mt: "16px", px: { xs: "16px", lg: "unset" } })}
          label="Destinataires"
          hintText="Liste de courriels, séparés par des virgules ou des espaces"
          textArea
          nativeTextAreaProps={{
            ...form.register("recipients"),
            rows: 4,
          }}
        /> */}

        {children}
      </Flex>
    </Center>
  );
};

// const validateEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Route = createFileRoute("/pdf/$reportId")({
  component: () => (
    <EnsureUser>
      <PDF />
    </EnsureUser>
  ),
  validateSearch: (search: Record<string, unknown>) => {
    const mode = search?.mode as Mode;
    const isModeValid = ["view", "edit", "send", "sent"].includes(mode);

    return {
      mode: isModeValid ? mode : "view",
    } as { mode: Mode };
  },
});

declare global {
  var editor: Editor;
}
