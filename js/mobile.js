(() => {
  const body = document.body;

  const menu = document.getElementById("mobileMenu");
  const openButton = document.getElementById("mobileMenuOpen");
  const closeButton = document.getElementById("mobileMenuClose");

  if (!menu || !openButton || !closeButton) {
    return;
  }

  function openMenu() {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");

    openButton.setAttribute("aria-expanded", "true");

    body.classList.add("menu-open");
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");

    openButton.setAttribute("aria-expanded", "false");

    body.classList.remove("menu-open");
  }

  openButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
})();