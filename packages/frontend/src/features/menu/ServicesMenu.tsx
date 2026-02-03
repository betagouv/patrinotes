import { useUser } from "../../contexts/AuthContext";
import { ServiceInstructeurs } from "../../db/AppSchema";
import { db, useDbQuery } from "../../db/db";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Spinner } from "#components/Spinner.tsx";
import { MenuTitle } from "./MenuTitle";
import { fr } from "@codegouvfr/react-dsfr";
import { useMutation } from "@tanstack/react-query";
import { transformBold } from "./ClauseMenu";
import { v4 } from "uuid";
import { Box, Typography } from "@mui/material";
import { Button, Input } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Divider } from "#components/ui/Divider.tsx";

type MenuMode = "view" | "add" | "edit";

export const ServicesMenu = () => {
  const user = useUser()!;
  const services = useDbQuery(
    db
      .selectFrom("service_instructeurs")
      .where("service_id", "=", user.service_id)
      .orderBy("short_name asc")
      .selectAll(),
  );

  const [mode, setMode] = useState<MenuMode>("view");

  const [bannerProps, setBannerProps] = useState<BannerProps | null>(null);

  const createServiceMutation = useMutation({
    mutationFn: async (service: ServiceInstructeurs) => {
      await db
        .insertInto("service_instructeurs")
        .values({ ...service, id: v4(), service_id: user.service_id })
        .execute();

      setBannerProps({
        status: "success",
        icon: fr.cx("ri-check-fill"),
        text: `Service ajouté`,
      });
      setMode("view");
    },
  });

  const editServicesMutation = useMutation({
    mutationFn: async (newServices: ServiceInstructeurs[]) => {
      const { updatedServices } = getDiff(services!.data, newServices);

      for (const service of updatedServices) {
        await db.updateTable("service_instructeurs").set(service).where("id", "=", service.id).execute();
      }

      setBannerProps({
        status: "success",
        icon: fr.cx("ri-check-fill"),
        text: `Modifications enregistrées`,
      });
      setMode("view");
    },
  });

  if (services.isLoading) {
    return (
      <Box height="100%">
        <Spinner />
      </Box>
    );
  }

  const isEditing = mode === "edit";
  const isAdding = mode === "add";

  const buttons =
    isEditing || isAdding ? (
      <>
        <Button
          sx={{
            "::before": {
              ml: "0 !important",
              mr: { xs: "0 !important", lg: "8px !important" },
            },
            display: { xs: "none", lg: "inline-flex" },
          }}
          disabled={editServicesMutation.isPending}
          iconId="ri-save-fill"
          priority="primary"
          type="submit"
          nativeButtonProps={{
            form: isEditing ? "edit-form" : "add-form",
          }}
        >
          Enregistrer
        </Button>
      </>
    ) : (
      <>
        <Button
          sx={{
            display: { xs: "none", lg: "inline-flex" },
            "::before": {
              ml: "0 !important",
              mr: { xs: "0 !important", lg: "8px !important" },
            },
          }}
          nativeButtonProps={{ type: "button" }}
          iconId="ri-pencil-fill"
          priority="secondary"
          onClick={(e) => {
            e.preventDefault();
            setBannerProps({
              status: "idle" as BannerStatus,
              icon: fr.cx("fr-icon-alert-fill"),
              text: "**Vous modifiez les services pour toute l’UDAP.**",
            });
            setMode("edit");
          }}
        >
          Modifier
        </Button>
        <Button
          sx={{
            display: { xs: "none", lg: "inline-flex" },
            "::before": {
              ml: "0 !important",
              mr: { xs: "0 !important", lg: "8px !important" },
            },
          }}
          nativeButtonProps={{ type: "button" }}
          iconId="ri-add-fill"
          priority="secondary"
          onClick={(e) => {
            e.preventDefault();
            setBannerProps({
              status: "idle" as BannerStatus,
              icon: fr.cx("fr-icon-alert-fill"),
              text: "**Vous ajoutez un service pour toute l’UDAP.**",
            });
            setMode("add");
          }}
        >
          Ajouter
        </Button>
      </>
    );

  return (
    <Flex flexDirection="column" height="100%">
      <MenuTitle buttons={buttons} alert={bannerProps ? <ServiceFormBanner {...bannerProps} /> : null}>
        <Box pl={{ xs: "8px", lg: "0" }}>Services instructeurs et urbanistes</Box>
      </MenuTitle>

      <Flex gap="80px" flexDirection="column" px={{ xs: "8px", lg: "32px" }} pb="40px">
        {isAdding ? <ServiceAdd addService={createServiceMutation.mutate} /> : null}
        <ServicesList services={services.data} mode={mode} editServices={editServicesMutation.mutate} />
      </Flex>
    </Flex>
  );
};

type BannerProps = {
  text: string;
  icon: string;
  status: BannerStatus;
};

type BannerStatus = "idle" | "success";

const ServiceFormBanner = ({ status, icon, text }: BannerProps) => {
  const bgColor = status === "idle" ? "#E8EDFF" : "#B8FEC9";
  const iconColor = status === "idle" ? "#0063CB" : "#18753C";

  return (
    <Flex bgcolor={bgColor} mb="24px" py="16px" px="32px">
      <i className={icon} style={{ color: iconColor }} />
      <Box dangerouslySetInnerHTML={{ __html: transformBold(text) }} ml="16px" pr="24px" color={iconColor}></Box>
    </Flex>
  );
};

const ServicesList = ({
  services,
  mode,
  editServices,
}: {
  services: ServiceInstructeurs[];
  mode: MenuMode;
  editServices: (services: ServiceInstructeurs[]) => any;
}) => {
  const form = useForm<{ services: ServiceInstructeurs[] }>({
    defaultValues: {
      services,
    },
  });

  const { fields, remove } = useFieldArray({ control: form.control, name: "services" });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      await db.deleteFrom("service_instructeurs").where("id", "=", id).execute();
      remove(fields.findIndex((field) => field.id === id));
    },
  });

  useEffect(() => {
    form.reset({ services });
  }, [mode]);

  const isEditing = mode === "edit";
  return (
    <Box
      component="form"
      onSubmit={form.handleSubmit((data) => isEditing && editServices(data.services))}
      id="edit-form"
      height="100%"
    >
      <Flex gap="24px" flexDirection="column" height="100%">
        {isEditing
          ? fields.map((field, index) => (
              <ServiceForm
                dividerBelow={index < fields.length - 1}
                key={field.id}
                name={`services[${index}]`}
                form={form}
                deleteService={deleteServiceMutation.mutate}
              />
            ))
          : services.map((service) => <Service key={service.id} service={service} />)}
      </Flex>
    </Box>
  );
};

const getDiff = (baseServices: ServiceInstructeurs[], modifiedServices: ServiceInstructeurs[]) => {
  const updatedServices = modifiedServices.filter((c) => {
    const baseService = baseServices.find((bc) => bc.id === c.id);
    return (
      baseService &&
      (baseService.full_name !== c.full_name ||
        baseService.short_name !== c.short_name ||
        baseService.email !== c.email ||
        baseService.tel !== c.tel)
    );
  });

  return { updatedServices };
};

const ServiceAdd = ({ addService }: { addService: (service: ServiceInstructeurs) => any }) => {
  const form = useForm<ServiceInstructeurs>({
    defaultValues: {
      full_name: "",
      short_name: "",
      email: "",
      tel: "",
    },
  });

  return (
    <Box component="form" onSubmit={form.handleSubmit((data) => addService(data))} id="add-form">
      <Flex>
        <ServiceForm form={form} dividerBelow />
      </Flex>
    </Box>
  );
};

const ServiceForm = ({
  name,
  form,
  dividerBelow,
  deleteService,
}: {
  name?: string;
  form: any;
  dividerBelow?: boolean;
  deleteService?: (id: string) => any;
}) => {
  const prefix = name ? `${name}.` : "";

  return (
    <Flex flexDirection="column" width="100%" height="100%">
      <Input
        sx={{ flex: "1" }}
        label="Intitulé complet"
        nativeInputProps={form.register(`${prefix}full_name`, { required: true })}
      />
      <Flex gap={{ xs: "8px", lg: "20px" }}>
        <Input
          sx={{ flex: "1" }}
          label="Abréviation"
          nativeInputProps={form.register(`${prefix}short_name`, { required: true })}
        />
        <Input sx={{ flex: "1" }} label="Téléphone" nativeInputProps={form.register(`${prefix}tel`)} />
      </Flex>

      <Flex>
        <Input sx={{ flex: "1" }} label="Courriel" nativeInputProps={form.register(`${prefix}email`)} />
      </Flex>

      {deleteService ? (
        <Flex justifyContent="flex-end" my={{ xs: "24px", lg: "40px" }}>
          <Button
            iconId="ri-delete-bin-fill"
            iconPosition="right"
            priority="tertiary"
            nativeButtonProps={{ type: "button" }}
            onClick={() => deleteService(form.watch(`${prefix}id`))}
          >
            Supprimer
          </Button>
        </Flex>
      ) : null}
      {dividerBelow ? <Divider /> : null}
    </Flex>
  );
};

const Service = ({ service }: { service: ServiceInstructeurs }) => {
  return (
    <Flex flexDirection="column">
      <Box color={fr.colors.decisions.text.title.blueFrance} fontWeight="bold">
        {service.short_name}
      </Box>
      <Box>
        <Typography fontWeight="bold">{service.full_name}</Typography>
        {" : "}
        <Typography>{service.email}</Typography>
        {", "}
        <Typography textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
          {service.tel}
        </Typography>
      </Box>
    </Flex>
  );
};
