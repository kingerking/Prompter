const PromptGroup = require('./promptGroup');
const Prompt = require('./prompt');

module.exports = (base, options) => {
    if(!!base && base instanceof Function && !options)
        return PromptGroup(base);
    return Prompt(base, options);
}
