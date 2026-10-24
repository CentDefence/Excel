# Excel in the browser

A spreadsheet editor in plain HTML/CSS/JavaScript. No build step, no server.

## Run
Open `index.html` in a browser. Try `samples/sales.csv` via Home > Open.

## Structure
- `index.html` - page markup (ribbon, formula bar, grid, sheet tabs)
- `css/style.css` - theme (light/dark), layout, animations
- `js/state.js` - helpers, global state
- `js/functions.js` - ~150 Excel functions (add your own to `FN`)
- `js/engine.js` - formula compiler/evaluator, number formats
- `js/render.js` - grid rendering, selection
- `js/editing.js` - editing, undo/redo, styles, AutoSum
- `js/files.js` - sheets, open/save .xlsx and .csv
- `js/input.js` - mouse, keyboard, clipboard
- `js/features.js` - fill, sort, find, insert/delete, charts, ribbon tabs
- `js/main.js` - entry point
- `tests/run.js` - formula tests: `node tests/run.js`

Scripts are plain `<script>` tags sharing one global scope, so keep the load order from `index.html`.

## Excel files
.xlsx support uses SheetJS (loaded from a CDN). For offline use, put `xlsx.full.min.js` (SheetJS 0.18.5) into a `lib/` folder; index.html falls back to it.

## Limits
No pivot tables, macros, conditional formatting, cross-sheet references or dynamic arrays. Styles are not saved into .xlsx.
