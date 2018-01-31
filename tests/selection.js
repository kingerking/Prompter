const Prompt = require('../index');

(async () => {
    const name = await Prompt("name; ");
    // console.log("got name: ", name);
    console.log();
    console.log();
    const nameSelection = await Prompt("Please pick your favorite name", {
        // styling: {
        //     selectedColor: "yellow",
        //     nonSelectedColor: "blue"
        // },
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
    
    const password = await Prompt("Please type a dummy password: ", { replaceCharacter: "*" });

    console.log();
    console.log();
    console.log('form summery:');
    console.log('name:', name);
    console.log('password:', password);
    console.log('name selection:', nameSelection.value);
    console.log('fav person selection:', favPerson.value);

})();