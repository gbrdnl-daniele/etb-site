# Regia — Intro Desktop 16:9

## Scena 0 — Nero iniziale

Il sito parte da nero assoluto. La durata è controllata da:

```js
initialBlack
```

## Scena 1 — Prima frase

Testo:

```text
Ci sono canzoni...
```

È la prima apparizione, quindi usa `firstFadeIn`.

## Scena 2 — Seconda frase

Testo:

```text
...che non si limitano ad essere ascoltate...
```

È la frase centrale, più lunga e più narrativa.

## Scena 3 — Climax

Testo:

```text
SI VIVONO.
```

È il climax. Quando inizia il suo fade-out, il fade dello sfondo verso il nero può partire in anticipo tramite:

```js
claimBackgroundFadeStart
```

## Scena 4 — Fade al nero

Lo sfondo va al nero con:

```js
fadeToBlack
```

Poi rimane nero per:

```js
blackPause
```

## Scena 5 — Apertura Home

La Hero emerge dal nero con:

```js
heroFadeFromBlack
```
