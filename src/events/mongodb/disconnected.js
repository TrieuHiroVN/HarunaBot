const Haruna = require('../../structures/Haruna');
const chalk = require('chalk');

module.exports = {
    name: 'disconnected',

    /**
     * 
     * @param { Haruna } haruna 
     */
    run: async (haruna) => {
        haruna.log(chalk.redBright('Disconnected from MongoDB!'));
    }
};