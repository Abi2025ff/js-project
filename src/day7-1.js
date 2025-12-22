const name = "Global";

function test() {
    const name = "Local";
    console.log("Inside:", name);
}

test();
console.log("Outside:", name);
