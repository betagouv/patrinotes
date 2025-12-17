import { fr } from "@codegouvfr/react-dsfr";
import { useMachine } from "@xstate/react";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useClickAway } from "react-use";
import { Report } from "../db/AppSchema";
import { AddressSuggestion, searchAddress } from "../features/address";
import { useIsFormDisabled } from "../features/DisabledContext";
import { createSuggestionMachine } from "../features/suggestionsMachine";
import { Box, Stack, Typography } from "@mui/material";
import { Badge, Input } from "./MUIDsfr";
import { Flex } from "./ui/Flex";

export const SmartAddressInput = () => {
  const form = useFormContext<Report>();
  const isFormDisabled = useIsFormDisabled();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [state, send] = useMachine(addressMachine, {});

  useClickAway(wrapperRef, () => {
    send({ type: "BLUR" });
  });

  const isOpen = state.matches("suggesting") || state.matches("error");
  const isLoading = state.matches("fetching");
  const suggestions = state.context.suggestions;

  const inputProps = form.register("applicantAddress");

  return (
    <Stack mb="28px">
      <Box ref={wrapperRef} position="relative" width="100%">
        <Input
          sx={{ mb: "8px" }}
          label={
            <Flex flexDirection="row" alignItems="center">
              <Typography mr="12px">Adresse (numéro, voie)</Typography>
              {isLoading ? (
                <Box display={{ xs: "none", lg: "block" }}>
                  <LoadingBadge />
                </Box>
              ) : null}
            </Flex>
          }
          disabled={isFormDisabled}
          nativeInputProps={{
            autoComplete: "new-password",
            ...inputProps,
            onChange: (e) => {
              inputProps.onChange(e);
              send({ type: "TYPE", value: e.target.value });
            },
            onFocus: () => send({ type: "FOCUS" }),
          }}
        />

        {isOpen ? (
          <Box
            bgcolor={"white"}
            zIndex="10"
            position="absolute"
            borderRadius="5px"
            width="100%"
            height="300px"
            maxHeight="400px"
            overflow="auto"
          >
            {isLoading ? null : suggestions.length === 0 ? (
              "Aucun résultat"
            ) : (
              <Box>
                {suggestions.map((item) => (
                  <Box
                    key={item.label}
                    onClick={() => {
                      form.setValue("applicantAddress", item?.address ?? "");
                      form.setValue("zipCode", item?.zipCode ?? "");
                      form.setValue("city", item?.city ?? "");

                      send({ type: "SELECT", item: item });
                    }}
                    sx={{
                      cursor: "pointer",
                      ":hover": {
                        bgcolor: fr.colors.decisions.background.contrast.grey.default,
                      },
                    }}
                    p="8px"
                  >
                    {item.label}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ) : (
          <Box></Box>
        )}
      </Box>
      {isLoading ? (
        <Box display={{ lg: "none" }} mt="8px">
          <LoadingBadge />
        </Box>
      ) : null}
    </Stack>
  );
};

const LoadingBadge = () => {
  return (
    <Badge
      sx={{
        display: "flex",
        flexDir: "row",
        alignItems: "center",
        fontWeight: "normal",
      }}
      severity="info"
      noIcon
    >
      <Box
        className={fr.cx("fr-icon-refresh-line", "fr-icon--sm")}
        component="i"
        sx={{
          "::before": {
            verticalAlign: "middle",
            mr: "4px",
          },
        }}
      ></Box>
      Recherche en cours
    </Badge>
  );
};

const addressMachine = createSuggestionMachine<AddressSuggestion>({
  fetchSuggestions: (query: string) => searchAddress(query),
});
