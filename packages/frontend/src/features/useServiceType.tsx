import { useLiveService } from "../contexts/AuthContext";

export const useServiceType = () => {
  const service = useLiveService();
  const lowerName = service?.name?.toLowerCase() ?? "";
  const serviceType = lowerName.includes("crmh")
    ? "CRMH"
    : lowerName.includes("drac")
      ? "DRAC"
      : lowerName.includes("udap")
        ? "UDAP"
        : "Service";

  return serviceType;
};
