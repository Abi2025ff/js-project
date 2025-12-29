const fs = require("fs");
const path = require("path");

const DataFolder = path.join(__dirname, "..", "data");
const dataFile = path.join(DataFolder, "day23.json");

const CRYPTO_MAP = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  ADA: "cardano",
  DOT: "polkadot",
  AVAX: "avalanche",
  LINK: "chainlink",
  MATIC: "polygon",
  XRP: "ripple",
  DOGE: "dogecoin",
};

const crypto = process.argv[2];
const currency = process.argv[3];

if (!crypto || !currency) {
  console.error("Usage: node day23.js <CRYPTO_SYMBOL> <CURRENCY_CODE>");
  process.exit(1);
}

const fullname = CRYPTO_MAP[crypto.toUpperCase()];

async function checkPrice() {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${fullname}&vs_currencies=${currency.toLowerCase()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (!data[fullname] || !data[fullname][currency.toLowerCase()]) {
      throw new Error("Invalid response from API");
    }
    const price = data[fullname][currency.toLowerCase()];
    console.log(
      `The current price of ${crypto.toUpperCase()} in ${currency.toUpperCase()} is: ${price}`
    );

    let history = [];
    try {
      const fileContent = fs.readFileSync(dataFile, "utf-8");
      history = JSON.parse(fileContent);
    } catch (error) {
      history = [];
    }

    history.push({
      crypto: crypto.toUpperCase(),
      currency: currency.toUpperCase(),
      price: price,
      time: new Date().toISOString(),
    });

    fs.writeFileSync(dataFile, JSON.stringify(history, null, 2));
    console.log("Price history updated.");
  } catch (error) {
    console.error("Error fetching price:", error.message);
    process.exit(1);
  }
}

checkPrice();
