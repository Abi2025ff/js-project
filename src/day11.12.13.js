const fs = require("fs");
const path = require("path");

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
  const prices = await fetchPrices()
  const record = {
    ...prices,
    time: new Date().toISOString()
  };

  const FILE_PATH = path.join(__dirname, "prices2.json");

  let history = [];

  if (fs.existsSync(FILE_PATH)) {
    try {
      const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
      
      if (fileContent.trim() !== "") {
        history = JSON.parse(fileContent);
      }
    } catch (error) {
      console.log("🔍 DEBUG: JSON parse error:", error.message);
      history = [];
    }
  }

  
  history.push(record);

  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error("❌ ERROR: Failed to write file:", error.message);
  }
}

main().catch(console.error);