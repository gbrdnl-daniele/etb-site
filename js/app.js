// App bootstrap.
// I moduli storyboard.js e background.js partono automaticamente.
// Questo file resta disponibile per future inizializzazioni globali.
document.body.classList.add("intro-mode");

const navBand = document.querySelector('a[href="#band"]');
const navHome = document.querySelector('a[href="#home"]');

const heroScene = document.getElementById("hero");
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

  bandScene.classList.remove("is-active");
  bandScene.setAttribute("aria-hidden", "true");

  showreelScene.classList.remove("is-active");
  showreelScene.setAttribute("aria-hidden", "true");

  datesScene.classList.remove("is-active");
  datesScene.setAttribute("aria-hidden", "true");

  if (sceneName === "home") {
    heroScene.classList.remove("scene-hidden");
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
      datesHeading.textContent = "PROSSIME DATE";
    }

    if (datesArchiveToggle) {
      datesArchiveToggle.textContent = "ARCHIVIO LIVE →";
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

const members = {
  fabio: {
    image: "assets/images/fabio-vox.png",
    alt: "Fabio Di Baldo",
    role: "LEAD VOCALS · “FABIO EROS”",
    name: "FABIO DI BALDO",
    quote:
      "Alias Fabio Eros. Una vita sulle note di Eros Ramazzotti.<br />Una passione diventata sogno: portarne la musica e le emozioni sul palco.",
  },

  danila: {
    image: "assets/images/danila-vox.png",
    alt: "Danila Sansoni",
    role: "VOCALS · DUETS · BACKING VOCALS",
    name: "DANILA SANSONI",
    quote:
      "Una passione innata per il canto, coltivata sin da bambina.<br />La voce dei cori e degli storici duetti di Eros Ramazzotti.",
  },

  nico: {
    image: "assets/images/nico-guitar.png",
    alt: "Nico Sansoni",
    role: "ELECTRIC GUITAR",
    name: "NICO SANSONI",
    quote:
      "Tecnica, precisione e personalità solistica.<br />La chitarra elettrica al servizio dello stile ETB.",
  },

  daniele: {
    image: "assets/images/daniele-guitar.png",
    alt: "Daniele Gabriele",
    role: "ELECTRIC & ACOUSTIC GUITAR · PROGRAMMING",
    name: "DANIELE GABRIELE",
    quote:
      "Trame armoniche, melodia e ricerca del suono.<br />Programmazioni e organizzazione tecnica al servizio della band.",
  },

  "stefano-nardi": {
    image: "assets/images/stefano-key.png",
    alt: "Stefano Nardi",
    role: "PIANO · KEYBOARDS · BACKING VOCALS",
    name: "STEFANO NARDI",
    quote:
      "Le atmosfere e la magia di ogni nostro live.<br />Il colore armonico che avvolge il sound della band.",
  },

  "stefano-campaioli": {
    image: "assets/images/stefano-drum.png",
    alt: "Stefano Campaioli",
    role: "DRUMS",
    name: "STEFANO CAMPAIOLI",
    quote:
      "La nostra macchina da guerra.<br />Il cuore pulsante che sostiene l’energia del palco.",
  },

  giammarco: {
    image: "assets/images/giammarco-bass.png",
    alt: "Giammarco Turchini",
    role: "BASS · BACKING VOCALS",
    name: "GIAMMARCO TURCHINI",
    quote:
      "Le fondamenta del nostro groove.<br />Dinamica e pulsazione al servizio della band.",
  },

  nicola: {
    image: "assets/images/nick-sax.png",
    alt: "Nicola Di Giorgio",
    role: "SAX",
    name: "NICOLA DI GIORGIO",
    quote:
      "Il Maestro. Personalità e carattere in ogni nota.<br />Come Eros desidera.",
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

let datesArchiveVisible = false;

const MONTHS = [
  "GEN",
  "FEB",
  "MAR",
  "APR",
  "MAG",
  "GIU",
  "LUG",
  "AGO",
  "SET",
  "OTT",
  "NOV",
  "DIC",
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
        ${showArchive ? "NESSUNA DATA IN ARCHIVIO" : "NUOVE DATE IN ARRIVO"}
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
        ? "ARCHIVIO LIVE"
        : "PROSSIME DATE";
    }

    datesArchiveToggle.textContent = datesArchiveVisible
      ? "← PROSSIME DATE"
      : "ARCHIVIO LIVE →";
  });
}

renderDates();
const eventLocationInput = document.getElementById("eventLocation");
const locationSuggestions = document.getElementById("locationSuggestions");

let locationSearchTimer;

eventLocationInput?.addEventListener("input", () => {
  selectedEventPlace = null;

  const query = eventLocationInput.value.trim();

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
          Località non verificata. Riprova.
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
    contactValueLabel.textContent = "Indirizzo email";

    contactValueInput.type = "email";
    contactValueInput.placeholder = "nome@esempio.it";
  } else if (method === "whatsapp") {
    contactValueLabel.textContent = "Numero WhatsApp";

    contactValueInput.type = "tel";
    contactValueInput.placeholder = "+39 333 1234567";
  } else {
    contactValueLabel.textContent = "Contatto";

    contactValueInput.type = "text";
    contactValueInput.placeholder = "Seleziona prima il canale";
  }
});

/* =========================================================
   QUOTE FORM
   ========================================================= */

const quoteForm = document.getElementById("quoteForm");
const quoteResult = document.getElementById("quoteResult");

quoteForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const eventDate = document.getElementById("eventDate").value;
    const locationType = document.getElementById("locationType").value;
    const serviceOption = document.getElementById("serviceOption").value;
    const lineup = document.getElementById("lineup").value;

    const contactMethod = document.getElementById("contactMethod").value;
    const contactValue = document.getElementById("contactValue").value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s]{8,18}$/;

    if (
      (contactMethod === "email" && !emailRegex.test(contactValue)) ||
      (contactMethod === "whatsapp" && !phoneRegex.test(contactValue))
    ) {
      quoteResult.innerHTML = `
    <div class="quote-note">
      Inserisci un contatto valido per ricevere il preventivo.
    </div>
  `;
      return;
    }

    quoteResult.innerHTML = `
      <div class="quote-note">
        Calcolo distanza e trasferta in corso...
      </div>
    `;

    const route = await getRouteEstimate();

    const quote = calculateEtbQuote({
      eventDate,
      distanceKmOneWay: route.distanceKmOneWay,
      tollOneWay: route.tollOneWay,
      lineup,
      serviceOption,
      locationType,
    });

    if (!quote.automaticQuoteAvailable) {
      quoteResult.innerHTML = `
        <div class="quote-total">
          VALUTAZIONE DEDICATA
        </div>

        <div class="quote-note">
          ${quote.message}
        </div>
      `;

      return;
    }

    const highDemandMessage = quote.highDemand
      ? `
        <div class="quote-note">
          <strong>DATA AD ALTA RICHIESTA</strong><br><br>
          La data selezionata rientra in uno dei periodi di maggiore attività live.
          La stima economica è indicativa e sarà confermata dal booking ETB.
        </div>
      `
      : "";

    quoteResult.innerHTML = `
      <div class="quote-total">
        ${formatEuro(quote.total)}
      </div>

      <div class="quote-note">
        STIMA INDICATIVA DEL LIVE<br><br>
        Formazione: ${quote.musicians} musicisti<br>
        Distanza indicativa da Roma: ${quote.distanceKmOneWay} km
      </div>

      ${highDemandMessage}

      <div class="quote-note">
        L'importo indicato costituisce una prima stima automatica
        e non rappresenta conferma definitiva della disponibilità o dell'ingaggio.
      </div>
    `;
  } catch (error) {
    quoteResult.innerHTML = `
      <div class="quote-total">
        ERRORE CALCOLO
      </div>

      <div class="quote-note">
        ${error.message}
      </div>
    `;

    console.error("Errore preventivo ETB:", error);
  }
});
