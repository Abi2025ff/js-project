const readline = require("readline");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let count = 0;
let second = 0;

setInterval(() => {
    second = second + 1;
    console.log("Seconds:", second);
}, 3000);

process.stdin.on("keypress",(str, key) => {
    if (key.name === "q") {
        count = count +1;
        console.log("Count:", count);
    }

    if (key.name === "return") {
        console.log("Exit");
        process.exit();
    }
});
