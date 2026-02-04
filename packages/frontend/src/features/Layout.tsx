import { Flex } from "#components/ui/Flex.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box/Box";
import { Link, useRouter } from "@tanstack/react-router";
import { type PropsWithChildren } from "react";
import { useIsLoggedIn } from "../contexts/AuthContext";
import { MenuButton, MenuModal } from "../features/menu/MenuButton";
import { useIsDesktop } from "../hooks/useIsDesktop";

export const Layout = ({ children, noProvider }: PropsWithChildren & { noProvider?: boolean }) => {
  const router = useRouter();
  const shouldFooterTakeFullheight = router.state.location.pathname.includes("/constat/");
  return (
    <Box display="flex" position="relative" flexDirection={"column"} height="100vh" sx={{ overflowX: "hidden" }}>
      <AppHeader noProvider={noProvider} />
      <Box flex={shouldFooterTakeFullheight ? "1" : undefined}>{children}</Box>
      <AppFooter />
    </Box>
  );
};

const AppFooter = () => {
  return (
    <footer
      id="fr-footer"
      className="fr-footer"
      role="contentinfo"
      style={{ border: "none", borderBottomWidth: 0, flex: 1 }}
    >
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <a className="active" title="Compte rendu vif" href="/" data-status="active">
              <p className="fr-logo">
                Ministère
                <br /> de la culture
              </p>
            </a>
          </div>
          <div className="fr-footer__content">
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  href="https://legifrance.gouv.fr"
                  title="legifrance.gouv.fr - ouvre une nouvelle fenêtre"
                >
                  legifrance.gouv.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  href="https://gouvernement.fr"
                  title="gouvernement.fr - ouvre une nouvelle fenêtre"
                >
                  gouvernement.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  href="https://service-public.gouv.fr"
                  title="service-public.gouv.fr - ouvre une nouvelle fenêtre"
                >
                  service-public.gouv.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  href="https://data.gouv.fr"
                  title="data.gouv.fr - ouvre une nouvelle fenêtre"
                >
                  data.gouv.fr
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <Link to="/mentions-legales" className="fr-footer__bottom-link">
                Mentions légales
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link to="/cgu" className="fr-footer__bottom-link">
                Conditions générales d'utilisation
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <span className="fr-footer__bottom-link">Accessibilité: non conforme</span>
            </li>
          </ul>

          <Flex flexDirection="column">
            <VersionDisplay />
            <div className="fr-footer__bottom-copy">
              <p>
                Sauf mention explicite de propriété intellectuelle détenue par des tiers, les contenus de ce site sont
                proposés sous{" "}
                <a
                  href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                  target="_blank"
                  title="licence etalab-2.0 - ouvre une nouvelle fenêtre"
                >
                  licence etalab-2.0
                </a>
              </p>
            </div>
          </Flex>
        </div>
      </div>
    </footer>
  );
};

const VersionDisplay = () => {
  const version = window.APP_VERSION;

  if (!version) return null;
  return (
    <div className="fr-footer__bottom-copy">
      <Typography mb="10px" fontSize=".75rem">
        Version {version}
      </Typography>
    </div>
  );
};

const AppHeader = ({ noProvider }: { noProvider?: boolean }) => {
  const isDesktop = useIsDesktop();
  const isLoggedIn = noProvider ? null : useIsLoggedIn();

  return (
    <>
      <header
        role="banner"
        id="fr-header"
        className="fr-header [&amp;_.fr-btn--menu]:opacity_0 [&amp;_.fr-btn--menu]:pointer-events_none"
      >
        <div className="fr-header__body">
          <Box
            className={"fr-container"}
            marginLeft={{ xs: "0", lg: "auto" }}
            marginRight={{ xs: "0", lg: "auto" }}
            paddingX={{ xs: "0", lg: "1rem" }}
          >
            <Box
              className={"fr-header__body-row"}
              display="flex"
              justifyContent="space-between"
              width="100%"
              margin="0"
            >
              <Link style={{ textWrap: "nowrap" }} to="/" title="Compte rendu vif" search={{ document: "constats" }}>
                <Box
                  className="fr-header__brand"
                  sx={{
                    "&:hover": {
                      bgcolor: { xs: "transparent", lg: fr.colors.decisions.background.raised.grey.hover },
                    },
                  }}
                  bgcolor={{ xs: "transparent", lg: "unset" }}
                >
                  <div className="fr-header__brand-top">
                    <div className="fr-header__logo">
                      <p className="fr-logo" style={{ position: "relative" }}>
                        Ministère
                        <br /> de la culture
                      </p>
                    </div>
                  </div>
                  {isDesktop ? (
                    <div className="fr-header__service lg:d_unset">
                      <p className="fr-header__service-title">
                        <>
                          Patrimoine Embarqué{" "}
                          <Badge as="span" noIcon severity="success">
                            Beta
                          </Badge>
                        </>
                      </p>
                    </div>
                  ) : undefined}
                </Box>
              </Link>
              <Box display="flex" alignItems="center">
                {isLoggedIn ? <MenuButton /> : null}
              </Box>
            </Box>
          </Box>
        </div>
      </header>
      <MenuModal />
    </>
  );
};
