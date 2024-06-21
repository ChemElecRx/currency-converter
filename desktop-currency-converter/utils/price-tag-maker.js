// List of extended currency signs
const extendedCurrencies = ['$', '€', '£', '¥', '₩', '₹', '₽', '₱', '฿', 'CHF', 'C$', 'A$', 'NZ$', 'HK$', 'S$'];

// Function to generate a random price with a currency sign from the list
function generateRandomPrice() {
    const amount = (Math.random() * (1000 - 1) + 1).toFixed(2);
    const currency = extendedCurrencies[Math.floor(Math.random() * extendedCurrencies.length)];
    return `${currency}${amount}`;
}

// Generate a list of 10 random price tags
let priceTags = Array.from({ length: 10 }, () => generateRandomPrice());

// Convert priceTags to a string of <p> tags
let priceTagsHTML = priceTags.map(tag => `<p>${tag}</p>`).join('');

// Output the list of price tags
console.log(priceTags);

// Later use: document.div.innerHTML = priceTagsHTML; to display in HTML
document.getElementById('priceContainer').innerHTML = priceTagsHTML;