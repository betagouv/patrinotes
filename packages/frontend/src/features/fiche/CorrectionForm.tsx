import { Alert, Button, Input } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box, Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLiveUser } from "../../contexts/AuthContext";
import { MonumentCorrection } from "../../db/AppSchema";
import { CorrectionField, correctionFields, CorrectionTarget, saveCorrection } from "./corrections";

/**
 * « Compléter les infos » of a fiche: the service corrects the information coming from POP or the dataspace.
 * A value equal to the original one is not stored as a correction.
 */
export const CorrectionForm = ({
  target,
  originals,
  correction,
  onDone,
}: {
  target: CorrectionTarget;
  /** values from POP / the dataspace, before correction */
  originals: Partial<Record<CorrectionField, string | null>>;
  correction: MonumentCorrection | null;
  onDone: () => void;
}) => {
  const user = useLiveUser()!;
  const fields = correctionFields[target.target];

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map(({ field }) => [field, (correction?.[field] ?? originals[field] ?? "") as string]),
    ),
  );

  const saveMutation = useMutation({
    mutationFn: () =>
      saveCorrection({
        target,
        existing: correction,
        userId: user.id,
        serviceId: user.service_id,
        values: Object.fromEntries(
          fields.map(({ field }) => {
            const value = values[field]!.trim();
            return [field, value === (originals[field] ?? "").trim() ? null : value];
          }),
        ),
      }),
    onSuccess: onDone,
  });

  return (
    <Stack component="form" onSubmit={(e) => (e.preventDefault(), saveMutation.mutate())} gap="8px">
      <Box display="grid" gridTemplateColumns={{ xs: "1fr", lg: "1fr 1fr" }} columnGap="24px">
        {fields.map(({ field, label, multiline }) =>
          multiline ? (
            <Input
              key={field}
              label={label}
              textArea
              style={{ gridColumn: "1 / -1" }}
              nativeTextAreaProps={{
                rows: 5,
                value: values[field],
                onChange: (e) => setValues((v) => ({ ...v, [field]: e.target.value })),
              }}
            />
          ) : (
            <Input
              key={field}
              label={label}
              nativeInputProps={{
                value: values[field],
                onChange: (e) => setValues((v) => ({ ...v, [field]: e.target.value })),
              }}
            />
          ),
        )}
      </Box>
      {/* @ts-ignore title is optional */}
      <Alert
        severity="info"
        small
        description="Les informations modifiées ne seront pas reportées sur la fiche POP. Elles sont partagées avec votre service et reprises dans ses prochains constats."
      />
      <Flex gap="8px" mt="16px" flexDirection={{ xs: "column", lg: "row" }}>
        <Button priority="secondary" size="large" type="button" onClick={onDone}>
          Annuler
        </Button>
        <Button size="large" type="submit" iconId="ri-save-fill" iconPosition="right" disabled={saveMutation.isPending}>
          Valider les modifications
        </Button>
      </Flex>
    </Stack>
  );
};
