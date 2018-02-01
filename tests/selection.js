const Prompt = require('../index');
const chalk = require('chalk');

const styling = {
    selectedColor: {r: 100, g: 100, b: 100},
    focusedColor: {r: 175, g: 175, b: 175},
    nonSelectedColor: {r: 255, g: 255, b: 255}
};

(async () => {
    const name = await Prompt("full name: ");
    console.log();
    const gender = await Prompt("Whats your gender?", { styling, selectable: ["Male", "Female"] });
    console.log("\n");
    const enable = await Prompt("Pick what feature you want to enable (space to select, enter to confirm selection)", {
        styling,
        multiSelection: true,
        selectable: [ "Api", "Frontend", "database", "basic" ]
    });
    console.log("\n");
    const password = await Prompt("Set your password: ", { replaceCharacter: "*" });

    console.log("form summery");
    console.log("name: ", name);
    console.log("gender: ", gender.value);
    console.log("enabled features: ", enable.map(v => v.value));
    console.log('password: ', password);


})();