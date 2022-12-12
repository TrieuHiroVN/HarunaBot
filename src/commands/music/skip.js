const Haruna = require('../../structures/Haruna');
const { ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Bỏ qua bài hát đang chơi',
    type: ApplicationCommandType.ChatInput,

    /**
     * 
     * @param { Haruna } haruna 
     * @param { ChatInputCommandInteraction } interaction 
     */
    run: async (haruna, interaction) => {
        const queue = haruna.musicPlayer.get(interaction.guild.id);
        if (!queue) return interaction.followUp({ content: '❌ Tôi hiện đang không chơi nhạc!' });

        if (!interaction.member.voice.channel) return interaction.followUp({ content: '⚠ Bạn cần tham gia một kênh thoại trước!' });
        if (
            interaction.guild.members.me.voice.channel
            && interaction.guild.members.me.voice.channel !== interaction.member.voice.channel
        ) return interaction.followUp({ content: '⚠ Bạn cần ở chung một kênh thoại với tôi!' });

        if ( // dj role later
            interaction.user.id !== queue.songs[0].requester.id
            && !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
        ) return interaction.followUp({ content: 'Bạn không thể bỏ qua bài hát của người khác!' });

        queue.songs.shift();
        haruna.functions.play(haruna, interaction.guild, queue.songs[0]);

        interaction.followUp({ content: '✅ Đã bỏ qua bài hát hiện tại!' });
    }
};