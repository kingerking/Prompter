// import { setTimeout } from 'timers';

// import { setTimeout } from 'timers';

const Prompt = require('./prompt');
const _ = require('lodash');
const { EventEmitter } = require('events');


module.exports = function(userConfig) {
   return new Promise(resolve => {
        
        const currentPrompt = 0;

        // execution queue will add properties to this object, the name being the prompt schema name and value being the prompt output.
        let returnObjects = {};

        let defaultOptions = {};
        // weather or not to confirm the data before returning. offer option to reset.
        let doConfirm = false;
        const promptExecutionQueue = [];

        // Group event handler.
        const groupEvents = new EventEmitter();

        // this is whats returned when group.Prompt() is invoked. 
        // if i can think of something to put in here i will, good to have in place.
        function promptModificationObject(name, base, options)
        {
            promptExecutionQueue.push({ name, base, options });
            return {
                
            };
        }

        // queue for current values.
        // since all code is ran then the prompts are ran we will have to 
        const nameAtQueue = {};
        // will contain all the settings functions before and during prompt execution.
        const handlerObject = {
            // not a true prompt. this is a base object that stores Prompt options in a execution queue.
            // This can be considered a Prompt-Like.
            // This function will do nothing unless it is included in the return Array of a PromptGroup configuration function.
            Prompt: (name, base, options) => promptModificationObject(name, base, options),
            
                
            /**
             * Apply these options to every prompt
             */
            apply: defaultOptionOverride => defaultOptions = _.merge(defaultOptions, defaultOptionOverride),
            /**
             * Defines a prompt that is dependent on another prompts values. 
             * The dependent info must be defined before this prompt is rendered.
             */
            requires: (requiredValues, promptDefine) => {
                // will hold the required values.
                const valueBuffer = {};
                const startLength = requiredValues.length;
                let done = false;
                groupEvents.on('prompt_finished', (schema, value) => {
                    if(done) return;
                    
                    // if a required value is detected then splice the required value array and add
                    // said value to the buffer.
                    requiredValues = _.without(_.map(requiredValues, (element, index) => {
                        if(element == schema.name)
                        {
                            valueBuffer[schema.name] = value;
                            return null;
                        } else return element;
                    }), null);

                    if(requiredValues.length == 0)
                    {
                        done = true;
                        // this will only define the prompt upon all required values being uptained, if not allow
                        // is found then prompt will not render.
                        if(_.size(valueBuffer) == startLength)
                            promptDefine(valueBuffer);
                    }
                });
            },
            /**
             * Wait for a promise to resolve then continue.
             */
            waitFor: (promise, promptDefine) => promise.then(promptDefine),
            
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
                groupEvents.emit('prompt_finished', schema, value);
            }
            // clear space
            // _.forEach(returnObjects, () => console.log());
            return returnObjects;
        };
        exe().then(() => resolve(returnObjects));
   });
}