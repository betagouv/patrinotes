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
        Déclaration d'accessibilité
      </Typography>
      <Typography variant="body1">
        Le ministère de la Culture s'engage à rendre ses sites internet, intranet, extranet et ses progiciels
        accessibles (et ses applications mobiles et mobilier urbain numérique) conformément à l'article 47 de la loi
        n°2005-102 du 11 février 2005.
      </Typography>
      <Typography variant="body1">
        À cette fin, le ministère met en œuvre la stratégie et les actions suivantes :
      </Typography>
      <ul>
        <li>
          <Typography variant="body1">
            <a className="fr-link" target="_blank" href="https://www.info.gouv.fr/accessibilite" rel="noreferrer">
              Schéma pluriannuel d'accessibilité du gouvernement
            </a>
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            <a
              className="fr-link"
              target="_blank"
              href="https://www.culture.gouv.fr/accessibilite-partiellement-conforme/schema-pluriannuel-d-accessibilite-numerique"
              rel="noreferrer"
            >
              Schéma pluriannuel d'accessibilité numérique du ministère de la Culture
            </a>
          </Typography>
        </li>
      </ul>
      <Typography variant="body1">
        Cette déclaration d'accessibilité s'applique à l'application <strong>Patrinotes</strong>.
      </Typography>

      <Typography variant="h2">État de conformité</Typography>
      <Typography variant="body1">
        L'application Patrinotes{" "}
        <a className="fr-link" target="_blank" href="https://app.patrinotes.beta.gouv.fr/" rel="noreferrer">
          app.patrinotes.beta.gouv.fr
        </a>{" "}
        est non conforme avec le référentiel général d'amélioration de l'accessibilité (RGAA), version 4, en raison
        d'absence d'audit achevé, ce qui ne permet pas
        aujourd'hui de lister les non-conformités du site. Cependant, Patrinotes est conçu en utilisant le Système de
        design de l'État (DSFR) prenant en compte les exigences en termes d'accessibilité. Le site n'a{" "}
        <strong>pas encore été audité</strong>. Il a cependant été conçu pour être accessible au plus grand nombre.
        Vous devriez donc pouvoir :
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
            adapter le site à votre préférences (taille de la police, zoom écran, changement de typographie…) sans
            perte de contenu
          </Typography>
        </li>
      </ul>

      <Typography variant="h2">Établissement de cette déclaration d'accessibilité</Typography>
      <Typography variant="body1">
        Cette déclaration a été établie 17/02/2026. Elle a été mise à jour le 16/09/2026.
      </Typography>

      <Typography variant="h2">Retour d'information et contact</Typography>
      <Typography variant="body1">
        Si vous n'arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable de
        Patrinotes pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme, à
        l'adresse électronique suivante :{" "}
        <a className="fr-link" href="mailto:contact@patrinotes.beta.gouv.fr">
          contact@patrinotes.beta.gouv.fr
        </a>
      </Typography>

      <Typography variant="h2">Voies de recours</Typography>
      <Typography variant="body1">
        Si vous constatez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité du
        site, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse de notre part, vous êtes en
        droit de faire parvenir vos doléances ou une demande de saisine au Défenseur des droits.
      </Typography>
      <Typography variant="body1">Plusieurs moyens sont à votre disposition :</Typography>
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
