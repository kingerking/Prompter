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
        // weather or not to confirm the data before returning. offer option to reset.
        let doConfirm = false;
        const promptExecutionQueue = [];

        // queue for current values.
        // since all code is ran then the prompts are ran we will have to 
        const nameAtQueue = {};
        // will contain all the settings functions before and during prompt execution.
        const handlerObject = {
            // not a true prompt. this is a base object that stores Prompt options in a execution queue.
            // This can be considered a Prompt-Like.
            // This function will do nothing unless it is included in the return Array of a PromptGroup configuration function.
            Prompt: (name, base, options) => promptExecutionQueue.push({name, base, options}),
            /**
             * Apply these options to every prompt
             */
            apply: defaultOptionOverride => defaultOptions = _.merge(defaultOptions, defaultOptionOverride),
                
            
            // /**
            //  * 
            //  */
            // confirm: () => doConfirm = true,
        };

        // configure PromptGroup.
        userConfig(handlerObject);

        function filterThroughReturnModel(str)
        {
            // bind string with its model so we can use previous values from PromptGroup.
            return require('string-template')(str, _.forOwn(returnObjects, (ro, key) => {
                return { [key]: ro instanceof String ? ro : ro.value }
            }));
        }

        async function exe() {
            for(const schema of promptExecutionQueue) 
            {
                const value = await Prompt(filterThroughReturnModel(schema.base), _.merge(schema.options, defaultOptions));
                
                returnObjects[schema.name] = value;
            }
            // clear space
            // _.forEach(returnObjects, () => console.log());
            return returnObjects;
        };
        exe().then(() => resolve(returnObjects));
   });
}