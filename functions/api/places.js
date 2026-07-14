import { searchPlaces } from "../_lib/openrouteservice.js";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequestGet(context) {
  try {
    if (!context.env.ORS_API_KEY) {
      return jsonResponse(
        { success: false, error: "Configurazione mappe mancante." },
        500,
      );
    }

    const url = new URL(context.request.url);
    const query = (url.searchParams.get("query") || "").trim();

    if (query.length < 3 || query.length > 120) {
      return jsonResponse({ success: true, places: [] });
    }

    const places = await searchPlaces(context.env.ORS_API_KEY, query);

    return jsonResponse({ success: true, places });
  } catch (error) {
    console.error("ETB places error:", error);

    return jsonResponse(
      {
        success: false,
        error: "Non è stato possibile cercare la località.",
      },
      502,
    );
  }
}

export async function onRequest(context) {
  if (context.request.method !== "GET") {
    return jsonResponse(
      { success: false, error: "Metodo non consentito." },
      405,
    );
  }

  return onRequestGet(context);
}
