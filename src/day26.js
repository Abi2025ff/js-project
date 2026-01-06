function decode(message) {
  return message
    .split("")
    .map((char) => {
      if (char >= "a" && char <= "z") {
        const code = char.charCodeAt(0);
        const mirrorecode = 122 - (code - 97);
        return String.fromCharCode(mirrorecode);
      }
      return char;
    })
    .join("");
}

console.log(decode("hello"));
