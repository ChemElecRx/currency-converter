let isConversionActive = false;

async function getExchangeRates() {
  let response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  let data = await response.json();
  return data.rates;
}

function detectAndConvertCurrency(text, rates, twdRate) {
  // Updated regex to include more currency symbols
  let currencyRegex = /(\$|€|£|¥|₩|₹|₽|₱|฿|CHF|C\$|A\$|NZ\$|HK\$|S\$)\s?(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?)/g;

  function convertToTWD(match, symbol, amount) {
    amount = parseFloat(amount.replace(/,/g, ''));
    let currency;
    switch (symbol) {
      case '$': currency = 'USD'; break;
      case '€': currency = 'EUR'; break;
      case '£': currency = 'GBP'; break;
      case '¥': currency = 'JPY'; break;
      case '₩': currency = 'KRW'; break;  // South Korean Won
      case '₹': currency = 'INR'; break;  // Indian Rupee
      case '₽': currency = 'RUB'; break;  // Russian Ruble
      case '₱': currency = 'PHP'; break;  // Philippine Peso
      case '฿': currency = 'THB'; break;  // Thai Baht
      case 'CHF': currency = 'CHF'; break;  // Swiss Franc
      case 'C$': currency = 'CAD'; break;  // Canadian Dollar
      case 'A$': currency = 'AUD'; break;  // Australian Dollar
      case 'NZ$': currency = 'NZD'; break;  // New Zealand Dollar
      case 'HK$': currency = 'HKD'; break;  // Hong Kong Dollar
      case 'S$': currency = 'SGD'; break;  // Singapore Dollar
      default: currency = 'USD';  // Default to USD if symbol not recognized
    }

    let usdAmount = amount / rates[currency];
    let twdAmount = usdAmount * twdRate;
    return `${twdAmount.toFixed(2)} TWD`;
  }

  return text.replace(currencyRegex, convertToTWD);
}

async function addHoverListeners() {
  let rates = await getExchangeRates();
  let twdRate = rates.TWD;

  document.body.addEventListener('mouseover', function(event) {
    if (!isConversionActive) return;

    let target = event.target;
    if (target.nodeType === Node.ELEMENT_NODE) {
      let text = target.innerText;
      let convertedText = detectAndConvertCurrency(text, rates, twdRate);
      if (convertedText !== text) {
        showTooltip(target, convertedText);
      }
    }
  });

  document.body.addEventListener('mouseout', function(event) {
    removeTooltip();
  });
}

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

function removeTooltip() {
  let tooltip = document.getElementById('currency-tooltip');
  if (tooltip) {
    document.body.removeChild(tooltip);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleConversion') {
    isConversionActive = !isConversionActive;
  }
});

window.addEventListener('load', addHoverListeners);
