const Haruna = require('../../structures/Haruna');
const { ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    name: 'stop',
    description: 'Dừng phát nhạc và phá huỷ hàng chờ',
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
        queue.connection.destroy();
        haruna.musicPlayer.delete(interaction.guild.id);
        interaction.followUp({ content: '✅ Đã dừng và phá huỷ hàng chờ!' });
    }
};