import { fr } from "@codegouvfr/react-dsfr";
import { Box } from "@mui/material";
import { Flex } from "./ui/Flex";
import { getRouteApi } from "@tanstack/react-router";
import { useSelector } from "@xstate/store/react";
import { searchStore } from "./SearchModal";
import { Button } from "./MUIDsfr";

export const DocumentTypeSelector = () => {
  const document = useSelector(searchStore, (state) => state.context.document) ?? "compte-rendus";

  const setSelected = (docType: "constats" | "compte-rendus") => {
    searchStore.send({ type: "setDocument", document: docType });
  };

  const selectedProps = {
    borderColor: fr.colors.decisions.border.active.blueFrance.default,
    color: fr.colors.decisions.text.actionHigh.blueFrance.default,
    marginBottom: "-1px",
    marginTop: "-1px",
    border: "1px solid",
  };

  return (
    <Flex width="100%">
      <Flex
        border="1px solid"
        borderRadius="4px"
        borderColor={fr.colors.decisions.border.default.grey.default}
        width={{ xs: "100%", lg: "auto" }}
      >
        <Button
          type="button"
          priority="tertiary no outline"
          sx={{
            py: "8px",
            width: { xs: "100%", lg: "240px" },
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            borderRadius: "4px",
            color: "black",
            fontWeight: "400",
            ...(document === "constats" ? { ...selectedProps } : {}),
          }}
          onClick={() => setSelected("constats")}
        >
          constats
        </Button>
        <Button
          type="button"
          priority="tertiary no outline"
          sx={{
            py: "8px",
            width: { xs: "100%", lg: "240px" },
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            borderRadius: "4px",
            color: "black",
            fontWeight: "400",
            ...(document === "compte-rendus" ? selectedProps : {}),
          }}
          onClick={() => setSelected("compte-rendus")}
        >
          compte-rendus
        </Button>
      </Flex>
    </Flex>
  );
};
