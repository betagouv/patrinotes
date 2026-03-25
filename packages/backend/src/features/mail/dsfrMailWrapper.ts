import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "../../assets");

const marianneLightBuffer = fs.readFileSync(path.join(assetsDir, "Marianne-Light@2x.png"));
const marianneDarkBuffer = fs.readFileSync(path.join(assetsDir, "Marianne-Dark@2x.png"));

const MARIANNE_LIGHT_CID = "marianne-light@patrinotes";
const MARIANNE_DARK_CID = "marianne-dark@patrinotes";

export type DsfrMailAttachment = {
  cid: string;
  filename: string;
  content: Buffer;
  contentDisposition: "inline";
  contentType: string;
};

const MARIANNE_ATTACHMENTS: DsfrMailAttachment[] = [
  { cid: MARIANNE_LIGHT_CID, filename: "Marianne-Light.png", content: marianneLightBuffer, contentDisposition: "inline", contentType: "image/png" },
  { cid: MARIANNE_DARK_CID,  filename: "Marianne-Dark.png",  content: marianneDarkBuffer,  contentDisposition: "inline", contentType: "image/png" },
];

const DSFR_CSS = `
  .hide-white {
    display: none !important;
  }
  .hide-black {
    display: block !important;
  }
  /********* DARK MODE ************/
  :root {
    color-scheme: light dark;
    supported-color-schemes: light dark;
  }
  @media (prefers-color-scheme: dark) {
    body {
      background: #161616 !important;
      font-color: #ffffff !important;
    }
    svg { fill: white; filter: invert(1); }
    .white { fill: #ffffff !important; filter: invert(1); }
    .hide-black { display: none !important; }
    .hide-white { display: block !important; }
    .darkmode {
      background-color: #161616 !important;
      font-color: #ffffff !important;
      color: #ffffff !important;
      background: none !important;
      border-color: #2A2A2A !important;
    }
    .darkmode-1 {
      background-color: #161616 !important;
      font-color: #CECECE !important;
      color: #CECECE !important;
      background: none !important;
    }
    .darkmode-2 {
      background-color: #242424 !important;
      font-color: #ffffff !important;
      color: #ffffff !important;
      border-color: #2A2A2A !important;
    }
    .darkmode-3 {
      background-color: #1E1E1E !important;
      font-color: #ffffff !important;
      color: #ffffff !important;
      border-color: #2A2A2A !important;
    }
    .darkmode-4 {
      background-color: #1B1B35 !important;
      font-color: #CECECE !important;
      color: #CECECE !important;
      border-color: #2A2A2A !important;
    }
    .darkmode-5 {
      background-color: #1A1A3D !important;
      font-color: #ffffff !important;
      color: #ffffff !important;
      border-color: #2A2A2A !important;
    }
    .darkmode-6 {
      background-color: #1F1F4A !important;
      font-color: #ffffff !important;
      color: #ffffff !important;
      border-color: #2A2A2A !important;
    }
    a[href] { color: #8585F6 !important; }
    a.darkmode-button-color-primary[href] { font-color: #000091 !important; color: #000091 !important; }
    .darkmode-button-primary {
      background-color: #8585F6 !important;
      font-color: #000091 !important;
      color: #000091 !important;
      border: solid 1px #8585F6 !important;
    }
    [data-ogsc] .darkmode { background-color: #161616 !important; }
    [data-ogsc] h1,[data-ogsc] h2,[data-ogsc] p,[data-ogsc] span,[data-ogsc] a,[data-ogsc] b { color: #ffffff !important; }
    [data-ogsc] .link { color: #7C7CFF !important; }
  }
  body {
    width: 100%;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
    -webkit-text-size-adjust: none;
    -webkit-font-smoothing: antialiased;
    -ms-text-size-adjust: none;
  }
  a[href] { color: #000091; }
  table { border-collapse: collapse; }
  table, td { border-collapse: collapse; padding: 0px; margin: 0px; }
  table.wlkm-mw { min-width: 0px !important; }
  @media only screen and (max-width: 600px) {
    .wlkm-mw { width: 480px !important; padding-left: 0 !important; padding-right: 0 !important; }
    .wlkm-cl { width: 460px !important; }
    .wlkm-hAuto { height: auto !important; }
    .wlkm-resp { width: auto !important; max-width: 460px !important; }
    .wlkm-resp2 { width: auto !important; max-width: 480px !important; }
    .wlkm-hide { display: none !important; }
    .wlkm-alignCenter { display: block !important; text-align: center !important; }
    .wlkm-alignCenter img { margin: 0 auto; }
    .img-max { width: 460px !important; }
  }
  @media only screen and (max-width: 480px) {
    .wlkm-cl { width: 90% !important; margin: 0 auto; }
    .wlkm-resp { max-width: 280px !important; }
    .img-max { width: 90% !important; margin: 0 auto; }
    .wlkm-resp2 { max-width: 300px !important; }
    .wlkm-mw { width: 100% !important; margin: 0 auto; }
  }
`;

export function wrapWithDsfrMail({
  title,
  preheader,
  content,
  serviceName = "Ministère de la Culture",
}: {
  title: string;
  preheader?: string;
  content: string;
  serviceName?: string;
}): { html: string; attachments: DsfrMailAttachment[] } {
  const html = `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;" />
  <title>${escapeHtml(title)}</title>
  <style type="text/css">${DSFR_CSS}</style>
</head>
<body style="font-family: Tahoma, Geneva, sans-serif;">

  ${
    preheader
      ? `<!-- Preheader -->
  <table style="min-width:100%!important; width:100%;" width="100%" cellspacing="0" cellpadding="0" role="presentation" border="0" bgcolor="#ffffff" class="wlkm-mw darkmode">
    <tr><td align="center" class="darkmode">
      <table style="min-width:600px; margin:0 auto; width:600px;" class="wlkm-mw darkmode" width="600" cellspacing="0" cellpadding="0" role="presentation" border="0" bgcolor="#ffffff" align="center">
        <tr><td class="darkmode">
          <table style="margin:0 auto; width:496px;" class="wlkm-cl darkmode" width="496" cellspacing="0" cellpadding="0" role="presentation" border="0" bgcolor="#ffffff" align="center">
            <tr><td class="darkmode-1" width="496" align="left" valign="top" style="padding:4px 0px 8px 0px; line-height:18px; font-size:12px; color:#6b6b6b; font-family:'Marianne',Arial,Helvetica,sans-serif;">
              <span style="font-family:'Marianne',Arial,Helvetica,sans-serif !important;">${escapeHtml(preheader)}</span>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>`
      : ""
  }

  <!-- Institutional header with Marianne logo -->
  <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#ffffff" class="darkmode" style="min-width:100%!important;width:100%;" role="presentation">
    <tr><td align="center">
      <table style="min-width:620px; margin:0 auto; width:620px;" width="620" cellspacing="0" cellpadding="0" role="presentation" border="0" align="center" class="wlkm-mw darkmode">
        <tr><td align="center">
          <table style="min-width:600px; margin:0 auto; width:600px; border-left:1px #e5e5e5 solid; border-right:1px #e5e5e5 solid; border-top:1px #e5e5e5 solid;" class="wlkm-mw darkmode" width="600" cellspacing="0" cellpadding="0" role="presentation" border="0" bgcolor="#ffffff" align="center">
            <tr><td>
              <table style="margin:0 auto; width:496px;" class="wlkm-cl darkmode" width="496" cellspacing="0" cellpadding="0" role="presentation" border="0" bgcolor="#ffffff" align="center">
                <tr><td style="width:100%;" width="100%" valign="top" align="center">
                  <!-- Marianne logo left -->
                  <table style="border-collapse:collapse;" width="76" cellspacing="0" cellpadding="0" role="presentation" border="0" align="left" bgcolor="#ffffff" class="darkmode">
                    <tr><td align="center">
                      <table style="border-collapse:collapse;" width="100%" cellspacing="0" cellpadding="0" role="presentation" border="0" align="left" bgcolor="#ffffff" class="darkmode">
                        <tr><td height="12" style="height:12px; line-height:12px; font-size:12px;">&nbsp;</td></tr>
                        <tr><td class="hide-black" align="left">
                          <img src="cid:${MARIANNE_LIGHT_CID}" alt="République française" style="display:block; height:auto; width:76px;" width="76" border="0" class="hide-black">
                        </td></tr>
                        <tr><td class="hide-white" align="left">
                          <img src="cid:${MARIANNE_DARK_CID}" alt="République française" style="display:block; height:auto; width:76px;" width="76" border="0" class="hide-white">
                        </td></tr>
                        <tr><td height="12" style="height:12px; line-height:12px; font-size:12px;">&nbsp;</td></tr>
                      </table>
                    </td></tr>
                  </table>
                  <!-- Service name right -->
                  <table style="border-collapse:collapse;" width="200" cellspacing="0" cellpadding="0" role="presentation" border="0" align="right" bgcolor="#ffffff" class="darkmode">
                    <tr><td align="right">
                      <table style="border-collapse:collapse;" width="100%" cellspacing="0" cellpadding="0" role="presentation" border="0" align="right" bgcolor="#ffffff" class="darkmode">
                        <tr><td height="12" style="height:12px; line-height:12px; font-size:12px;">&nbsp;</td></tr>
                        <tr><td class="darkmode" style="line-height:20px; font-size:12px; color:#161616; font-family:'Marianne',Arial,Helvetica,sans-serif;" align="right">
                          <span style="font-family:'Marianne',Arial,Helvetica,sans-serif !important;"><strong>${escapeHtml(serviceName)}</strong></span>
                        </td></tr>
                        <tr><td height="12" style="height:12px; line-height:12px; font-size:12px;">&nbsp;</td></tr>
                      </table>
                    </td></tr>
                  </table>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>

  <!-- Title band -->
  <table style="min-width:100%!important; width:100%;" width="100%" cellspacing="0" cellpadding="0" role="presentation" border="0" bgcolor="#ffffff" class="wlkm-mw darkmode">
    <tr><td align="center">
      <table style="min-width:620px; margin:0 auto; width:620px; background:linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(234,234,234,1) 5%, rgba(234,234,234,1) 95%, rgba(255,255,255,1) 100%);" width="620" cellspacing="0" cellpadding="0" role="presentation" border="0" align="center" class="wlkm-mw darkmode">
        <tr><td align="center">
          <table style="min-width:600px; margin:0 auto; width:600px; border-left:1px #e5e5e5 solid; border-right:1px #e5e5e5 solid;" class="wlkm-mw darkmode-4" width="600" cellspacing="0" cellpadding="0" role="presentation" border="0" bgcolor="#ECECFE" align="center">
            <tr><td>
              <table style="margin:0 auto; width:496px;" class="wlkm-cl darkmode" width="496" cellspacing="0" cellpadding="0" role="presentation" border="0" bgcolor="#ECECFE" align="center">
                <tr><td class="darkmode-4" width="496" align="left" valign="top" style="padding:20px 10px 20px 10px; line-height:32px; font-size:24px; color:#161616; font-family:'Marianne',Arial,Helvetica,sans-serif;">
                  <span style="font-family:'Marianne',Arial,Helvetica,sans-serif !important;"><strong>${escapeHtml(title)}</strong></span>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>

  <!-- Content section -->
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#ffffff" width="100%" style="min-width:100%!important; width:100%;" class="darkmode">
    <tr><td>
      <table style="min-width:620px; margin:0 auto; width:620px; background:linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(234,234,234,1) 5%, rgba(234,234,234,1) 95%, rgba(255,255,255,1) 100%);" width="620" cellspacing="0" cellpadding="0" role="presentation" border="0" align="center" class="wlkm-mw darkmode">
        <tr><td align="center">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#ffffff" width="600" style="min-width:600px; margin:0 auto; width:600px; border-left:1px #e5e5e5 solid; border-right:1px #e5e5e5 solid;" class="wlkm-mw darkmode">
            <tr><td align="left" valign="top" style="padding:24px 10px 24px 10px; line-height:24px; font-size:14px; color:#161616; font-family:Tahoma,Geneva,sans-serif;" class="wlkm-cl darkmode">
              <span style="font-family:Tahoma,Geneva,sans-serif !important;">${content}</span>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>

  <!-- Footer -->
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#ffffff" width="100%" style="min-width:100%!important; width:100%;" class="darkmode">
    <tr><td align="center">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#ffffff" width="600" style="min-width:600px; margin:0 auto; width:600px;" class="wlkm-mw darkmode">
        <tr><td align="left" valign="top" style="padding:10px 10px 20px 10px; line-height:18px; font-size:12px; color:#585858; font-family:Tahoma,Geneva,sans-serif;" class="wlkm-cl darkmode-1">
          <span style="font-family:Tahoma,Geneva,sans-serif !important;">Envoi automatique depuis le service numérique Patrinotes</span>
        </td></tr>
      </table>
    </td></tr>
  </table>

</body>
</html>`;
  return { html, attachments: MARIANNE_ATTACHMENTS };
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
