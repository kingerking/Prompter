# Input Promptify
A collections of command-line prompt utilities,
written to be async in nature.

## features: 
 - Non blocking Basic prompting
 - Character replacing (much like a password field in nature)
 - Basic Selections
 - Multi Selectable Selections
 - Enhanced styling

## planned features:
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
### Selections
Selections are a important part of prompts / cli forms, input-promptify supports two types of selections.
1. Single selectable selections
2. Multi selectable selections
###### Single selectable selections
These are simple selections, a Array of *selectable* elements is passed into the Prompt function witch will
instantiate a new single selectable selection instance. The supplied selectable's will be displayed in
list format, user will navigate list with arrow buttons and make their selection when the enter key is pressed.

When the prompt is submitted by the user, the Prompt function will resolve with a *Selection Object*.
###### Multi selectable selections
All rules are enfored here from *Single selectable selections* except in order to instantiate a multi selectable selection you must set the property *multiSelection* to true. items can be toggled(selected and unselected) by pressing the space bar, when user is ready to continue they can press enter.

When  multi selectable selections resolve, they resolve with an Array of Selection Objects, each describing a selection the user made.
###### Selection Objects
A selection object is whats returned from a selection operation. its make is as follows:
```
{
    index: <The index of the value>,
    value: <The value of the selection>
}
```

<!-- Some examples of Selections -->
#### Simple single selectable selection example
#### ES6
```
const Prompt = require('input-promptify');
(async () => {
    const gender = await Prompt("Gender", { selectable: ["Male", "Female", "Other"] });
    console.log(gender);
})();
```
#### ES5
```
const Prompt = require('input-promptify);
Prompt("Gender", { selectable: selectable: ["Male", "Female", "Other"] }).then(console.log);
```
### Simple multi selectable selection example
#### ES6
```
const Prompt = require('input-promptify');
(async () => {
    const languages = await Prompt("Select the programming languages you know(space to selection, enter to continue)", {
        multiSelection: true,
        selectable: [
            "php",
            "javascript",
            "c++",
            "java",
            "python"
        ]
    });
    console.log(languages);
})();
```
#### ES5
```
const Prompt = require('input-promptify');
Prompt("Select the programming languages you know(space to selection, enter to continue)", {
    multiSelection: true,
    selectable: [
        "php",
        "javascript",
        "c++",
        "java",
        "python"
    ]
}).then(console.log);
```