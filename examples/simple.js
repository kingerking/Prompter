const Prompt = require('input-prompt');
// ES6
(async () => {
    const testData = await Prompt("Whats your name? ");
    console.log(testData);
})();
// ES5 promise's 
Prompt("Whats your name? ").then(console.log);