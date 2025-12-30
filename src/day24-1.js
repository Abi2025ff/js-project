const transactions = [
  { hash: "0x123", amount: 100, token: "ETH", date: "2025-01-01" },
  { hash: "0x456", amount: 50, token: "BTC", date: "2025-01-02" },
  { hash: "0x789", amount: 200, token: "ETH", date: "2025-01-03" },
  { hash: "0xabc", amount: 75, token: "BTC", date: "2025-01-04" },
  { hash: "0xdef", amount: 150, token: "ETH", date: "2025-01-05" },
];

const amounts = transactions.map((tx) => tx.amount);

console.log(amounts);

const withUSD = transactions.map((tx) => ({
  ...tx,
  usdValue: tx.token === "ETH" ? tx.amount * 2000 : tx.amount * 90000,
}));

console.log(withUSD);

const ethTx = transactions.filter((tx) => tx.token === "ETH");

console.log(ethTx);

const largeTx = transactions.filter((tx) => tx.amount > 125);

console.log(largeTx);

const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);

console.log(totalAmount);
