import { calculateEtbQuote } from "../_lib/quote-engine.js";
import { geocodePlace, calculateRoute } from "../_lib/openrouteservice.js";

import {
  buildCustomerEmailHtml as buildCustomerEmailHtmlIt,
  buildBookingEmailHtml as buildBookingEmailHtmlIt,
} from "../_lib/email-templates.js";

import { buildCustomerEmailHtml as buildCustomerEmailHtmlEn } from "../_lib/email-templates-en.js";

import { sendEmail } from "../_lib/resend.js";

const EMAIL_CONFIG = {
  from: "ETB Booking <booking@mail.etberostribute.it>",
  replyTo: "booking@etberostribute.it",
  bookingTo: "booking@etberostribute.it",

  customerSubjectIt: "La tua richiesta per ETB — Eros Ramazzotti Tribute Band",

  customerSubjectEn: "Your enquiry for ETB — Eros Ramazzotti Tribute Band",

  bookingSubject: "Nuova richiesta preventivo ETB",
};

const ALLOWED_LOCATION_TYPES = new Set(["A", "B", "C", "D"]);
const ALLOWED_SERVICE_OPTIONS = new Set(["available", "required"]);
const ALLOWED_LINEUPS = new Set(["full", "reduced"]);

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function cleanString(value, maxLength) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

function normalizePhone(value) {
  return cleanString(value, 30).replace(/[^\d+]/g, "");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isFutureDate(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split("-").map(Number);
  const selected = new Date(year, month - 1, day);

  if (
    selected.getFullYear() !== year ||
    selected.getMonth() !== month - 1 ||
    selected.getDate() !== day
  ) {
    return false;
  }

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return selected >= tomorrow;
}

function validateAndNormalizePayload(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Payload mancante o non valido.");
  }

  // Honeypot: un utente reale non compila questo campo invisibile.
  if (cleanString(raw.website, 200)) {
    return { bot: true };
  }

  const customerEmail = cleanString(raw.customerEmail, 254).toLowerCase();
  const customerPhone = normalizePhone(raw.customerPhone);
  const phoneDigits = customerPhone.replace(/\D/g, "");

  const event = {
    clientName: cleanString(raw.event?.clientName, 120),
    eventDate: cleanString(raw.event?.eventDate, 10),
    eventLocation: cleanString(raw.event?.eventLocation, 180),
    internationalEvent: raw.event?.internationalEvent === true,
    locationType: cleanString(raw.event?.locationType, 1),
    serviceOption: cleanString(raw.event?.serviceOption, 20),
    lineup: cleanString(raw.event?.lineup, 20),
    notes: cleanString(raw.event?.notes, 1500),
  };

  if (!isValidEmail(customerEmail)) {
    throw new Error("Email cliente non valida.");
  }

  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    throw new Error("Numero di telefono non valido.");
  }

  if (event.clientName.length < 2) {
    throw new Error("Nome cliente mancante o non valido.");
  }

  if (!isFutureDate(event.eventDate)) {
    throw new Error("Data evento non valida.");
  }

  if (event.eventLocation.length < 3) {
    throw new Error("Località evento mancante o non valida.");
  }

  if (!ALLOWED_LOCATION_TYPES.has(event.locationType)) {
    throw new Error("Tipo di location non valido.");
  }

  if (!ALLOWED_SERVICE_OPTIONS.has(event.serviceOption)) {
    throw new Error("Opzione service non valida.");
  }

  if (!ALLOWED_LINEUPS.has(event.lineup)) {
    throw new Error("Formazione richiesta non valida.");
  }

  return {
    bot: false,
    customerEmail,
    customerPhone,
    marketingConsent: raw.marketingConsent === true,
    event,
  };
}

export async function onRequestPost(context) {
  const contentLength = Number(
    context.request.headers.get("content-length") || "0",
  );

  if (contentLength > 20_000) {
    return jsonResponse(
      { success: false, error: "Richiesta troppo grande." },
      413,
    );
  }

  if (!context.env.RESEND_API_KEY || !context.env.ORS_API_KEY) {
    return jsonResponse(
      { success: false, error: "Configurazione server incompleta." },
      500,
    );
  }
  try {
    const rawPayload = await context.request.json();

    const language =
      String(rawPayload?.language || "").toLowerCase() === "en" ? "en" : "it";

    const payload = validateAndNormalizePayload(rawPayload);

    // Risposta neutra ai bot per non rivelare il filtro.
    if (payload.bot) {
      return jsonResponse({ success: true });
    }

    let route = null;
    let quote;

    if (payload.event.internationalEvent) {
      quote = calculateEtbQuote({
        eventDate: payload.event.eventDate,
        distanceKmOneWay: Number.POSITIVE_INFINITY,
        lineup: payload.event.lineup,
        serviceOption: payload.event.serviceOption,
        locationType: payload.event.locationType,
      });
    } else {
      const destination = await geocodePlace(
        context.env.ORS_API_KEY,
        payload.event.eventLocation,
      );

      route = await calculateRoute(context.env.ORS_API_KEY, destination);

      quote = calculateEtbQuote({
        eventDate: payload.event.eventDate,
        distanceKmOneWay: route.distanceKmOneWay,
        lineup: payload.event.lineup,
        serviceOption: payload.event.serviceOption,
        locationType: payload.event.locationType,
      });
    }

    const requestId = crypto.randomUUID();
    const receivedAt = new Date().toISOString();

    const completeRequest = {
      ...payload,
      route,
      quote,
      requestId,
      receivedAt,
    };

    const buildCustomerEmailHtml =
      language === "en" ? buildCustomerEmailHtmlEn : buildCustomerEmailHtmlIt;

    const customerSubject =
      language === "en"
        ? EMAIL_CONFIG.customerSubjectEn
        : EMAIL_CONFIG.customerSubjectIt;

    const customerHtml = buildCustomerEmailHtml(completeRequest);

    const bookingHtml = buildBookingEmailHtmlIt(completeRequest);

    // L'invio è considerato riuscito solo se entrambe le email partono.
    const [customerResult, bookingResult] = await Promise.all([
      sendEmail(context.env.RESEND_API_KEY, {
        from: EMAIL_CONFIG.from,
        to: [payload.customerEmail],
        reply_to: EMAIL_CONFIG.replyTo,
        subject: customerSubject,
        html: customerHtml,
      }),

      sendEmail(context.env.RESEND_API_KEY, {
        from: EMAIL_CONFIG.from,
        to: [EMAIL_CONFIG.bookingTo],
        reply_to: payload.customerEmail,
        subject: `${EMAIL_CONFIG.bookingSubject} — ${payload.event.clientName}`,
        html: bookingHtml,
      }),
    ]);

    return jsonResponse({
      success: true,
      requestId,
      customerEmailId: customerResult.id,
      bookingEmailId: bookingResult.id,
    });
  } catch (error) {
    console.error("ETB send-quote error:", error);

    const clientErrors = new Set([
      "Payload mancante o non valido.",
      "Email cliente non valida.",
      "Numero di telefono non valido.",
      "Nome cliente mancante o non valido.",
      "Data evento non valida.",
      "Località evento mancante o non valida.",
      "Tipo di location non valido.",
      "Opzione service non valida.",
      "Formazione richiesta non valida.",
    ]);

    if (clientErrors.has(error.message)) {
      return jsonResponse({ success: false, error: error.message }, 400);
    }

    return jsonResponse(
      {
        success: false,
        error: "Non è stato possibile inviare la richiesta. Riprova più tardi.",
      },
      500,
    );
  }
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return jsonResponse(
      { success: false, error: "Metodo non consentito." },
      405,
    );
  }

  return onRequestPost(context);
}
