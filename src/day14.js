const fs = require("fs");
const path = require("path");


function getUserInput(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toUpperCase());
    });
  });
}


async function fetchCryptoPrice(crypto, currency) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.toLowerCase()}&vs_currencies=${currency.toLowerCase()}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data[crypto.toLowerCase()]) {
      throw new Error(`Crypto "${crypto}" not found`);
    }

    return data[crypto.toLowerCase()][currency.toLowerCase()];
  } catch (error) {
    throw error;
  }
}

async function main() {
  console.log("Welcome to Crypto Price Checker!");
  console.log("Enter 'quit' to exit\n");

  while (true) {
    const crypto = await getUserInput("Enter crypto ticker (e.g., BTC, ETH, SOL): ");
    
    if (crypto === 'QUIT') {
      console.log("Goodbye!");
      break;
    }

    const currency = await getUserInput("Enter target currency (e.g., USD, EUR, GBP): ");
    
    if (currency === 'QUIT') {
      console.log("Goodbye!");
      break;
    }

    try {
      console.log("Fetching price...");
      const price = await fetchCryptoPrice(crypto, currency);
      
      console.log(`${crypto} price: ${price} ${currency.toUpperCase()}`);
      
      const record = {
        crypto: crypto,
        currency: currency,
        price: price,
        time: new Date().toISOString()
      };

      const FILE_PATH = path.join(__dirname, "crypto-history.json");
      let history = [];

      if (fs.existsSync(FILE_PATH)) {
        try {
          const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
          if (fileContent.trim() !== "") {
            history = JSON.parse(fileContent);
          }
        } catch (error) {
          history = [];
        }
      }

      history.push(record);
      fs.writeFileSync(FILE_PATH, JSON.stringify(history, null, 2));
      
      console.log("Saved to history\n");
    } catch (error) {
      console.error(`Error: ${error.message}\n`);
    }
  }
}
main().catch(console.error);