const Haruna = require('../../structures/Haruna');
const { ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    name: 'resume',
    description: 'Tiếp tục bài hát đang tạm dừng',
    type: ApplicationCommandType.ChatInput,

    /**
     * 
     * @param { Haruna } haruna 
     * @param { ChatInputCommandInteraction } interaction 
     */
    run: async (haruna, interaction) => {
        const queue = haruna.musicPlayer.get(interaction.guild.id);
        if (!queue) return interaction.followUp({ content: '❌ I am currently not playing music!' });

        if (!interaction.member.voice.channel) return interaction.followUp({ content: '⚠ You must join a voice channel first!' });
        if (
            interaction.guild.members.me.voice.channel
            && interaction.guild.members.me.voice.channel !== interaction.member.voice.channel
        ) return interaction.followUp({ content: '⚠ You must be in the same voice channel with me!' });

        // dj role later
        const res = await queue.connection.subscription.player.unpause();
        if (res) interaction.followUp({ content: '✅ Resumed!' });
        else interaction.followUp({ content: '❌ The song has not been paused!' });
    }
};