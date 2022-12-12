const Haruna = require('../../structures/Haruna');
const { ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    name: 'pause',
    description: 'Tạm dừng bài hát',
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

        // dj role later
        const res = await queue.connection.subscription.player.pause();
        if (res) interaction.followUp({ content: '✅ Đã tạm dừng bài hát!' });
        else interaction.followUp({ content: '❌ Bài hát đã được tạm dừng rồi!' });
    }
};