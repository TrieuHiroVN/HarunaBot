const Haruna = require('../../structures/Haruna');
const chalk = require('chalk');

module.exports = {
    name: 'reconnected',

    /**
     * 
     * @param { Haruna } haruna 
     */
    run: async (haruna) => {
        haruna.log(chalk.greenBright('Reconnected to MongoDB!'));
    }
};