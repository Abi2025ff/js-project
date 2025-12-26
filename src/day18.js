const EventEmitter = require("events");
const readline = require("readline");

const emitter = new EventEmitter();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

emitter.on("userInput", (text) => {
    console.log("You typed:", text);

    if (text === "exut") {
        console.log("Program finished");
        rl.close();
        process.exit(0);
    }
});

function ask() {
    rl.question(">", (answer) => {
        emitter.emit("userInput", answer.trim());
        ask();
    })
}

ask();