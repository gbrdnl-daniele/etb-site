/* =========================================================
   ETB EMAIL MANAGER
   Gestione email preventivo cliente + booking ETB
   ========================================================= */

const ETB_EMAIL_CONFIG = {
  logoUrl: "assets/images/etb-logo.png",

  customerSubject: "La tua richiesta per ETB — Eros Ramazzotti Tribute Band",

  bookingSubject: "Nuova richiesta preventivo ETB",
};

function escapeEmailHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatEmailDate(dateString) {
  if (!dateString) {
    return "Data non indicata";
  }

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatEmailEuro(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/D";
  }

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildCustomerEmailHtml(payload) {
  const { event, quote, contacts } = payload;

  const clientName = escapeEmailHtml(event.clientName);
  const eventLocation = escapeEmailHtml(event.eventLocation);
  const eventDate = formatEmailDate(event.eventDate);

  const phone1 = escapeEmailHtml(contacts?.phone1 || "");
  const phone2 = escapeEmailHtml(contacts?.phone2 || "");

  const contactNumbers = [phone1, phone2]
    .filter(Boolean)
    .map(
      (phone) => `
        <div style="
          font-size:16px;
          line-height:1.6;
          color:#f2e7d5;
        ">
          ${phone}
        </div>
      `,
    )
    .join("");

  const estimateSection = quote.automaticQuoteAvailable
    ? `
      <tr>
        <td style="padding:0 32px 30px 32px;">
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              border-collapse:collapse;
              background:#17120c;
              border:1px solid #8f672c;
            "
          >
            <tr>
              <td
                align="center"
                style="
                  padding:26px 20px 10px 20px;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:13px;
                  letter-spacing:3px;
                  color:#c99a4a;
                  text-transform:uppercase;
                "
              >
                Stima indicativa
              </td>
            </tr>

            <tr>
              <td
                align="center"
                style="
                  padding:0 20px 26px 20px;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:42px;
                  line-height:1.1;
                  font-weight:700;
                  color:#fff4df;
                "
              >
                ${formatEmailEuro(quote.commercialTotal)}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${
        quote.highDemand
          ? `
            <tr>
              <td style="padding:0 32px 24px 32px;">
                <div style="
                  padding:16px 18px;
                  border-left:3px solid #c99a4a;
                  background:#100d09;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:14px;
                  line-height:1.6;
                  color:#d8c4a4;
                ">
                  La data richiesta rientra nel periodo di maggiore domanda.
                  La disponibilità resta soggetta a conferma del booking ETB.
                </div>
              </td>
            </tr>
          `
          : ""
      }
    `
    : `
      <tr>
        <td style="padding:0 32px 28px 32px;">
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              border-collapse:collapse;
              background:#17120c;
              border:1px solid #8f672c;
            "
          >
            <tr>
              <td style="
                padding:24px;
                font-family:Arial,Helvetica,sans-serif;
                font-size:16px;
                line-height:1.7;
                color:#f2e7d5;
              ">
                Non è stato possibile elaborare automaticamente una stima
                economica per questa richiesta.
                <br /><br />
                ${escapeEmailHtml(quote.message || "")}
                <br /><br />
                Il booking ETB valuterà i dettagli e ti ricontatterà con una
                proposta personalizzata.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;

  return `
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${ETB_EMAIL_CONFIG.customerSubject}</title>
  </head>

  <body style="
    margin:0;
    padding:0;
    background:#050505;
  ">
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="
        width:100%;
        border-collapse:collapse;
        background:#050505;
      "
    >
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table
            role="presentation"
            width="640"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width:100%;
              max-width:640px;
              border-collapse:collapse;
              background:#0b0a08;
              border:1px solid #2c2114;
            "
          >
            <tr>
              <td style="padding:0;">
                <img
                  src="${ETB_EMAIL_CONFIG.logoUrl}"
                  alt="ETB Eros Ramazzotti Tribute Band"
                  width="640"
                  style="
                    display:block;
                    width:100%;
                    max-width:640px;
                    height:auto;
                    border:0;
                  "
                />
              </td>
            </tr>

            <tr>
              <td style="
                padding:34px 32px 18px 32px;
                font-family:Arial,Helvetica,sans-serif;
                color:#f2e7d5;
              ">
                <div style="
                  margin-bottom:12px;
                  font-size:13px;
                  letter-spacing:3px;
                  color:#c99a4a;
                  text-transform:uppercase;
                ">
                  Richiesta ricevuta
                </div>

                <div style="
                  font-size:28px;
                  line-height:1.25;
                  font-weight:700;
                  color:#fff4df;
                ">
                  Grazie ${clientName}
                </div>

                <div style="
                  margin-top:16px;
                  font-size:16px;
                  line-height:1.7;
                  color:#d8cfc1;
                ">
                  Abbiamo ricevuto la tua richiesta per un live di
                  ETB — Eros Ramazzotti Tribute Band.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 32px 28px 32px;">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    border-collapse:collapse;
                    background:#100d09;
                    border-top:1px solid #3a2b19;
                    border-bottom:1px solid #3a2b19;
                  "
                >
                  <tr>
                    <td style="
                      padding:18px 20px 8px 20px;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:12px;
                      letter-spacing:2px;
                      color:#c99a4a;
                      text-transform:uppercase;
                    ">
                      Data evento
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      padding:0 20px 16px 20px;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:17px;
                      color:#f2e7d5;
                    ">
                      ${eventDate}
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      padding:8px 20px 8px 20px;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:12px;
                      letter-spacing:2px;
                      color:#c99a4a;
                      text-transform:uppercase;
                    ">
                      Località
                    </td>
                  </tr>

                  <tr>
                    <td style="
                      padding:0 20px 18px 20px;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:17px;
                      color:#f2e7d5;
                    ">
                      ${eventLocation}
                    </td>
                  </tr>

                  ${
                    quote.automaticQuoteAvailable
                      ? `
                        <tr>
                          <td style="
                            padding:8px 20px 8px 20px;
                            font-family:Arial,Helvetica,sans-serif;
                            font-size:12px;
                            letter-spacing:2px;
                            color:#c99a4a;
                            text-transform:uppercase;
                          ">
                            Formazione
                          </td>
                        </tr>

                        <tr>
                          <td style="
                            padding:0 20px 18px 20px;
                            font-family:Arial,Helvetica,sans-serif;
                            font-size:17px;
                            color:#f2e7d5;
                          ">
                            ${quote.musicians} musicisti
                          </td>
                        </tr>
                      `
                      : ""
                  }
                </table>
              </td>
            </tr>

            ${estimateSection}

            <tr>
              <td style="
                padding:0 32px 16px 32px;
                font-family:Arial,Helvetica,sans-serif;
                font-size:14px;
                line-height:1.7;
                color:#bfb4a3;
              ">
                La stima è indicativa e non costituisce conferma definitiva
                della disponibilità, dell’ingaggio o delle condizioni tecniche.
                La richiesta sarà verificata dal booking ETB.
              </td>
            </tr>

            <tr>
              <td style="
                padding:0 32px 28px 32px;
                font-family:Arial,Helvetica,sans-serif;
                font-size:13px;
                line-height:1.7;
                color:#988b79;
              ">
                La stima indicata rappresenta il costo complessivo stimato del live ETB.
                Eventuali imposte, IVA e ulteriori oneri fiscali o previdenziali
                applicabili non sono inclusi e saranno determinati in base alla modalità
                contrattuale concordata.
              </td>
            </tr>

            
            <tr>
              <td style="
                padding:24px 32px;
                background:#080705;
                border-top:1px solid #2c2114;
                font-family:Arial,Helvetica,sans-serif;
              ">
                <div style="
                  margin-bottom:12px;
                  font-size:12px;
                  letter-spacing:2px;
                  color:#c99a4a;
                  text-transform:uppercase;
                ">
                  Contatti ETB
                </div>

                ${contactNumbers}

                <div style="
                  margin-top:14px;
                  font-size:13px;
                  line-height:1.6;
                  color:#988b79;
                ">
                  Gli stessi numeri sono disponibili anche per messaggi WhatsApp.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

function buildEtbEmailHtml(payload) {
  const { customerEmail, customerPhone, event, route, quote } = payload;

  const automaticQuote = quote.automaticQuoteAvailable;

  const rows = [
    ["Nome cliente", event.clientName],
    ["Telefono / WhatsApp", customerPhone],
    ["Email cliente", customerEmail],
    ["Data evento", formatEmailDate(event.eventDate)],
    ["Località", event.eventLocation],
    ["Tipo location", event.locationType],
    ["Formazione richiesta", event.lineup],
    ["Service audio/luci", event.serviceOption],
    ["Note", event.notes || "Nessuna nota"],
    ["Distanza sola andata", `${route.distanceKmOneWay} km`],
    ["Pedaggio stimato sola andata", formatEmailEuro(route.tollOneWay)],
    ["Preventivo automatico", automaticQuote ? "SÌ" : "NO"],
    ["Musicisti", quote.musicians ?? "N/D"],
    ["Periodo alta domanda", quote.highDemand ? "SÌ" : "NO"],
    [
      "Totale matematico",
      automaticQuote ? formatEmailEuro(quote.total) : "NON EMESSO",
    ],
    [
      "Importo comunicato al cliente",
      automaticQuote ? formatEmailEuro(quote.commercialTotal) : "NON EMESSO",
    ],
    ["Motivo / messaggio motore", quote.message || "Nessun blocco automatico"],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="
            width:38%;
            padding:11px 14px;
            border-bottom:1px solid #342819;
            font-family:Arial,Helvetica,sans-serif;
            font-size:13px;
            font-weight:700;
            color:#c99a4a;
            vertical-align:top;
          ">
            ${escapeEmailHtml(label)}
          </td>

          <td style="
            padding:11px 14px;
            border-bottom:1px solid #342819;
            font-family:Arial,Helvetica,sans-serif;
            font-size:14px;
            line-height:1.5;
            color:#f2e7d5;
            vertical-align:top;
          ">
            ${escapeEmailHtml(value)}
          </td>
        </tr>
      `,
    )
    .join("");

  const technicalJson = escapeEmailHtml(
    JSON.stringify(quote.technicalDetails || quote, null, 2),
  );

  return `
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${ETB_EMAIL_CONFIG.bookingSubject}</title>
  </head>

  <body style="
    margin:0;
    padding:0;
    background:#050505;
  ">
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="
        width:100%;
        border-collapse:collapse;
        background:#050505;
      "
    >
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table
            role="presentation"
            width="720"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width:100%;
              max-width:720px;
              border-collapse:collapse;
              background:#0b0a08;
              border:1px solid #2c2114;
            "
          >
            <tr>
              <td style="
                padding:28px 28px 20px 28px;
                font-family:Arial,Helvetica,sans-serif;
              ">
                <div style="
                  margin-bottom:8px;
                  font-size:12px;
                  letter-spacing:3px;
                  text-transform:uppercase;
                  color:#c99a4a;
                ">
                  Booking ETB
                </div>

                <div style="
                  font-size:28px;
                  line-height:1.2;
                  font-weight:700;
                  color:#fff4df;
                ">
                  Nuova richiesta preventivo
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 28px 26px 28px;">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    width:100%;
                    border-collapse:collapse;
                    background:#100d09;
                    border:1px solid #342819;
                  "
                >
                  ${rowsHtml}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 28px 28px 28px;">
                <div style="
                  margin-bottom:10px;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:12px;
                  letter-spacing:2px;
                  text-transform:uppercase;
                  color:#c99a4a;
                ">
                  Dettagli tecnici completi
                </div>

                <pre style="
                  margin:0;
                  padding:18px;
                  overflow:auto;
                  white-space:pre-wrap;
                  word-break:break-word;
                  background:#070604;
                  border:1px solid #342819;
                  font-family:Consolas,Monaco,monospace;
                  font-size:12px;
                  line-height:1.5;
                  color:#d8cfc1;
                ">${technicalJson}</pre>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

function openEmailPreviewWindow(title, html) {
  const previewWindow = window.open("", "_blank");

  if (!previewWindow) {
    throw new Error(
      "Il browser ha bloccato l'apertura della preview email. Consenti i popup per questo sito.",
    );
  }

  previewWindow.document.open();
  previewWindow.document.write(html);
  previewWindow.document.close();

  previewWindow.document.title = title;
}

async function simulateEtbQuoteEmails(payload) {
  const customerEmailHtml = buildCustomerEmailHtml(payload);
  const bookingEmailHtml = buildEtbEmailHtml(payload);

  console.log("===== EMAIL CLIENTE HTML =====");
  console.log(customerEmailHtml);

  console.log("===== EMAIL ETB HTML =====");
  console.log(bookingEmailHtml);

  openEmailPreviewWindow(ETB_EMAIL_CONFIG.customerSubject, customerEmailHtml);

  await new Promise((resolve) => setTimeout(resolve, 250));

  openEmailPreviewWindow(ETB_EMAIL_CONFIG.bookingSubject, bookingEmailHtml);

  await new Promise((resolve) => setTimeout(resolve, 700));

  return {
    success: true,
    mode: "mock",
    customerEmail: payload.customerEmail,
    bookingEmail: payload.bookingEmail,
  };
}

async function sendEtbQuoteEmails(payload) {
  if (!payload) {
    throw new Error("Payload email mancante.");
  }

  if (!payload.customerEmail) {
    throw new Error("Email cliente mancante.");
  }

  if (!payload.bookingEmail) {
    throw new Error("Email booking ETB mancante.");
  }

  if (window.ETB_CONFIG.backend.mock) {
    return simulateEtbQuoteEmails(payload);
  }

  const response = await fetch(window.ETB_CONFIG.backend.sendQuoteEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Invio email non riuscito.");
  }

  return response.json();
}
