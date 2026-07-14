/* =========================================================
   ETB ROUTE SERVICE — AUTOCOMPLETE PROTETTO
   La chiave OpenRouteService resta esclusivamente nel backend.
   ========================================================= */

let selectedEventPlace = null;

async function searchEventPlaces(query) {
  const url = new URL("/api/places", window.location.origin);
  url.searchParams.set("query", query);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(
      result?.error || "Errore durante la ricerca della località.",
    );
  }

  return result.places;
}
