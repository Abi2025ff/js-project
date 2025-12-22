process.stdin.on("data", (data) => {
    console.log("You typed:", data.toString());
    if(data.toString().trim() == "exit") {
        process.exit();
    }
});