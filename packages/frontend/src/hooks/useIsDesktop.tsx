import { useMedia } from "react-use";
import { fr } from "@codegouvfr/react-dsfr";

const breakpoints = fr.breakpoints.getPxValues();

export const useIsDesktop = () => {
  return useMedia(`(min-width: ${breakpoints.lg}px)`);
};

export const useIsXL = () => {
  return useMedia(`(min-width: ${breakpoints.xl}px)`);
};

function getDeviceType() {
  // 1. Modern approach: Check userAgentData (Chromium-based browsers)
  if ((navigator as any).userAgentData) {
    return (navigator as any).userAgentData.mobile ? "mobile/tablet" : "desktop";
  }

  // 2. Fallback approach: Regex parsing of the userAgent string
  const ua = navigator.userAgent;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  return mobileRegex.test(ua) ? "mobile/tablet" : "desktop";
}

export const isDesktopDevice = getDeviceType() === "desktop";
