// import { setTimeout } from 'timers';

// import { setTimeout } from 'timers';

const Prompt = require('./prompt');
const _ = require('lodash');

module.exports = function(userConfig) {
   return new Promise(resolve => {
        
        const currentPrompt = 0;

        // execution queue will add properties to this object, the name being the prompt schema name and value being the prompt output.
        let returnObjects = {};

        let defaultOptions = {};

        const promptExecutionQueue = [];

        // will contain all the settings functions before and during prompt execution.
        const handlerObject = {
            // not a true prompt. this is a base object that stores Prompt options in a execution queue.
            // This can be considered a Prompt-Like.
            // This function will do nothing unless it is included in the return Array of a PromptGroup configuration function.
            Prompt: (name, base, options) => { promptExecutionQueue.push({name, base, options}) },
            /**
             * Apply these options to every prompt
             */
            apply: defaultOptionOverride => defaultOptions = _.merge(defaultOptions, defaultOptionOverride)
            
        };

        // configure PromptGroup.
        userConfig(handlerObject);
        
        console.log("exe queue length: ", promptExecutionQueue.length);

        function test()
        {
            return new Promise(resolve => {
                setTimeout(() => {
                    console.log("resolving timeout")
                    resolve("testing 123!!1")
                }, 1000);
            });
        }

        async function exe() {
            for(const schema of promptExecutionQueue) 
                returnObjects[schema.name] = await Prompt(schema.base, _.merge(defaultOptions, schema.options));
            return returnObjects;
        };
        exe().then(() => resolve(returnObjects));
   });
}