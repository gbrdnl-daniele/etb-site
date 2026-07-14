/* =========================================================
   ETB EMAIL MANAGER — PRODUZIONE
   Il backend genera e invia le email.
   ========================================================= */

async function sendEtbQuoteEmails(payload) {
  if (!payload) {
    throw new Error("Payload email mancante.");
  }

  const response = await fetch(
    window.ETB_CONFIG.backend.sendQuoteEndpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(
      result?.error || "Invio email non riuscito.",
    );
  }

  return result;
}
