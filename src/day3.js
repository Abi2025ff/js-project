const tokens = ["eth, usdc, wbtc"];
const recentTransactions = [
    "0xsv5642...",
    "0xeg5546...",
    "0xf2v56f..."
];

tokens.push("btc");
recentTransactions.push("0x5236522");
tokens.unshift("aia");


// object

const myWallet = {
    address: "0x5235422",
    balance: 2.5,
    tokens: ["ETH","USDC"]
};
 
// add a new token

myWallet.tokens.push("USDT");


console.log("My wallet", myWallet.address);
console.log("Balance", myWallet.balance);
console.log(recentTransactions);


