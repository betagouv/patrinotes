// import { serviceInstructeurs } from "@patrinotes/pdf";
import { Autocomplete, Box } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import { useStyles } from "tss-react";
import { Report, ServiceInstructeurs } from "../db/AppSchema";
import { db, useDbQuery } from "../db/db";

export const ServiceInstructeurSelect = ({ disabled }: { disabled?: boolean }) => {
  const form = useFormContext<Report>();

  const value = useWatch({ control: form.control, name: "serviceInstructeur" });
  const { cx } = useStyles();

  const serviceInstructeursQuery = useDbQuery(db.selectFrom("service_instructeurs").selectAll());
  if (serviceInstructeursQuery.isLoading) return null;

  const rawItems = serviceInstructeursQuery.data ?? [];

  const selectItem = (item: ServiceInstructeurs | null) => {
    form.setValue("serviceInstructeur", item?.id || null);
  };

  return (
    <Autocomplete
      disabled={disabled}
      disablePortal
      options={rawItems}
      getOptionLabel={(item) => item.short_name || ""}
      value={value ? rawItems.find((item) => item.id == value) : null}
      onChange={(_e, item) => {
        selectItem(item || null);
      }}
      renderInput={(params) => (
        <div className="fr-input-group">
          <label className="fr-label" htmlFor={params.id}>
            Service instructeur
          </label>
          <Box ref={params.InputProps.ref} mt="8px">
            <input
              {...params.inputProps}
              disabled={disabled}
              className={cx(params.inputProps.className, "fr-input")}
              placeholder={"Sélectionner un service instructeur"}
              type={"text"}
            />
          </Box>
        </div>
      )}
      noOptionsText="Aucun résultat"
    />
  );
};
