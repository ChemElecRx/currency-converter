let isConversionActive = false;

async function getExchangeRates() {
  let response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  let data = await response.json();
  return data.rates;
}

function detectAndConvertCurrency(text, rates, twdRate) {
  let currencyRegex = /(\$|€|£|¥)\s?(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?)/g;

  function convertToTWD(match, symbol, amount) {
    amount = parseFloat(amount.replace(/,/g, ''));
    let currency;
    switch (symbol) {
      case '$': currency = 'USD'; break;
      case '€': currency = 'EUR'; break;
      case '£': currency = 'GBP'; break;
      case '¥': currency = 'JPY'; break;
      default: currency = 'USD';
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
