class wallet {
  constructor(balance, currency, owner) {
    this.balance = Number(balance);
    this.currency = currency;
    this.owner = owner;
  }

  deposit(amount) {
    this.balance += amount;
    return this.balance;
  }

  withdraw(amount) {
    if (amount > this.balance) {
      return "Insufficient funds";
    }
    this.balance -= amount;
    return this.balance;
  }
}

const mywallet = new wallet(process.argv[2], process.argv[3], process.argv[4]);

console.log(mywallet.balance);
console.log(mywallet.currency);
console.log(mywallet.owner);
console.log(mywallet.deposit(50));
console.log(mywallet.withdraw(20));
