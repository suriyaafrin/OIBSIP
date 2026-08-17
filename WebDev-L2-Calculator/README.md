# Calculator

A clean, responsive calculator built with plain HTML, CSS, and JavaScript — no frameworks, no build tools.

## Features

- Basic arithmetic: addition, subtraction, multiplication, division
- Decimal input support
- Backspace to delete the last digit
- Clear (AC) to reset the calculator
- Divide-by-zero handling with an error message
- Full keyboard support (numbers, `+ - * /`, `Enter`/`=`, `Backspace`, `Escape`)
- Responsive layout that works on mobile and desktop
- Visual highlight on the currently selected operator

## File Structure

\`\`\`
calculator/
├── index.html   # Markup / structure
├── style.css    # Styling and layout
├── script.js    # Calculator logic
└── README.md    # This file
\`\`\`

## Getting Started

No installation or build step needed.

1. Download or clone the three files (`index.html`, `style.css`, `script.js`) into the same folder.
2. Open `index.html` in any modern web browser.

That's it — the calculator runs entirely in the browser.

## Usage

| Action              | Mouse/Touch      | Keyboard              |
|---------------------|------------------|------------------------|
| Enter a number       | Click a digit key | `0`–`9`                |
| Decimal point        | Click `.`         | `.`                    |
| Add / Subtract       | Click `+` / `−`   | `+` / `-`               |
| Multiply / Divide    | Click `×` / `÷`   | `*` / `/`               |
| Calculate result     | Click `=`         | `Enter` or `=`          |
| Delete last digit    | Click `⌫`         | `Backspace` / `Delete`  |
| Clear everything     | Click `AC`        | `Escape`                |

## How It Works

The logic in `script.js` tracks four pieces of state:

- `currentInput` — what's currently shown on the display
- `storedValue` — the first operand once an operator is chosen
- `pendingOperator` — the operator waiting to be applied
- `waitingForOperand` — whether the next digit should start a new number

When an operator or `=` is pressed, `calculate()` applies the pending operation to `storedValue` and `currentInput`. Dividing by zero triggers `showError()`, which displays "Cannot divide by zero" until the user presses a key to reset.

## Customization

Colors and spacing are defined as CSS custom properties at the top of `style.css`:

\`\`\`css
:root {
  --navy: #1E1B2E;
  --purple: #7C3AED;
  --blue: #4F46E5;
  --red: #F87171;
  --orange: #F59E0B;
  /* ... */
}
\`\`\`

Change these values to re-theme the calculator without touching any other rules.

## License

Free to use and modify for personal or commercial projects.