/* =========================================================
   ETB BACKEND — OPENROUTESERVICE
   ORS_API_KEY deve essere salvata come Secret Cloudflare.
   ========================================================= */

const ORS_BASE_URL = "https://api.openrouteservice.org";

const ETB_ORIGIN = {
  label: "Roma, Italia",
  lon: 12.4964,
  lat: 41.9028,
};

async function readJsonOrThrow(response, genericMessage) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("OpenRouteService error:", response.status, data);
    throw new Error(data?.error?.message || genericMessage);
  }

  return data;
}

export async function searchPlaces(apiKey, query) {
  const url = new URL(`${ORS_BASE_URL}/geocode/autocomplete`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("text", query);
  url.searchParams.set("boundary.country", "IT");
  url.searchParams.set("size", "5");

  const response = await fetch(url.toString());
  const data = await readJsonOrThrow(
    response,
    "Errore durante la ricerca della località.",
  );

  return (data.features || []).map((feature) => ({
    label: feature.properties?.label || "",
    locality:
      feature.properties?.locality ||
      feature.properties?.county ||
      feature.properties?.region ||
      "",
  }));
}

export async function geocodePlace(apiKey, placeLabel) {
  const url = new URL(`${ORS_BASE_URL}/geocode/search`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("text", placeLabel);
  url.searchParams.set("boundary.country", "IT");
  url.searchParams.set("size", "1");

  const response = await fetch(url.toString());
  const data = await readJsonOrThrow(
    response,
    "Errore durante la verifica della località.",
  );

  const feature = data.features?.[0];

  if (!feature?.geometry?.coordinates) {
    throw new Error("La località indicata non è stata trovata.");
  }

  return {
    label: feature.properties?.label || placeLabel,
    lon: Number(feature.geometry.coordinates[0]),
    lat: Number(feature.geometry.coordinates[1]),
  };
}

export async function calculateRoute(apiKey, destination) {
  const response = await fetch(
    `${ORS_BASE_URL}/v2/directions/driving-car`,
    {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [
          [ETB_ORIGIN.lon, ETB_ORIGIN.lat],
          [destination.lon, destination.lat],
        ],
      }),
    },
  );

  const data = await readJsonOrThrow(
    response,
    "Errore durante il calcolo del percorso.",
  );

  const summary = data.routes?.[0]?.summary;

  if (!summary) {
    throw new Error("Il percorso per la località indicata non è disponibile.");
  }

  return {
    origin: ETB_ORIGIN.label,
    destination: destination.label,
    distanceKmOneWay: Math.ceil(summary.distance / 1000),
    durationMinutes: Math.ceil(summary.duration / 60),
    source: "openrouteservice",
  };
}
