# Temperature Converter

A simple, clean web app that converts a temperature between **Celsius**, **Fahrenheit**, and **Kelvin** — all three results shown at once.

## Features

- Numeric input field with validation (rejects empty or non-numeric input)
- Unit selector dropdown (Celsius / Fahrenheit / Kelvin)
- Converts to **all three units simultaneously** — no need to convert one pair at a time
- "Convert" button triggers the calculation
- Color-coded result cards (red for Celsius, amber for Fahrenheit, blue for Kelvin)
- Absolute zero validation — rejects any value below −273.15°C with a friendly error message
- Accessible: proper labels, `aria-live` regions for results, `aria-invalid` on bad input

## File Structure

```
temp-converter/
├── index.html   # Page structure and content
├── style.css    # All styling
├── script.js    # Conversion logic and form handling
└── README.md    # This file
```

## How to Run

No build tools or installation needed.

1. Download all three files (`index.html`, `style.css`, `script.js`) into the **same folder**.
2. Double-click `index.html`, or open it in your browser.

That's it — it runs entirely in the browser with no server or dependencies required (aside from Google Fonts and the Lucide icon library, loaded from a CDN).

## How to Use

1. Type a temperature value into the input field (e.g. `21.5`, `-40`, `100`).
2. Choose the unit you're entering **from** (Celsius, Fahrenheit, or Kelvin).
3. Click **Convert**.
4. All three result cards update at once, showing the equivalent value in Celsius, Fahrenheit, and Kelvin.

## Validation Rules

| Input | Result |
|---|---|
| Empty field | "Please enter a temperature value." |
| Non-numeric text | "That's not a valid number. Try something like 21.5 or -4." |
| Value below absolute zero (−273.15°C / −459.67°F / 0 K) | "That temperature is below absolute zero. Please enter a real value." |
| Valid value | Shows all three converted results |

## Conversion Formulas

All conversions go through Celsius as the common unit:

```
Fahrenheit → Celsius:   (°F − 32) × 5/9
Kelvin → Celsius:       K − 273.15
Celsius → Fahrenheit:   (°C × 9/5) + 32
Celsius → Kelvin:       °C + 273.15
```

## Tech Stack

- Plain HTML, CSS, and JavaScript (no frameworks, no build step)
- [Lucide](https://lucide.dev/) for icons
- Google Fonts: DM Sans (body) and Fraunces (headings)

## Browser Support

Works in any modern browser (Chrome, Firefox, Safari, Edge). No special setup required.