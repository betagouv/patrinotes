import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export const MobileModalActions = ({ onClose, children }: PropsWithChildren<{ onClose: (event: Event) => void }>) => {
  return (
    <Box
      bgcolor="rgba(0,0,0,.8)"
      display={{ xs: "block", lg: "none" }}
      position="fixed"
      zIndex="200000"
      top="0"
      left="0"
      right="0"
      bottom="0"
      onClick={(e) => onClose(e.nativeEvent)}
    >
      <Box bgcolor="white" position="absolute" left="0" right="0" bottom="0" onClick={(e) => e.stopPropagation()}>
        {children}
      </Box>
    </Box>
  );
};
