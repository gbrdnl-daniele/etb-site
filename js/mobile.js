document.addEventListener("DOMContentLoaded", () => {
  const promoButton = document.getElementById("promoButton");

  const trailerOverlay = document.getElementById("trailerOverlay");

  const trailerClose = document.getElementById("trailerClose");

  const trailerVideo = document.getElementById("trailerVideo");

  const menuOpen = document.getElementById("menuOpen");
  const menuOverlay = document.getElementById("menuOverlay");

  const revealSections = document.querySelectorAll(".reveal-section");
  const menuLinks = document.querySelectorAll(".menu-links a");

  const bandIntroImage = document.getElementById("bandIntroImage");
  const bandEntryScene = document.querySelector(".band-entry-scene");

  const tvTrack = document.querySelector(".showreel-tv-track");
  const tvDots = document.querySelectorAll(".showreel-tv-dots span");

  const datesUpcomingTab = document.getElementById("datesUpcomingTab");

  const datesArchiveTab = document.getElementById("datesArchiveTab");

  const datesUpcomingPanel = document.getElementById("datesUpcomingPanel");

  const datesArchivePanel = document.getElementById("datesArchivePanel");

  const datesUpcomingList = document.getElementById("datesUpcomingList");

  const datesArchiveList = document.getElementById("datesArchiveList");

  const quoteForm = document.getElementById("quoteForm");

  const quoteResult = document.getElementById("quoteResult");

  const quoteSubmitButton = document.querySelector(".mobile-quote-submit");

  const BAND_INTRO_DURATION = 4300;
  const MENU_CLOSE_DURATION = 450;

  /* ==========================================================
   SCELTA LINGUA PER DATE
========================================================== */

  const PAGE_LANGUAGE = document.documentElement.lang
    ?.toLowerCase()
    .startsWith("en")
    ? "en"
    : "it";

  const PAGE_LOCALE = PAGE_LANGUAGE === "en" ? "en-GB" : "it-IT";

  const UI_TEXT = {
    it: {
      menuOpen: "Apri il menu",
      menuClose: "Chiudi il menu",

      eventTimePrefix: "ORE",
      nextEvent: "PROSSIMO EVENTO",
      upcomingDates: "PROSSIME DATE",
      upcomingEmpty: "Nuovi appuntamenti in arrivo.",
      liveArchive: "ARCHIVIO LIVE",
      archiveEmpty: "Gli eventi conclusi verranno raccolti qui.",
    },

    en: {
      menuOpen: "Open menu",
      menuClose: "Close menu",

      eventTimePrefix: "TIME",
      nextEvent: "NEXT EVENT",
      upcomingDates: "UPCOMING DATES",
      upcomingEmpty: "New live dates coming soon.",
      liveArchive: "LIVE ARCHIVE",
      archiveEmpty: "Past events will be collected here.",
    },
  };

  const TEXT = UI_TEXT[PAGE_LANGUAGE];

  /* ==========================================================*/

  let bandIntroTimer = null;
  let menuCloseTimer = null;
  let menuScrollY = 0;
  let isPageScrollLocked = false;

  /* ==========================================================
   MENU
========================================================== */

  function lockPageScroll() {
    if (isPageScrollLocked) {
      return;
    }

    menuScrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${menuScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    isPageScrollLocked = true;
  }

  function unlockPageScroll() {
    if (!isPageScrollLocked) {
      return;
    }

    const scrollPosition = menuScrollY;

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";

    isPageScrollLocked = false;

    window.scrollTo(0, scrollPosition);
  }

  function openMenu() {
    if (!menuOverlay) {
      return;
    }

    if (document.body.classList.contains("menu-is-open")) {
      return;
    }

    window.clearTimeout(menuCloseTimer);
    menuCloseTimer = null;

    lockPageScroll();

    menuOverlay.classList.add("is-visible");
    menuOverlay.setAttribute("aria-hidden", "false");

    menuOpen?.setAttribute("aria-expanded", "true");
    menuOpen?.setAttribute("aria-label", TEXT.menuClose);

    document.body.classList.add("menu-is-open");
  }

  function closeMenu(onClosed = null) {
    if (!menuOverlay || !document.body.classList.contains("menu-is-open")) {
      return;
    }

    window.clearTimeout(menuCloseTimer);

    menuOverlay.classList.remove("is-visible");
    menuOverlay.setAttribute("aria-hidden", "true");

    menuOpen?.setAttribute("aria-expanded", "false");
    menuOpen?.setAttribute("aria-label", TEXT.menuOpen);

    document.body.classList.remove("menu-is-open");

    /*
     * Manteniamo la pagina congelata durante la dissolvenza
     * dell'overlay. Lo scroll viene riattivato soltanto quando
     * il menu ha terminato la chiusura.
     */
    menuCloseTimer = window.setTimeout(() => {
      unlockPageScroll();

      menuCloseTimer = null;

      if (typeof onClosed === "function") {
        onClosed();
      }
    }, MENU_CLOSE_DURATION);
  }

  function toggleMenu() {
    const isOpen = document.body.classList.contains("menu-is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /* ==========================================================
     BAND INTRO
  ========================================================== */

  function markBandIntroAsPlayed() {
    if (!bandEntryScene) {
      return;
    }

    bandEntryScene.classList.add("band-intro-played");
    bandIntroTimer = null;
  }

  function startBandIntro() {
    if (!bandEntryScene) {
      return;
    }

    if (bandEntryScene.classList.contains("band-intro-played")) {
      return;
    }

    window.clearTimeout(bandIntroTimer);

    bandEntryScene.classList.add("is-visible");

    bandIntroTimer = window.setTimeout(
      markBandIntroAsPlayed,
      BAND_INTRO_DURATION,
    );
  }

  function resetBandIntro() {
    if (!bandEntryScene) {
      return;
    }

    window.clearTimeout(bandIntroTimer);
    bandIntroTimer = null;

    bandEntryScene.classList.remove("is-visible", "band-intro-played");

    /*
     * Forza il browser a registrare lo stato iniziale.
     * In questo modo le transizioni possono ripartire.
     */
    void bandEntryScene.offsetWidth;
  }

  function isBandSceneAlreadyVisible() {
    if (!bandEntryScene) {
      return false;
    }

    const rect = bandEntryScene.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    return (
      rect.top < viewportHeight * 0.65 && rect.bottom > viewportHeight * 0.35
    );
  }

  /* ==========================================================
   TRAILER UFFICIALE
========================================================== */

  const TRAILER_OPENING_DURATION = 600;

  let trailerOpeningTimer = null;
  let trailerClosingTimer = null;

  function openTrailer() {
    if (!trailerOverlay || !trailerVideo) {
      return;
    }

    window.clearTimeout(trailerOpeningTimer);
    window.clearTimeout(trailerClosingTimer);

    trailerOverlay.classList.remove("is-player-visible");
    trailerOverlay.classList.add("is-visible");

    trailerOverlay.setAttribute("aria-hidden", "false");

    document.body.classList.add("trailer-is-open");

    trailerVideo.currentTime = 0;

    /*
     * Aspettiamo due frame:
     * il primo registra lo stato iniziale del player,
     * il secondo avvia correttamente fade e zoom.
     */
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        trailerOverlay.classList.add("is-player-visible");
      });
    });

    const playPromise = trailerVideo.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.info("Autoplay del trailer non disponibile:", error);
      });
    }

    trailerClose?.focus();
  }

  async function closeTrailer() {
    if (!trailerOverlay || !trailerVideo) {
      return;
    }

    window.clearTimeout(trailerClosingTimer);

    trailerVideo.pause();

    /*
     * Prima usciamo dal fullscreen nativo del browser.
     */
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.webkitFullscreenElement) {
        await document.webkitExitFullscreen();
      } else if (
        trailerVideo.webkitDisplayingFullscreen &&
        typeof trailerVideo.webkitExitFullscreen === "function"
      ) {
        trailerVideo.webkitExitFullscreen();
      }
    } catch (error) {
      console.info("Uscita dal fullscreen non disponibile:", error);
    }

    /*
     * Sblocca un eventuale orientamento imposto
     * dal player fullscreen.
     */
    try {
      screen.orientation?.unlock();
    } catch (error) {
      console.info("Sblocco orientamento non disponibile:", error);
    }

    trailerOverlay.classList.remove("is-player-visible", "is-visible");

    trailerOverlay.setAttribute("aria-hidden", "true");

    document.body.classList.remove("trailer-is-open");

    trailerClosingTimer = window.setTimeout(() => {
      trailerVideo.currentTime = 0;
    }, 300);

    promoButton?.focus();
  }

  function restartHomeAnimation(element) {
    if (!element) {
      return;
    }

    element.style.animation = "none";

    /*
     * Forza il browser a registrare lo stato iniziale
     * prima di ripristinare l'animazione CSS originale.
     */
    void element.offsetWidth;

    element.style.animation = "";
  }

  function replayHomeScene() {
    const heroBackground = document.querySelector("#home .hero-background");

    const promoButtonHome = document.querySelector("#home .promo-button");

    const scrollHintHome = document.querySelector("#home .scene-scroll-hint");

    restartHomeAnimation(heroBackground);
    restartHomeAnimation(promoButtonHome);
    restartHomeAnimation(scrollHintHome);
  }

  /* ==========================================================
     EVENTI PRINCIPALI
  ========================================================== */

  promoButton?.addEventListener("click", openTrailer);

  trailerClose?.addEventListener("click", closeTrailer);

  menuOpen?.addEventListener("click", toggleMenu);

  trailerVideo?.addEventListener("ended", closeTrailer);

  menuLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const destination = link.getAttribute("href");

      if (!destination || !destination.startsWith("#")) {
        return;
      }

      event.preventDefault();

      const targetSection = document.querySelector(destination);

      if (!targetSection) {
        return;
      }

      /*
       * Per ora manteniamo soltanto il comportamento
       * già esistente della scena introduttiva della Band.
       */
      if (destination === "#memberFabio") {
        resetBandIntro();
      }

      closeMenu(() => {
        if (window.location.hash !== destination) {
          window.history.pushState(null, "", destination);
        }

        /*
         * La HOME coincide con l'inizio assoluto della pagina.
         */
        if (destination === "#home") {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });

          const homeNavigationStartedAt = performance.now();
          const homeNavigationTimeout = 1800;

          function waitForHomeArrival() {
            const hasArrived = window.scrollY <= 2;

            const hasTimedOut =
              performance.now() - homeNavigationStartedAt >=
              homeNavigationTimeout;

            if (hasArrived || hasTimedOut) {
              replayHomeScene();
              return;
            }

            window.requestAnimationFrame(waitForHomeArrival);
          }

          window.requestAnimationFrame(waitForHomeArrival);

          return;
        }

        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        /*
         * Se Fabio era già dentro il viewport, l'Observer potrebbe
         * non generare un nuovo ingresso. Riavviamo quindi soltanto
         * la Band in questo caso specifico.
         */
        if (destination === "#memberFabio" && isBandSceneAlreadyVisible()) {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(startBandIntro);
          });
        }
      });
    });
  });

  menuOverlay?.addEventListener("click", (event) => {
    if (event.target === menuOverlay) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (trailerOverlay?.classList.contains("is-visible")) {
      closeTrailer();
      return;
    }

    closeMenu();
  });

  /* ==========================================================
     REVEAL DELLE SCENE
  ========================================================== */

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const isBandEntry = entry.target.classList.contains("band-entry-scene");

        /*
         * La scena di Fabio resta sempre osservata:
         * potrà essere resettata e riavviata dal menu.
         */
        if (isBandEntry) {
          startBandIntro();
          return;
        }

        /*
         * Tutte le altre scene entrano una sola volta.
         */
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.38,
    },
  );

  revealSections.forEach((section) => {
    revealObserver.observe(section);
  });

  /* ==========================================================
     CALCOLO ZOOM BAND INTRO
     FIT HEIGHT → FIT WIDTH
  ========================================================== */

  function updateBandIntroScale() {
    if (!bandIntroImage || !bandEntryScene) {
      return;
    }

    const naturalWidth = bandIntroImage.naturalWidth;
    const naturalHeight = bandIntroImage.naturalHeight;

    if (!naturalWidth || !naturalHeight) {
      return;
    }

    const sceneWidth = bandEntryScene.clientWidth;
    const sceneHeight = bandEntryScene.clientHeight;

    const imageHeightAtFitWidth = sceneWidth * (naturalHeight / naturalWidth);

    const fitHeightScale = sceneHeight / imageHeightAtFitWidth;

    bandEntryScene.style.setProperty(
      "--band-intro-start-scale",
      Math.max(1, fitHeightScale).toFixed(4),
    );
  }

  if (bandIntroImage) {
    if (bandIntroImage.complete) {
      updateBandIntroScale();
    } else {
      bandIntroImage.addEventListener("load", updateBandIntroScale, {
        once: true,
      });
    }

    window.addEventListener("resize", updateBandIntroScale);
  }
  if (tvTrack && tvDots.length) {
    let tvScrollFrame = null;

    function updateTvCarouselDots() {
      const cards = tvTrack.querySelectorAll(".showreel-mobile-card");

      if (!cards.length) {
        return;
      }

      const activeIndex = Math.round(tvTrack.scrollLeft / tvTrack.clientWidth);

      tvDots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
      });
    }

    tvTrack.addEventListener(
      "scroll",
      () => {
        window.cancelAnimationFrame(tvScrollFrame);

        tvScrollFrame = window.requestAnimationFrame(updateTvCarouselDots);
      },
      { passive: true },
    );

    updateTvCarouselDots();
  }

  function activateDatesPanel(activeTab, activePanel) {
    const tabs = [datesUpcomingTab, datesArchiveTab];
    const panels = [datesUpcomingPanel, datesArchivePanel];

    tabs.forEach((tab) => {
      if (!tab) {
        return;
      }

      const isActive = tab === activeTab;

      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    panels.forEach((panel) => {
      if (!panel) {
        return;
      }

      const isActive = panel === activePanel;

      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
  }

  function buildDateCard(event, isPast = false) {
    const [year, month, day] = event.date.split("-");

    const eventDate = new Date(Number(year), Number(month) - 1, Number(day));

    const pageLocale =
      document.documentElement.lang === "en" ? "en-GB" : "it-IT";

    const monthName = new Intl.DateTimeFormat(PAGE_LOCALE, {
      month: "long",
    })
      .format(eventDate)
      .toUpperCase();

    const card = document.createElement("article");

    card.className = "date-card";

    if (isPast) {
      card.classList.add("date-card--past");
    }

    card.dataset.eventDate = event.date;

    const eventMarkup = event.event
      ? `<p class="date-card-event">${event.event}</p>`
      : "";

    const locationMarkup = event.location
      ? `<p class="date-card-event">${event.location}</p>`
      : "";

    card.innerHTML = `
    <div class="date-card-date">
      <span class="date-card-day">${day}</span>
      <span class="date-card-month">${monthName}</span>
      <span class="date-card-year">${year}</span>
    </div>

    <div class="date-card-body">
      <h3>${event.city}</h3>

      <p class="date-card-location">
        ${event.city} (${event.province})
      </p>

      ${eventMarkup}
      ${locationMarkup}

      <div class="date-card-time">
        ${TEXT.eventTimePrefix} ${event.time}
      </div>
    </div>
  `;

    return card;
  }

  function organizeEventsByDate() {
    if (
      typeof ETB_DATES === "undefined" ||
      !datesUpcomingList ||
      !datesArchiveList
    ) {
      console.warn("ETB_DATES o contenitori delle date non disponibili.");

      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = [];
    const pastEvents = [];

    ETB_DATES.forEach((event) => {
      const [year, month, day] = event.date.split("-").map(Number);

      const eventDate = new Date(year, month - 1, day);
      eventDate.setHours(0, 0, 0, 0);

      const item = {
        event,
        date: eventDate,
      };

      if (eventDate < today) {
        pastEvents.push(item);
      } else {
        upcomingEvents.push(item);
      }
    });

    upcomingEvents.sort((a, b) => a.date - b.date);
    pastEvents.sort((a, b) => b.date - a.date);

    datesUpcomingList.replaceChildren();
    datesArchiveList.replaceChildren();

    upcomingEvents.forEach(({ event }, index) => {
      const card = buildDateCard(event);

      if (index === 0) {
        card.classList.add("date-card--featured");

        const badge = document.createElement("div");
        badge.className = "date-card-badge";

        const badgeText = document.createElement("span");
        badgeText.textContent = TEXT.nextEvent;

        badge.appendChild(badgeText);

        card.prepend(badge);
      }

      datesUpcomingList.appendChild(card);
    });

    pastEvents.forEach(({ event }) => {
      datesArchiveList.appendChild(buildDateCard(event, true));
    });

    if (!upcomingEvents.length) {
      datesUpcomingList.innerHTML = `
      <div class="dates-empty-state">
        <span class="dates-empty-year">
          ${TEXT.upcomingDates}
        </span>

        <p>${TEXT.upcomingEmpty}</p>
      </div>
      `;
    }

    if (!pastEvents.length) {
      datesArchiveList.innerHTML = `
      <div class="dates-empty-state">
        <span class="dates-empty-year">
          ${TEXT.liveArchive}
        </span>

        <p>${TEXT.archiveEmpty}</p>
      </div>
    `;
    }
  }

  organizeEventsByDate();

  datesUpcomingTab?.addEventListener("click", () => {
    activateDatesPanel(datesUpcomingTab, datesUpcomingPanel);
  });

  datesArchiveTab?.addEventListener("click", () => {
    activateDatesPanel(datesArchiveTab, datesArchivePanel);
  });
});

/* ==========================================================
   APERTURA MODULO RICHIESTA STIMA
========================================================== */

const startQuoteButton = document.getElementById("startQuoteButton");
const quoteFormSection = document.getElementById("quoteFormSection");

if (startQuoteButton && quoteFormSection) {
  startQuoteButton.addEventListener("click", () => {
    const isAlreadyOpen = quoteFormSection.classList.contains("is-open");

    if (isAlreadyOpen) {
      return;
    }

    quoteFormSection.classList.add("is-open");
    quoteFormSection.setAttribute("aria-hidden", "false");

    startQuoteButton.classList.add("is-complete");
    startQuoteButton.setAttribute("aria-expanded", "true");
    startQuoteButton.textContent = "RICHIESTA INIZIATA";

    window.setTimeout(() => {
      quoteFormSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 180);
  });
  /* ==========================================================
   MODULO BOOKING — DATA E LOCALITÀ
========================================================== */

  const mobileEventDate = document.getElementById("eventDate");
  const mobileEventLocation = document.getElementById("eventLocation");
  const mobileInternationalEvent =
    document.getElementById("internationalEvent");

  const mobileLocationSuggestions = document.getElementById(
    "locationSuggestions",
  );

  let mobileSelectedPlace = null;
  let mobileLocationSearchTimer = null;

  /* ----------------------------------------------------------
   DATA MINIMA: DOMANI
---------------------------------------------------------- */

  function getTomorrowDateValue() {
    const tomorrow = new Date();

    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (mobileEventDate) {
    mobileEventDate.min = getTomorrowDateValue();
  }

  /* ----------------------------------------------------------
   GESTIONE SUGGERIMENTI LOCALITÀ
---------------------------------------------------------- */

  function closeMobileLocationSuggestions() {
    if (!mobileLocationSuggestions) {
      return;
    }

    mobileLocationSuggestions.classList.remove("is-visible");
    mobileLocationSuggestions.replaceChildren();
  }

  async function searchMobilePlaces(query) {
    const url = new URL("/api/places", window.location.origin);

    url.searchParams.set("query", query);

    const response = await fetch(url);

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
      throw new Error(
        data?.error || "Non è stato possibile cercare la località.",
      );
    }

    return Array.isArray(data.places) ? data.places : [];
  }

  function showMobileLocationMessage(message) {
    if (!mobileLocationSuggestions) {
      return;
    }

    mobileLocationSuggestions.replaceChildren();

    const item = document.createElement("div");

    item.className = "location-suggestion";
    item.textContent = message;

    mobileLocationSuggestions.appendChild(item);
    mobileLocationSuggestions.classList.add("is-visible");
  }

  function renderMobileLocationSuggestions(places) {
    if (!mobileLocationSuggestions || !mobileEventLocation) {
      return;
    }

    mobileLocationSuggestions.replaceChildren();

    places.forEach((place) => {
      const button = document.createElement("button");

      button.className = "location-suggestion";
      button.type = "button";
      button.textContent = place.label;

      button.addEventListener("click", () => {
        mobileSelectedPlace = place;
        mobileEventLocation.value = place.label;

        closeMobileLocationSuggestions();
      });

      mobileLocationSuggestions.appendChild(button);
    });

    mobileLocationSuggestions.classList.toggle("is-visible", places.length > 0);
  }
  
  mobileInternationalEvent?.addEventListener("change", () => {
    mobileSelectedPlace = null;
    closeMobileLocationSuggestions();
  });

  mobileEventLocation?.addEventListener("input", () => {
    if (mobileInternationalEvent?.checked) {
      closeMobileLocationSuggestions();
      return;
    }

    mobileSelectedPlace = null;

    const query = mobileEventLocation.value.trim();

    window.clearTimeout(mobileLocationSearchTimer);

    if (query.length < 3) {
      closeMobileLocationSuggestions();
      return;
    }

    mobileLocationSearchTimer = window.setTimeout(async () => {
      try {
        const places = await searchMobilePlaces(query);

        if (!places.length) {
          showMobileLocationMessage("Nessuna località trovata.");
          return;
        }

        renderMobileLocationSuggestions(places);
      } catch (error) {
        console.error("Errore ricerca località ETB:", error);

        showMobileLocationMessage(
          "Non è stato possibile verificare la località. Riprova.",
        );
      }
    }, 400);
  });

  /* Chiude i suggerimenti toccando fuori dal campo */

  document.addEventListener("pointerdown", (event) => {
    const clickedInsideLocation =
      mobileEventLocation?.contains(event.target) ||
      mobileLocationSuggestions?.contains(event.target);

    if (!clickedInsideLocation) {
      closeMobileLocationSuggestions();
    }
  });

  /* ==========================================================
   ANDROID AUTOFILL — MANTIENE VISIBILI TUTTI I CAMPI DEL FORM
========================================================== */

  const mobileAutofillFields = quoteForm.querySelectorAll(
    'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), select, textarea',
  );

  function keepAutofilledFieldVisible(field) {
    window.setTimeout(() => {
      field.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "nearest",
      });
    }, 200);
  }

  mobileAutofillFields.forEach((field) => {
    field.addEventListener("input", (event) => {
      /*
      Android può usare insertReplacementText, insertText
      oppure non valorizzare inputType durante l'autofill.
    */
      const autofillInput =
        event.inputType === "insertReplacementText" ||
        event.inputType === "insertText" ||
        !event.inputType;

      if (autofillInput && field.value.trim()) {
        keepAutofilledFieldVisible(field);
      }
    });

    field.addEventListener("change", () => {
      if (field.value.trim()) {
        keepAutofilledFieldVisible(field);
      }
    });
    field.addEventListener("focus", () => {
      window.setTimeout(() => {
        keepAutofilledFieldVisible(field);
      }, 200);
    });
  });
}
