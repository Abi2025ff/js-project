const ethers = require("ethers");
const path = require("path");
const fs = require("fs");
const readline = require("readline");
require("dotenv").config({ path: "../.env" });
    
const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
});

function getAnswer(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
        resolve(answer.trim());
    });
})
}

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

if (!ALCHEMY_API_KEY) {
    console.error("Error: ALCHEMY_API_KEY is not set in environment variables.");
    process.exit(1);
}

const dataFolder = path.join(__dirname, "..", "data");
const dataFile = path.join(dataFolder, "day20.21.json");

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
}

function readHistory() {
    try {
        const content = fs.readFileSync(dataFile, "utf-8");
        return JSON.parse(content);
    } catch(error) {
        console.error("Error reading history:", error.message);
        return [];
    }
}


function writeHistory(filePath, history) {
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2), "utf-8");
}


async function getBalance(address) {
   try {
       const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);

       const balanceWei = await provider.getBalance(address);
       const balanceEth = ethers.formatEther(balanceWei);

       return balanceEth;
   }catch(error) {
      throw error;
   }
}


async function fetchCryptoPrice(crypto, currency) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto.toLowerCase()}&vs_currencies=${currency.toLowerCase()}`);

        if (!response.ok) {
           throw new Error(`API error: ${response.status}`); 
        }

        const data = await response.json();

        if (!(data[crypto.toLowerCase()] && data[crypto.toLowerCase()][currency.toLowerCase()])) {
            throw new Error(`Crypto ${crypto} not found or currency ${currency} not supported.`);
        }

        return data[crypto.toLowerCase()][currency.toLowerCase()];
    } catch (error) {
        throw error;
    }
}

async function main() {
    console.log("Welcome");
    console.log("Enter 'quit' to exit\n");

    let history = readHistory();

    while (true) {
        const response = await getAnswer("Choose on option:\n1. Check wallet balance\n2. Fetch crypto price\n3. Clear history\n");

        if (response.toUpperCase() === 'QUIT') {
            console.log("Goodbye!");
            rl.close();
            break;
        }

        if (response === '1') {
            const address = await getAnswer("Enter your wallet address:");

            if (address.toUpperCase() === 'QUIT') {
                console.log("Goodbye!");
                rl.close();
                break;
            }

            if (!ethers.isAddress(address)) {
                console.log("Invalid address. Please try again. make sure that the address consists of 42 characters.");
                continue;
            }

            try {
                console.log("Fetching balance...");
                const balance = await getBalance(address);
                console.log(`Wallet balance: ${balance} ETH`);


               history.push({
                    type: "balance",
                    address: address,
                    balance: balance,
                    time: new Date().toISOString()
               });

                writeHistory(dataFile, history);

            } catch(error) {
                console.error("Error:", error.message);
            }
        } else if (response === '2') {
            const crypto = await getAnswer("Enter crypto ticker (e.g., BTC, ETH, SOL):");

            if (crypto.toUpperCase() === 'QUIT') {
                console.log("Goodbye!");
                rl.close();
                break;
            }

            const currency = await getAnswer("Enter target currency (e.g., USD, EUR, GBP):");

            if (currency.toUpperCase() === 'QUIT') {
                console.log("Goodbye!");
                break;
            }

            try {
                console.log("Fetching price...");
                const price = await fetchCryptoPrice(crypto.toUpperCase(), currency.toUpperCase());
                console.log(`${crypto} price: ${price} ${currency.toUpperCase()}`);

                history.push({
                    type: "price",
                    crypto: crypto.toUpperCase(),
                    currency: currency.toUpperCase(),
                    price: price,
                    time: new Date().toISOString()
                });

                writeHistory(dataFile, history);

            } catch(error) {
            throw error;
            } 
        } else if (response === '3') {
            history = [];
            writeHistory(history);
            console.log("History cleared.");
        } else {
            console.log("Invalid option. Please try again.");
        }
    }
}

main();




