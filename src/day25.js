// Multi-Exchange Price Aggregator
// Агрегатор курсов по нескольким биржам
class MultiExchangeAggregator {
  constructor() {
    // Initialize cache to store recent API results
    // Инициализировать кэш для хранения недавних результатов API
    this.cache = new Map();
    // Cache timeout: 30 seconds
    // Таймаут кэша: 30 секунд
    this.cacheTimeout = 30000;
  }

  // Fetch price from CoinGecko API
  // Получить курс из API CoinGecko
  async fetchCoinGeckoPrice(crypto) {
    const COINGECKO_IDS = {
      BTC: "bitcoin",
      ETH: "ethereum",
      SOL: "solana",
      ADA: "cardano",
      BNB: "binancecoin",
      XRP: "ripple",
      DOT: "polkadot",
      DOGE: "dogecoin",
    };

    const id = COINGECKO_IDS[crypto.toUpperCase()];
    if (!id) {
      return {
        price: null,
        error: `CoinGecko ID not found for ${crypto}`,
        source: "CoinGecko",
        timestamp: Date.now(),
      };
    }

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const price = data[id]?.usd ?? null;

      return {
        price,
        source: "CoinGecko",
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        price: null,
        error: error.message,
        source: "CoinGecko",
        timestamp: Date.now(),
      };
    }
  }

  // Fetch price from Binance API
  // Получить курс из API Binance
  async fetchBinancePrice(crypto) {
    // Logic: Construct API URL (Binance uses USDT pair)
    // Логика: Построить URL API (Binance использует пару USDT)
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${crypto.toUpperCase()}USDT`;

    try {
      // Logic: Make HTTP request to Binance
      // Логика: Сделать HTTP-запрос к Binance
      const response = await fetch(url);

      // Logic: Check if response is successful
      // Логика: Проверить, успешен ли ответ
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status}`);
      }

      // Logic: Parse JSON response
      // Логика: Разобрать JSON-ответ
      const data = await response.json();

      // Logic: Extract price from Binance response structure
      // Логика: Извлечь цену из структуры ответа Binance
      const price = parseFloat(data.price);

      // Logic: Return normalized data structure
      // Логика: Вернуть нормализованную структуру данных
      return {
        price: price,
        source: "Binance",
        timestamp: Date.now(),
      };
    } catch (error) {
      // Logic: Handle network/API errors gracefully
      // Логика: Грациозно обработать сетевые/ошибки API
      return {
        error: error.message,
        source: "Binance",
        timestamp: Date.now(),
      };
    }
  }

  // Fetch price from Kraken API
  // Получить курс из API Kraken
  async fetchKrakenPrice(crypto) {
    // Logic: Construct API URL for Kraken
    // Логика: Построить URL API для Kraken
    const url = `https://api.kraken.com/0/public/Ticker?pair=${crypto.toUpperCase()}USD`;

    try {
      // Logic: Make HTTP request to Kraken
      // Логика: Сделать HTTP-запрос к Kraken
      const response = await fetch(url);

      // Logic: Check if response is successful
      // Логика: Проверить, успешен ли ответ
      if (!response.ok) {
        throw new Error(`Kraken API error: ${response.status}`);
      }

      // Logic: Parse JSON response
      // Логика: Разобрать JSON-ответ
      const data = await response.json();

      // Logic: Extract price from Kraken response structure (complex nested)
      // Логика: Извлечь цену из структуры ответа Kraken (сложная вложенная)
      const pair = Object.keys(data.result)[0];
      const price = parseFloat(data.result[pair].c[0]);

      // Logic: Return normalized data structure
      // Логика: Вернуть нормализованную структуру данных
      return {
        price: price,
        source: "Kraken",
        timestamp: Date.now(),
      };
    } catch (error) {
      // Logic: Handle network/API errors gracefully
      // Логика: Грациозно обработать сетевые/ошибки API
      return {
        error: error.message,
        source: "Kraken",
        timestamp: Date.now(),
      };
    }
  }

  // Fetch prices from all exchanges in parallel
  // Получить курсы из всех бирж параллельно
  async fetchAllPrices(crypto) {
    // Logic: Use Promise.allSettled to handle individual API failures
    // Логика: Использовать Promise.allSettled для обработки отдельных сбоев API
    const [coingecko, binance, kraken] = await Promise.allSettled([
      this.fetchCoinGeckoPrice(crypto),
      this.fetchBinancePrice(crypto),
      this.fetchKrakenPrice(crypto),
    ]);

    // Logic: Process each result (successful or failed)
    // Логика: Обработать каждый результат (успешный или неудачный)
    const prices = {
      coingecko:
        coingecko.status === "fulfilled" ? coingecko.value : coingecko.reason,
      binance: binance.status === "fulfilled" ? binance.value : binance.reason,
      kraken: kraken.status === "fulfilled" ? kraken.value : kraken.reason,
    };

    return prices;
  }

  // Analyze aggregated price data
  // Анализировать агрегированные данные о курсе
  analyzePriceData(prices) {
    // Logic: Extract successful prices (filter out errors)
    // Логика: Извлечь успешные курсы (отфильтровать ошибки)
    const successfulPrices = Object.values(prices)
      .filter((data) => data.price !== undefined)
      .map((data) => data.price);

    // Logic: Check if we have any valid prices
    // Логика: Проверить, есть ли у нас какие-то валидные курсы
    if (successfulPrices.length === 0) {
      return { error: "No valid prices found from any exchange" };
    }

    // Logic  : Calculate statistical analysis
    // Логика: Рассчитать статистический анализ
    const min = Math.min(...successfulPrices);
    const max = Math.max(...successfulPrices);
    const avg =
      successfulPrices.reduce((sum, price) => sum + price, 0) /
      successfulPrices.length;
    const spread = max - min;

    // Logic: Return comprehensive analysis
    // Логика: Вернуть комплексный анализ
    return {
      min,
      max,
      avg,
      spread,
      count: successfulPrices.length,
      sources: Object.keys(prices).filter(
        (key) => prices[key].price !== undefined
      ),
    };
  }

  // Main aggregation method
  // Основной метод агрегации
  async getAggregatedPrice(crypto) {
    try {
      // Check cache first
      const cacheKey = crypto.toLowerCase();
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.result;
      }

      // Fetch fresh data
      const prices = await this.fetchAllPrices(crypto);
      const analysis = this.analyzePriceData(prices);

      // Ensure analysis has valid data
      // Обеспечить, чтобы анализ имел валидные данные
      if (analysis.error) {
        return {
          crypto,
          prices,
          analysis: { avg: 0, min: 0, max: 0, count: 0 }, // Default safe values
          timestamp: new Date().toISOString(),
        };
      }

      const result = {
        crypto,
        prices,
        analysis,
        timestamp: new Date().toISOString(),
      };

      // Cache the result
      this.cache.set(cacheKey, {
        result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      console.error(
        `Error in getAggregatedPrice for ${crypto}:`,
        error.message
      );
      // Return safe default object
      // Вернуть безопасный объект по умолчанию
      return {
        crypto,
        prices: {},
        analysis: { avg: 0, min: 0, max: 0, count: 0 },
        timestamp: new Date().toISOString(),
      };
    }
  }

  async calculatePortfolioValue(assets) {
    const assetResults = await Promise.all(
      assets.map(async (asset) => {
        try {
          const priceData = await this.getAggregatedPrice(asset.symbol);

          // Check if priceData is valid
          // Проверить, валидны ли priceData
          if (!priceData || !priceData.analysis) {
            console.error(`Failed to get price data for ${asset.symbol}`);
            return {
              symbol: asset.symbol,
              quantity: asset.quantity,
              avgPrice: 0,
              totalValue: 0,
              error: "Failed to fetch price data",
            };
          }

          const avgPrice = priceData.analysis?.avg || 0;
          const totalValue = avgPrice * asset.quantity;

          return {
            symbol: asset.symbol,
            quantity: asset.quantity,
            avgPrice: avgPrice,
            totalValue: totalValue,
            priceSources: priceData.prices,
          };
        } catch (error) {
          console.error(
            `Error processing asset ${asset.symbol}:`,
            error.message
          );
          return {
            symbol: asset.symbol,
            quantity: asset.quantity,
            avgPrice: 0,
            totalValue: 0,
            error: error.message,
          };
        }
      })
    );

    const totalValue = assetResults.reduce(
      (sum, asset) => sum + asset.totalValue,
      0
    );

    return {
      assets: assetResults,
      totalValue,
      timestamp: new Date().toISOString(),
    };
  }
}

// Example usage
// Пример использования
async function main() {
  const aggregator = new MultiExchangeAggregator();

  try {
    // Example 1: Get aggregated price for Bitcoin
    // Пример 1: Получить агрегированный курс для Bitcoin
    console.log("Fetching BTC price from multiple exchanges...");
    const cryptoRaw = process.argv[2];
    const crypto = cryptoRaw.replace(/^['"]|['"]$/g, "");
    const btcResult = await aggregator.getAggregatedPrice(crypto);
    console.log("BTC Aggregated Result:", btcResult);

    // Example 2: Calculate portfolio value
    // Пример 2: Рассчитать стоимость портфолио
    console.log("\nCalculating portfolio value...");
    const portfolio = [
      { symbol: "BTC", quantity: 0.5 },
      { symbol: "ETH", quantity: 2.0 },
      { symbol: "SOL", quantity: 10 },
    ];

    const portfolioValue = await aggregator.calculatePortfolioValue(portfolio);
    console.log("Portfolio Value:", portfolioValue);
  } catch (error) {
    console.error("Error in main function:", error.message);
  }
}

// Run the example
// Запустить пример
main();
