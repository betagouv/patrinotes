import { Flex } from "#components/ui/Flex.tsx";
import { Box, BoxProps, LinkBaseProps, LinkProps, Stack, styled, Typography } from "@mui/material";
import { StateReportFormType, useIsStateReportDisabled, useStateReportFormContext } from "../utils";
import { UseFormRegisterReturn, useWatch } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert, Button, Input } from "#components/MUIDsfr.tsx";
import { PropsWithChildren, useState } from "react";
import { IconLink } from "#components/ui/IconLink.tsx";
import { ButtonsSwitch } from "../WithReferencePop";
import { useIsDesktop } from "../../../hooks/useIsDesktop";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../../api";
import { db, useDbQuery } from "../../../db/db";
import { PopImage, PopObjet } from "../../../db/AppSchema";
import { useIsOnline } from "../../../hooks/useIsOnline";
import { downloadFile } from "../../../utils";
import { getStateReportMailName } from "@patrinotes/pdf/constat";
import { getRouteApi, Link } from "@tanstack/react-router";
import { Divider } from "#components/ui/Divider.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { MHAddressAutocomplete } from "../MHAddressAutocomplete";
import { Accordion } from "#components/MUIDsfr.tsx";
import { PlanDeSituationModal } from "./PlanDeSituationModal";
import { MonumentUpInfos, useIsMonumentComplexe } from "../../up/MonumentUpInfos";
import { MonumentConstatRow, useMonumentConstats } from "../../fiche/useMonumentConstats";
import { ObjetAnnotationModal } from "../../fiche/alerts/ObjetAnnotationModal";
import type { MonumentAlertContext } from "../../fiche/alerts/monumentAlerts";
// import { PlanDeSituationModal } from "./PlanDeSituationModal";

const routeApi = getRouteApi("/constat/$constatId");

export const MonumentHistorique = () => {
  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: "reference_pop" });
  const isDesktop = useIsDesktop();

  const { mode } = routeApi.useSearch();

  const referencePop = useWatch({ control: form.control, name: "reference_pop" });
  const isCustom = referencePop === "CUSTOM";

  const isDisabled = useIsStateReportDisabled();
  const adresse = useWatch({ control: form.control, name: "adresse" });
  const upId = useWatch({ control: form.control, name: "up_id" });
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const isEditing = mode === "edit" || isCustom;
  const isComplexe = useIsMonumentComplexe() && !isCustom;
  return (
    <Flex
      flexDirection="column"
      height="100%"
      sx={{
        ".fr-input-group:not(:last-child)": {
          marginBottom: "16px !important",
        },
      }}
    >
      <Flex
        flexDirection="column"
        px={{ xs: "16px", lg: "64px" }}
        pt={{ xs: "24px", lg: "14px" }}
        gap={isEditing ? 0 : "16px"}
        sx={{
          ".fr-input-group": { width: "100%" },
        }}
        width="100%"
        flex="1"
      >
        <Typography
          display={{
            xs: "none",
            lg: "block",
          }}
          fontSize="16px !important"
          variant="h3"
          fontWeight="500"
          pt="0 !important"
          component="h3"
          mb="24px"
          color={fr.colors.decisions.text.actionHigh.blueFrance.default}
        >
          Informations
        </Typography>
        {referencePop && !isCustom ? (
          <Box mb={{ xs: "8px", lg: "16px" }}>
            <Link
              to="/monument/$reference"
              params={{ reference: referencePop }}
              search={upId ? { up: upId } : {}}
              className="fr-link fr-icon-arrow-right-line fr-link--icon-right"
            >
              {upId ? "Voir la fiche de l’unité patrimoniale" : "Voir la fiche du monument"}
            </Link>
          </Box>
        ) : null}
        {isComplexe ? (
          <>
            <MonumentUpInfos />
            <Divider my={isEditing ? "24px" : { xs: "16px", lg: "8px" }} />
          </>
        ) : null}
        <Flex flexDirection={{ xs: "column", lg: "row" }} width="100%" gap={isEditing ? { xs: 0, lg: "16px" } : "16px"}>
          <Box flex="1">
            <EditableField
              label="Nature de l'édifice"
              field="nature_edifice"
              isEditing={isEditing}
              isDisabled={!isCustom || isDisabled}
            />
          </Box>
          <Box flex="1" mt={{ xs: isEditing ? "16px" : "0", lg: "0" }}>
            {!isCustom && !isComplexe ? (
              <EditableField
                label="Référence Mérimée"
                field="reference_pop"
                isEditing={isEditing}
                isDisabled
                renderValue={({ value }) => {
                  if (value === "CUSTOM") return null;
                  return (
                    <Typography
                      mt="4px"
                      className="fr-link"
                      component="a"
                      href={`https://pop.culture.gouv.fr/notice/merimee/${value}`}
                      target="_blank"
                      title="pop.culture.gouv.fr - ouvre une nouvelle fenêtre"
                      rel="noopener external"
                    >
                      {value ?? "Non renseigné"}
                    </Typography>
                  );
                }}
              />
            ) : null}
          </Box>
        </Flex>

        <Divider my={isEditing ? "24px" : { xs: "16px", lg: "8px" }} />

        <Flex flexDirection={{ xs: "column", lg: "row" }} width="100%" gap={isEditing ? { xs: 0, lg: "16px" } : "16px"}>
          <EditableField
            label="Adresse"
            field="adresse"
            isEditing={isEditing}
            isDisabled={isDisabled}
            renderInput={(props) => <MHAddressAutocomplete {...props} />}
          />
          {!isCustom ? <EditableField label="Commune" field="commune" isEditing={isEditing} /> : null}
        </Flex>

        <Flex
          flexDirection={{ xs: "column", lg: "row-reverse" }}
          width="100%"
          gap={isEditing ? { xs: 0, lg: "16px" } : "16px"}
          mt={isEditing ? "16px" : 0}
        >
          {isCustom ? (
            <EditableField label="Commune" field="commune" isEditing={isEditing} isDisabled={isDisabled} />
          ) : (
            <EditableField
              label="Commune historique"
              field="commune_historique"
              isEditing={isEditing}
              isDisabled={isDisabled}
            />
          )}
          <EditableField
            label="Référence cadastrale"
            field="reference_cadastrale"
            isEditing={isEditing}
            isDisabled={isDisabled}
          />
        </Flex>

        {referencePop && !isCustom ? (
          <Button
            priority="tertiary"
            iconId="fr-icon-road-map-fill"
            onClick={() => setIsPlanModalOpen(true)}
            type="button"
            sx={{ alignSelf: "flex-start", mt: isEditing ? "8px" : "4px" }}
          >
            Voir le plan de situation
          </Button>
        ) : null}
        {isPlanModalOpen ? (
          <PlanDeSituationModal referencePop={referencePop!} onClose={() => setIsPlanModalOpen(false)} />
        ) : null}

        <Divider my={isEditing ? "24px" : { xs: "16px", lg: "8px" }} />

        <Flex
          flexDirection={{ xs: "column", lg: "row" }}
          width="100%"
          mt={isEditing ? "16px" : "0"}
          gap={isEditing ? { xs: 0, lg: "16px" } : "16px"}
        >
          <Box flex="1">
            <EditableField
              isDisabled={isDisabled}
              label="Nature de la protection"
              field="nature_protection"
              isEditing={isEditing}
            />
          </Box>
          <Box flex="1" mt={{ xs: isEditing ? "16px" : "0", lg: "0" }}>
            {!isCustom ? (
              <EditableField
                isDisabled={isDisabled}
                label="Période de construction"
                field="periode_construction"
                isEditing={isEditing}
              />
            ) : null}
          </Box>
        </Flex>

        <Flex
          width="100%"
          flexDirection={{ xs: "column", lg: isEditing ? "column" : "row" }}
          gap={isEditing ? { xs: 0, lg: "16px" } : "16px"}
          mt={isEditing ? "32px" : "0"}
        >
          <EditableField
            isDisabled={isDisabled}
            renderInput={renderTextAreaInput}
            label="Parties protégées"
            field="parties_protegees"
            isEditing={isEditing}
          />
          {!isCustom ? (
            <EditableField
              isDisabled={isDisabled}
              renderInput={renderTextAreaInput}
              label="Description de l'édifice"
              field="description"
              isEditing={isEditing}
            />
          ) : null}
        </Flex>
        {referencePop ? <PreviousConstats referencePop={referencePop} upId={upId ?? null} /> : null}
        {!isCustom ? <Divider my={isEditing ? "24px" : { xs: "16px", lg: "8px" }} /> : null}
        {!isCustom ? <Box>{isEditing ? <MonumentObjetsEdition /> : <MonumentObjets />}</Box> : null}
        {isEditing && !isCustom ? (
          //@ts-ignore
          <Alert
            severity="info"
            title={undefined}
            description="Les informations modifiées ne seront pas reportées sur sa fiche POP."
            sx={{ mt: "16px" }}
          />
        ) : null}
        {isDesktop ? <ButtonsSwitch isCustom={isCustom} /> : null}
      </Flex>

      <Box position="relative" height="60px" width="100%" mt={{ xs: "16px", lg: "32px" }}>
        <Box
          height="60px"
          bgcolor={fr.colors.decisions.background.contrast.info.default}
          py="18px"
          position="absolute"
          top="0"
          left="0"
          right="calc(-100vw + 100%)"
          bottom="0"
        >
          <Box
            component="a"
            href={`https://pop.culture.gouv.fr/notice/merimee/${value}`}
            title="pop.culture.gouv.fr - ouvre une nouvelle fenêtre"
            target="_blank"
            rel="noopener external"
            sx={{
              marginLeft: { lg: "64px", xs: "16px" },
              color: fr.colors.decisions.text.actionHigh.blueFrance.default,
              textDecoration: "underline",
              textUnderlineOffset: "5px",
            }}
          >
            En savoir plus sur l'édifice
          </Box>
        </Box>
      </Box>

      {!isDesktop ? <ButtonsSwitch isCustom={isCustom} /> : null}
    </Flex>
  );
};

type PreviousConstatRow = MonumentConstatRow;

/**
 * Sent constats of the same monument. For a constat on an unité patrimoniale, only those of that UP;
 * for the whole monument, all of them (each one labelled with its UP).
 */
const PreviousConstats = ({ referencePop, upId }: { referencePop: string; upId: string | null }) => {
  const { constatId } = routeApi.useParams();
  const { rows: allRows } = useMonumentConstats(referencePop, constatId);

  if (!referencePop || referencePop === "CUSTOM") return null;

  const rows = upId ? allRows.filter((c) => c.up_id === upId) : allRows;
  if (!rows.length) return null;

  return (
    <Box mt="16px">
      <Accordion
        label="Constats antérieurs"
        sx={{
          bgcolor: "#ECECFE",
          borderRadius: "4px",
          "::before": {
            boxShadow: "none",
          },
        }}
      >
        <PreviousConstatsList constats={rows} />
      </Accordion>
    </Box>
  );
};

const PreviousConstatsList = ({ constats }: { constats: PreviousConstatRow[] }) => {
  const downloadMutation = useMutation({
    mutationFn: async (constat: PreviousConstatRow) => {
      const base64 = (await api.get("/api/pdf/state-report", {
        query: { stateReportId: constat.id },
      })) as string;
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/pdf" });
      downloadFile(URL.createObjectURL(blob), getStateReportMailName({ titre_edifice: constat.titre_edifice ?? undefined }));
    },
  });

  return (
    <Stack gap="8px" px="16px">
      {constats.map((constat, index) => {
        const label = `${new Date(constat.created_at!).toLocaleDateString("fr-FR")} - visite ${
          constat.nature_visite === "complète" ? "complète" : "partielle"
        }${constat.up_intitule ? ` - ${constat.up_intitule}` : ""}`;
        const isDownloading = downloadMutation.isPending && downloadMutation.variables?.id === constat.id;

        return (
          <Stack key={constat.id}>
            {constat.isLocal ? (
              <Typography
                component="a"
                href={`/constat/${constat.id}/pdf`}
                target="_blank"
                rel="noopener external"
                className="fr-link"
                title="Ouvre le constat dans un nouvel onglet"
                sx={{ textDecoration: "underline", textUnderlineOffset: "5px" }}
              >
                {label}
              </Typography>
            ) : (
              <Typography
                component="a"
                role="button"
                href="#"
                className="fr-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (!downloadMutation.isPending) downloadMutation.mutate(constat);
                }}
                sx={{ textDecoration: "underline", textUnderlineOffset: "5px" }}
              >
                {label}
                {isDownloading ? " (téléchargement…)" : " (PDF)"}
              </Typography>
            )}
            <Typography mt="2px" color={fr.colors.decisions.text.actionHigh.blueFrance.default}>
              Par {constat.redacted_by}
              {constat.service_name && !constat.isLocal ? ` — ${constat.service_name}` : ""}
            </Typography>
            {!constat.isLocal && downloadMutation.isError && downloadMutation.variables?.id === constat.id ? (
              <Typography mt="2px" fontSize="12px" color={fr.colors.decisions.text.actionHigh.redMarianne.default}>
                Le téléchargement a échoué, veuillez réessayer.
              </Typography>
            ) : null}

            {index !== constats.length - 1 ? <Divider my="8px" /> : null}
          </Stack>
        );
      })}
    </Stack>
  );
};

const MonumentObjetsEdition = () => {
  return (
    <Stack>
      <Typography fontWeight="bold">Objets mobiliers conservés</Typography>
      <Typography>
        Vous ne pouvez pas modifier ces informations. Toutefois, vous pouvez{" "}
        <a className="fr-link">signaler une alerte</a> si vous remarquez l’absence ou une détérioration d’un objet
        mobilier.
      </Typography>
    </Stack>
  );
};

const MonumentObjets = () => {
  const form = useStateReportFormContext();
  const monumentReference = useWatch({ control: form.control, name: "reference_pop" });

  const totalCountQuery = useDbQuery(
    db
      .selectFrom("pop_objets")
      .select(db.fn.countAll().as("count"))
      .where("reference_a_une_notice_merimee_mh", "like", "%" + monumentReference?.trim()),
    [monumentReference],
    { throttleMs: 10000 },
  );

  const objetsQuery = useInfiniteQuery({
    queryKey: ["pop-objets", monumentReference],
    queryFn: async (ctx) => {
      const offset = ctx.pageParam.offset;
      const limit = ctx.pageParam.limit;

      const objetsResponse = await db
        .selectFrom("pop_objets")
        .selectAll()
        .where("reference_a_une_notice_merimee_mh", "like", "%" + monumentReference!.trim())
        .limit(limit)
        .offset(offset)
        .execute();

      return { objets: objetsResponse, offset, limit };
    },
    initialPageParam: { offset: 0, limit: 2 },
    getNextPageParam: (lastPage) => {
      return { offset: lastPage.offset + lastPage.limit, limit: 6 };
    },
    enabled: !!monumentReference,
  });

  const total = totalCountQuery.data?.[0]?.count ?? 0;
  const nbShown = objetsQuery.data ? objetsQuery.data.pages.reduce((acc, page) => acc + page.objets.length, 0) : 0;

  const shouldShowLoadMore = nbShown < (total as number);

  return (
    <>
      <Typography variant="subtitle1" fontWeight="bold" mb="8px">
        Objets mobiliers conservés
      </Typography>
      <Typography mb="16px" color={fr.colors.decisions.text.mention.grey.default}>
        Consultez la fiche d’un objet, annotez-le rapidement ou déclenchez une alerte.
      </Typography>
      {objetsQuery.isLoading ? (
        <Box mb="16px" mt="64px">
          <Spinner size={80} />
        </Box>
      ) : (
        <>
          <Stack width="100%" gap="16px">
            {objetsQuery.data?.pages.filter(Boolean).map((page) => (
              <MonumentObjetPage popObjets={page.objets} />
            ))}
          </Stack>
          {shouldShowLoadMore ? (
            <Button
              priority="tertiary"
              sx={{ px: "32px", mt: "16px", width: { xs: "100%", lg: "calc(50% - 8px)" }, justifyContent: "center" }}
              onClick={() => objetsQuery.fetchNextPage()}
            >
              Voir plus de mobiliers
            </Button>
          ) : null}
        </>
      )}
    </>
  );
};

const MonumentObjetPage = ({ popObjets }: { popObjets: PopObjet[] }) => {
  const form = useStateReportFormContext();
  const [referencePop, titreEdifice, commune] = useWatch({
    control: form.control,
    name: ["reference_pop", "titre_edifice", "commune"],
  });
  const [annotated, setAnnotated] = useState<PopObjet | null>(null);
  // an annotation is about the objet, kept on its fiche: not tied to the constat nor to an UP
  const context: MonumentAlertContext = {
    referencePop: (referencePop ?? "").trim(),
    titreEdifice: titreEdifice ?? null,
    commune: commune ?? null,
  };
  const imagesQuery = useQuery({
    queryKey: ["pop-images-for-objets", popObjets.map((o) => o.reference)],
    queryFn: async () => {
      const references = popObjets.map((o) => o.reference);
      const images = await api.get("/api/state-report/objets-images", {
        query: { references: references.join(",") as any },
      });
      return { images: images as PopImage[] };
    },
    refetchOnWindowFocus: false,
    enabled: !!popObjets.length,
  });

  const images = imagesQuery.data?.images ?? [];

  return (
    <>
      {popObjets?.length ? (
        <Flex width="100%" gap="16px" flexDirection={{ xs: "column", lg: "row" }} flexWrap="wrap">
          {popObjets.map((obj) => (
            <MonumentObjetItem
              key={obj.id}
              popObjet={obj}
              images={images.filter((img) => img.reference === obj.reference)}
              onAnnotate={() => setAnnotated(obj)}
            />
          ))}
        </Flex>
      ) : (
        <Flex>
          <Typography>Ce monument ne contient pas d’objets mobiliers.</Typography>
        </Flex>
      )}
      {annotated?.reference ? (
        <ObjetAnnotationModal
          open
          onClose={() => setAnnotated(null)}
          context={{ ...context, objetReference: annotated.reference, objetTitre: annotated.titre_editorial }}
        />
      ) : null}
    </>
  );
};

/** As in the prototype: the whole card opens the « Annotations de visite » of the objet. */
const MonumentObjetItem = ({
  popObjet,
  images,
  onAnnotate,
}: {
  popObjet: PopObjet;
  images: PopImage[];
  onAnnotate: () => void;
}) => {
  return (
    <Flex
      position="relative"
      flexDirection="column"
      flex="1"
      gap="8px"
      border="1px solid"
      borderColor={fr.colors.decisions.border.default.grey.default}
      minWidth={{ xs: "100%", lg: "calc(50% - 8px)" }}
      maxWidth={{ xs: "100%", lg: "calc(50% - 8px)" }}
      sx={{
        "&:hover": { bgcolor: fr.colors.decisions.background.default.grey.hover },
        "&:focus-within": { outline: "2px solid #0a76f6", outlineOffset: "2px" },
      }}
    >
      <Box
        component="img"
        height="216px"
        alt=""
        src={images?.[0]?.url ? images[0].url : "/objet-sans-image.png"}
        sx={{
          objectFit: "cover",
        }}
      />
      <Flex flexDirection="column" justifyContent="space-between" px="16px" gap={"8px"} py="16px" height="100%">
        <Box
          component="button"
          type="button"
          onClick={onAnnotate}
          aria-haspopup="dialog"
          title={`Annoter ${popObjet.titre_editorial || popObjet.reference}`}
          p="0"
          border="none"
          bgcolor="transparent"
          textAlign="left"
          fontSize="20px"
          fontWeight="bold"
          lineHeight="28px"
          color={fr.colors.decisions.text.actionHigh.blueFrance.default}
          sx={{
            cursor: "pointer",
            "&:focus-visible": { outline: "none" },
            // the whole card is clickable
            "&::after": { content: '""', position: "absolute", inset: 0 },
          }}
        >
          {popObjet.titre_editorial || popObjet.reference}
        </Box>
        <Flex alignItems="center" justifyContent="space-between">
          <Typography fontSize="12px" color={fr.colors.decisions.text.mention.grey.default}>
            {popObjet.reference}
          </Typography>
          <Box
            aria-hidden="true"
            color={fr.colors.decisions.text.actionHigh.blueFrance.default}
            className="fr-icon fr-icon-arrow-right-line"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export const ContentBlock = (props: PropsWithChildren<BoxProps>) => {
  return (
    <Flex
      flexDirection={{ xs: "column", lg: "row" }}
      borderBottom={{ xs: "1px solid", lg: "1px solid" }}
      gap={{ xs: "8px", lg: "0" }}
      pb="16px"
      borderColor={fr.colors.decisions.border.default.grey.default + " !important"}
      {...props}
    >
      {props.children}
    </Flex>
  );
};

const EditableField = ({
  label,
  field,
  isEditing,
  isDisabled,
  renderInput = renderBasicInput,
  renderValue = renderBasicValue,
}: {
  label: string;
  field: keyof StateReportFormType;
  isEditing: boolean;
  isDisabled?: boolean;
  renderInput?: (props: { inputProps: UseFormRegisterReturn; label: string; disabled?: boolean }) => React.ReactNode;
  renderValue?: (props: { value: string | number | null | undefined }) => React.ReactNode;
}) => {
  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: field });

  if (isEditing) {
    const props = {
      inputProps: { ...form.register(field) },
      label,
      disabled: isDisabled,
    };
    return renderInput(props);
  }

  return (
    <Flex flexDirection="column" width="100%">
      <Typography variant="subtitle1" fontWeight="bold">
        {label}
      </Typography>
      {renderValue({ value })}
    </Flex>
  );
};

const renderBasicValue = ({ value }: { value: string | number | null | undefined }) => {
  return <Typography mt="4px">{value ?? "Non renseigné"}</Typography>;
};

const renderBasicInput = ({
  inputProps,
  label,
  disabled,
}: {
  inputProps: UseFormRegisterReturn;
  label: string;
  disabled?: boolean;
}) => {
  return <Input label={label} nativeInputProps={{ ...inputProps }} disabled={disabled} />;
};

const renderTextAreaInput = ({
  inputProps,
  label,
  disabled,
}: {
  inputProps: UseFormRegisterReturn;
  label: string;
  disabled?: boolean;
}) => {
  return (
    <Input
      label={label}
      sx={{ width: "100%" }}
      textArea
      nativeTextAreaProps={{ rows: 5, ...inputProps, disabled }}
      disabled={disabled}
    />
  );
};
