import { Alert, Button } from "#components/MUIDsfr.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { Box } from "@mui/material";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { applyPendingUpdate, useIsUpdateAvailable } from "./appUpdate";

/**
 * Pages where nothing is being typed: the update can reload them without asking. Everywhere else (a
 * compte-rendu or a constat being written, the PDF and send pages, account and service settings, sign-in and
 * sign-up forms...) the agent may be typing, so a reload would make them lose what is not saved yet: they
 * choose when to reload.
 */
const READ_ONLY_PATHS = [
  /^\/$/,
  /^\/monument(\/.*)?$/,
  /^\/objet\/.*$/,
  /^\/stats\/?$/,
  /^\/accessibilite\/?$/,
  /^\/mentions-legales\/?$/,
  /^\/politique-confidentialite\/?$/,
  /^\/cgu\/?$/,
];

const isTyping = () => {
  const element = document.activeElement as HTMLElement | null;
  if (!element) return false;
  return element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName);
};

export const UpdateBanner = () => {
  const isUpdateAvailable = useIsUpdateAvailable();
  const { pathname } = useLocation();
  const reloading = useRef(false);

  const isReadOnlyPage = READ_ONLY_PATHS.some((path) => path.test(pathname));

  useEffect(() => {
    if (!isUpdateAvailable || !isReadOnlyPage || reloading.current || isTyping()) return;
    reloading.current = true;
    applyPendingUpdate();
  }, [isUpdateAvailable, isReadOnlyPage]);

  // Also shown on read-only pages until the reload happens, or when the agent was typing in a search field.
  if (!isUpdateAvailable) return null;

  return (
    <Box px={{ xs: "16px", lg: "24px" }} pt="16px" data-test-id="update-banner">
      {/* @ts-ignore */}
      <Alert
        severity="info"
        small
        description={
          <Flex alignItems="center" flexWrap="wrap" gap="8px">
            <span>Une nouvelle version de Patrinotes est disponible.</span>
            <Button
              priority="tertiary no outline"
              size="small"
              type="button"
              onClick={() => {
                reloading.current = true;
                applyPendingUpdate();
              }}
            >
              Recharger
            </Button>
          </Flex>
        }
      />
    </Box>
  );
};
