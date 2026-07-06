/* =========================================================
   ETB QUOTE ENGINE
   Preventivo indicativo automatico
   ========================================================= */

const ETB_QUOTE_CONFIG = {
  originCity: "Roma",

  maxAutomaticDistanceKm: 250,

  freeTravelUntilKm: 29,

  vanDailyCost: 100,

  fuelPricePerLiter: 1.85,

  carKmPerLiter: 14,
  vanKmPerLiter: 10,

  highDemandMultiplier: 1.5,
  
  estimatedTollPerKmOneWay: 0.09,

  musicians: {
    full: 8,
    reduced: 7,
  },

  feeBands: [
    {
      minKm: 0,
      maxKm: 49,
      feePerMusician: 100,
    },
    {
      minKm: 50,
      maxKm: 120,
      feePerMusician: 120,
    },
    {
      minKm: 121,
      maxKm: 250,
      feePerMusician: 150,
    },
  ],
};

function isHighDemandDate(eventDateString) {
  const [, month, day] = eventDateString.split("-").map(Number);

  return month === 8 && day >= 10 && day <= 20;
}

function getFeePerMusician(distanceKm) {
  const band = ETB_QUOTE_CONFIG.feeBands.find((item) => {
    return distanceKm >= item.minKm && distanceKm <= item.maxKm;
  });

  return band ? band.feePerMusician : null;
}

function calculateFuelCost(distanceKmRoundTrip, kmPerLiter) {
  const liters = distanceKmRoundTrip / kmPerLiter;

  return liters * ETB_QUOTE_CONFIG.fuelPricePerLiter;
}

function calculateEtbQuote({
  eventDate,
  distanceKmOneWay,
  tollOneWay = 0,
  lineup = "full",
  serviceOption = "available",
  locationType = null,
}) {
  if (locationType !== "A" || serviceOption !== "available") {
    return {
      automaticQuoteAvailable: false,
      reason: "MANUAL_REVIEW_REQUIRED",
      message:
        "La tipologia di evento indicata richiede una verifica tecnica e organizzativa. Il booking ETB ti ricontatterà con una proposta personalizzata.",
    };
  }

  const musicians =
    lineup === "reduced"
      ? ETB_QUOTE_CONFIG.musicians.reduced
      : ETB_QUOTE_CONFIG.musicians.full;

  if (distanceKmOneWay > ETB_QUOTE_CONFIG.maxAutomaticDistanceKm) {
    return {
      automaticQuoteAvailable: false,
      reason: "DISTANCE_OVER_LIMIT",
      message:
        "La località indicata supera il raggio previsto per la stima automatica. È necessaria una valutazione dedicata del booking ETB.",
    };
  }

  const highDemand = isHighDemandDate(eventDate);

  let feePerMusician = getFeePerMusician(distanceKmOneWay);

  if (feePerMusician === null) {
    return {
      automaticQuoteAvailable: false,
      reason: "NO_FEE_BAND",
    };
  }

  if (highDemand) {
    feePerMusician *= ETB_QUOTE_CONFIG.highDemandMultiplier;
  }

  const artisticFee = feePerMusician * musicians;

  const roundTripKm = distanceKmOneWay * 2;
  const roundTripToll = tollOneWay * 2;

  let travelCost = 0;
  let selectedTravelMode = "TRASFERTA GRATUITA";

  if (distanceKmOneWay > ETB_QUOTE_CONFIG.freeTravelUntilKm) {
    const separateCarsCost =
      musicians *
        calculateFuelCost(roundTripKm, ETB_QUOTE_CONFIG.carKmPerLiter) +
      musicians * roundTripToll;

    const vanPlusCarCost =
      ETB_QUOTE_CONFIG.vanDailyCost +
      calculateFuelCost(roundTripKm, ETB_QUOTE_CONFIG.vanKmPerLiter) +
      calculateFuelCost(roundTripKm, ETB_QUOTE_CONFIG.carKmPerLiter) +
      2 * roundTripToll;

    if (vanPlusCarCost < separateCarsCost) {
      travelCost = vanPlusCarCost;
      selectedTravelMode = "FURGONE + 1 AUTO";
    } else {
      travelCost = separateCarsCost;
      selectedTravelMode = "AUTO SEPARATE";
    }
  }

  const total = artisticFee + travelCost;

  return {
    automaticQuoteAvailable: true,

    lineup,
    musicians,

    distanceKmOneWay,
    roundTripKm,
    tollOneWay,
    roundTripToll,

    highDemand,
    requiresBookingConfirmation: highDemand,

    feePerMusician,
    artisticFee,

    travelCost,
    selectedTravelMode,

    total,
  };
}

function formatEuro(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
