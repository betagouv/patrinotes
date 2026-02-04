import { Font, Image, Text, View, ViewProps } from "@react-pdf/renderer";
import React from "react";
import { StateReportAlert } from "../../frontend/src/db/AppSchema";
import linkifyHtml from "linkify-html";
export const initFonts = (folder: string = "") => {
  Font.register({
    family: "Marianne",
    fonts: [
      {
        src: `${folder}/fonts/Marianne-Regular.ttf`,
        fontStyle: "normal",
        fontWeight: "normal",
      },
      { src: `${folder}/fonts/Marianne-Bold.ttf`, fontStyle: "normal", fontWeight: "bold" },
      {
        src: `${folder}/fonts/Marianne-RegularItalic.ttf`,
        fontStyle: "italic",
        fontWeight: "normal",
      },
      {
        src: `${folder}/fonts/Marianne-BoldItalic.ttf`,
        fontStyle: "italic",
        fontWeight: "bold",
      },
    ],
  });
};

export const MarianneHeader = ({
  marianneUrl,
  styles,
}: {
  marianneUrl: string;
  styles?: ({ pageNumber }: { pageNumber: number }) => ViewProps["style"];
}) => {
  return (
    <View
      fixed
      render={({ pageNumber }) => (
        <View
          style={{
            position: "absolute",
            top: -36,
            left: 40,
            height: 13,
            width: 34,
            ...styles?.({ pageNumber }),
          }}
          fixed
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            src={marianneUrl}
          />
        </View>
      )}
    />
  );
};

export const Pagination = () => {
  return (
    <View fixed style={{ position: "absolute", bottom: 40, right: 40, fontSize: 10 }}>
      <Text
        render={({ pageNumber, totalPages }) => (
          <Text style={{ fontSize: 8 }}>
            Page {pageNumber} sur {totalPages}
          </Text>
        )}
      />
    </View>
  );
};

const minifyHtml = (htmlString: string) => {
  return htmlString.split("\n").join("").split("  ").join("");
};
const breakUrl = (url: string) => url.replace(/([/\-._])/g, "$1\u200B");

export const processHtml = (htmlString: string) => {
  return minifyHtml(
    linkifyHtml(htmlString, {
      target: "_blank",
      format: (value) => breakUrl(value),
    }),
  );
};

export const serializeMandatoryEmails = (emails: { service: string; email: string }[]): string => {
  return emails.map((e) => `${e.service}:${e.email}`).join(";");
};

export const deserializeMandatoryEmails = (data: string): { service: string; email: string }[] => {
  if (!data) return [];
  return data.split(";").map((entry) => {
    const [service, email] = entry.split(":");
    return { service: service!, email: email ?? "" };
  });
};

export const getIsAlertVisited = (alertSection: any) => {
  return !!alertSection.commentaires || !!alertSection.objet_ou_mobilier;
};

export const OBJETS_MOBILIERS_SECTION = "Objets et mobiliers";
export const EDIFICE_EN_PERIL_SECTION = "Edifice en péril";
export const ABORDS_DE_L_EDIFICE_SECTION = "Abords de l'édifice";
export const ARCHEOLOGIE_SECTION = "Archéologie";
export const SITE_CLASSE_OU_INSCRIT_SECTION = "Site classé ou inscrit";
export const BIODIVERSITE_SECTION = "Biodiversité";
export const SECURITE_SECTION = "Sécurité";
