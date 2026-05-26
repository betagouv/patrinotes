import { Center } from "#components/MUIDsfr.tsx";
import { Stack, Typography } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/accessibilite")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Center mt="32px" mb="32px" flexDirection="column">
      <Accessibilite />
    </Center>
  );
}

const Accessibilite = () => {
  return (
    <Stack width={{ xs: "100%", lg: "800px" }} gap="16px" px="16px">
      <Typography variant="h1" mb="16px">
        Accessibilité : Non conforme
      </Typography>
      <Typography variant="body1">
        <strong>Patrinotes</strong> s'engage à rendre ses services numériques accessibles, conformément à l'article 47
        de la loi n° 2005-102 du 11 février 2005.
      </Typography>

      <Typography variant="h2">Déclaration d'accessibilité</Typography>
      <Typography variant="body1">
        Cette déclaration d'accessibilité s'applique au site{" "}
        <a className="fr-link" href="https://app.patrinotes.beta.gouv.fr/">
          app.patrinotes.beta.gouv.fr
        </a>
      </Typography>

      <Typography variant="h2">État de conformité</Typography>
      <Typography variant="body1">
        Le site{" "}
        <a className="fr-link" href="https://app.patrinotes.beta.gouv.fr/">
          app.patrinotes.beta.gouv.fr
        </a>{" "}
        est non conforme avec le RGAA 4.1. Le site n'a <strong>pas encore été audité</strong>. Il a cependant été conçu
        pour être accessible au plus grand nombre. Vous devriez donc pouvoir :
      </Typography>
      <ul>
        <li>
          <Typography variant="body1">naviguer sur toutes les pages du site en utilisant un clavier</Typography>
        </li>
        <li>
          <Typography variant="body1">consulter le site web avec un lecteur d'écran.</Typography>
        </li>
        <li>
          <Typography variant="body1">
            adapter le site à votre préférences (taille de la police, zoom écran, changement de typographie…) sans perte
            de contenu
          </Typography>
        </li>
      </ul>

      <Typography variant="h2">Amélioration et contact</Typography>
      <Typography variant="body1">
        Si vous n'arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable de
        beta.gouv.fr pour être orienté·e vers une alternative accessible ou obtenir le contenu sous une autre forme.
      </Typography>
      <ul>
        <li>
          <Typography variant="body1">
            Courriel :{" "}
            <a className="fr-link" href="mailto:contact@beta.gouv.fr">
              contact@beta.gouv.fr
            </a>
          </Typography>
        </li>
        <li>
          <Typography variant="body1">Adresse : DINUM, 20 avenue de Ségur 75007 Paris</Typography>
        </li>
      </ul>
      <Typography variant="body1">Nous essayons de répondre dans les 2 jours ouvrés.</Typography>

      <Typography variant="h2">Voie de recours</Typography>
      <Typography variant="body1">
        Cette procédure est à utiliser dans le cas suivant : vous avez signalé au responsable du site internet un défaut
        d'accessibilité qui vous empêche d'accéder à un contenu ou à un des services du portail et vous n'avez pas
        obtenu de réponse satisfaisante.
      </Typography>
      <Typography variant="body1">Vous pouvez :</Typography>
      <ul>
        <li>
          <Typography variant="body1">
            Écrire un message au{" "}
            <a className="fr-link" target="_blank" href="https://formulaire.defenseurdesdroits.fr/" rel="noreferrer">
              Défenseur des droits
            </a>
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Contacter le délégué du{" "}
            <a
              className="fr-link"
              target="_blank"
              href="https://www.defenseurdesdroits.fr/saisir/delegues"
              rel="noreferrer"
            >
              Défenseur des droits dans votre région
            </a>
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) : Défenseur des droits - Libre réponse
            71120 75342 Paris CEDEX 07
          </Typography>
        </li>
      </ul>
    </Stack>
  );
};
