import { groupBy } from "pastable";
import type { MinimalAlert } from "../stateReport";
import { deserializeMandatoryEmails, OBJETS_MOBILIERS_SECTION } from "../utils";
import { Multiline } from "./state-report.details";
import { ImagesTable } from "../components/images";

export const Alerts = ({ alerts }: { alerts: MinimalAlert[] }) => {
  if (!alerts || alerts.length === 0) return null;

  const groupedAlerts = groupBy(alerts, (alert) => alert.alert);
  return (
    <div>
      <h2>Alertes</h2>
      <b>
        Suite à la visite, {alerts.length} alerte{alerts.length > 1 ? "s ont été" : " a été"} signalée
        {alerts.length > 1 ? "s" : ""} et transmise{alerts.length > 1 ? "s" : ""} aux services concernés :
      </b>
      <ul>
        {Object.entries(groupedAlerts).map(([alertTitle, alertGroup]) => {
          const firstAlert = alertGroup[0]!;
          const mandatoryEmails = deserializeMandatoryEmails(firstAlert.mandatory_emails || "");

          const servicesDestArray = mandatoryEmails.map((e) => {
            const pronom = servicePronoms.find((sp) => sp.serviceCode === e.service)?.pronom || "à";
            return `${pronom}${e.service}` + (e.email ? ` (${e.email})` : "");
          });

          return (
            <li key={alertTitle}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div>
                  <b>{alertTitle}</b>
                </div>
                {alertGroup[0]?.should_send ? (
                  <i style={{ color: "#3A3A3A" }}>
                    Alerte transmise par courriel {formatArrayWithCommasAnd(servicesDestArray)}
                  </i>
                ) : null}
                {alertGroup.map((alert) => {
                  const isObjetsMobiliersSection = alert.alert === OBJETS_MOBILIERS_SECTION;

                  return (
                    <div key={alert.id}>
                      {isObjetsMobiliersSection ? (
                        <div>
                          - {alert.objet_ou_mobilier_name} (
                          <a href={`https://pop.culture.gouv.fr/notice/palissy/${alert.objet_ou_mobilier}`}>
                            {alert.objet_ou_mobilier}
                          </a>
                          ) : {alert.probleme}
                        </div>
                      ) : null}
                      <div style={{ marginBottom: 8, marginTop: 8 }}>
                        <u>Commentaires </u> : <Multiline text={alert.commentaires || "Aucun"} />
                      </div>
                      <ImagesTable
                        images={alert.attachments.map((a) => ({
                          attachmentId: a.id,
                          url: a.file!,
                          label: a.label ?? undefined,
                        }))}
                      />
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const formatArrayWithCommasAnd = (items: string[]) => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} et ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;
};

export const servicePronoms = [
  { serviceCode: "CRMH", pronom: "au " },
  { serviceCode: "UDAP", pronom: "à l'" },
  { serviceCode: "CAOA", pronom: "au " },
  { serviceCode: "SRA", pronom: "à la " },
  { serviceCode: "DREAL", pronom: "à la " },
  { serviceCode: "OFB", pronom: "à l'" },
  { serviceCode: "Mairie", pronom: "à la " },
];
