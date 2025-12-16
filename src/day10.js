const fs = require("fs");

async function fetchPrices() {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
  );

  if (!response.ok) {
    throw new Error("API error");
  }

  const data = await response.json();

  return {
    btc: data.bitcoin.usd,
    eth: data.ethereum.usd
  };
}

async function main() {
  const prices = await fetchPrices();

  const record = {
    ...prices,
    time: new Date().toISOString()
  };

  let history = [];

  if (fs.existsSync("prices.json")) {
    const file = fs.readFileSync("prices.json", "utf-8");
    history = JSON.parse(file);
  }

  history.push(record);

  fs.writeFileSync("prices.json", JSON.stringify(history, null, 2));

  console.log("Saved:", record);
}

main().catch(console.error);
