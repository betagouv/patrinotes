import { fr } from "@codegouvfr/react-dsfr";
import { Box } from "@mui/material";
import { Flex } from "./ui/Flex";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/");

export const DocumentTypeSelector = () => {
  const { document } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const setSelected = (docType: "constats" | "compte-rendus") => {
    navigate({
      search: (old) => ({
        ...old,
        document: docType,
      }),
      resetScroll: false,
    });
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
        <Box
          py="8px"
          width={{ xs: "100%", lg: "240px" }}
          textAlign="center"
          borderRadius="4px"
          {...(document === "constats" ? { ...selectedProps } : {})}
          sx={{ cursor: "pointer" }}
          onClick={() => setSelected("constats")}
        >
          constats
        </Box>
        <Box
          py="8px"
          width={{ xs: "100%", lg: "240px" }}
          textAlign="center"
          borderRadius="4px"
          {...(document === "compte-rendus" ? selectedProps : {})}
          sx={{ cursor: "pointer" }}
          onClick={() => setSelected("compte-rendus")}
        >
          compte-rendus
        </Box>
      </Flex>
    </Flex>
  );
};
