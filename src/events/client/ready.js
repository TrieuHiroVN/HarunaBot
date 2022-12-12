const Haruna = require('../../structures/Haruna');
const { Client } = require('discord.js');

module.exports = {
    name: 'ready',

    /**
     * 
     * @param { Client } client 
     * @param { Haruna } haruna 
     */
    run: async (client, haruna) => {
        // ready log
        haruna.log(`${haruna.user.tag} is ready!`);

        // register commands
        const commands = [];
        haruna.commands.forEach(command => commands.push(command));
        haruna.application.commands.set(commands, '925015298967482389'); // senko coffee
        haruna.application.commands.set(commands, '933738059701305395'); // wanderers
    }
};