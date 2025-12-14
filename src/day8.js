async function main() {
  console.log("1. Start");
  const price = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
  const data = await price.json();
  console.log("2. ETH Price:", data.ethereum.usd, "USD");
  console.log("3. Done");
}

main().catch(console.error);