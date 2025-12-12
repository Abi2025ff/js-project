const Wallet = {
    address: "0x635241",
    balance: 55,
    isActive: true,
    role: "admin",
    tokens: ["ETH", "BTC", "USDC"]
};

const canDeploy = Wallet.balance >= 2 && Wallet.isActive;
const isPremium = Wallet.balance >= 100 || Wallet.role === "admin";
const hasAdminAccess = Wallet.role === "admin" || Wallet.role === "moderator";
const ownsUSDC = Wallet.tokens.includes("USDC");

console.log("WALLET VALIDATION REPORT");
console.log(`-Address: ${Wallet.address}`);
console.log(`-Balance: ${Wallet.balance}`);
console.log(`-Status: ${Wallet.isActive ? "Active" : "InActive"}`);
console.log(`\nDeploy Access: ${canDeploy ? "Granted" : "Denied"}`);
console.log(`premium Status: ${isPremium ? "Yes" : "No"}`);
console.log(`Admin Access ${hasAdminAccess ? "Granted" : "Denied"}`);
console.log(`Owns USDC ${ownsUSDC ? "Yes" : "No"}`);
