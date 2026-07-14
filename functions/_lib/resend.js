/* =========================================================
   ETB BACKEND — RESEND CLIENT
   ========================================================= */

const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendEmail(apiKey, email) {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("Resend error:", response.status, result);
    throw new Error(
      result?.message || `Resend ha restituito HTTP ${response.status}.`,
    );
  }

  return result;
}
