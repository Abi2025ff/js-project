const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "..", "data");
const dataFile = path.join(dataFolder, "day22.json");

let arr = [];

if (fs.existsSync(dataFile)) {
    const content = fs.readFileSync(dataFile, "utf-8").trim();
    let parsed = [];

     if (content !== "") {
        parsed = JSON.parse(content);
     }
     
    if (Array.isArray(parsed)) {
        arr = parsed;
    } else {
        arr = [parsed];
    }
}

arr.push({message: "New entry added", timestamp: new Date().toISOString()});

fs.writeFileSync(dataFile,JSON.stringify(arr, null, 2));