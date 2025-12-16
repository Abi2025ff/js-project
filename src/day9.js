async function fetchPrices() {

        const responce = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        
        if(!responce.ok) {
            throw new Error(`API error: ${responce.status} ${responce.statusText}`);
        }

        const data = await responce.json();

        return { btc: data.bitcoin.usd, eth: data.ethereum.usd };
};


async function main() {
    console.log("fetching crypto prices...");

    const prices = await fetchPrices();

    console.log("Prices fetched:");
    console.log(`-BTC: $${prices.btc}`);
    console.log(`-ETH: $${prices.eth}`);
}

main().catch(console.error)