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

function buildQuoteTechnicalDetails({
  eventDate,
  distanceKmOneWay,
  tollOneWay,
  lineup,
  locationType,
  serviceOption,
  musicians = null,
  feePerMusician = null,
  artisticFee = null,
  travelCost = null,
  selectedTravelMode = null,
  highDemand = false,
  total = null,
  separateCarsCost = null,
  vanPlusCarCost = null,
}) {
  const roundTripKm = distanceKmOneWay * 2;
  const roundTripToll = tollOneWay * 2;

  return {
    originCity: ETB_QUOTE_CONFIG.originCity,
    eventDate,
    locationType,
    serviceOption,
    lineup,

    maxAutomaticDistanceKm: ETB_QUOTE_CONFIG.maxAutomaticDistanceKm,
    freeTravelUntilKm: ETB_QUOTE_CONFIG.freeTravelUntilKm,

    distanceKmOneWay,
    roundTripKm,

    tollOneWay,
    roundTripToll,
    estimatedTollPerKmOneWay: ETB_QUOTE_CONFIG.estimatedTollPerKmOneWay,

    fuelPricePerLiter: ETB_QUOTE_CONFIG.fuelPricePerLiter,
    carKmPerLiter: ETB_QUOTE_CONFIG.carKmPerLiter,
    vanKmPerLiter: ETB_QUOTE_CONFIG.vanKmPerLiter,
    vanDailyCost: ETB_QUOTE_CONFIG.vanDailyCost,

    highDemand,
    highDemandMultiplier: ETB_QUOTE_CONFIG.highDemandMultiplier,
    highDemandPeriod: "10–20 agosto",

    musicians,
    feePerMusician,
    artisticFee,

    selectedTravelMode,
    separateCarsCost,
    vanPlusCarCost,
    travelCost,

    total,

    feeBands: ETB_QUOTE_CONFIG.feeBands,
  };
}

// Arrotondamento alle 50 Euro superiori preventivo al cliente
function roundUpTo50(value) {
  return Math.ceil(value / 50) * 50;
}
//*********************************** */

function calculateEtbQuote({
  eventDate,
  distanceKmOneWay,
  tollOneWay = 0,
  lineup = "full",
  serviceOption = "available",
  locationType = null,
}) {
  const musicians =
    lineup === "reduced"
      ? ETB_QUOTE_CONFIG.musicians.reduced
      : ETB_QUOTE_CONFIG.musicians.full;

  const estimatedTollOneWay =
    distanceKmOneWay * ETB_QUOTE_CONFIG.estimatedTollPerKmOneWay;

  const roundTripKm = distanceKmOneWay * 2;
  const roundTripToll = estimatedTollOneWay * 2;
  const highDemand = isHighDemandDate(eventDate);

  const buildTechnicalDetails = (extra = {}) => ({
    originCity: ETB_QUOTE_CONFIG.originCity,

    eventDate,
    locationType,
    serviceOption,
    lineup,
    musicians,

    distanceKmOneWay,
    roundTripKm,

    tollOneWay: estimatedTollOneWay,
    roundTripToll,
    estimatedTollPerKmOneWay: ETB_QUOTE_CONFIG.estimatedTollPerKmOneWay,
    tollCalculationMethod:
      "Stima prudenziale applicata sempre: distanza sola andata × costo stimato €/km",

    maxAutomaticDistanceKm: ETB_QUOTE_CONFIG.maxAutomaticDistanceKm,
    freeTravelUntilKm: ETB_QUOTE_CONFIG.freeTravelUntilKm,

    fuelPricePerLiter: ETB_QUOTE_CONFIG.fuelPricePerLiter,
    carKmPerLiter: ETB_QUOTE_CONFIG.carKmPerLiter,
    vanKmPerLiter: ETB_QUOTE_CONFIG.vanKmPerLiter,
    vanDailyCost: ETB_QUOTE_CONFIG.vanDailyCost,

    highDemand,
    highDemandPeriod: "10–20 agosto",
    highDemandMultiplier: ETB_QUOTE_CONFIG.highDemandMultiplier,

    feeBands: ETB_QUOTE_CONFIG.feeBands,

    ...extra,
  });

  /* ===== EVENTO ESTERO ===== */

  if (!Number.isFinite(distanceKmOneWay)) {
    return {
      automaticQuoteAvailable: false,
      reason: "INTERNATIONAL_EVENT",
      message:
        "L'evento si svolge fuori Italia. Il booking ETB preparerà una proposta personalizzata.",
      technicalDetails: buildTechnicalDetails(),
    };
  }

  if (locationType !== "A" || serviceOption !== "available") {
    return {
      automaticQuoteAvailable: false,
      reason: "MANUAL_REVIEW_REQUIRED",
      message:
        "La tipologia di evento indicata richiede una verifica tecnica e organizzativa. Il booking ETB ti ricontatterà con una proposta personalizzata.",
      technicalDetails: buildTechnicalDetails(),
    };
  }

  if (distanceKmOneWay > ETB_QUOTE_CONFIG.maxAutomaticDistanceKm) {
    return {
      automaticQuoteAvailable: false,
      reason: "DISTANCE_OVER_LIMIT",
      message:
        "La località indicata supera il raggio previsto per la stima automatica. È necessaria una valutazione dedicata del booking ETB.",
      technicalDetails: buildTechnicalDetails(),
    };
  }

  let feePerMusician = getFeePerMusician(distanceKmOneWay);

  if (feePerMusician === null) {
    return {
      automaticQuoteAvailable: false,
      reason: "NO_FEE_BAND",
      message:
        "Non è stata trovata una fascia economica compatibile con la distanza indicata.",
      technicalDetails: buildTechnicalDetails(),
    };
  }

  const baseFeePerMusician = feePerMusician;

  if (highDemand) {
    feePerMusician *= ETB_QUOTE_CONFIG.highDemandMultiplier;
  }

  const artisticFee = feePerMusician * musicians;

  let travelCost = 0;
  let selectedTravelMode = "TRASFERTA GRATUITA";
  let separateCarsCost = 0;
  let vanPlusCarCost = 0;

  if (distanceKmOneWay > ETB_QUOTE_CONFIG.freeTravelUntilKm) {
    separateCarsCost =
      musicians *
        calculateFuelCost(roundTripKm, ETB_QUOTE_CONFIG.carKmPerLiter) +
      musicians * roundTripToll;

    vanPlusCarCost =
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

  const commercialTotal = roundUpTo50(total);

  return {
    automaticQuoteAvailable: true,

    lineup,
    musicians,

    distanceKmOneWay,
    roundTripKm,
    tollOneWay: estimatedTollOneWay,
    roundTripToll,

    highDemand,
    requiresBookingConfirmation: highDemand,

    baseFeePerMusician,
    feePerMusician,
    artisticFee,

    travelCost,
    selectedTravelMode,
    separateCarsCost,
    vanPlusCarCost,

    total,
    commercialTotal,

    technicalDetails: buildTechnicalDetails({
      baseFeePerMusician,
      feePerMusician,
      artisticFee,
      selectedTravelMode,
      separateCarsCost,
      vanPlusCarCost,
      travelCost,
      total,
      commercialTotal,
    }),
  };
}
function formatEuro(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
