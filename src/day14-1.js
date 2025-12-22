const readline = require("readline");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let sum = 0;
let i = 0;

process.stdin.on("keypress", (str, key) => {
    sum += i;
    console.log(`Current sum: ${sum}`);
    i++;
    if (i > 10) {
        process.stdin.setRawMode(false);
        process.stdin.pause();
    }
});
