const Prompt = require('input-promptify');
// ES6
(async () => {
    const test = await Prompt("Whats your secret name? ", { replaceCharacter: "*" });
    console.log(test);
})();
//ES5
Prompt("Whats your secret name? ", { replaceCharacter: "*" }).then(console.log);
 