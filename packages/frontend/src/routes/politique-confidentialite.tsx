import { Center } from "#components/MUIDsfr.tsx";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/politique-confidentialite")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Center mt="32px" mb="32px" flexDirection="column">
      <PolitiqueConfidentialite />
    </Center>
  );
}

const PolitiqueConfidentialite = () => {
  return (
    <Stack width={{ xs: "100%", lg: "800px" }} gap="16px" px="16px">
      <Typography variant="h1" mb="16px">
        Politique de confidentialite
      </Typography>

      <Typography variant="h2">Qui est responsable du traitement des données à caractère personnel ?</Typography>
      <Typography variant="body1">
        Patrinotes est un produit numérique à l'initiative de la Direction générale des patrimoines et de l'architecture
        (DGPA) du ministère de la Culture. Il s'agit d'une suite d'outils numériques en mobilité pour accompagner les
        agents publics dans la protection et la valorisation du patrimoine. L'objectif est de faciliter le travail de
        terrain, notamment le contrôle scientifique et technique sur les monuments historiques, ainsi que la bonne
        compréhension des préconisations de l'agent par le demandeur à travers la génération rapide de comptes-rendus
        simplifiés. Ces documents garantissent la traçabilité des observations, recommandations et décisions prises pour
        assurer un suivi efficace et cohérent des projets et de l'état de conservation des monuments historiques.
      </Typography>
      <Typography variant="body1">
        Le responsable de traitement est la DGPA, représentée par madame Delphine CHRISTOPHE, en sa qualité de
        directrice générale et déléguée interministérielle aux Archives de France.
      </Typography>

      <Typography variant="h2">Pourquoi des données à caractère personnel sont collectées ?</Typography>
      <Box component="ul" sx={{ m: 0, pl: "20px" }}>
        <li>
          <Typography variant="body1">Gérer l'inscription et la connexion aux comptes des agents publics ;</Typography>
        </li>
        <li>
          <Typography variant="body1">
            Permettre aux agents publics de renseigner des informations dans les comptes-rendus et matérialiser des
            rapports d'audits en PDF ;
          </Typography>
        </li>
        <li>
          <Typography variant="body1">Gérer l'envoi de la lettre d'information aux agents publics ;</Typography>
        </li>
        <li>
          <Typography variant="body1">Gérer les demandes reçues par courriel (support) ;</Typography>
        </li>
        <li>
          <Typography variant="body1">Assurer la traçabilité des actions sur le produit numérique.</Typography>
        </li>
      </Box>

      <Typography variant="h2">Quelles sont les données que nous collectons ?</Typography>
      <Box component="ul" sx={{ m: 0, pl: "20px" }}>
        <li>
          <Typography variant="body1">
            Données relatives au compte utilisateur : nom, prénom, adresse courriel, fonction et service ;
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Données relatives aux constats d'états : nom et prénom des propriétaires des monuments ou leurs
            représentants, champs libres ;
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Données relatives aux comptes-rendus : nom et prénom des demandeurs de renseignements de la part de l'UDAP
            reçus par les agents lors de rencontres, champs libres ;
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Données relatives aux demandes de contact : nom, prénom, adresse courriel, champs libres ;
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            Données relatives à la lettre d'information : nom, prénom, adresse courriel ;
          </Typography>
        </li>
        <li>
          <Typography variant="body1">Données relatives à la traçabilité : logs et adresse IP.</Typography>
        </li>
      </Box>

      <Typography variant="h2">Qu'est-ce qui nous autorise à collecter des données ?</Typography>
      <Typography variant="body1">
        Patrinotes collecte des données à caractère personnel en se basant sur l'exécution d'une mission d'intérêt
        public et relevant de l'exercice de l'autorité publique dont est investi la DGPA au sens de l'article 6-1 e) du
        RGPD.
      </Typography>
      <Typography variant="body1">
        Cette mission d'intérêt public se traduit en pratique par l'arrêté du 25 août 2025 relatif aux missions et à
        l'organisation de la DGPA.
      </Typography>

      <Typography variant="h2">Pendant combien de temps les données sont conservées ?</Typography>
      <TableContainer>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Catégories de données</b>
              </TableCell>
              <TableCell>
                <b>Durée de conservation</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Données relatives au compte utilisateur et aux comptes-rendus</TableCell>
              <TableCell>2 ans à partir de la dernière connexion</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Données relatives aux demandes de contact</TableCell>
              <TableCell>6 mois à partir de la réception de la demande</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Données relatives à la lettre d'information</TableCell>
              <TableCell>Jusqu'à la désinscription de l'utilisateur</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Données relatives à la traçabilité</TableCell>
              <TableCell>1 an, conformément à la LCEN</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h2">Quels sont vos droits ?</Typography>
      <Typography variant="body1">Vous disposez :</Typography>
      <Box component="ul" sx={{ m: 0, pl: "20px" }}>
        <li>
          <Typography variant="body1">D'un droit d'information et d'un droit d'accès à vos données ;</Typography>
        </li>
        <li>
          <Typography variant="body1">D'un droit de rectification ;</Typography>
        </li>
        <li>
          <Typography variant="body1">D'un droit d'opposition ;</Typography>
        </li>
        <li>
          <Typography variant="body1">D'un droit à la limitation du traitement.</Typography>
        </li>
      </Box>
      <Typography variant="body1">
        Pour les exercer, contactez nous à : <b>contact@patrinotes.beta.gouv.fr</b>
      </Typography>
      <Typography variant="body1">
        Puisque ce sont des droits personnels, nous ne traiterons votre demande que si nous sommes en mesure de vous
        identifier. Dans le cas où nous ne parvenons pas à vous identifier, nous pouvons être amenés à vous demander une
        preuve de votre identité.
      </Typography>
      <Typography variant="body1">
        Pour vous aider dans votre démarche, vous trouverez un modèle de courrier élaboré par la CNIL ici :{" "}
        <a
          className="fr-link"
          target="_blank"
          rel="noreferrer"
          href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces"
        >
          https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces
        </a>
      </Typography>
      <Typography variant="body1">
        Nous nous engageons à vous répondre dans un délai raisonnable qui ne saurait dépasser 1 mois à compter de la
        réception de votre demande.
      </Typography>

      <Typography variant="h2">Qui peut avoir accès à vos données ?</Typography>
      <Typography variant="body1">
        Les accès aux données sont strictement encadrés et juridiquement justifiés. Les personnes suivantes vont avoir
        accès aux données :
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: "20px" }}>
        <li>
          <Typography variant="body1">Les membres habilités de la DGPA et de l'équipe de Patrinotes.</Typography>
        </li>
        <li>
          <Typography variant="body1">
            Les membres habilités du service Numérique du ministère de la Culture.
          </Typography>
        </li>
      </Box>

      <Typography variant="h2">Qui nous aide à collecter vos données ?</Typography>
      <TableContainer>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Sous-traitant</b>
              </TableCell>
              <TableCell>
                <b>Pays destinataire</b>
              </TableCell>
              <TableCell>
                <b>Traitement réalisé</b>
              </TableCell>
              <TableCell>
                <b>Garanties</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>OVH</TableCell>
              <TableCell>France</TableCell>
              <TableCell>Hébergement des données</TableCell>
              <TableCell>
                <a
                  className="fr-link"
                  target="_blank"
                  rel="noreferrer"
                  href="https://us.ovhcloud.com/legal/data-processing-agreement/"
                >
                  https://us.ovhcloud.com/legal/data-processing-agreement/
                </a>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Brevo</TableCell>
              <TableCell>France</TableCell>
              <TableCell>Gestion de la lettre d'information</TableCell>
              <TableCell>
                <a
                  className="fr-link"
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.brevo.com/fr/legal/termsofuse/#accord-sur-le-traitement-des-données-a-caractere-personnel-dpa"
                >
                  https://www.brevo.com/fr/legal/termsofuse/#accord-sur-le-traitement-des-données-a-caractere-personnel-dpa
                </a>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h2">Témoins de connexion et traceurs</Typography>
      <Typography variant="body1">
        Patrinotes ne dépose aucun témoin de connexion ou traceurs. Le produit numérique utilise uniquement Matomo, un
        outil de mesure d'audience configuré en mode "exempté" et qui ne nécessite pas le recueil du consentement
        conformément aux recommandations de la CNIL. Vous souhaitez tout de même vous désengager de Matomo ? Suivez
        cette procédure :{" "}
        <a className="fr-link" target="_blank" rel="noreferrer" href="https://fr.matomo.org/faq/general/faq_20000/">
          https://fr.matomo.org/faq/general/faq_20000/
        </a>
      </Typography>
    </Stack>
  );
};
