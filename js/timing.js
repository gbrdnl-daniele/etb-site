// ETB Cinematic Experience — timing centrale.
// Modifica questi valori e ricarica Chrome per rifinire il ritmo della intro.

window.ETB_TIMING = {
  // Fade delle frasi
  fadeIn: 500,
  firstFadeIn: 2200,
  fadeOut: 700,
  cleanPause: 250,

  // Nero iniziale e passaggio alla Home
  initialBlack: 1200,
  fadeToBlack: 1000,
  blackPause: 100,
  heroFadeFromBlack: 700,

  // Ritardi di comparsa dopo la Hero
  navDelay: 700,
  cardDelay: 700,

  // Quando la frase finale inizia a sparire, dopo questa percentuale parte il fade dello sfondo.
  // 0.7 = il fade dello sfondo parte quando il fade-out del testo è al 70%.
  claimBackgroundFadeStart: 0.7
};

window.ETB_STORYBOARD = [
  {
    text: 'Ci sono canzoni...',
    hold: 1000,
    first: true
  },
  {
    text: '...che non si limitano ad essere ascoltate...',
    hold: 1900,
    long: true
  },
  {
    text: 'SI VIVONO.',
    hold: 2000,
    claim: true,
    pauseAfter: 300
  }
];


