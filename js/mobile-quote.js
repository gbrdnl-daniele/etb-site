/* ==========================================================
   ETB MOBILE QUOTE
   Gestione form richiesta preventivo
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const quoteForm = document.getElementById("quoteForm");

  const quoteResult = document.getElementById("quoteResult");

  const quoteSubmitButton = document.querySelector(".mobile-quote-submit");

  if (!quoteForm || !quoteResult || !quoteSubmitButton) {
    console.warn("ETB Mobile Quote: form non trovato.");
    return;
  }

  quoteForm.noValidate = true;

  const customerEmailConfirmField = quoteForm.elements.namedItem(
    "etbEmailManualConfirm",
  );

  if (customerEmailConfirmField) {
    customerEmailConfirmField.value = "";

    customerEmailConfirmField.addEventListener("focus", () => {
      customerEmailConfirmField.setAttribute("autocomplete", "new-password");
    });
  }

  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    quoteResult.className = "mobile-quote-result";
    quoteResult.textContent = "";

    const originalButtonText = quoteSubmitButton.textContent;

    function showFieldError(fieldId, message) {
      const field = document.getElementById(fieldId);

      quoteResult.className = "mobile-quote-result is-error";
      quoteResult.textContent = message;

      if (field) {
        field.focus({
          preventScroll: true,
        });

        field.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }

    try {
      /*
      Lasciamo al browser il tempo di registrare eventuali valori
      appena inseriti tramite autofill Android.
    */
      await new Promise((resolve) => {
        window.requestAnimationFrame(resolve);
      });

      await new Promise((resolve) => {
        window.requestAnimationFrame(resolve);
      });

      /*
      FormData legge anche i valori inseriti dal browser
      attraverso l'autocompletamento.
    */
      const formData = new FormData(quoteForm);

      const clientName = String(formData.get("clientName") || "").trim();

      const eventDate = String(formData.get("eventDate") || "").trim();

      const eventLocation = String(formData.get("eventLocation") || "").trim();

      const locationType = String(formData.get("locationType") || "").trim();

      const lineup = String(formData.get("lineup") || "").trim();

      const serviceOption = String(formData.get("serviceOption") || "").trim();

      const customerPhone = String(formData.get("customerPhone") || "").trim();

      const customerEmail = String(formData.get("customerEmail") || "").trim();

      const customerEmailConfirm = String(
        formData.get("etbEmailManualConfirm") || "",
      ).trim();

      const eventNotes = String(formData.get("eventNotes") || "").trim();

      /*
      VALIDAZIONE NELL'ORDINE REALE DEL FORM
    */

      if (!clientName) {
        showFieldError("clientName", "Inserisci il tuo nome.");
        return;
      }

      if (!eventDate) {
        showFieldError("eventDate", "Seleziona la data dell’evento.");
        return;
      }

      const selectedDate = new Date(`${eventDate}T00:00:00`);

      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (Number.isNaN(selectedDate.getTime()) || selectedDate < tomorrow) {
        showFieldError(
          "eventDate",
          "La data dell’evento deve essere successiva alla data odierna.",
        );
        return;
      }

      if (!eventLocation) {
        showFieldError("eventLocation", "Inserisci la località dell’evento.");
        return;
      }

      if (!locationType) {
        showFieldError("locationType", "Seleziona il tipo di location.");
        return;
      }

      if (!lineup) {
        showFieldError("lineup", "Seleziona la formazione ETB.");
        return;
      }

      if (!serviceOption) {
        showFieldError(
          "serviceOption",
          "Indica la disponibilità del service audio e luci.",
        );
        return;
      }

      /*
      TELEFONO PRIMA DELLE EMAIL
    */

      if (!customerPhone) {
        showFieldError("customerPhone", "Inserisci il tuo numero di telefono.");
        return;
      }

      const normalizedPhone = customerPhone.replace(/[^\d+]/g, "");

      const phoneDigits = normalizedPhone.replace(/\D/g, "");

      if (phoneDigits.length < 8 || phoneDigits.length > 15) {
        showFieldError(
          "customerPhone",
          "Inserisci un numero di telefono valido, comprensivo di prefisso.",
        );
        return;
      }

      if (!customerEmail) {
        showFieldError("customerEmail", "Inserisci il tuo indirizzo email.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(customerEmail)) {
        showFieldError("customerEmail", "Inserisci un indirizzo email valido.");
        return;
      }

      if (!customerEmailConfirm) {
        showFieldError(
          "customerEmailConfirm",
          "Ripeti il tuo indirizzo email.",
        );
        return;
      }

      if (customerEmail.toLowerCase() !== customerEmailConfirm.toLowerCase()) {
        showFieldError(
          "customerEmailConfirm",
          "Le due email inserite non coincidono.",
        );
        return;
      }

      const payload = {
        customerEmail,

        customerPhone: normalizedPhone,

        marketingConsent: formData.has("marketingConsent"),

        website: String(formData.get("website") || ""),

        event: {
          clientName,
          eventDate,
          eventLocation,
          locationType,
          serviceOption,
          lineup,
          notes: eventNotes,
        },
      };

      quoteSubmitButton.disabled = true;
      quoteSubmitButton.textContent = "INVIO IN CORSO...";

      quoteResult.textContent = "Stiamo elaborando la tua richiesta.";

      await sendEtbQuoteEmails(payload);

      quoteResult.className = "mobile-quote-result is-success";

      quoteResult.textContent =
        "Richiesta inviata con successo. Controlla la casella email indicata.";

      quoteSubmitButton.textContent = "RICHIESTA INVIATA";
    } catch (error) {
      quoteResult.className = "mobile-quote-result is-error";

      quoteResult.textContent =
        error.message || "Si è verificato un errore durante l’invio.";

      quoteSubmitButton.disabled = false;
      quoteSubmitButton.textContent = originalButtonText;

      console.error("Errore preventivo ETB Mobile:", error);
    }
  });
});
