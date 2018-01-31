const _ = require('lodash');
const readline = require('readline');

let currentPrompt = null;
let readInput = false;

// weather or not to display current buffer on screen
let blockOutput = false;
let inputCharacterOverride = null;
let prefix = "";

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
// buffer is whats displayed, return buffer is whats returned.
// useful for replaceCharacters
let textToRender = [], returnBuffer = [];

function startLine ()
{
    process.stdout.write(prefix);
}

function render() {
    process.stdout.write(prefix);
    process.stdout.write(textToRender.join(''));
}

process.stdin.on('keypress', (str, key) => {
    if(!readInput) return;
    let didBackspace = false;
    if(key.ctrl && key.name == 'c')
    {
        process.exit(0);
        return;
    } else if(key.name == "return")
    {
        // this is for new line. dont remove
        console.log();
        if(!!currentPrompt)
            currentPrompt(returnBuffer.join("").trim());

        return;
    }else if(key.name == "backspace")
    {
        textToRender.pop();
        
        returnBuffer[returnBuffer.length - 1] = null;
        returnBuffer = _.without(returnBuffer, null);

        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, -1);
        render();
        return;
    }
    
    // textToRender = _.without(
    //     _.map(textToRender, element => element == " " ? null : element), null
    // );
        

    textToRender.push( !!inputCharacterOverride ? inputCharacterOverride : str);
    returnBuffer.push(str);

    // if(!blockOutput)
    // {
    
    
    readline.cursorTo(process.stdout, 0);
    render();


    // }
});


const baseOptions = {
    replaceCharacter: null,
};

module.exports = (base = "", options = baseOptions) => {

    const promise = new Promise(resolve => {
        // if someone only wants to change one thing in options this allows users to do so.
        options = _.merge(baseOptions, options);
        if(base) 
            prefix = base;
        else prefix = "";
        startLine();
        // configure prompt
        // blockOutput = !!options.inputCharacterOverride;
        inputCharacterOverride = !!options.replaceCharacter ? options.replaceCharacter : null;
        currentPrompt = data => {
            process.stdin.setRawMode(false);
            readInput = false;
            process.stdin.pause();
            resolve(data);
        };
        // reset buffer.
        textToRender = [];
        returnBuffer = [];
        process.stdin.setRawMode(true);
        readInput = true;
        process.stdin.resume();
    });


    return promise;
};
