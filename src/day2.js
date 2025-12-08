function canDeploy(balance) {
    return balance >= 2;
}

function getWalletStatus(address, balance) {
    const status = canDeploy(balance) ? "READY" : "LOW_BALANCE";
    return `Wallet ${address} has ${balance}ETH. Status: ${status}`;
}

const myBalance = 1.8;

console.log("Can deploy" , canDeploy(myBalance));
console.log(getWalletStatus("0x742d35Cc6634C0532925a3b8D4C9db4C2A8e7a12", myBalance));

// const name = "abi";
// const greeting = `Hello, ${name}!`;