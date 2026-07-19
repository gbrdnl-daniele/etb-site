/* =========================================================
   ETB BACKEND — EMAIL TEMPLATES
   ========================================================= */

const LOGO_URL = "https://etberostribute.it/assets/images/etb-logo.png";

const ETB_CONTACTS = {
  phone1: "348.8299245",
  phone2: "392.3594010",
};

function normalizePhoneHref(value = "") {
  return String(value).replace(/[^\d+]/g, "");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(dateString) {
  const [year, month, day] = String(dateString).split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatEuro(value) {
  if (!Number.isFinite(Number(value))) {
    return "N/D";
  }

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function labelLocationType(value) {
  return (
    {
      A: "Suolo pubblico · Piazza · Festa",
      B: "Pub · Ristorante · Locale",
      C: "Teatro · Auditorium",
      D: "Cerimonia nuziale",
    }[value] || value
  );
}

function labelLineup(value) {
  return value === "reduced"
    ? "ETB Compact Live — 7 musicisti"
    : "ETB Full Live Experience — 8 musicisti";
}

function labelService(value) {
  return value === "available"
    ? "Già disponibile sul posto"
    : "Richiesto a ETB";
}

export function buildCustomerEmailHtml({ event, quote }) {
  const estimateSection = quote.automaticQuoteAvailable
    ? `
      <tr>
        <td style="padding:0 32px 30px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
            style="border-collapse:collapse;background:#17120c;border:1px solid #8f672c;">
            <tr>
              <td align="center"
                style="padding:26px 20px 10px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:3px;color:#c99a4a;text-transform:uppercase;">
                Stima indicativa
              </td>
            </tr>
            <tr>
              <td align="center"
                style="padding:0 20px 26px;font-family:Arial,sans-serif;font-size:42px;line-height:1.1;font-weight:700;color:#fff4df;">
                ${formatEuro(quote.commercialTotal)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      ${
        quote.highDemand
          ? `
          <tr>
            <td style="padding:0 32px 24px;">
              <div style="padding:16px 18px;border-left:3px solid #c99a4a;background:#100d09;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#d8c4a4;">
                La data richiesta rientra nel periodo di maggiore domanda.
                La disponibilità resta soggetta a conferma del booking ETB.
              </div>
            </td>
          </tr>`
          : ""
      }
    `
    : `
      <tr>
        <td style="padding:0 32px 28px;">
          <div style="padding:24px;background:#17120c;border:1px solid #8f672c;font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#f2e7d5;">
            Non è stato possibile elaborare automaticamente una stima economica.
            <br /><br />
            ${escapeHtml(quote.message || "")}
            <br /><br />
            Il booking ETB valuterà i dettagli e ti ricontatterà con una proposta personalizzata.
          </div>
        </td>
      </tr>
    `;

  return `<!doctype html>
<html lang="it">
  <body style="margin:0;padding:0;background:#050505;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
      style="width:100%;border-collapse:collapse;background:#050505;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0"
            style="width:100%;max-width:640px;border-collapse:collapse;background:#0b0a08;border:1px solid #2c2114;">
            <tr>
              <td>
                <img src="${LOGO_URL}" alt="ETB Eros Ramazzotti Tribute Band"
                  width="640" style="display:block;width:100%;height:auto;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:34px 32px 18px;font-family:Arial,sans-serif;color:#f2e7d5;">
                <div style="margin-bottom:12px;font-size:13px;letter-spacing:3px;color:#c99a4a;text-transform:uppercase;">
                  Richiesta ricevuta
                </div>
                <div style="font-size:28px;line-height:1.25;font-weight:700;color:#fff4df;">
                  Grazie ${escapeHtml(event.clientName)}
                </div>
                <div style="margin-top:16px;font-size:16px;line-height:1.7;color:#d8cfc1;">
                  Abbiamo ricevuto la tua richiesta per un live di
                  ETB — Eros Ramazzotti Tribute Band.
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 28px;">
                <div style="padding:18px 20px;background:#100d09;border-top:1px solid #3a2b19;border-bottom:1px solid #3a2b19;font-family:Arial,sans-serif;color:#f2e7d5;line-height:1.8;">
                  <strong style="color:#c99a4a;">Data evento</strong><br />
                  ${escapeHtml(formatDate(event.eventDate))}
                  <br /><br />
                  <strong style="color:#c99a4a;">Località</strong><br />
                  ${escapeHtml(event.eventLocation)}
                  ${
                    quote.automaticQuoteAvailable
                      ? `<br /><br /><strong style="color:#c99a4a;">Formazione</strong><br />${quote.musicians} musicisti`
                      : ""
                  }
                </div>
              </td>
            </tr>
            ${estimateSection}
            <tr>
              <td style="padding:0 32px 16px;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#bfb4a3;">
                La stima è indicativa e non costituisce conferma definitiva
                della disponibilità, dell’ingaggio o delle condizioni tecniche.
                La richiesta sarà verificata dal booking ETB.
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#988b79;">
                La stima rappresenta il costo complessivo stimato del live ETB.
                Eventuali imposte, IVA e ulteriori oneri fiscali o previdenziali
                applicabili non sono inclusi e saranno determinati in base alla
                modalità contrattuale concordata.
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;background:#080705;border-top:1px solid #2c2114;font-family:Arial,sans-serif;color:#f2e7d5;line-height:1.7;">
               
                <strong style="color:#c99a4a;">Contatti ETB</strong><br />

                <a
                  href="tel:${normalizePhoneHref(ETB_CONTACTS.phone1)}"
                  style="color:#fff4df;text-decoration:none;"
                >
                  ${escapeHtml(ETB_CONTACTS.phone1)}
                </a>

                ${
                  ETB_CONTACTS.phone2
                    ? `
                      <br />
                      <a
                        href="tel:${normalizePhoneHref(ETB_CONTACTS.phone2)}"
                        style="color:#fff4df;text-decoration:none;"
                      >
                        ${escapeHtml(ETB_CONTACTS.phone2)}
                      </a>
                    `
                    : ""
                }
                <div
                  style="
                    margin-top:12px;
                    color:#988b79;
                    font-size:13px;
                    line-height:1.6;
                  "
                >
                  Gli stessi numeri sono disponibili anche tramite WhatsApp.
                  <br />
                  Puoi inoltre rispondere direttamente a questa email.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildBookingEmailHtml({
  customerEmail,
  customerPhone,
  marketingConsent,
  event,
  route,
  quote,
  receivedAt,
  requestId,
}) {
  const rows = [
    ["ID richiesta", requestId],
    ["Ricevuta il", receivedAt],
    ["Nome cliente", event.clientName],
    ["Telefono / WhatsApp", customerPhone],
    ["Email cliente", customerEmail],
    ["Data evento", formatDate(event.eventDate)],
    ["Località indicata", event.eventLocation],
    ["Località verificata", route?.destination ?? "EVENTO FUORI ITALIA"],
    ["Tipo location", labelLocationType(event.locationType)],
    ["Formazione richiesta", labelLineup(event.lineup)],
    ["Service audio/luci", labelService(event.serviceOption)],
    ["Note", event.notes || "Nessuna nota"],
    ["Consenso comunicazioni future", marketingConsent ? "SÌ" : "NO"],
    ["Distanza sola andata", route ? `${route.distanceKmOneWay} km` : "N/D"],
    [
      "Durata stimata sola andata",
      route ? `${route.durationMinutes} minuti` : "N/D",
    ],
    ["Preventivo automatico", quote.automaticQuoteAvailable ? "SÌ" : "NO"],
    ["Musicisti", quote.musicians ?? "N/D"],
    ["Periodo alta domanda", quote.highDemand ? "SÌ" : "NO"],
    [
      "Totale matematico",
      quote.automaticQuoteAvailable ? formatEuro(quote.total) : "NON EMESSO",
    ],
    [
      "Importo comunicato al cliente",
      quote.automaticQuoteAvailable
        ? formatEuro(quote.commercialTotal)
        : "NON EMESSO",
    ],
    ["Motivo / messaggio motore", quote.message || "Nessun blocco automatico"],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td
          width="38%"
          style="
            width:38%;
            padding:11px 14px;
            border-bottom:1px solid #342819;
            font-family:Arial,sans-serif;
            font-size:13px;
            font-weight:700;
            color:#c99a4a;
            vertical-align:top;
            overflow-wrap:anywhere;
            word-break:break-word;
          "
        >
          ${escapeHtml(label)}
        </td>

        <td
          width="62%"
          style="
            width:62%;
            padding:11px 14px;
            border-bottom:1px solid #342819;
            font-family:Arial,sans-serif;
            font-size:14px;
            line-height:1.5;
            color:#f2e7d5;
            vertical-align:top;
            overflow-wrap:anywhere;
            word-break:break-word;
          "
        >
          ${escapeHtml(value)}
        </td>
      </tr>`,
    )
    .join("");

  const technicalJson = escapeHtml(
    JSON.stringify(
      {
        requestId,
        receivedAt,
        customerEmail,
        customerPhone,
        marketingConsent,
        event,
        route,
        quote,
      },
      null,
      2,
    ),
  );

  return `<!doctype html>
<html lang="it">
  <body style="margin:0;padding:0;background:#050505;">
    <div style="max-width:760px;margin:0 auto;padding:28px 16px;font-family:Arial,sans-serif;">
      <div style="padding:28px;border:1px solid #2c2114;background:#0b0a08;">
        <div style="margin-bottom:8px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#c99a4a;">
          Booking ETB
        </div>
        <h1 style="margin:0 0 24px;color:#fff4df;font-size:28px;">
          Nuova richiesta preventivo
        </h1>
          
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            style="
              width:100%;
              border-collapse:collapse;
              table-layout:fixed;
              background:#100d09;
              border:1px solid #342819;
            "
          >
            ${rowsHtml}
          </table>

        <div style="margin-top:28px;margin-bottom:10px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c99a4a;">
          JSON completo della richiesta
        </div>
        <pre style="margin:0;padding:18px;overflow:auto;white-space:pre-wrap;word-break:break-word;background:#070604;border:1px solid #342819;color:#d8cfc1;font-family:Consolas,Monaco,monospace;font-size:12px;line-height:1.5;">${technicalJson}</pre>
      </div>
    </div>
  </body>
</html>`;
}
