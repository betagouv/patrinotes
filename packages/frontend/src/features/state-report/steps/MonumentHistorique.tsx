import { Flex } from "#components/ui/Flex.tsx";
import { Box, BoxProps, LinkBaseProps, LinkProps, Stack, styled, Typography } from "@mui/material";
import { StateReportFormType, useStateReportFormContext } from "../utils";
import { UseFormRegisterReturn, useWatch } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert, Button, Input } from "#components/MUIDsfr.tsx";
import { PropsWithChildren, useState } from "react";
import { IconLink } from "#components/ui/IconLink.tsx";
import { ButtonsSwitch } from "../WithReferencePop";
import { useIsDesktop } from "../../../hooks/useIsDesktop";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "../../../api";
import { db, useDbQuery } from "../../../db/db";
import { PopImage, PopObjet } from "../../../db/AppSchema";
import { getRouteApi } from "@tanstack/react-router";
import { Divider } from "#components/ui/Divider.tsx";
import { Spinner } from "#components/Spinner.tsx";

const routeApi = getRouteApi("/constat/$constatId");

export const MonumentHistorique = () => {
  const form = useStateReportFormContext();
  const value = useWatch({ control: form.control, name: "reference_pop" });
  const isDesktop = useIsDesktop();

  const { mode } = routeApi.useSearch();
  const isEditing = mode === "edit";

  const referencePop = useWatch({ control: form.control, name: "reference_pop" });
  const isCustom = referencePop === "CUSTOM";

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
        pt={{ xs: "24px", lg: "32px" }}
        gap={isEditing ? 0 : "16px"}
        sx={{
          ".fr-input-group": { width: "100%" },
        }}
        width="100%"
        flex="1"
      >
        <Flex flexDirection={{ xs: "column", lg: "row" }} width="100%" gap={isEditing ? { xs: 0, lg: "16px" } : "16px"}>
          <EditableField label="Nature de l'édifice" field="nature_edifice" isEditing={isEditing} isDisabled />
          <EditableField
            label="Référence POP"
            field="reference_pop"
            isEditing={isEditing}
            isDisabled
            renderInput={
              isCustom
                ? ({ label, disabled }) => renderBasicInput({ inputProps: {} as any, label: "Référence POP", disabled })
                : undefined
            }
            renderValue={({ value }) => {
              if (value === "CUSTOM") return null;
              return (
                <Typography
                  mt="4px"
                  className="fr-link"
                  component="a"
                  href={`https://pop.culture.gouv.fr/notice/merimee/${value}`}
                  target="_blank"
                  rel="noopener external"
                >
                  {value ?? "Non renseigné"}
                </Typography>
              );
            }}
          />
        </Flex>

        <Divider my={isEditing ? "24px" : { xs: "16px", lg: "8px" }} />

        <Flex flexDirection={{ xs: "column", lg: "row" }} width="100%" gap={isEditing ? { xs: 0, lg: "16px" } : "16px"}>
          <EditableField label="Adresse" field="adresse" isEditing={isEditing} />
          <EditableField label="Commune" field="commune" isEditing={isEditing} />
        </Flex>

        <Flex
          flexDirection={{ xs: "column", lg: "row" }}
          width="100%"
          gap={isEditing ? { xs: 0, lg: "16px" } : "16px"}
          mt={isEditing ? "16px" : 0}
        >
          <EditableField label="Commune historique" field="commune_historique" isEditing={isEditing} />
          <EditableField label="Référence cadastrale" field="reference_cadastrale" isEditing={isEditing} />
        </Flex>

        <Divider my={isEditing ? "24px" : { xs: "16px", lg: "8px" }} />

        <Flex flexDirection={{ xs: "column", lg: "row" }} width="100%" gap={isEditing ? { xs: 0, lg: "16px" } : "16px"}>
          <EditableField label="Nature de la protection" field="nature_protection" isEditing={isEditing} />
          <EditableField label="Période de construction" field="periode_construction" isEditing={isEditing} />
        </Flex>

        <Flex
          width="100%"
          flexDirection={{ xs: "column", lg: isEditing ? "column" : "row" }}
          gap={isEditing ? { xs: 0, lg: "16px" } : "16px"}
          mt={isEditing ? "16px" : "0"}
        >
          <EditableField
            renderInput={renderTextAreaInput}
            label="Parties protégées"
            field="parties_protegees"
            isEditing={isEditing}
          />
          <EditableField
            renderInput={renderTextAreaInput}
            label="Description de l'édifice"
            field="description"
            isEditing={isEditing}
          />
        </Flex>
        <Divider my={isEditing ? "24px" : { xs: "16px", lg: "8px" }} />
        <Box>{isEditing ? <MonumentObjetsEdition /> : <MonumentObjets />}</Box>
        {isEditing ? (
          //@ts-ignore
          <Alert
            severity="info"
            title={undefined}
            description="Les informations modifiées ne seront pas reportées sur sa fiche POP."
            sx={{ mt: "16px" }}
          />
        ) : null}
        {isDesktop ? <ButtonsSwitch /> : null}
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
            title="En savoir plus sur l'édifice - Nouvelle fenêtre"
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

      {!isDesktop ? <ButtonsSwitch /> : null}
    </Flex>
  );
};

const getNbToShow = (page: number) => {
  let baseNb = 2;
  return baseNb + (page - 1) * 6;
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
      <Typography variant="subtitle1" fontWeight="bold" mb="16px">
        Objets mobiliers conservés
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
            />
          ))}
        </Flex>
      ) : (
        <Flex>
          <Typography>Ce monument ne contient pas d’objets mobiliers.</Typography>
        </Flex>
      )}
    </>
  );
};

const MonumentObjetItem = ({ popObjet, images }: { popObjet: PopObjet; images: PopImage[] }) => {
  return (
    <Flex
      component="a"
      // @ts-ignore mui error
      href={`https://pop.culture.gouv.fr/notice/palissy/${popObjet.reference}`}
      target="_blank"
      rel="noopener external"
      flexDirection="column"
      flex="1"
      border="1px solid"
      borderColor={fr.colors.decisions.border.default.grey.default}
      gap="8px"
      minWidth={{ xs: "100%", lg: "calc(50% - 8px)" }}
      maxWidth={{ xs: "100%", lg: "calc(50% - 8px)" }}
      sx={{
        "::after": {
          display: "none",
        },
      }}
    >
      <Box
        component="img"
        height="216px"
        src={images?.[0]?.url ? images[0].url : "/objet-sans-image.png"}
        sx={{
          objectFit: "cover",
        }}
      />
      <Flex flexDirection="column" justifyContent="space-between" px="16px" gap={"8px"} py="16px" height="100%">
        <Typography fontSize="20px" color={fr.colors.decisions.text.actionHigh.blueFrance.default} fontWeight="bold">
          {popObjet.titre_editorial}
        </Typography>
        <Flex alignItems="center" justifyContent="space-between">
          <Typography fontSize="12px" color={fr.colors.decisions.text.mention.grey.default}>
            {popObjet.reference}
          </Typography>
          <Box
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
    <Flex flexDirection="column" width="50%">
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

const renderTextAreaInput = ({ inputProps, label }: { inputProps: UseFormRegisterReturn; label: string }) => {
  return <Input label={label} sx={{ width: "100%" }} textArea nativeTextAreaProps={{ rows: 5, ...inputProps }} />;
};
