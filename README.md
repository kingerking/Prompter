# Input Promptify
A collections of command-line prompt utilities,
written to be async in nature. medium getting started tutorial [here](https://medium.com/@kkingerkyle/everything-you-need-to-know-about-node-js-prompts-57301272e64b)

## features: 
 - Non blocking prompting model.
 - Character replacing (much like a password field in nature).
 - Basic Selections.
 - Multi Selectable Selections.
 - Enhanced styling.
 - Prompt Grouping.
 - Basic keyboard event system.

## planned features:
 - Advanced Prompt Groups.
 - Javascript Regular expression string filtering.
 - More advanced event system.
 - Prompt Group event system integration.
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
### Prompt Groups
Prompt Groups are a useful feature, they have many planned features and are a way of unifying prompt options and large group's of prompts. Here is a basic PromptGroup that contains one simple Prompt and a single selection Prompt.
```
(callback => Prompt(group => {
    group.Prompt("email", chalk.green("Email "));
    group.Prompt("lang", chalk.green("Favorite Language"), {
        selectable: ["English", "French", "Spanish"]
    });

}).then(callback))(returnedData => {
    console.log("== Form summery ==");
    console.log("users email: ", returnedData.email);
    console.log("users favorite language: ", returnedData.lang.value);
});
```
This will invoke each defined Prompt one-by-one in order of definition. PromptGroups also offer a additional feature that can be useful in larger group's of Prompts, You can define default Prompt Options, for an example we will rewrite the previous snippet except we will be adding a new multi selectable selection and apply default styling to the group.
```
(callback => Prompt(group => {
    
    group.apply({
        styling: {
            // a nice yellow / orange color.
            focusedColor: { r: 220, g: 165, b: 0 }
        }
    });
    group.Prompt("email", chalk.green("Email "));

    group.Prompt("lang", chalk.green("Favorite Language"), {
        selectable: ["English", "French", "Spanish"]
    });
    
    group.Prompt("gender", chalk.green("What are you? "), {
        selectable: ["Male", "Female", "Apache attack helicopter"]
    });

}).then(callback))(returnedData => {
    console.log("== Form summery ==");
    console.log("users email: ", returnedData.email);
    console.log("users favorite language: ", returnedData.lang.value);
    console.log("You are a: ", returnedData.gender.value);
});
```
### Important Note about the use of PromptGroups
PromptGroups cannot refer to the values of previous Prompts within the same group by regular convention, due to this limitation, I have added String templating to use the current return model state as a template model. Here is a example that is written "without" PromptGrouping, we will recreate this with PromptGroup's.
```
(async () => {
    const name = await Prompt(chalk.green("Name "));
    const gender = await Prompt(chalk.green(`can you pick your gender ${name}?`), {
        selectable: ['Male', 'Female']
    });

    console.log('Finished!');
})();
```
This will work fine(this doesnt use PromptGroup's), in order to get the same result with a PromptGroup you simple use a string template, to get the value of previous prompt with the name of "email" you would use: **{email}** instead of ${email}. To further show this in action, we will do the same as the previous snippet like this:
```
const form = callback => Prompt(form => {

    form.Prompt('name', chalk.green("Name "));
    
    form.Prompt('gender', chalk.green(`can you pick your gender {name}?`), {
        selectable: ['Male', 'Female']
    });

}).then(callback);

form(data => {
    console.log("Finished!");
});

```
### Advanced PromptGroup use cases
The features available to PromptGroups is ever expanding, One cool feature of witch is similar to that of the string templating we previously talked about. If you require to do some more advanced stuff with the previous prompt return data you can. You can use a PromptGroup feature known as PDPF's(Post definition Prompt Factory's), Post Prompt definition Factories are factory functions defined within a group factory function. The function we want in this case is the **group.requires()** function.

This function simply takes two arguments(Array,Function), The array being an array of strings each of witch contains a name of a previous Prompt in the group. After passing these required value's then you have to define a Prompt factory function witch simply is a function that takes a argument that the PromptGroup will pass to it, The object is called a Value Buffer witch simply is a chunk of PromptGroup values(kind of like a small version of the PromptGroup return object).
###### Example
For example you need more then simply a value from the previous Prompts, You want to make a simple substring of the values. In this case you would need to use the **group.requires()** PDPF, here is an example of displaying different Prompt selectable fields based on what the user typed for their email.
```
(callback => Prompt(group => {
    
    group.Prompt('email', "Email ");

    group.requires(["email"], values => {
        
        const accountActions = ["Create Account", "Delete Account"];
        if(values.email == "test@test.com")
            accountActions.push("Ban someone");

        // please note that you are not required to create a prompt in this function if you dont want to.
        group.Prompt('action', `Here are some actions available for ${values.email}`, {
            selectable: accountActions
        });
    });

}).then(callback))(returnedData => {
    console.log("finished form.");
});
```
This example is rather boring and useless but using the **group.requires()** PDPF function can dramatically increase the useability of your application and create a clean coding experience.