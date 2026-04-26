import { SyncFormStatus } from "./SyncForm";
import { forwardRef } from "react";
import { BoxProps } from "@mui/material";
import { fr } from "@codegouvfr/react-dsfr";
import { Center } from "./MUIDsfr";
import { useStatus } from "@powersync/react";

export const Banner = forwardRef<HTMLDivElement, BoxProps & { status: SyncFormStatus }>(
  ({ status, className, ...props }, ref) => {
    const statusColorMap = {
      offline: "#FFE9E6",
      pending: "#FEECC2",
    };

    const bgColor = fr.colors.decisions.background.open.blueFrance.default;

    return <Center ref={ref as any} className={className} bgcolor={bgColor} flexDirection="column" {...props} />;
  },
);

export const SimpleBanner = (props: Omit<BoxProps, "ref">) => {
  const powerSyncStatus = useStatus();

  const isOk = powerSyncStatus.connected || powerSyncStatus.connecting;
  const status = isOk ? "saved" : "offline";

  return <Banner status={status} {...props} />;
};

export const useBannerBgColor = () => {
  const status = useStatus();

  const isOk = status.connected || status.connecting;
  return isOk ? fr.colors.decisions.background.open.blueFrance.default : "#FFE9E6";
};

/*
 "yellow-waiting": { value: "#FEECC2" },
  "red-offline": { value: "#FFE9E6" },
  "blue-connected": { value: "#E3E3FD" },
*/
