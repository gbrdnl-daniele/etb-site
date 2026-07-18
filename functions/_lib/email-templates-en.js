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

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatEuro(value) {
  if (!Number.isFinite(Number(value))) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function labelLocationType(value) {
  return (
    {
      A: "Public space · Town square · Festival",
      B: "Pub · Restaurant · Live venue",
      C: "Theatre · Auditorium",
      D: "Wedding ceremony",
    }[value] || value
  );
}

function labelLineup(value) {
  return value === "reduced"
    ? "ETB Compact Live — 7 musicians"
    : "ETB Full Live Experience — 8 musicians";
}

function labelService(value) {
  return value === "available"
    ? "Already available at the venue"
    : "To be provided by ETB";
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
                Estimated cost
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
                The requested date falls within a period of high demand.
                Availability remains subject to confirmation by ETB Booking.
              </div>
            </td>
          </tr>
          `
          : ""
      }
    `
    : `
      <tr>
        <td style="padding:0 32px 28px;">
          <div style="padding:24px;background:#17120c;border:1px solid #8f672c;font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#f2e7d5;">
            It was not possible to calculate an automatic estimate.

            <br /><br />

            ${escapeHtml(quote.message || "")}

            <br /><br />

            ETB Booking will review the details and contact you with a personalised proposal.
          </div>
        </td>
      </tr>
    `;

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#050505;">
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      style="width:100%;border-collapse:collapse;background:#050505;"
    >
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table
            role="presentation"
            width="640"
            cellspacing="0"
            cellpadding="0"
            style="width:100%;max-width:640px;border-collapse:collapse;background:#0b0a08;border:1px solid #2c2114;"
          >
            <tr>
              <td>
                <img
                  src="${LOGO_URL}"
                  alt="ETB Eros Ramazzotti Tribute Band"
                  width="640"
                  style="display:block;width:100%;height:auto;border:0;"
                />
              </td>
            </tr>

            <tr>
              <td style="padding:34px 32px 18px;font-family:Arial,sans-serif;color:#f2e7d5;">
                <div style="margin-bottom:12px;font-size:13px;letter-spacing:3px;color:#c99a4a;text-transform:uppercase;">
                  Enquiry received
                </div>

                <div style="font-size:28px;line-height:1.25;font-weight:700;color:#fff4df;">
                  Thank you, ${escapeHtml(event.clientName)}
                </div>

                <div style="margin-top:16px;font-size:16px;line-height:1.7;color:#d8cfc1;">
                  We have received your enquiry for a live performance by
                  ETB — Eros Ramazzotti Tribute Band.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 32px 28px;">
                <div style="padding:18px 20px;background:#100d09;border-top:1px solid #3a2b19;border-bottom:1px solid #3a2b19;font-family:Arial,sans-serif;color:#f2e7d5;line-height:1.8;">
                  <strong style="color:#c99a4a;">Event date</strong><br />

                  ${escapeHtml(formatDate(event.eventDate))}

                  <br /><br />

                  <strong style="color:#c99a4a;">Location</strong><br />

                  ${escapeHtml(event.eventLocation)}

                  ${
                    quote.automaticQuoteAvailable
                      ? `<br /><br /><strong style="color:#c99a4a;">Line-up</strong><br />${quote.musicians} musicians`
                      : ""
                  }
                </div>
              </td>
            </tr>

            ${estimateSection}

            <tr>
              <td style="padding:0 32px 16px;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#bfb4a3;">
                This estimate is indicative and does not constitute final
                confirmation of availability, engagement or technical
                conditions. Your enquiry will be reviewed by ETB Booking.
              </td>
            </tr>

            <tr>
              <td style="padding:0 32px 28px;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#988b79;">
                The estimate represents the expected total cost of the ETB live
                performance. Any applicable taxes, VAT and additional fiscal or
                social-security charges are not included and will be determined
                according to the agreed contractual arrangement.
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px;background:#080705;border-top:1px solid #2c2114;font-family:Arial,sans-serif;color:#f2e7d5;line-height:1.7;">
                <strong style="color:#c99a4a;">ETB contacts</strong><br />

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
                  The same numbers are also available on WhatsApp.

                  <br />

                  You may also reply directly to this email.
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
    ["Request ID", requestId],
    ["Received on", receivedAt],
    ["Customer name", event.clientName],
    ["Phone / WhatsApp", customerPhone],
    ["Customer email", customerEmail],
    ["Event date", formatDate(event.eventDate)],
    ["Location entered", event.eventLocation],
    ["Verified location", route.destination],
    ["Venue type", labelLocationType(event.locationType)],
    ["Requested line-up", labelLineup(event.lineup)],
    ["Sound and lighting system", labelService(event.serviceOption)],
    ["Notes", event.notes || "No notes"],
    ["Consent to future communications", marketingConsent ? "YES" : "NO"],
    ["One-way distance", `${route.distanceKmOneWay} km`],
    ["Estimated one-way travel time", `${route.durationMinutes} minutes`],
    ["Automatic estimate", quote.automaticQuoteAvailable ? "YES" : "NO"],
    ["Musicians", quote.musicians ?? "N/A"],
    ["High-demand period", quote.highDemand ? "YES" : "NO"],
    [
      "Calculated total",
      quote.automaticQuoteAvailable ? formatEuro(quote.total) : "NOT ISSUED",
    ],
    [
      "Amount communicated to the customer",
      quote.automaticQuoteAvailable
        ? formatEuro(quote.commercialTotal)
        : "NOT ISSUED",
    ],
    ["Reason / engine message", quote.message || "No automatic restriction"],
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
      </tr>
    `,
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
<html lang="en">
  <body style="margin:0;padding:0;background:#050505;">
    <div style="max-width:760px;margin:0 auto;padding:28px 16px;font-family:Arial,sans-serif;">
      <div style="padding:28px;border:1px solid #2c2114;background:#0b0a08;">
        <div style="margin-bottom:8px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#c99a4a;">
          Booking ETB
        </div>

        <h1 style="margin:0 0 24px;color:#fff4df;font-size:28px;">
          New estimate enquiry
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
          Complete request JSON
        </div>

        <pre style="margin:0;padding:18px;overflow:auto;white-space:pre-wrap;word-break:break-word;background:#070604;border:1px solid #342819;color:#d8cfc1;font-family:Consolas,Monaco,monospace;font-size:12px;line-height:1.5;">${technicalJson}</pre>
      </div>
    </div>
  </body>
</html>`;
}
