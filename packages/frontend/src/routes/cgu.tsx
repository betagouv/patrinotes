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
        Dernière mise à jour le 17 novembre 2025
      </Typography>

      <Typography variant="body1">
        Les présentes conditions générales d’utilisation (dites « CGU ») fixent le cadre juridique de la Plateforme «
        Patrimoine Embarqué » et définissent les conditions d’accès et d’utilisation des services par l’Utilisateur.
      </Typography>

      <Typography variant="h2">Article 1 - Champ d’application</Typography>
      <Typography variant="body1" fontWeight="bold">
        Le présent document a pour objet d’encadrer l’utilisation de la Plateforme. Toute utilisation de la Plateforme
        est subordonnée au respect intégral des présentes CGU.
      </Typography>

      <Typography variant="h2">Article 2 - Objet</Typography>
      <Typography variant="body1">
        La Plateforme, dénommée « Patrimoine Embarqué » accompagne les agents dans la protection et la valorisation du
        patrimoine culturel, en leur permettant de générer rapidement plusieurs types de documents pour tracer l’état du
        patrimoine lors des rencontres sur le terrain.
      </Typography>

      <Typography variant="h2">Article 3 - Définitions</Typography>
      <Typography variant="body1">
        - <b>« Plateforme » désigne le service numérique Patrimoine Embarqué.</b>
        <br />-{" "}
        <b>« Services » désigne les fonctionnalités offertes par la Plateforme pour répondre à ses finalités.</b>
        <br />- <b>« Utilisateur » est tout agents du ministère de la Culture qui utilise la Plateforme.</b>
      </Typography>

      <Typography variant="h2">Article 4 - Fonctionnalités</Typography>
      <Typography variant="body1">Plusieurs fonctionnalités sont disponibles sur la plateforme :</Typography>

      <Typography variant="h3">Constat d’état</Typography>
      <Typography variant="body1">
        Le compte Utilisateur sur la Plateforme est créé au préalable à partir du mail de l’agent que ce dernier envoit
        à l’équipe de Patrimoine Embarqué.
      </Typography>

      <Typography variant="h3">Découverte du patrimoine du territoire (par département ou région)</Typography>
      <Typography variant="body1">
        La Plateforme permet d’accéder à une liste d’objets et de monuments sur un territoire donné, à l’échelle du
        département ou de la région. Des statistiques sur le suivi global via Patrimoine Embarqué seront également
        disponibles sur la Plateforme dans le futur.
      </Typography>

      <Typography variant="h3">Les informations récoltées pendant la rencontre sur le terrain</Typography>
      <Typography variant="body1">
        Les agents renseignent des informations sur des éléments qu’ils ont en charge de visiter et/ou conseiller. Ils
        peuvent notamment ajouter des informations complémentaires lors de leur mission dans une zone de champ libre,
        sans pour autant indiquer de données identifiantes supplémentaires ou de données sensibles.
      </Typography>

      <Typography variant="h2">Article 5 - Responsabilités</Typography>
      <Typography variant="h3">5.1 L’Éditeur de la Plateforme</Typography>
      <Typography variant="body1">
        L’Éditeur de la Plateforme s’engage à :
        <ul>
          <li>
            mettre à disposition de l’Utilisateur une Plateforme permettant les fonctionnalités décrites ci-avant ;
          </li>
          <li>mettre à disposition le service gratuitement ;</li>
          <li>
            collecter, conserver, traiter, héberger les données et/ou contributions de manière loyale et conformément
            aux finalités de la Plateforme ;
          </li>
          <li>
            prendre toute mesure nécessaire de nature à garantir la sécurité et la confidentialité des informations
            fournies par l’usager et notamment empêcher qu’elles soient déformées, endommagées ou que des tiers non
            autorisés y aient accès ;
          </li>
          <li>
            ne commercialiser, d’aucune manière, les informations et pièces justificatives récoltées dans le cadre de la
            Plateforme.
          </li>
        </ul>
        L’Éditeur s’autorise à supprimer, sans préavis ni indemnité d’aucune sorte, tout compte faisant l’objet d’une
        utilisation contrevenante aux présentes CGU.
        <br /> L’indisponibilité de la Plateforme ne donne droit à aucune indemnité.
      </Typography>

      <Typography variant="h3">5.2 L’Utilisateur</Typography>
      <Typography variant="body1">
        {" "}
        L’Utilisateur reconnait avoir lu les présentes CGU et s’engage à :<br />
        <ul>
          <li>
            accepter toute modification à venir des présentes CGU dont il aura été informé au préalable par mail ;
          </li>
          <li>
            prévenir immédiatement l’Éditeur de toute utilisation non autorisée de son compte ou de ses informations ;
          </li>
          <li>
            communiquer des informations à jour et exactes notamment s’agissant des informations relatives au profil, sa
            situation personnelle et les missions proposées. Il est rappelé que toute personne procédant à une fausse
            déclaration pour elle-même ou pour autrui s’expose, notamment, aux sanctions prévues à l’article 441-1 du
            Code Pénal, prévoyant des peines pouvant aller jusqu’à trois ans d’emprisonnement et 45 000 euros d’amende.
          </li>
          <li>
            Les Utilisateurs peuvent signaler toute description, information ou commentaire ne répondant pas aux CGU.
          </li>
        </ul>
      </Typography>

      <Typography variant="h2">Article 6 - Mise à jour des conditions générales d’utilisation</Typography>
      <Typography variant="body1">
        Les termes des présentes conditions générales d’utilisation peuvent être amendés à tout moment, sans préavis, en
        fonction des modifications apportées à la plateforme, de l’évolution de la législation ou pour tout autre motif
        jugé nécessaire. Chaque modification donne lieu à une nouvelle version qui est acceptée par les parties.
      </Typography>

      <Typography variant="h2">Article 7 - Propriété intellectuelle</Typography>
      <Typography variant="body1">
        Conformément au décret n° 2017-638 prévu par l’article L. 323-2 du Code des Relations entre le Public et
        l’Administration (CRPA), les administrations publiques peuvent ouvrir leurs données et soumettre la
        réutilisation à titre gratuit des informations publiques qu’elle détient sous la licence ouverte. En cochant la
        case lors de l’envoi de vos documents, vous renoncez à vos droits sur ceux-ci et prenez connaissance qu’ils
        seront placés sous licence ouverte.
      </Typography>
    </Stack>
  );
};
