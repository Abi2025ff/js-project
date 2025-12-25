const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const commands = {
    SAY: (args) => {
        console.log(args.join(" "));
    },

    ADD: (args) => {
        const a = Number(args[0]);
        const b = Number(args[1]);
        console.log("Result:", a + b);
    },

    QUIT: () => {
        console.log("Goodbye!");
        rl.close();
        process.exit(0);
    }
};

function getUserInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function main() {
    console.log("Commands: SAY text | ADD a b | QUIT");

    while (true) {
        const input = await getUserInput("> ");
        const upper = input.toUpperCase();

        const parts = upper.split(" ");
        const command = parts[0].toUpperCase();
        const args = parts.slice(1);

        if (commands[command]) {
            commands[command](args);
        } else {
            console.log("Unknown command");
        }
    }
}

main();
