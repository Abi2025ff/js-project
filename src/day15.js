const readline = require("readline");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let sum = 0;

let i = 1;

process.stdin.on("keypress", (str, key) => {
    sum += i;
    console.log("current sum:", sum);
    i = i*5;
    if (i > 10) {
        process.exit();
    }
});
