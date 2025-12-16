async function fetchPrices() {
    try {
        const responce = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        
        if(!responce.ok) {
            throw new Error(`API error: ${responce.status} ${responce.statusText}`);
        }

        const data = await responce.json();

        const btcPrice = data.bitcoin.usd;
        const ethPrice = data.ethereum.usd;

        return { btc: btcPrice, eth: ethPrice };
    } catch (error) {
        console.error("Failed to fetch prices:", error.message);
        throw error
    }
}


async function main() {
    console.log("fetching crypto prices...");

    const prices = await fetchPrices();

    console.log("Prices fetched:");
    console.log(`-BTC: $${prices.btc}`);
    console.log(`-ETH: $${prices.eth}`);
}

main().catch(console.error)