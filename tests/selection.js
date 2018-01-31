const Prompt = require('../index');
const chalk = require('chalk');

(async () => {
    const name = await Prompt("name; ");
    // console.log("got name: ", name);
    console.log();
    console.log();
    const nameSelection = await Prompt("Please pick your favorite name", {
        multiSelection: true,
        selectable: [
            "Bob", "Gill", "Kyle", "garry"
        ],
    });
    console.log();
    console.log();
    const favPerson = await Prompt("Please pick your favorite person", {
        selectable: [
            "Jill", "kinger"
        ]
    });
    console.log();
    console.log();
    
    const password = await Prompt(chalk.underline("Please type a dummy password: "), { replaceCharacter: "*" });

    console.log();
    console.log();
    console.log('form summery:');
    console.log('name:', name);
    console.log('password:', password);
    console.log('name selection:', nameSelection);
    console.log('fav person selection:', favPerson);

})();