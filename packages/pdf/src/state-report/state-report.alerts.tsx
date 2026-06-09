export const Alerts = ({}) => {};

/**
 * 
 * 
const generateAlertsTable = (alerts: MinimalAlert[]) => {
  const groupedAlerts = groupBy(alerts, (alert) => alert.alert);
  return `<ul>
    ${Object.entries(groupedAlerts)
      .map(([alertTitle, alertGroup]) => {
        const firstAlert = alertGroup[0]!;

        const mandatoryEmails = deserializeMandatoryEmails(firstAlert.mandatory_emails || "");

        const servicesDestArray = mandatoryEmails.map((e) => {
          const pronom = servicePronoms.find((sp) => sp.serviceCode === e.service)?.pronom || "à";
          return `${pronom}${e.service}` + (e.email ? ` (${e.email})` : "");
        });

        return `<li>
          <div><b>${alertTitle}</b></div>
          <i style="color: #3A3A3A">Alerte transmise par courriel ${formatArrayWithCommasAnd(servicesDestArray)}</i><br/>
          <br/>
          ${alertGroup.map(generateAlertTableRow).join("<br/>")}
        </li>`;
      })
      .join("<br/>")}  
  </ul>`;
};

const formatArrayWithCommasAnd = (items: string[]) => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} et ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;
};

/*  ${alerts
      .filter((a) => !!a.alert && !!a.email)
      .map((a) => {
        const section = alertSections.find((section) => section.title === a.alert);
        const withPronom = [section?.pronom ?? "à", a.nom_service_contacte];

        return `
            <li>
              <b>${a.alert}</b><br/>
              <i>Alerte transmise par courriel ${alertSections.find((section) => section.title === a.alert)?.pronom ?? "à"} ${a.email || "Non renseigné"}</i>
            </li>
          `;
      })
      .join("")}
 */

/*

const generateAlertTableRow = (alert: MinimalAlert) => {
  if (alert.alert === OBJETS_MOBILIERS_SECTION) {
    return `
      <div>- ${alert.objet_ou_mobilier_name} (<a href="${`https://pop.culture.gouv.fr/notice/palissy/${alert.objet_ou_mobilier}`}">${alert.objet_ou_mobilier}</a>) : ${alert.probleme}</div>
      <div><u>Commentaires :</u> ${alert.commentaires || "Aucun"}<br/>
      ${generateImagesTable(
        alert.attachments.map((a) => ({ attachmentId: a.id, url: a.file!, label: a.label ?? undefined })),
        { hideTitle: true },
      )}</div>
    `;
  }

  return `<div>
  <div style="margin-bottom: 8px;">
    <u>Commentaires :</u> ${alert.commentaires || "Aucun"}
  </div>
  ${generateImagesTable(
    alert.attachments.map((a) => ({ attachmentId: a.id, url: a.file!, label: a.label ?? undefined })),
    { hideTitle: true },
  )}
  
  </div>`;
};

export const alertSectionStaticData = [
  { title: EDIFICE_EN_PERIL_SECTION, services: ["CRMH"] },
  { title: ABORDS_DE_L_EDIFICE_SECTION, services: ["UDAP"] },
  { title: OBJETS_MOBILIERS_SECTION, services: ["CAOA", "CRMH"] },
  { title: ARCHEOLOGIE_SECTION, services: ["SRA"] },
  { title: SITE_CLASSE_OU_INSCRIT_SECTION, services: ["DREAL"] },
  { title: BIODIVERSITE_SECTION, services: ["OFB"] },
  { title: SECURITE_SECTION, services: ["Mairie"] },
];

export const servicePronoms = [
  { serviceCode: "CRMH", pronom: "au " },
  { serviceCode: "UDAP", pronom: "à l'" },
  { serviceCode: "CAOA", pronom: "au " },
  { serviceCode: "SRA", pronom: "à la " },
  { serviceCode: "DREAL", pronom: "à la " },
  { serviceCode: "OFB", pronom: "à l'" },
  { serviceCode: "Mairie", pronom: "à la " },
];

 */
