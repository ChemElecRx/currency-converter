// renderer.js

// Wait for the window to finish loading
window.addEventListener('load', () => {
  // Retrieve electronAPI from the window object exposed by preload.js
  const { electronAPI } = window;

  // Flag to track if currency conversion is active
  let isConversionActive = false;

  // Function to fetch exchange rates from an API (example)
  async function getExchangeRates() {
    try {
      let response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      let data = await response.json();
      return data.rates;
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      return null;
    }
  }

  // Function to detect and convert currency based on rates
  function detectAndConvertCurrency(text, rates, twdRate) {
    let currencyRegex = /(\$|€|£|¥|₩|₹|₽|₱|฿|CHF|C\$|A\$|NZ\$|HK\$|S\$)\s?(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?)/g;

    function convertToTWD(match, symbol, amount) {
      amount = parseFloat(amount.replace(/,/g, ''));
      let currency;
      switch (symbol) {
        case '$': currency = 'USD'; break;
        case '€': currency = 'EUR'; break;
        case '£': currency = 'GBP'; break;
        case '¥': currency = 'JPY'; break;
        case '₩': currency = 'KRW'; break;
        case '₹': currency = 'INR'; break;
        case '₽': currency = 'RUB'; break;
        case '₱': currency = 'PHP'; break;
        case '฿': currency = 'THB'; break;
        case 'CHF': currency = 'CHF'; break;
        case 'C$': currency = 'CAD'; break;
        case 'A$': currency = 'AUD'; break;
        case 'NZ$': currency = 'NZD'; break;
        case 'HK$': currency = 'HKD'; break;
        case 'S$': currency = 'SGD'; break;
        default: currency = 'USD'; // Default to USD if symbol not recognized
      }

      let usdAmount = amount / rates[currency];
      let twdAmount = usdAmount * twdRate;
      return `${twdAmount.toFixed(2)} TWD`;
    }

    return text.replace(currencyRegex, convertToTWD);
  }

  // Function to add hover listeners to elements in the document body
  async function addHoverListeners() {
    let rates = await getExchangeRates(); // Fetch exchange rates
    let twdRate = rates.TWD; // Get TWD exchange rate

    document.body.addEventListener('mouseover', function(event) {
      if (!isConversionActive) return;

      let target = event.target;
      if (target.nodeType === Node.ELEMENT_NODE) {
        let text = target.innerText;
        let convertedText = detectAndConvertCurrency(text, rates, twdRate);
        if (convertedText !== text) {
          showTooltip(target, convertedText); // Show tooltip if currency converted
        }
      }
    });

    document.body.addEventListener('mouseout', function(event) {
      removeTooltip(); // Remove tooltip on mouseout
    });
  }

  // Function to show tooltip for converted currency
  function showTooltip(target, convertedText) {
    let tooltip = document.createElement('div');
    tooltip.id = 'currency-tooltip';
    tooltip.innerText = convertedText;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#fff';
    tooltip.style.border = '1px solid #000';
    tooltip.style.padding = '5px';
    tooltip.style.zIndex = 1000;
    tooltip.style.pointerEvents = 'none';

    let rect = target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.top + window.scrollY - 30}px`;

    document.body.appendChild(tooltip);
  }

  // Function to remove tooltip from the document
  function removeTooltip() {
    let tooltip = document.getElementById('currency-tooltip');
    if (tooltip) {
      document.body.removeChild(tooltip);
    }
  }

  // Event listener to toggle currency conversion activation
  electronAPI.toggleConversion(() => {
    isConversionActive = !isConversionActive;
  });

  // Initialize hover listeners when the window has loaded
  addHoverListeners();
});
