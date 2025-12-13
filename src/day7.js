function canDeploy(balance, isActive) {
    return balance >= 0.5 && isActive === true;
}

function getPremiumstatus(balance, role) {
    if (balance >= 3 || role === "admin") {
        return "Premium"
    };
}

function hasToken(tokens, symbol) {
    return tokens.includes(symbol);
}

console.log("Deploy Access:", canDeploy(3, true));
console.log("User status:", getPremiumstatus(3, "user"));
console.log("Has USDC:", hasToken(["USDC", "BTC", "STRK"], "USDC"));