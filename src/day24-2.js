class PriceConverter {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30000;
  }

  // Convert API string prices to numbers safely
  // Безопасно преобразовать строковые цены API в числа
  convertApiPrices(apiData) {
    const converted = {};

    for (const [token, priceStr] of Object.entries(apiData)) {
      const price = parseFloat(priceStr);

      if (isNaN(price)) {
        console.error(`Invalid price for ${token}: ${priceStr}`);
        converted[token] = 0;
      } else {
        converted[token] = price;
      }
    }

    return converted;
  }

  // Calculate portfolio value with type safety
  // Рассчитать стоимость портфолио с безопасностью типов
  calculatePortfolioValue(portfolio, prices) {
    return portfolio.reduce((total, asset) => {
      const balance = parseFloat(asset.balance);
      const price = prices[asset.token.toLowerCase()];

      if (isNaN(balance) || isNaN(price)) {
        console.warn(`Invalid data for ${asset.token}`);
        return total;
      }

      return total + balance * price;
    }, 0);
  }
}

// Usage example
// Пример использования
const converter = new PriceConverter();
const apiPrices = { eth: "2964.67", sol: "125.19", btc: "43210.56" };
const convertedPrices = converter.convertApiPrices(apiPrices);

const portfolio = [
  { token: "ETH", balance: "2.5" },
  { token: "SOL", balance: "10" },
  { token: "BTC", balance: "0.1" },
];

const totalValue = converter
  .calculatePortfolioValue(portfolio, convertedPrices)
  .toFixed(3);
console.log("Total Portfolio Value:", totalValue);
