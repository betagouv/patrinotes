import { Center } from "#components/MUIDsfr.tsx";
import { Stack, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cgu")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Center mt="32px" mb="32px" flexDirection="column">
      <CGU />
    </Center>
  );
}

const CGU = () => {
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
        Conditions Générales d’Utilisation (CGU)
      </Typography>

      <Typography variant="body1" fontStyle="italic">
        Dernière mise à jour le 01/02/2026
      </Typography>

      <Typography variant="h2">Article 1 - Champ d’application</Typography>
      <Typography variant="body1" fontWeight="bold">
        Les présentes conditions générales d’utilisation (ci-après « CGU ») précisent le cadre juridique de la
        Plateforme « Patrinotes » et définissent les conditions d’accès et d’utilisation des Services par l’Utilisateur.
        Toute utilisation de la Plateforme par l’Utilisateur est subordonnée à l’acceptation préalable et au respect des
        présentes CGU.
      </Typography>

      <Typography variant="h2">Article 2 - Objet</Typography>
      <Typography variant="body1">
        La Plateforme a pour objectif d’accompagner les agents dans la protection et la valorisation du patrimoine
        culturel, en leur permettant de générer rapidement plusieurs types de documents pour tracer l’état du patrimoine
        lors des rencontres sur le terrain.
      </Typography>

      <Typography variant="h2">Article 3 - Définitions</Typography>
      <Typography variant="body1">
        - <b>« Éditeur »</b> désigne la personne morale qui met à la disposition du public la Plateforme, à savoir la
        Direction générale des patrimoines et de l’architecture (DGPA) du ministère de la Culture.
        <br />- <b>« Plateforme »</b> désigne le service numérique Patrinotes.
        <br />- <b>« Services »</b> désigne les fonctionnalités offertes par la Plateforme pour répondre à ses
        finalités.
        <br />- <b>« Utilisateur »</b> est tout agent public du ministère de la Culture qui est inscrit sur la
        Plateforme.
      </Typography>

      <Typography variant="h2">Article 4 - Fonctionnalités</Typography>

      <Typography variant="h3">Création de compte</Typography>
      <Typography variant="body1">
        La création du compte nécessite de renseigner les informations suivantes : adresse courriel, mot de passe, nom,
        prénom, fonction et service de l’agent public parmi une liste d’organismes habilités.
        <br />
        Les membres de l’équipe de la Plateforme valident toute création de compte, et s’assurent de garantir l’accès
        aux Services aux seuls agents publics habilités, qui ont un lien avec la mission de service public du
        patrimoine.
      </Typography>

      <Typography variant="h3">Connexion au compte</Typography>
      <Typography variant="body1">
        L’Utilisateur peut se connecter à son compte en renseignant son adresse courriel et son mot de passe. Il peut
        notamment réinitialiser son mot de passe en saisissant l’adresse courriel associée à son compte.
      </Typography>

      <Typography variant="h3">Autres fonctionnalités</Typography>
      <Typography variant="body1">
        L’Utilisateur peut notamment créer des comptes-rendus et des constats d’état de monuments historiques.
        <br />
        Plusieurs fonctionnalités sont disponibles sur la Plateforme :<br />-{" "}
        <b>Exploration du patrimoine du territoire (par département ou région) :</b> La Plateforme permet d’accéder à
        une liste d’objets et de monuments sur un territoire donné, à l’échelle du département ou de la région. <br />-{" "}
        <b>Les informations récoltées pendant la rencontre sur le terrain :</b> Les agents renseignent des informations
        sur des éléments qu’ils ont en charge de visiter et/ou conseiller. Ils peuvent notamment ajouter des
        informations complémentaires lors de leur mission dans une zone de champ libre, sans pour autant indiquer de
        données identifiantes supplémentaires, de secrets protégés par la loi ou de données sensibles. <br />
      </Typography>
      <Typography variant="body1">
        Les agents établissant les comptes-rendus sont amenés à renseigner sur la Plateforme les noms et prénoms des
        propriétaires de monuments historiques pour la rédaction de ces documents. Ils veillent à saisir les seules
        données strictement nécessaires et à informer les personnes concernées de ce traitement de données.
      </Typography>

      <Typography variant="h2">Article 5 - Responsabilités</Typography>
      <Typography variant="h3">5.1 Responsabilités de l’Éditeur</Typography>
      <Typography variant="body1">
        Les sources des informations diffusées sur la Plateforme sont réputées fiables, mais elle ne garantit pas être
        exempte de défauts, d’erreurs ou d’omissions. <br />
        L’Éditeur s’engage à la sécurisation de la Plateforme, notamment en prenant toutes les mesures nécessaires
        permettant de garantir la sécurité et la confidentialité des informations fournies. Il effectue une modération à
        priori, lorsqu’il habilite les comptes qui peuvent accéder à la Plateforme.
        <br />
        L’Éditeur n’est en aucun cas tenu responsable de tout contenu, production et document généré par l’intermédiaire
        de la Plateforme.
        <br />
        Il fournit les moyens nécessaires et raisonnables pour assurer un accès continu à la Plateforme. Il se réserve
        la liberté de faire évoluer, de modifier ou de suspendre, sans préavis, la Plateforme pour des raisons de
        maintenance ou pour tout autre motif jugé nécessaire.
        <br />
        En cas de manquement à une ou plusieurs des stipulations des présentes CGU, l’Éditeur se réserve le droit de
        suspendre ou de supprimer le compte de l’Utilisateur responsable.
      </Typography>

      <Typography variant="h3">Responsabilités de l’Utilisateur</Typography>
      <Typography variant="body1">
        L’Utilisateur s’assure de garder son mot de passe secret. Toute divulgation du mot de passe, quelle que soit sa
        forme, est interdite. Il assume les risques liés à l’utilisation de son adresse courriel et de son mot de passe.
        <br />
        En s’inscrivant sur la Plateforme, l’Utilisateur certifie qu’il est un agent dont les missions intrinsèques
        relèvent du patrimoine et de l’architecture. Il est seul responsable de tout contenu qu’il dépose sur la
        Plateforme, notamment dans les zones de champs libres.
        <br />
        L’Utilisateur veille à informer les personnes concernées lorsqu’il renseigne leurs données à caractère personnel
        sur la Plateforme. Il s’engage à ne communiquer que les données strictement nécessaires à sa mission de service
        public.
        <br />
        Il est rappelé que toute personne procédant à une fausse déclaration pour elle-même ou pour autrui s’expose
        notamment aux sanctions prévues à l’article 441-1 du code pénal.
        <br />
        L’Utilisateur s’engage à ne pas mettre en ligne de contenus ou informations contraires au cadre juridique en
        vigueur. Il veille notamment à ne pas communiquer de données sensibles ou de secrets protégés par la loi.
      </Typography>

      <Typography variant="h2">Article 6 - Mise à jour des conditions générales d’utilisation</Typography>
      <Typography variant="body1">
        Les termes des présentes CGU peuvent être amendés à tout moment, sans préavis, en fonction des modifications
        apportées à la Plateforme, de l’évolution de la législation ou pour tout autre motif jugé nécessaire. Chaque
        modification donne lieu à une nouvelle version qui est acceptée par les parties.
      </Typography>

      <Typography variant="h2">Prise de contact</Typography>
      <Typography variant="body1">
        Tout utilisateur peut contacter Patrimoine via l’adresse mail suivante : <b>contact@patrinotes.beta.gouv.fr</b>
      </Typography>
    </Stack>
  );
};
