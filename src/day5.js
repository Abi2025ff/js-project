const wallet = {
   address: "0x635241",
   balance: 5.2,
   isActive: true,
   role: "user"
};

if (wallet.balance >= 2 && wallet.isActive) {
    console.log("Can deploy");
}

if (wallet.balance >= 5 || wallet.role === "admin") {
    console.log("Account is premium");
}

if (wallet.role === "admin" || wallet.role === "moderator") {
    console.log("Admin panel access: GRANTED");
} else {
    console.log("Admin panel access: DENIED");
}