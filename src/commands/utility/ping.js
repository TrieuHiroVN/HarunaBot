const Haruna = require('../../structures/Haruna');
const { ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: '🏓 pong',
    type: ApplicationCommandType.ChatInput,

    /**
     * 
     * @param { Haruna } haruna 
     * @param { ChatInputCommandInteraction } interaction 
     */
    run: async (haruna, interaction) => {
        const msg = await interaction.followUp({ content: 'Pinging...' });
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('🏓 Pong!')
            .setDescription(`Latency: **${msg.createdTimestamp - interaction.createdTimestamp}ms**\nDiscord API: **${haruna.ws.ping}ms**`)
            .setTimestamp();
        return interaction.editReply({ content: '\u200b', embeds: [embed] });
    }
};