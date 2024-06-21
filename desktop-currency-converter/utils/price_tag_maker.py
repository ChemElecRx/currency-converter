import random

# List of extended currency signs
extended_currencies = ['$', '€', '£', '¥', '₩', '₹', '₽', '₱', '฿', 'CHF', 'C$', 'A$', 'NZ$', 'HK$', 'S$']

# Function to generate a random price with a currency sign from the list
def generate_random_price():
    amount = round(random.uniform(1, 1000), 2)
    currency = random.choice(extended_currencies)
    return f"{currency}{amount}"

# Generate a list of 10 random price tags
price_tags = [generate_random_price() for _ in range(10)]

# Output the list of price tags
print(price_tags)
