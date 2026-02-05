import { useSelector } from "@xstate/react";
import { createStore } from "@xstate/store";
import { AlertErrors } from "../alerts/StateReportAlert.utils";

export const stateReportSideMenuStore = createStore(
  {
    sideMenu: "closed" as StateReportMenuStates,
    selectedAlertSection: null as string | null,
    isEditingEmail: false,
    alertErrors: null as { alert: string; errors: AlertErrors }[] | null,
  },
  {
    setSideMenu: (context, event: { menu: StateReportMenuStates }) => ({
      ...context,
      sideMenu: event.menu,
      selectedAlertSection: event.menu === "closed" ? null : context.selectedAlertSection,
      isEditingEmail: event.menu === "closed" ? false : context.isEditingEmail,
    }),
    closeSideMenu: (context) => ({ ...context, sideMenu: "closed" as StateReportMenuStates }),
    setSelectedAlert: (context, event: { section: string | null }) => ({
      ...context,
      selectedAlertSection: event.section,
      isEditingEmail: event.section ? context.isEditingEmail : false,
    }),
    clearSelectedAlert: (context) => ({ ...context, selectedAlertSection: null }),
    setIsEditingEmail: (context, event: { isEditing: boolean }) => ({ ...context, isEditingEmail: event.isEditing }),
    setAlertErrors: (context, event: { alertErrors: { alert: string; errors: AlertErrors }[] | null }) => ({
      ...context,
      alertErrors: event.alertErrors,
    }),

    openAlertSection: (context, event: { section: string }) => ({
      ...context,
      sideMenu: "alerts" as StateReportMenuStates,
      selectedAlertSection: event.section,
      isEditingEmail: true,
    }),
  },
);

export const useSideMenu = () => {
  const sideMenu = useSelector(stateReportSideMenuStore, (state) => state.context.sideMenu);
  const setSideMenu = (menu: StateReportMenuStates) => stateReportSideMenuStore.send({ type: "setSideMenu", menu });

  return [sideMenu, setSideMenu] as const;
};

export const useSelectedAlertSection = () => {
  const selectedAlertSection = useSelector(stateReportSideMenuStore, (state) => state.context.selectedAlertSection);
  const setSelectedAlertSection = (section: string | null) =>
    stateReportSideMenuStore.send({ type: "setSelectedAlert", section });

  return [selectedAlertSection, setSelectedAlertSection] as const;
};

export const useIsEditingAlertEmail = () => {
  const isEditingEmail = useSelector(stateReportSideMenuStore, (state) => state.context.isEditingEmail);
  const setIsEditingEmail = (isEditing: boolean) =>
    stateReportSideMenuStore.send({ type: "setIsEditingEmail", isEditing });

  return [isEditingEmail, setIsEditingEmail] as const;
};

export const useAlertErrors = () => {
  const alertErrors = useSelector(stateReportSideMenuStore, (state) => state.context.alertErrors);
  const setAlertErrors = (alertErrors: { alert: string; errors: AlertErrors }[] | null) =>
    stateReportSideMenuStore.send({ type: "setAlertErrors", alertErrors });

  return [alertErrors, setAlertErrors] as const;
};

export type StateReportMenuStates = "closed" | "notes" | "alerts";
