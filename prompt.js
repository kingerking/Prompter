const _ = require('lodash');
const chalk = require("chalk");
const cliCursor = require('cli-cursor');
const readline = require('readline');

let promptOptions = {};
/**
 * Colors must be available to chalk
 */
const baseSelectionStyleOptions = {

    /**
     * Color for the selected fields.
     */
    selectedColor: { r: 129, g: 168, b: 92 },

    /**
     * Color for the non selected fields.
     */
    nonSelectedColor: { r: 255, g: 255, b: 255 },
    /**
     * This feature is only available in a multi selectable selection prompt.
     */
    focusedColor: { r: 155, g: 155, b: 155 },
    /**
     * Color of the header.(user can manually set this if they want.)
     */
    headerColor: {r: 255, g: 255, b: 255}
};

const baseOptions = {
    /**
     * If this is not null it means the user is wanting to create a character filtered field, therefore the character(s) you place in this variable will display in place of a letter when typing.
     */
    replaceCharacter: null,
    // basic selection settings.
    styling: baseSelectionStyleOptions,
    /**
     * If this is not null and an array the system will scheme out a selection prompt.
     * Put an array of available selection options in here that the user can select.
     */
    selectable: null,
    /**
     * Weather or not you can select more the one field.
     */
    multiSelection: false,
    /**
     * Lets external function to be called upon a keyboard event.
     */
    events: new require('events').EventEmitter(),
};

let currentPrompt = null;
let readInput = false;

// weather or not to display current buffer on screen
let blockOutput = false;
let inputCharacterOverride = null;
let prefix = "";
let multiSelectionMode = false;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
// buffer is whats displayed, return buffer is whats returned.
// useful for replaceCharacters
let textToRender = [], returnBuffer = [];

// SELECTION CONTEXT VARIABLES
// what selection the cursor is on.
let focused = 0;
// array of int's pointing to index's of selected selection items
let selected = [];
// if not null the system will create a selection instance.
let selectionFields = null;

function startLine ()
{
    process.stdout.write(prefix);
}

/**
 * Basic input prompt rendering.
 */
function renderInputPrompt() {
    process.stdout.write(prefix);
    process.stdout.write(textToRender.join(''));
}

/**
 * Refresh what to return to user.
 * :NOTE: This will only be used for a non multi section prompt.
 */
function refreshReturnBuffer()
{
    // console.log('updating selected value: ', selectionFields[focused])
    returnBuffer = [ {
        index: focused,
        value: selectionFields[focused].trim()
    } ];
}

/**
 * Will return a chalk function based on selected index, etc..
 * @param {*} selectedColor 
 * @param {*} nonSelectedColor 
 * @param {*} focusedColor 
 * @param {*} index 
 */
function calculateFieldColor(selectedColor, nonSelectedColor, focusedColor, index, out)
{
    if(selected.indexOf(index) !== -1 && focused == index)
    return chalk.bold.rgb(selectedColor.r, selectedColor.g, selectedColor.b)(out);
    if(selected.indexOf(index) !== -1) // this goes before focused so selected color gets priority over focused values
        return chalk.rgb(selectedColor.r, selectedColor.g, selectedColor.b)(out);
    if(focused == index)
        return chalk.bold.rgb(focusedColor.r, focusedColor.g, focusedColor.b)(out);
    return chalk.rgb(nonSelectedColor.r, nonSelectedColor.g, nonSelectedColor.b)(out);
}

function renderSelectionPrompt()
{
    if(!selectionFields)
    {
        console.log(chalk.red("Tried rendering selection prompt without a buffer to render..."));
        process.exit(1);
    }
    

    readline.clearScreenDown(process.stdout);
    // process.stdout.write('\n');
    selectionFields.forEach((field, index) => {
        readline.cursorTo(process.stdout, -1);
        process.stdout.write(
            calculateFieldColor(
                !!promptOptions.styling.selectedColor ? promptOptions.styling.selectedColor : baseSelectionStyleOptions.selectedColor, 
                !!promptOptions.styling.nonSelectedColor ? promptOptions.styling.nonSelectedColor : baseSelectionStyleOptions.nonSelectedColor, 
                !!promptOptions.styling.focusedColor ? promptOptions.styling.focusedColor : baseSelectionStyleOptions.focusedColor, 
                index, field
            ) + '\n'
        ); 
    });
    // process.stdout.write('\n');
    readline.moveCursor(process.stdout, 0, -(selectionFields.length));
}

process.stdin.on('keypress', (str, key, isRenderCall) => {
    // console.log("got render call: ", str, key, isRenderCall);
    if(!readInput) return;
    let didBackspace = false;
    
    // console.log(key.name);
    if(!!promptOptions.keyboardEvent && !isRenderCall)
        promptOptions.keyboardEvent(str, key);

    switch(key.name)
    {
        // TODO: add abort prompt functionality.
        case 'c': if(!key.ctrl) break;
            return process.exit(0);
        // user is done.
        case 'return':
            if(!currentPrompt)
                return;
            // console.log("selection output", selected.map(val => selectionFields[val]))
            // if in text mode return the buffer joined, else return the zero index witch is a selection object.
            const selectionReturn = () => {
                // multi section return
                return multiSelectionMode ? selected.map(val => {
                    return {
                        index: val,
                        value: selectionFields[val]
                    };
                    // if single section mode.
                }) : !!selectionFields ? {
                    index: focused,
                    value: selectionFields[focused]
                } : []
            };
            return currentPrompt(!selectionFields ? returnBuffer.join("").trim() : selectionReturn());
        case 'backspace':
            // selection fields dont require this functionality.
            if(!!selectionFields) break;
            textToRender.pop();
            
            returnBuffer[returnBuffer.length - 1] = null;
            returnBuffer = _.without(returnBuffer, null);

            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, -1);    
            return renderInputPrompt();
        // up key
        case 'up':
            if(!!selectionFields)
            {
                if(focused !== 0) 
                    focused--;
                else // hope to bottom if top of selection
                    focused = selectionFields.length -1;
                refreshReturnBuffer();
            }
            break;
        //down key
        case 'down':
            if(!!selectionFields)
            {
                if(focused !== selectionFields.length - 1)
                    focused++;
                else
                    focused = 0;
                refreshReturnBuffer();
            }
            break;
        case 'space':
            if(!multiSelectionMode) break;
            // set what field to select.
            const toSelect = focused;
            const targetIndex = selected.indexOf(toSelect);
            // could not found index.
            if(targetIndex == -1)
                // select a value.
                // console.log(`add ${selectionFields[focused]} to selected list.`);
                selected.push(focused); 
            
            else 
                // deselect a value.
                // console.log(`remove ${selectionFields[focused]} from selected list.`);
                selected = _.without(selected, focused);
            break;
        

    }
    
    
    // textToRender = _.without(
    //     _.map(textToRender, element => element == " " ? null : element), null
    // );
        

    textToRender.push( !!inputCharacterOverride ? inputCharacterOverride : str);
    returnBuffer.push(str);

    // if(!blockOutput)
    // {
    
    
    // render a basic input form.
    if(!selectionFields)
    {
        // keep this line outside of renderInputPrompt() since backspacing requires the render function and has a different process of readline.cursorTo()
        readline.cursorTo(process.stdout, 0);
        return renderInputPrompt();
    }
    
    // render a selection form.
    renderSelectionPrompt();

    // }
});

function Prompt(base, options = baseOptions) {
    const promise = new Promise(resolve => {
        // add some space between this prompt and last one(if last one exists)
        // if someone only wants to change one thing in options this allows users to do so.
        // apply default styling if not overwritten
        if(!options.styling)
            options.styling = baseSelectionStyleOptions;
        // set prompt options
        promptOptions = options;

        if(base) 
            prefix = base;
        else prefix = "";
        // reset all buffers.
        textToRender = [];
        returnBuffer = [];
        selected = [];
        selectionFields = null;
        focused = 0;
        multiSelectionMode = !options.multiSelection ? false : options.multiSelection;

        // check for selection option and if so init selection system.
        if(!!options.selectable && options.selectable instanceof Array)
        {
            selectionFields = options.selectable;
            cliCursor.hide();
            // write the prefix
            console.log(prefix);
        }
        // console.log("working with selection field object: ", selectionFields);
    
        // configure prompt
        // blockOutput = !!options.inputCharacterOverride;
        inputCharacterOverride = !!options.replaceCharacter ? options.replaceCharacter : null;
        currentPrompt = data => {
            if(multiSelectionMode)
            {
                /**
                 * Add space between the top most selected value and bottom of list. this is because node will write ontop of any non selected values.
                 * This is a quick little feature that makes output look nicer and less ganky.
                 */
                let curr = 0;
                const topValue = _.without(selected.map(value => value >= curr ? value : null), null);
                topValue.forEach(() => console.log());
                
            } else if(!!selectionFields) // if single selection mode then give space based on what option the user selected...
                for(let i = focused - 1; i < selectionFields.length; i++)
                    console.log();
            
            process.stdin.setRawMode(false);
            readInput = false;
            cliCursor.show();// incase its hid.
            process.stdin.pause();
            console.log();
            resolve(data);
        };
        if(!!promptOptions.abortHandler)
        {
            promptOptions.abortHandler.once('abort', () => {
                // end with current value.
                currentPrompt(returnBuffer.join("").trim());
            });
        }
        // reset buffer.
        process.stdin.setRawMode(true);
        readInput = true;
        process.stdin.resume();
        (!options.selectable ? startLine : renderSelectionPrompt)();
        if(!!promptOptions.startWith)
        {
            const deconstructed = promptOptions.startWith.split('');
            // returnBuffer = deconstructed;
            // textToRender = deconstructed;
            deconstructed.forEach(element => process.stdin.emit('keypress', element, { ctrl: false, name: element }, true));
        }
    });
    return promise;
}
module.exports = Prompt;