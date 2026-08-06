import { fr } from "@codegouvfr/react-dsfr";
import { Box, Stack } from "@mui/material";

export const drawingColors = ["#000AFF", "#FF3F3F", "#FF8A00", "#FFD600", "#3DFF7F", "white", "black"];
const blackPenColors = ["#FFD600", "#3DFF7F", "white"];

export const ColorSelection = ({
  activeColor,
  setActiveColor,
}: {
  activeColor: string;
  setActiveColor: (color: string) => void;
}) => {
  return (
    <Stack gap="8px" flexDirection="row" justifyContent="center" alignItems="center">
      {drawingColors.map((color) => {
        const isActive = activeColor === color;
        const size = isActive ? 30 : 20;
        return (
          <Box
            key={color}
            component="button"
            type="button"
            onClick={() => setActiveColor(color)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 40,
              height: 40,
              padding: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                width: size,
                height: size,
                bgcolor: color,
                border: "1px solid #000091",
                transition: "width 0.1s, height 0.1s",
              }}
            >
              {isActive && (
                <Box
                  className={fr.cx("fr-icon--sm", "ri-pencil-line")}
                  component="i"
                  color={blackPenColors.includes(color) ? "black" : "white"}
                />
              )}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
};
