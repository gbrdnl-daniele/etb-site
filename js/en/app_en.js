// App bootstrap.
// I moduli storyboard.js e background.js partono automaticamente.
// Questo file resta disponibile per future inizializzazioni globali.
document.body.classList.add("intro-mode");

const navHome = document.querySelector('a[href="#home"]');
const navProject = document.querySelector('a[href="#project"]');
const navBand = document.querySelector('a[href="#band"]');

const heroScene = document.getElementById("hero");
const projectScene = document.getElementById("projectScene");
const bandScene = document.getElementById("bandScene");

const navShowreel = document.querySelector('a[href="#showreel"]');
const showreelScene = document.getElementById("showreelScene");

const navDates = document.querySelector('a[href="#dates"]');
const datesScene = document.getElementById("datesScene");

const showreelPlay = document.getElementById("showreelPlay");
const showreelVideo = document.getElementById("showreelVideo");

const navContacts = document.querySelector('a[href="#contacts"]');
const contactsScene = document.getElementById("contactsScene");

const showreelExplore = document.getElementById("showreelExplore");
const showreelGalleryBack = document.getElementById("showreelGalleryBack");

const projectToBand = document.getElementById("projectToBand");
const projectToShowreel = document.getElementById("projectToShowreel");

showreelExplore?.addEventListener("click", () => {
  showreelScene.classList.add("is-gallery");
});

showreelGalleryBack?.addEventListener("click", () => {
  showreelScene.classList.remove("is-gallery");
});
let showreelIntroTimer;

function goToScene(sceneName) {
  if (showreelVideo) {
    showreelVideo.pause();
    showreelVideo.currentTime = 0;
  }

  showreelScene.classList.remove("is-playing");
  showreelScene.classList.remove("is-ready");

  showreelScene.classList.remove("is-gallery");
  showreelGallery?.setAttribute("aria-hidden", "true");

  heroScene.classList.add("scene-hidden");
  if (projectScene) {
    projectScene.classList.remove("is-active");
    projectScene.setAttribute("aria-hidden", "true");
  }

  projectScene.classList.remove("is-active");
  projectScene.setAttribute("aria-hidden", "true");

  bandScene.classList.remove("is-active");
  bandScene.setAttribute("aria-hidden", "true");

  showreelScene.classList.remove("is-active");
  showreelScene.setAttribute("aria-hidden", "true");

  datesScene.classList.remove("is-active");
  datesScene.setAttribute("aria-hidden", "true");

  if (sceneName === "home") {
    heroScene.classList.remove("scene-hidden");
  }

  if (sceneName === "project" && projectScene) {
    projectScene.classList.add("is-active");
    projectScene.setAttribute("aria-hidden", "false");
  }

  if (sceneName === "project") {
    projectScene.classList.add("is-active");
    projectScene.setAttribute("aria-hidden", "false");
  }

  if (sceneName === "band") {
    bandScene.classList.add("is-active");
    bandScene.setAttribute("aria-hidden", "false");
  }

  if (sceneName === "showreel") {
    showreelScene.classList.add("is-active");
    showreelScene.setAttribute("aria-hidden", "false");

    showreelScene.classList.remove("is-ready");
    showreelScene.classList.remove("is-playing");

    showreelVideo.pause();
    showreelVideo.currentTime = 0;

    clearTimeout(showreelIntroTimer);

    showreelIntroTimer = setTimeout(() => {
      showreelScene.classList.add("is-ready");
    }, 2200);
  }

  if (datesScene) {
    datesScene.classList.remove("is-active");
    datesScene.setAttribute("aria-hidden", "true");
  }

  if (sceneName === "dates") {
    datesScene.classList.add("is-active");
    datesScene.setAttribute("aria-hidden", "false");

    datesArchiveVisible = false;
    renderDates(false);

    if (datesHeading) {
      datesHeading.textContent = "UPCOMING SHOWS";
    }

    if (datesArchiveToggle) {
      datesArchiveToggle.textContent = "LIVE ARCHIVE →";
    }
  }
  if (contactsScene) {
    contactsScene.classList.remove("is-active");
    contactsScene.setAttribute("aria-hidden", "true");
  }

  if (sceneName === "contacts") {
    contactsScene.classList.add("is-active");
    contactsScene.setAttribute("aria-hidden", "false");
  }
}

navDates?.addEventListener("click", (e) => {
  e.preventDefault();
  goToScene("dates");
});

navShowreel?.addEventListener("click", (e) => {
  e.preventDefault();
  goToScene("showreel");
});

navProject?.addEventListener("click", (e) => {
  e.preventDefault();
  goToScene("project");
});

navBand?.addEventListener("click", (e) => {
  e.preventDefault();
  goToScene("band");
});

navHome?.addEventListener("click", (e) => {
  e.preventDefault();
  goToScene("home");
});

showreelPlay?.addEventListener("click", () => {
  showreelScene.classList.remove("is-ready");
  showreelScene.classList.add("is-playing");

  showreelVideo.currentTime = 0;
  showreelVideo.play();
});

navContacts?.addEventListener("click", (e) => {
  e.preventDefault();
  goToScene("contacts");
});

projectToBand?.addEventListener("click", () => {
  goToScene("band");
});

projectToShowreel?.addEventListener("click", () => {
  goToScene("showreel");
});

const members = {
  fabio: {
    image: "/assets/images/fabio-vox.png",
    alt: "Fabio Di Baldo",
    role: "LEAD VOCALS · “FABIO EROS”",
    name: "FABIO DI BALDO",
    quote:
      "Also known as Fabio Eros. A lifetime inspired by the music of Eros Ramazzotti.<br />A passion that became a dream: bringing his music and emotions to the stage.",
  },

  danila: {
    image: "/assets/images/danila-vox.png",
    alt: "Danila Sansoni",
    role: "VOCALS · DUETS · BACKING VOCALS",
    name: "DANILA SANSONI",
    quote:
      "A natural passion for singing, nurtured since childhood.<br />The voice behind the backing vocals and Eros Ramazzotti’s most iconic duets.",
  },

  nico: {
    image: "/assets/images/nico-guitar.png",
    alt: "Nico Sansoni",
    role: "ELECTRIC GUITAR",
    name: "NICO SANSONI",
    quote:
      "Technique, precision and a distinctive lead-guitar personality.<br />Electric guitar at the service of the ETB sound.",
  },

  daniele: {
    image: "/assets/images/daniele-guitar.png",
    alt: "Daniele Gabriele",
    role: "ELECTRIC & ACOUSTIC GUITAR · PROGRAMMING",
    name: "DANIELE GABRIELE",
    quote:
      "Harmonic textures, melody and a constant search for the right sound.<br />Programming and technical coordination at the service of the band.",
  },

  "stefano-nardi": {
    image: "/assets/images/stefano-key.png",
    alt: "Stefano Nardi",
    role: "PIANO · KEYBOARDS · BACKING VOCALS",
    name: "STEFANO NARDI",
    quote:
      "The atmosphere and magic behind every live performance.<br />The harmonic colour that surrounds the band’s sound.",
  },

  "stefano-campaioli": {
    image: "/assets/images/stefano-drum.png",
    alt: "Stefano Campaioli",
    role: "DRUMS",
    name: "STEFANO CAMPAIOLI",
    quote:
      "Our driving force.<br />The beating heart behind the energy of every performance.",
  },

  giammarco: {
    image: "/assets/images/giammarco-bass.png",
    alt: "Giammarco Turchini",
    role: "BASS · BACKING VOCALS",
    name: "GIAMMARCO TURCHINI",
    quote:
      "The foundation of our groove.<br />Dynamics and pulse at the service of the band.",
  },

  nicola: {
    image: "/assets/images/nick-sax.png",
    alt: "Nicola Di Giorgio",
    role: "SAXOPHONE",
    name: "NICOLA DI GIORGIO",
    quote:
      "The Maestro. Personality and character in every note.<br />Just as Eros intended.",
  },
};

const memberScene = document.getElementById("memberScene");
const memberBack = document.getElementById("memberBack");
const memberImage = document.getElementById("memberImage");
const memberRole = document.getElementById("memberRole");
const memberName = document.getElementById("memberName");
const memberQuote = document.getElementById("memberQuote");

function openMember(memberKey) {
  const member = members[memberKey];

  if (!member) {
    return;
  }

  memberImage.src = member.image;
  memberImage.alt = member.alt;
  memberImage.className = "member-image";
  memberImage.classList.add(`member-image-${memberKey}`);

  memberRole.innerHTML = member.role;
  memberName.innerHTML = member.name;
  memberQuote.innerHTML = member.quote;

  bandScene.classList.remove("is-active");
  bandScene.setAttribute("aria-hidden", "true");

  memberScene.classList.add("is-active");
  memberScene.setAttribute("aria-hidden", "false");
}

document.querySelectorAll(".member-hotspot").forEach((hotspot) => {
  hotspot.addEventListener("click", () => {
    openMember(hotspot.dataset.member);
  });
});

memberBack.addEventListener("click", () => {
  memberScene.classList.remove("is-active");
  memberScene.setAttribute("aria-hidden", "true");

  bandScene.classList.add("is-active");
  bandScene.setAttribute("aria-hidden", "false");
});

showreelVideo?.addEventListener("ended", () => {
  showreelScene.classList.remove("is-playing");
  showreelScene.classList.add("is-ready");
});

document.querySelectorAll("#topnav a").forEach((link) => {
  link.addEventListener("click", () => {
    const memberScene = document.getElementById("memberScene");

    if (memberScene) {
      memberScene.classList.remove("is-active");
      memberScene.setAttribute("aria-hidden", "true");
    }
  });
});

/* =========================================================
   DATES
   ========================================================= */

const datesList = document.getElementById("datesList");
const datesArchiveToggle = document.getElementById("datesArchiveToggle");
const datesHeading = document.querySelector(".dates-heading");

const eventDateInput = document.getElementById("eventDate");

if (eventDateInput) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  eventDateInput.min = `${year}-${month}-${day}`;
}

let datesArchiveVisible = false;

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function getLocalToday() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseEtbDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function renderDates(showArchive = false) {
  if (!datesList) return;

  const today = getLocalToday();

  const filteredDates = ETB_DATES.filter((item) => {
    const eventDate = parseEtbDate(item.date);

    return showArchive ? eventDate < today : eventDate >= today;
  }).sort((a, b) => {
    const dateA = parseEtbDate(a.date);
    const dateB = parseEtbDate(b.date);

    return showArchive ? dateB - dateA : dateA - dateB;
  });

  datesList.innerHTML = "";

  if (filteredDates.length === 0) {
    datesList.innerHTML = `
      <div class="dates-year">
        ${showArchive ? "NO PAST SHOWS AVAILABLE" : "NEW LIVE DATES COMING SOON"}
      </div>
    `;

    return;
  }

  const groupedDates = {};

  filteredDates.forEach((item) => {
    const eventDate = parseEtbDate(item.date);
    const year = eventDate.getFullYear();

    if (!groupedDates[year]) {
      groupedDates[year] = [];
    }

    groupedDates[year].push(item);
  });

  Object.entries(groupedDates).forEach(([year, dates]) => {
    const yearElement = document.createElement("div");

    yearElement.className = "dates-year";
    yearElement.textContent = `LIVE ${year}`;

    datesList.appendChild(yearElement);

    dates.forEach((item) => {
      const eventDate = parseEtbDate(item.date);

      const row = document.createElement("div");
      row.className = "date-row";

      row.innerHTML = `
          <div>
            <div class="date-day">
              ${String(eventDate.getDate()).padStart(2, "0")}
            </div>

            <span class="date-month">
              ${MONTHS[eventDate.getMonth()]}
            </span>
          </div>

          <div>
            <div class="date-city">
              ${item.city} (${item.province})
            </div>

            <div class="date-event">
              ${item.event}
            </div>

            ${
              item.location
                ? `
                  <div class="date-location">
                    ${item.location}
                  </div>
                `
                : ""
            }
          </div>

          <div class="date-time">
            ${item.time}
          </div>
        `;

      datesList.appendChild(row);
    });
  });
}

if (datesArchiveToggle) {
  datesArchiveToggle.addEventListener("click", () => {
    datesArchiveVisible = !datesArchiveVisible;

    renderDates(datesArchiveVisible);

    if (datesHeading) {
      datesHeading.textContent = datesArchiveVisible
        ? "LIVE ARCHIVE"
        : "UPCOMING SHOWS";
    }

    datesArchiveToggle.textContent = datesArchiveVisible
      ? "← UPCOMING SHOWS"
      : "LIVE ARCHIVE →";
  });
}

renderDates();
const eventLocationInput = document.getElementById("eventLocation");
const locationSuggestions = document.getElementById("locationSuggestions");
const internationalEventInput = document.getElementById("internationalEvent");

let locationSearchTimer;

function updateInternationalEventState() {
  if (!eventLocationInput) return;

  const isInternational = internationalEventInput?.checked === true;

  selectedEventPlace = null;

  if (locationSuggestions) {
    locationSuggestions.classList.remove("is-visible");
    locationSuggestions.innerHTML = "";
  }

  clearTimeout(locationSearchTimer);

  eventLocationInput.placeholder = isInternational
    ? "E.g. Paris, France"
    : "E.g. Rome, Italy";
}

internationalEventInput?.addEventListener(
  "change",
  updateInternationalEventState,
);

updateInternationalEventState();

eventLocationInput?.addEventListener("input", () => {
  selectedEventPlace = null;

  const query = eventLocationInput.value.trim();
  const isInternational = internationalEventInput?.checked === true;

  if (isInternational) {
    clearTimeout(locationSearchTimer);

    locationSuggestions?.classList.remove("is-visible");

    if (locationSuggestions) {
      locationSuggestions.innerHTML = "";
    }

    return;
  }

  if (query.length < 3) {
    locationSuggestions.classList.remove("is-visible");
    locationSuggestions.innerHTML = "";
    return;
  }

  clearTimeout(locationSearchTimer);

  locationSearchTimer = setTimeout(async () => {
    try {
      const places = await searchEventPlaces(query);

      locationSuggestions.innerHTML = "";

      places.forEach((place) => {
        const item = document.createElement("div");
        item.className = "location-suggestion";
        item.textContent = place.label;

        item.addEventListener("click", () => {
          selectedEventPlace = place;
          eventLocationInput.value = place.label;
          locationSuggestions.classList.remove("is-visible");
          locationSuggestions.innerHTML = "";
        });

        locationSuggestions.appendChild(item);
      });

      locationSuggestions.classList.toggle("is-visible", places.length > 0);
    } catch (error) {
      locationSuggestions.innerHTML = `
        <div class="location-suggestion">
          Location could not be verified. Please try again.
        </div>
      `;
      locationSuggestions.classList.add("is-visible");
    }
  }, 400);
});

/* =========================================================
   CONTACT METHOD
   ========================================================= */

const contactMethodSelect = document.getElementById("contactMethod");

const contactValueInput = document.getElementById("contactValue");

const contactValueLabel = document.getElementById("contactValueLabel");

contactMethodSelect?.addEventListener("change", () => {
  const method = contactMethodSelect.value;

  contactValueInput.value = "";
  contactValueInput.disabled = !method;

  if (method === "email") {
    contactValueLabel.textContent = "Email address";

    contactValueInput.type = "email";
    contactValueInput.placeholder = "name@example.com";
  } else if (method === "whatsapp") {
    contactValueLabel.textContent = "WhatsApp number";

    contactValueInput.type = "tel";
    contactValueInput.placeholder = "+44 7123 456789";
  } else {
    contactValueLabel.textContent = "Contact details";

    contactValueInput.type = "text";
    contactValueInput.placeholder = "Select a contact method first";
  }
});

/* =========================================================
   QUOTE FORM
   ========================================================= */

const quoteForm = document.getElementById("quoteForm");
const quoteResult = document.getElementById("quoteResult");

/*====================================================
  PREVIEW EMAIL
  ==================================================== */
function buildCustomerEmailPreview(payload) {
  const { event, quote, contacts } = payload;

  if (quote.automaticQuoteAvailable) {
    return `
    ETB — EROS RAMAZZOTTI TRIBUTE BAND

    Thank you, ${event.clientName}, for contacting us.

    We have reviewed your enquiry for an ETB live performance.

    EVENT DETAILS

    Date: ${event.eventDate}
    Location: ${event.eventLocation}
    Line-up: ${quote.musicians} musicians

    ESTIMATED FEE

    ${formatEuro(quote.commercialTotal)}

    This amount is an initial automated estimate and does not constitute
    final confirmation of availability or booking.

    For any further information, you can contact us at:

    ${contacts.phone1}
    ${contacts.phone2}

    Both numbers are also available on WhatsApp.

    ETB
    Eros Ramazzotti Tribute Band
        `.trim();
  }

  return `
    ETB — EROS RAMAZZOTTI TRIBUTE BAND

    Thank you, ${event.clientName}, for contacting us.

    We have received your enquiry for an ETB live performance.

    EVENT DETAILS

    Date: ${event.eventDate}
    Location: ${event.eventLocation}

    We were unable to generate an automatic fee estimate.

    Reason:
    ${quote.message}

    Your enquiry has still been received by the ETB booking team.
    We will contact you with a personalised assessment.

    For any further information, you can contact us at:

    ${contacts.phone1}
    ${contacts.phone2}

    Both numbers are also available on WhatsApp.

    ETB
    Eros Ramazzotti Tribute Band
      `.trim();
}

function buildEtbEmailPreview(payload) {
  const { customerEmail, event, route, quote } = payload;

  return `
NUOVA RICHIESTA PREVENTIVO ETB

CLIENTE

Nome: ${event.clientName}
Email: ${customerEmail}

EVENTO

Data: ${event.eventDate}
Località: ${event.eventLocation}
Tipo location: ${event.locationType}
Formazione richiesta: ${event.lineup}
Service: ${event.serviceOption}
Note: ${event.notes || "Nessuna nota"}

CALCOLO TRASFERTA

Distanza da Roma: ${route.distanceKmOneWay} km
Pedaggio stimato sola andata: ${formatEuro(route.tollOneWay)}

ESITO MOTORE PREVENTIVO

Preventivo automatico: ${quote.automaticQuoteAvailable ? "SI" : "NO"}

Musicisti: ${quote.musicians ?? "N/D"}
Alta richiesta: ${quote.highDemand ? "SI" : "NO"}

Totale matematico calcolato: ${
    quote.automaticQuoteAvailable ? formatEuro(quote.total) : "NON EMESSO"
  }

Arrotondamento commerciale: per eccesso a multipli di € 50

Importo comunicato al cliente: ${
    quote.automaticQuoteAvailable
      ? formatEuro(quote.commercialTotal)
      : "NON EMESSO"
  }

Motivo / messaggio motore:
${quote.message || "Nessun blocco automatico"}

DATI TECNICI COMPLETI

${JSON.stringify(quote, null, 2)}
  `.trim();
}

/*====================================================
  FINE PREVIEW EMAIL
  ==================================================== */
quoteForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  quoteResult.className = "quote-inline-result";

  try {
    const eventDate = document.getElementById("eventDate").value;
    const selectedDate = new Date(`${eventDate}T00:00:00`);

    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (selectedDate < tomorrow) {
      quoteResult.classList.add("is-error");
      quoteResult.textContent = "The event date must be later than today.";
      return;
    }

    const locationType = document.getElementById("locationType").value;
    const serviceOption = document.getElementById("serviceOption").value;
    const lineup = document.getElementById("lineup").value;
    const eventNotes = document.getElementById("eventNotes").value.trim();

    const customerEmail = document.getElementById("customerEmail").value.trim();
    const customerEmailConfirm = document
      .getElementById("customerEmailConfirm")
      .value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(customerEmail)) {
      quoteResult.classList.add("is-error");
      quoteResult.textContent = "Please enter a valid email address.";
      return;
    }

    if (customerEmail !== customerEmailConfirm) {
      quoteResult.classList.add("is-error");
      quoteResult.textContent = "The email addresses do not match.";
      return;
    }

    quoteResult.textContent = "Processing your enquiry...";

    const customerPhone = document.getElementById("customerPhone").value.trim();

    const normalizedPhone = customerPhone.replace(/[^\d+]/g, "");

    const phoneDigits = normalizedPhone.replace(/\D/g, "");

    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      quoteResult.classList.add("is-error");
      quoteResult.textContent =
        "Please enter a valid telephone number, including the country code.";
      return;
    }

    const payload = {
      language: "en",
      customerEmail,
      customerPhone: normalizedPhone,

      marketingConsent:
        document.getElementById("marketingConsent")?.checked === true,

      // Campo honeypot invisibile: deve restare vuoto.
      website: document.getElementById("website")?.value || "",

      event: {
        clientName: document.getElementById("clientName").value.trim(),
        eventDate,
        eventLocation: document.getElementById("eventLocation").value.trim(),

        internationalEvent:
          document.getElementById("internationalEvent")?.checked === true,

        locationType,
        serviceOption,
        lineup,
        notes: eventNotes,
      },
    };

    await sendEtbQuoteEmails(payload);

    quoteResult.classList.add("is-success");
    quoteResult.textContent =
      "Your enquiry has been sent successfully. Please check the email address provided.";
  } catch (error) {
    quoteResult.classList.add("is-error");
    quoteResult.textContent = `An error occurred: "${error.message}"`;

    console.error("Errore preventivo ETB:", error);
  }
});

const privacyPolicyModal = document.getElementById("privacyPolicyModal");
const privacyPolicyLink = document.getElementById("privacyPolicyLink");

const privacyPolicyCloseElements = document.querySelectorAll(
  "[data-privacy-close]",
);

function openPrivacyPolicy() {
  if (!privacyPolicyModal) return;

  privacyPolicyModal.classList.add("is-open");
  privacyPolicyModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("privacy-modal-open");

  const closeButton = document.getElementById("privacyPolicyClose");

  if (closeButton) {
    closeButton.focus();
  }
}

function closePrivacyPolicy() {
  if (!privacyPolicyModal) return;

  privacyPolicyModal.classList.remove("is-open");
  privacyPolicyModal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("privacy-modal-open");
}

if (privacyPolicyLink) {
  privacyPolicyLink.addEventListener("click", (event) => {
    event.preventDefault();
    openPrivacyPolicy();
  });
}

privacyPolicyCloseElements.forEach((element) => {
  element.addEventListener("click", closePrivacyPolicy);
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    privacyPolicyModal?.classList.contains("is-open")
  ) {
    closePrivacyPolicy();
  }
});

const lineupHelpTrigger = document.getElementById("lineupHelpTrigger");
const lineupHelpTooltip = document.getElementById("lineupHelpTooltip");

function openLineupHelp() {
  if (!lineupHelpTrigger || !lineupHelpTooltip) return;

  lineupHelpTooltip.classList.add("is-open");
  lineupHelpTooltip.setAttribute("aria-hidden", "false");
  lineupHelpTrigger.setAttribute("aria-expanded", "true");
}

function closeLineupHelp() {
  if (!lineupHelpTrigger || !lineupHelpTooltip) return;

  lineupHelpTooltip.classList.remove("is-open");
  lineupHelpTooltip.setAttribute("aria-hidden", "true");
  lineupHelpTrigger.setAttribute("aria-expanded", "false");
}

if (lineupHelpTrigger && lineupHelpTooltip) {
  lineupHelpTrigger.addEventListener("mouseenter", openLineupHelp);
  lineupHelpTrigger.addEventListener("focus", openLineupHelp);

  lineupHelpTrigger.addEventListener("click", (event) => {
    event.preventDefault();

    const isOpen = lineupHelpTooltip.classList.contains("is-open");

    if (isOpen) {
      closeLineupHelp();
    } else {
      openLineupHelp();
    }
  });

  lineupHelpTooltip.addEventListener("mouseenter", openLineupHelp);

  lineupHelpTrigger.addEventListener("mouseleave", () => {
    window.setTimeout(() => {
      if (!lineupHelpTooltip.matches(":hover")) {
        closeLineupHelp();
      }
    }, 120);
  });

  lineupHelpTooltip.addEventListener("mouseleave", closeLineupHelp);

  document.addEventListener("click", (event) => {
    if (
      !lineupHelpTrigger.contains(event.target) &&
      !lineupHelpTooltip.contains(event.target)
    ) {
      closeLineupHelp();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLineupHelp();
    }
  });
}
