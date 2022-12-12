const Haruna = require('../../structures/Haruna');
const chalk = require('chalk');

module.exports = {
    name: 'connected',

    /**
     * 
     * @param { Haruna } haruna 
     */
    run: async (haruna) => {
        haruna.log(chalk.greenBright('Connected to MongoDB!'));
    }
};