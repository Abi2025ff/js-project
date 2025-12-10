// array of transactions object

const transactions = [
    { hash: "0x524163", amount: 0.5 },
    { hash: "0x415263", amount: 2.7 },
    { hash: "0x362514", amount: 5.2 }
];

// total amount

let total = 0;

// loop through each transactions

for (const tx of transactions) {
    console.log(`"Transaction", ${tx.hash}`);
    console.log(`"Amount", ${tx.amount}`);
    total += tx.amount;
}

// print final total

console.log(`\nTotal ETH sent: ${total} ETH`);
