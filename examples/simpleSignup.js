const Prompt = require('input-prompt');

// ES6
(async () => {
    const email = await Prompt("Email: ");
    const password = await Prompt("Password: ", { replaceCharacter: "*" });
    if(!email || !password)
        return console.log("invalid fields.");
    console.log(`Successful login as ${email} with password: ${password}`);
})();
// ES5
Prompt("Email: ").then(email => {
    Prompt("Password: ", { replaceCharacter: "*" }).then(password => {
        if(!email || !password)
            return console.log("invalid fields.");
        console.log(`Successful login as ${email} with password: ${password}`);
    });
});