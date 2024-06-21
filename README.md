# Currency Converter Chrome Extension
This project is a Google Chrome extension that converts various currencies to New Taiwan Dollar (TWD) when the user hovers over price tags on a webpage. The extension supports multiple currencies and dynamically fetches the latest exchange rates.

## Features
- Detects and converts multiple currencies to TWD on mouse hover.
- Supports a wide range of currency symbols.
- Fetches live exchange rates from an API.
- Provides a tooltip with the converted TWD amount.

## Project Structure
```
.
├── background.js            # Script to handle extension background tasks
├── content.js               # Main script for detecting and converting currencies
├── manifest.json            # Extension configuration
├── popup.html               # HTML file for the extension popup
├── popup.js                 # Script for handling popup interactions
├── style.css                # CSS file for styling tooltips and popup
└── README.md                # Project README file
```

## Setup and Installation

### Load the extension in Chrome:

1. Open Chrome and go to chrome://extensions/.
2. Enable "Developer mode" using the toggle switch in the top right corner.
3. Click on "Load unpacked" and select the directory where you cloned the repository.

### Activate the extension:
1. Click on the extension icon in the Chrome toolbar.
2. Use the toggle switch in the popup to enable or disable currency conversion.
## Usage
Hover over any price tag: When the extension is enabled, hovering over any price tag in a supported currency will show a tooltip with the equivalent amount in TWD.
## chatGPT
Randomly generate a list of price tags with the following currency signs: $, €, £, ¥, ₩, ₹, ₽, ₱, ฿, CHF, C$, A$, NZ$, HK$, and S$.
