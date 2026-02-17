import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { useStateReportFormContext } from "./utils";
import { useRef } from "react";
import { useMachine } from "@xstate/react";
import { useClickAway } from "react-use";
import { createSuggestionMachine } from "../suggestionsMachine";
import { AddressSuggestion, searchAddress } from "../address";
import { fromPromise } from "xstate";
import { Box, Stack, Typography } from "@mui/material";
import { Input } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { LoadingBadge } from "#components/SmartAddressInput.tsx";
import { fr } from "@codegouvfr/react-dsfr";

export const MHAddressAutocomplete = ({
  disabled,
  inputProps,
}: {
  disabled?: boolean;
  inputProps: InputProps["nativeInputProps"];
}) => {
  const form = useStateReportFormContext();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [state, send] = useMachine(addressMachine, {});

  useClickAway(wrapperRef, () => {
    send({ type: "BLUR" });
  });

  const isOpen = state.matches("suggesting") || state.matches("error");
  const isLoading = state.matches("fetching");
  const suggestions = state.context.suggestions;

  const props = form.register("adresse");

  return (
    <Stack width="100%">
      <Box ref={wrapperRef} position="relative" width="100%">
        <Input
          sx={{ width: "100%" }}
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
          disabled={disabled}
          nativeInputProps={{
            autoComplete: "new-password",
            ...inputProps,
            onChange: (e) => {
              props.onChange(e);
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
            top="100%"
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
                      form.setValue("adresse", item?.address ?? "");
                      form.setValue("commune", item?.city ?? "");
                      form.setValue("commune_historique", item?.city ?? "");

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

const addressMachine = createSuggestionMachine<AddressSuggestion>({}).provide({
  actors: {
    fetchSuggestions: fromPromise(async ({ input }: { input: { query: string } }) => searchAddress(input.query)),
  },
});
