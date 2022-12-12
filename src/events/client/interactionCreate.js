const Haruna = require('../../structures/Haruna');
const { CommandInteraction } = require('discord.js');

module.exports = {
    name: 'interactionCreate',

    /**
     * 
     * @param { CommandInteraction } interaction 
     * @param { Haruna } haruna 
     */
    run: async (interaction, haruna) => {
        if (interaction.isChatInputCommand()) {
            // get command
            const command = haruna.commands.get(interaction.commandName);
            if (!command) return interaction.reply({ content: 'Đã có lỗi xảy ra!' });

            // database auto create
            const userData = await haruna.database.user.findById(interaction.user.id);
            if (!userData) await haruna.database.user.create({ _id: interaction.user.id });

            // force reply
            if (!command.forgeReply) await interaction.deferReply({ ephemeral: command.ephemeral ?? false });

            // run command
            try {
                await command.run(haruna, interaction);
            } catch (e) {
                console.error(e);
                interaction.followUp({ content: 'Đã có lỗi xảy ra!' });
            };
        };
    }
};