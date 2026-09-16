import { InputProps } from "@codegouvfr/react-dsfr/Input";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { useMutation } from "@tanstack/react-query";
import { HTMLAttributes, useCallback, useMemo, useRef, useState } from "react";
import { useStyles } from "tss-react";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Paper,
  PaperProps,
  Stack,
  StackProps,
} from "@mui/material";
import { useUser } from "../contexts/AuthContext";
import { db, useDbQuery } from "../db/db";
import { Button } from "./MUIDsfr";
import { Flex } from "./ui/Flex";

export const EmailInput = ({
  label,
  hintText,
  nativeInputProps,
  value,
  onValueChange,
  disabled,
  single,
  sx,
}: Partial<InputProps> & {
  value: string[];
  disabled?: boolean;
  single?: boolean;
  onValueChange: (value: string[]) => void;
  sx?: StackProps["sx"];
}) => {
  const { cx } = useStyles();
  const user = useUser()!;

  const [inputValue, setInputValue] = useState(single ? value[0] ?? "" : "");
  const [statusMessage, setStatusMessage] = useState("");

  const suggestionsQuery = useDbQuery(
    db
      .selectFrom("suggested_email")
      .where("service_id", "=", user.service_id)
      .select(["email"])
      .orderBy("email"),
  );

  const suggestions = useMemo(
    () =>
      Array.from(
        new Set((suggestionsQuery.data ?? []).map((row) => row.email as string).filter(Boolean)),
      ),
    [suggestionsQuery.data],
  );

  const deleteSuggestionMutation = useMutation({
    mutationFn: async (email: string) => {
      await db
        .deleteFrom("suggested_email")
        .where("email", "=", email)
        .where("service_id", "=", user.service_id)
        .execute();
    },
  });

  const commitEmails = (next: readonly string[]) => {
    const cleaned = next.map((email) => email.trim()).filter(Boolean);
    onValueChange(Array.from(new Set(cleaned)));
  };

  const addFromInput = () => {
    const email = inputValue.trim();
    if (!email) return;
    if (value.includes(email)) {
      setStatusMessage(`${email} est déjà dans la liste`);
    } else {
      commitEmails([...value, email]);
      setStatusMessage(`${email} ajoutée`);
    }
    setInputValue("");
  };

  // tracks how many suggestions the list is currently showing, so the
  // "removal applies to the whole service" notice only renders alongside them
  const shownCountRef = useRef(0);

  const filterOptions = useCallback((options: string[], state: { inputValue: string }) => {
    const query = state.inputValue.trim().toLowerCase();
    const result = query ? options.filter((option) => option.toLowerCase().includes(query)) : [];
    shownCountRef.current = result.length;
    return result;
  }, []);

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <div className="fr-input-group">
      {label ? (
        <label className="fr-label" htmlFor={params.id}>
          {label}
          {hintText ? <span className="fr-hint-text">{hintText}</span> : null}
        </label>
      ) : null}
      <Box ref={params.InputProps.ref} mt={label ? "8px" : 0}>
        <input
          {...nativeInputProps}
          {...params.inputProps}
          disabled={disabled}
          type="text"
          inputMode="email"
          autoComplete="off"
          data-lpignore="true"
          data-form-type="other"
          className={cx(nativeInputProps?.className, params.inputProps.className, "fr-input")}
        />
      </Box>
    </div>
  );

  // renders each suggestion with a "remove from the whole service" button
  const renderOption = (props: HTMLAttributes<HTMLLIElement>, option: string) => (
    <Box component="li" {...props} key={option} sx={{ position: "relative", pr: "40px !important" }}>
      <Box flex={1}>{option}</Box>
      {/* @ts-ignore priority typing */}
      <Button
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          backgroundColor: "transparent",
        }}
        type="button"
        priority="tertiary no outline"
        iconId="ri-close-line"
        title={`Supprimer ${option} des suggestions du service`}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          deleteSuggestionMutation.mutate(option);
        }}
      />
    </Box>
  );

  const PaperComponent = useMemo(
    () =>
      function PaperWithNotice(props: PaperProps) {
        return (
          <Paper {...props}>
            {props.children}
            {shownCountRef.current > 0 ? (
              <Box
                bgcolor="#ECECFE"
                width="100%"
                minHeight="46px"
                p="8px"
                color="#000091"
                textAlign="center"
              >
                La suppression de contact s'appliquera à tout le service
              </Box>
            ) : null}
          </Paper>
        );
      },
    [],
  );

  return (
    <Stack sx={sx}>
      <Box mb="1rem">
        {single ? (
          <Autocomplete
            freeSolo
            disabled={disabled}
            disablePortal
            options={suggestions}
            noOptionsText="Aucun résultat"
            filterOptions={filterOptions}
            renderInput={renderInput}
            renderOption={renderOption}
            PaperComponent={PaperComponent}
            value={value[0] ?? ""}
            inputValue={inputValue}
            onInputChange={(_e, next) => {
              setInputValue(next);
              onValueChange([next.trim()]);
            }}
            onChange={(_e, next) => {
              const email = (typeof next === "string" ? next : "").trim();
              setInputValue(email);
              onValueChange([email]);
            }}
          />
        ) : (
          <Autocomplete
            multiple
            freeSolo
            disableClearable
            disabled={disabled}
            disablePortal
            options={suggestions}
            noOptionsText="Aucun résultat"
            filterOptions={filterOptions}
            renderInput={renderInput}
            renderOption={renderOption}
            PaperComponent={PaperComponent}
            // tags are rendered below the field, so keep MUI's in-field adornment empty
            renderTags={() => null}
            value={value.filter(Boolean)}
            inputValue={inputValue}
            onInputChange={(_e, next, reason) => {
              if (reason !== "reset") setInputValue(next);
            }}
            onChange={(_e, next) => {
              commitEmails(next as string[]);
              setInputValue("");
            }}
          />
        )}
      </Box>

      {!single ? (
        <Flex gap="12px" flexDirection={{ xs: "column", lg: "row" }}>
          <Box>
            {/* @ts-ignore priority typing */}
            <Button
              style={{ zIndex: 1 }}
              type="button"
              priority="secondary"
              iconId="ri-add-line"
              disabled={disabled}
              onClick={addFromInput}
            >
              Ajouter
            </Button>
          </Box>

          <Flex
            gap="8px"
            justifyContent="flex-start"
            alignItems="center"
            width="100%"
            flexWrap="wrap"
            mt="4px"
          >
            {value.filter(Boolean).map((email) => (
              <Tag
                key={email}
                dismissible
                nativeButtonProps={{
                  type: "button",
                  "aria-label": `Retirer ${email}`,
                  onClick: () => onValueChange(value.filter((v) => v !== email)),
                }}
              >
                {email}
              </Tag>
            ))}
          </Flex>
        </Flex>
      ) : null}

      <Box className="fr-sr-only" aria-live="polite" role="status">
        {statusMessage}
      </Box>
    </Stack>
  );
};
