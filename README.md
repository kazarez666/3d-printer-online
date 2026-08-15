# 3D Printer Online — Prototype 0.1

Browser prototype for the first core-loop test of **3D Printer Online**, a casual 3D-printing game planned for Yandex Games.

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

The prototype currently loads Three.js from jsDelivr, so the first run needs internet access.

## Prototype 0.1 includes

- stylized 3D printer
- animated print head and filament spool
- vertical clipping / hybrid layer reveal
- active fresh-layer effect
- Rubber Duck print
- completion / sell flow
- Cash
- Speed upgrade
- localStorage save
- mobile-responsive HUD

## Current core loop

`PRINT → WATCH → COMPLETE → SELL → MONEY → SPEED UPGRADE → PRINT FASTER`

## Project direction

The long-term game is a casual simulator / collection / light-tycoon hybrid. Development stays focused on proving that watching an object print layer-by-layer is satisfying before adding collection, orders, multiple printers, materials, Yandex SDK integration, and monetization.
