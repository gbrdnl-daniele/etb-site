/* =========================================================
   ETB ROUTE SERVICE — OPENROUTESERVICE
   ========================================================= */

const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImU5M2RkZjJlMGRlZDQ0MDE5YzdhNzk1ZWNhNGUxNWM2IiwiaCI6Im11cm11cjY0In0=";

const ETB_ORIGIN = {
  label: "Roma, Italia",
  lon: 12.4964,
  lat: 41.9028,
};

let selectedEventPlace = null;

async function searchEventPlaces(query) {
  const url = new URL("https://api.openrouteservice.org/geocode/autocomplete");

  url.searchParams.set("api_key", ORS_API_KEY);
  url.searchParams.set("text", query);
  url.searchParams.set("boundary.country", "IT");
  url.searchParams.set("size", "5");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Errore autocomplete località");
  }

  const data = await response.json();

  return data.features.map((feature) => {
    return {
      label: feature.properties.label,
      locality:
        feature.properties.locality ||
        feature.properties.county ||
        feature.properties.region ||
        "",
      lon: feature.geometry.coordinates[0],
      lat: feature.geometry.coordinates[1],
    };
  });
}

async function getRouteEstimateFromCoordinates(lon, lat) {
  const response = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car",
    {
      method: "POST",
      headers: {
        Authorization: ORS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [
          [ETB_ORIGIN.lon, ETB_ORIGIN.lat],
          [lon, lat],
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Errore calcolo percorso");
  }

  const data = await response.json();
  const summary = data.routes[0].summary;

  return {
    distanceKmOneWay: Math.ceil(summary.distance / 1000),
    durationMinutes: Math.ceil(summary.duration / 60),
    tollOneWay: 0,
    source: "openrouteservice",
  };
}

async function getRouteEstimate() {
  if (!selectedEventPlace) {
    throw new Error("Seleziona una località valida tra i risultati proposti.");
  }

  return getRouteEstimateFromCoordinates(
    selectedEventPlace.lon,
    selectedEventPlace.lat
  );
}