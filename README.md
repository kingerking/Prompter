# Input Promptify
A collections of command-line prompt utilities,
written to be async in nature.

## features: 
 - Non blocking Basic prompting
 - Character replacing (much like a password field in nature)

## planned features:
 - Selection's
 - Javascript Regular expression string filtering
 - Ability to have multiple prompts open at a time in a column based style
 - More features to come, if you want to request a feature please open an issue.

## Installation 
#### npm
`npm i -s input-promptify`

#### yarn
`yarn add input-promptify`

## Usage
#### Basic prompting
##### ES6

    const Prompt = require('input-promptify');

    (async () => {
        const testData = await Prompt("Whats your name? ");
        console.log(testData);
    })();
##### ES5
    const Prompt = require('input-promptify');
    Prompt("Whats your name? ").then(console.log); 

#### Replace characters
If you want to grab input without showing the user what their typing you can use replace characters.
##### ES6
    const Prompt = require('input-promptify');
    (async () => {
        const test = await Prompt("Whats your secret name? ", { replaceCharacter: "*" });
        console.log(test);
    })();
##### ES5
    const Prompt = require('input-promptify');
    Prompt("Whats your secret name? ", { replaceCharacter: "*" }).then(console.log);
#### combining the previous examples to make a simple signup template
#### ES6
    const Prompt = require('input-promptify');
    (async () => {
        const email = await Prompt("Email: ");
        const password = await Prompt("Password: ", { replaceCharacter: "*" });
        if(!email || !password)
            return console.log("invalid fields.");
        console.log(`Successful login as ${email} with password: ${password}`);
    })();
##### ES5
    const Prompt = require('input-promptify');
    Prompt("Email: ").then(email => {
        Prompt("Password: ", { replaceCharacter: "*" }).then(password => {
            if(!email || !password)
                return console.log("invalid fields.");
            console.log(`Successful login as ${email} with password: ${password}`);
        });
    }); 