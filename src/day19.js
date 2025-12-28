const { ethers } = require("ethers");
require("dotenv").config({ path: "../.env" });

async function getBalance() {
    const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);

    const address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // Example wallet
    const balanceWei = await provider.getBalance(address);

    const balanceEth = ethers.formatEther(balanceWei);
    console.log("Balance:", balanceEth, "ETH");
}

getBalance()
