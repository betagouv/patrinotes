import { InputProps } from "@codegouvfr/react-dsfr/Input";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { useMutation } from "@tanstack/react-query";
import { useMachine } from "@xstate/react";
import { useEffect, useRef } from "react";
import { useClickAway } from "react-use";
import { useUser } from "../contexts/AuthContext";
import { db } from "../db/db";
import { createSuggestionMachine } from "../features/suggestionsMachine";
import { Box, Stack } from "@mui/material";
import { Button, Input } from "./MUIDsfr";
import { Flex } from "./ui/Flex";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { fromPromise } from "xstate";

export const EmailInput = ({
  label,
  hintText,
  nativeInputProps,
  value,
  onValueChange,
  single,
}: Partial<InputProps> & {
  value: string[];
  single?: boolean;
  onValueChange: (value: string[]) => void;
}) => {
  const [state, send] = useMachine(emailMachine, {
    input: {
      query: single ? value[0] : "",
    },
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!single || !state.context.selected) return;
    onValueChange([state.context.selected]);
  }, [state.context.selected]);

  // when clicking on the add button
  const onClick = () => {
    const emailToAdd = state.context.query;
    if (!emailToAdd) return;
    if (!value.includes(emailToAdd)) {
      onValueChange([...value, emailToAdd]);
    }
    send({ type: "CLEAR" });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      onClick();
    }
  };

  useClickAway(wrapperRef, () => {
    send({ type: "BLUR" });
  });

  const user = useUser()!;

  const deleteSuggestionMutation = useMutation({
    mutationFn: async (email: string) => {
      await db
        .deleteFrom("suggested_email")
        .where("email", "=", email)
        .where("service_id", "=", user.service_id)
        .execute();

      send({
        type: "REMOVE",
        item: email,
      });
    },
  });

  const isOpen = state.matches("suggesting") || state.matches("error");
  const suggestions = state.context.suggestions;

  const isDesktop = useIsDesktop();

  return (
    <Stack>
      <Box ref={wrapperRef} position="relative" width="100%">
        <Input
          sx={{
            mb: "1.5rem",
            "& > input": {
              pr: single ? "0" : { xs: "0", lg: "100px" },
            },
          }}
          label={label}
          hintText={hintText}
          nativeInputProps={{
            ...nativeInputProps,
            type: "email",
            value: state.context.query,
            onChange: (e) => {
              if (single) onValueChange([e.target.value]);
              send({ type: "TYPE", value: e.target.value });
            },
            onKeyDown: handleKeyPress,
          }}
        />

        {isOpen ? (
          <Box
            bgcolor="white"
            sx={{
              transform: "translateY(-1.25rem)",
            }}
            zIndex="10"
            position="absolute"
            borderRadius="5px"
            width="100%"
            maxHeight="300px"
            overflow="auto"
          >
            {suggestions.length === 0 ? null : (
              <Box>
                {suggestions.map((item) => (
                  <Box
                    key={item}
                    onClick={() => {
                      send({ type: "SELECT", item });
                    }}
                    sx={{
                      ":hover > div": {
                        bg: "#ECECFE",
                        display: "block",
                        cursor: "pointer",
                      },
                    }}
                    position="relative"
                    p="8px"
                  >
                    {item}
                    <Box display="none">
                      {/* @ts-ignore */}
                      <Button
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          backgroundColor: "transparent !important",
                        }}
                        type="button"
                        priority="tertiary no outline"
                        iconId="ri-close-line"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          deleteSuggestionMutation.mutate(item);
                        }}
                      ></Button>
                    </Box>
                  </Box>
                ))}
                <Box bgcolor="#ECECFE" width="100%" minHeight="46px" p="8px" color="#000091" textAlign="center">
                  La suppression de contact s'appliquera à tout le service
                </Box>
              </Box>
            )}
          </Box>
        ) : null}
      </Box>

      {!single ? (
        <Button
          sx={{
            zIndex: 1,
            mt: "-16px",
            bgcolor: "white",
          }}
          type="button"
          priority="tertiary"
          iconId="ri-add-line"
          onClick={onClick}
        >
          Ajouter
        </Button>
      ) : null}

      {!single ? (
        <Flex
          gap="8px"
          justifyContent="flex-start"
          alignItems="center"
          mt={!single ? "16px" : "-16px"}
          width="100%"
          flexWrap="wrap"
        >
          {value.filter(Boolean).map((email) => (
            <Tag
              key={email}
              dismissible
              nativeButtonProps={{
                type: "button",
                onClick: () => {
                  onValueChange(value.filter((v) => v !== email));
                },
              }}
            >
              {email}
            </Tag>
          ))}
        </Flex>
      ) : null}
    </Stack>
  );
};

export const emailMachine = createSuggestionMachine<EmailSuggestion>({
  minLength: 1,
}).provide({
  actors: {
    fetchSuggestions: fromPromise(async ({ input }: { input: { query: string } }) =>
      db
        .selectFrom("suggested_email")
        .where("email", "like", `%${input.query}%`)
        .select(["email"])
        .execute()
        .then((res) => res.map((r) => r.email as string)),
    ),
  },
});

type EmailSuggestion = string;
