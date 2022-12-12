const Haruna = require('../../structures/Haruna');
const { ApplicationCommandType, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const yts = require('yt-search');

module.exports = {
    name: 'queue',
    description: 'Hàng đợi bài hát',
    type: ApplicationCommandType.ChatInput,

    /**
     * 
     * @param { Haruna } haruna 
     * @param { ChatInputCommandInteraction } interaction 
     */
    run: async (haruna, interaction) => {
        const queue = haruna.musicPlayer.get(interaction.guildId);

        if (!queue) return interaction.followUp({ content: '❌ Tôi hiện đang không chơi nhạc!' });

        const pages = [];
        let display = [], nowplaying;

        for (const song of queue.songs) {
            if (queue.songs.indexOf(song) === 0) nowplaying = (`**⋙ Đang chơi 🎵**\n**${song.info.title}** - Được yêu cầu bởi: ${song.requester.tag}\n\n**⋙ Tiếp theo** 🎶\n`);
            else display.push(`**${display.length + pages.length * 5 + 1}. ${song.info.title}**\nThời lượng: ${song.info.duration.timestamp} - Được yêu cầu bởi: ${song.requester.tag}`);

            if (display.length === 5) {
                const embed = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('🎶 Danh sách chờ nhạc')
                    .setDescription(nowplaying + display.join('\n'))
                    .setTimestamp();

                pages.push(embed);
                display = [];
            };
        };

        if (display.length > 0) {
            const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('🎶 Danh sách chờ nhạc')
                .setDescription(nowplaying + display.join('\n'))
                .setTimestamp();

            pages.push(embed);
        };

        function row(disable) {
            return new ActionRowBuilder()
                .setComponents(
                    new ButtonBuilder()
                        .setEmoji('◀')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('queue-prev')
                        .setDisabled(disable),
                    new ButtonBuilder()
                        .setEmoji('▶')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('queue-next')
                        .setDisabled(disable),
                    new ButtonBuilder()
                        .setEmoji('🗑')
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId('queue-delete')
                        .setDisabled(disable)
                );
        };

        let page = 1;

        const msg = await interaction.followUp({ embeds: [pages[0].setFooter({ text: `Trang ${page}/${pages.length} • Bài 1-${page * 5 > queue.songs.length ? queue.songs.length : page * 5}/${queue.songs.length}` })], components: [row(false)] });
        const collector = msg.createMessageComponentCollector({
            filter: ctx => ctx.user === interaction.user,
            componentType: ComponentType.Button,
            idle: 60_000
        });

        collector.on('collect', async ctx => {
            await ctx.deferUpdate();

            if (ctx.customId === 'queue-prev') page === 1 ? page = pages.length : page--;
            else if (ctx.customId === 'queue-next') page === pages.length ? page = 1 : page++;
            else {
                msg.delete();
                return collector.stop('delete');
            };

            ctx.editReply({ embeds: [pages[page - 1].setFooter({ text: `Trang ${page}/${pages.length} • Bài ${page * 5 - 5}-${page * 5 > queue.songs.length ? queue.songs.length : page * 5}/${queue.songs.length}` })] });
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'delete') return;
            msg.edit({ components: [row(true)] });
        });
    }
};