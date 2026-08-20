# Todo List

A clean, fully functional to-do list. No backend, no external SDK — everything runs in the browser and persists via `localStorage`.

## Files

| File | Description |
|---|---|
| `index.html` | Page markup |
| `style.css` | Clean UI styling using the color theme below |
| `script.js` | All app logic + `localStorage` persistence |

## Run it

Just open `index.html` in a browser — no build step, no server required.

```bash
open index.html        # macOS
# or
npx serve .             # any OS, if you want it served over http
```

## Features

- **Add tasks** — type and press Enter or click "Add"
- **Mark complete** — click the round checkbox
- **Edit in place** — pencil icon reveals an inline input; Enter saves, Escape cancels
- **Delete** — trash icon removes a task immediately
- **Pending / Done sections** — tasks sort automatically, each with a live count
- **Empty states** — friendly copy when a section has nothing in it
- **Clear done** — one-click button to wipe completed tasks (appears only when there are done tasks)
- **Persistence** — saved to `localStorage` under the key `todoList.tasks.v1`, so your list survives page reloads and browser restarts (per-browser, per-device)
- **Accessible** — visible keyboard focus rings, `aria-pressed`/`aria-label` on controls, reduced-motion support, screen-reader-only labels on inputs
- **Safe rendering** — task text is inserted via `textContent`, not `innerHTML`, so tasks can't break the layout or inject scripts

## Color theme

| Element | Color |
|---|---|
| Background | `#F5F7F5` |
| Main card | `#FFFFFF` |
| Primary color | `#4CAF7D` |
| Primary hover | `#3D956A` |
| Text | `#1F2937` |
| Secondary text | `#6B7280` |
| Pending accent | `#F59E0B` |
| Completed accent | `#10B981` |
| Delete | `#EF4444` |
| Border | `#E5E7EB` |

All values are defined as CSS variables at the top of `style.css` (`:root`), so the whole palette can be swapped by editing one block.

## Customizing

- **Colors** — edit the `:root` variables in `style.css`
- **Font** — currently DM Sans via Google Fonts; swap the `<link>` in `index.html` and the `--font-body` variable in `style.css`
- **Storage key** — change `STORAGE_KEY` in `script.js` if you want multiple independent lists on the same origin
- **Character limit** — tasks are capped at 200 characters (`maxlength`); adjust in `index.html` and the edit-input markup in `script.js`

## Known limitations

- Data is local to one browser — it won't sync across devices. For that you'd need a backend (e.g. a REST API or a service like Supabase/Firebase) in place of the `localStorage` calls in `script.js`.
- Clearing browser storage/site data will erase tasks.