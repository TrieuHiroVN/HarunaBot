const Haruna = require('../../structures/Haruna');
const { ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Skip current playing music',
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

        if ( // dj role later
            interaction.user.id !== queue.songs[0].requester.id
            && !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
        ) return interaction.followUp({ content: 'You cannot skip someone else\'s song!' });

        queue.songs.shift();
        haruna.functions.play(haruna, interaction.guild, queue.songs[0]);

        interaction.followUp({ content: '✅ Skipped!' });
    }
};