(() => {
  const line = document.getElementById("storyLine");
  const intro = document.getElementById("introStage");
  const hero = document.getElementById("hero");
  const nav = document.getElementById("topnav");
  const card = document.getElementById("themeCard");
  const fader = document.getElementById("sceneFader");

  const timing = window.ETB_TIMING;
  const storyboard = window.ETB_STORYBOARD;

  const heroLogo = document.querySelector(".hero-logo");
  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  const heroClaimLines = document.querySelectorAll(".hero-claim-line");
  const heroActions = document.querySelector(".hero-actions");

  let heroTransitionStarted = false;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function showPhrase(scene) {
    const fadeInTime = scene.first ? timing.firstFadeIn : timing.fadeIn;

    const fadeOutTime = scene.claim
      ? timing.claimFadeOut
      : scene.fadeOut || timing.fadeOut;

    line.textContent = scene.text;
    line.classList.toggle("is-claim", !!scene.claim);
    line.classList.toggle("is-long", !!scene.long);
    line.classList.remove("is-visible", "is-out");

    await wait(50);

    line.style.transitionDuration = fadeInTime + "ms";
    line.classList.add("is-visible");
    await wait(fadeInTime);

    line.style.transitionDuration = "";
    await wait(scene.hold);

    line.classList.remove("is-visible");
    line.classList.add("is-out");

    if (scene.claim) {
      const startRatio = timing.claimBackgroundFadeStart ?? 0.7;

      await wait(fadeOutTime * startRatio);

      transitionToHero();

      await wait(fadeOutTime * (1 - startRatio));

      return;
    } else {
      await wait(fadeOutTime);
    }

    line.classList.remove("is-out");
    await wait(timing.cleanPause);

    if (scene.pauseAfter) {
      await wait(scene.pauseAfter);
    }
  }

  async function fadeFromInitialBlack() {
    await wait(timing.initialBlack);

    fader.style.transitionDuration = timing.firstFadeIn + "ms";
    fader.classList.add("is-clear");

    await wait(timing.firstFadeIn);
    fader.style.transitionDuration = "";
  }

  async function transitionToHero() {
  if (heroTransitionStarted) return;
  heroTransitionStarted = true;

  intro.classList.add("is-hidden");

  fader.style.transitionDuration = timing.fadeToBlack + "ms";
  fader.classList.remove("is-clear");
  fader.classList.add("is-black");

  await wait(timing.fadeToBlack);

  document.body.classList.remove("intro-mode");
  document.body.classList.add("hero-mode");

  hero.classList.add("is-visible");

  await wait(timing.blackPause);

  fader.style.transitionDuration = timing.heroFadeFromBlack + "ms";
  fader.classList.add("is-clear");
  fader.classList.remove("is-black");

  await wait(timing.heroFadeFromBlack);
  fader.style.transitionDuration = "";

  await revealHeroSequence();

  await wait(timing.cardDelay);
}

  async function revealHeroSequence() {
    heroLogo?.classList.add("is-revealed");

    await wait(520);
    heroTitle?.classList.add("is-revealed");

    await wait(520);
    heroSubtitle?.classList.add("is-revealed");

    await wait(520);
    heroClaimLines[0]?.classList.add("is-revealed");

    await wait(420);
    heroClaimLines[1]?.classList.add("is-revealed");

    // await wait(650);
    // heroActions?.classList.add("is-revealed");

    await wait(500);
    nav.classList.add("is-visible");
  }

  async function runIntro() {
    document.documentElement.classList.add("etb-ready");
    document.body.classList.add("intro-mode");

    const fadePromise = fadeFromInitialBlack();

    await showPhrase(storyboard[0]);
    await fadePromise;

    for (const scene of storyboard.slice(1)) {
      await showPhrase(scene);
    }
  }

  window.addEventListener("load", runIntro, { once: true });
})();
