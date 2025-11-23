import { Center } from "#components/MUIDsfr.tsx";
import { fr } from "@codegouvfr/react-dsfr";
import { Box, Stack, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mentions-legales")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Center mt="32px" mb="32px" flexDirection="column">
      <MentionLegales />
    </Center>
  );
}

const MentionLegales = () => {
  return (
    <Stack
      width={{ xs: "100%", lg: "800px" }}
      gap="16px"
      px="16px"
      sx={{
        a: {},
      }}
    >
      <Typography variant="h1" mb="16px">
        Mentions légales
      </Typography>
      <Typography variant="h2">Éditeur de la plateforme</Typography>
      <Typography variant="body1">
        <Box mb="8px">Cette plateforme est éditée par :</Box>
        Ministère de la culture,
        <br />
        182, rue Saint-Honoré
        <br />
        75001 Paris, France
        <br />
        Téléphone : 01 40 15 80 00
      </Typography>
      <Typography variant="h2">Directrice de la publication</Typography>
      <Typography variant="body1">
        La directrice de la publication est Madame Rachida DATI, ministre de la Culture.
      </Typography>

      <Typography variant="h2">Hébergement de la plateforme</Typography>
      <Typography variant="body1">
        <Box mb="8px">Cette plateforme est hébergée par :</Box>
        OVH
        <br />
        2, rue Kellermann
        <br />
        59100 Roubaix, France
        <br />
      </Typography>

      <Typography variant="h2">Accessibilité</Typography>
      <Typography variant="body1">
        <Box mb="8px">
          La conformité aux normes d'accessibilité numérique est un{" "}
          <a className="fr-link" target="_blank" href="https://collectif-objets.beta.gouv.fr/declaration_accessibilite">
            objectif ultérieur
          </a>{" "}
          mais nous tâchons de rendre cette plateforme accessible à toutes et à tous.
          <br />
        </Box>
        Pour en savoir plus, vous pouvez consulter la{" "}
        <a className="fr-link" target="_blank" href="https://accessibilite.numerique.gouv.fr/">
          politique d'accessibilité numérique de l'État
        </a>
      </Typography>

      <Typography variant="h2">Signaler un dysfonctionnement</Typography>
      <Typography variant="body1">
        <Box mb="8px">
          Si vous rencontrez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité du
          site, merci de nous en faire part : <b>contact@patrimoine-embarque.beta.gouv.fr</b>
        </Box>
        Si vous n'obtenez pas de réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou une
        demande de saisine au Défenseur des droits.
      </Typography>

      <Typography variant="h2">Sécurité</Typography>
      <Typography variant="body1">
        <Box mb="8px">
          La plateforme est protégée par un certificat électronique, matérialisé pour la grande majorité des navigateurs
          par un cadenas. Cette protection participe à la confidentialité des échanges.
        </Box>
        En aucun cas les services associés à la plateforme ne seront à l'origine d'envoi de courriels pour demander la
        saisie d'informations personnelles.
      </Typography>
    </Stack>
  );
};
