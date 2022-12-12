const Haruna = require('../../structures/Haruna');
const { ApplicationCommandType, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const yts = require('yt-search');

module.exports = {
    name: 'queue',
    description: 'Songs queue',
    type: ApplicationCommandType.ChatInput,

    /**
     * 
     * @param { Haruna } haruna 
     * @param { ChatInputCommandInteraction } interaction 
     */
    run: async (haruna, interaction) => {
        const queue = haruna.musicPlayer.get(interaction.guildId);

        if (!queue) return interaction.followUp({ content: '❌ I am currently not playing music!' });

        const pages = [];
        let display = [], nowplaying;

        for (const song of queue.songs) {
            if (queue.songs.indexOf(song) === 0) nowplaying = (`**⋙ Playing 🎵**\n**${song.info.title}** - Requested by: ${song.requester.tag}\n\n**⋙ Next** 🎶\n`);
            else display.push(`**${display.length + pages.length * 5 + 1}. ${song.info.title}**\nDuration: ${song.info.duration.timestamp} - Requested by: ${song.requester.tag}`);

            if (display.length === 5) {
                const embed = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('🎶 Song queue')
                    .setDescription(nowplaying + display.join('\n'))
                    .setTimestamp();

                pages.push(embed);
                display = [];
            };
        };

        if (display.length > 0) {
            const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('🎶 Song queue')
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

        const msg = await interaction.followUp({ embeds: [pages[0].setFooter({ text: `Page ${page}/${pages.length} • Song 1-${page * 5 > queue.songs.length ? queue.songs.length : page * 5}/${queue.songs.length}` })], components: [row(false)] });
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

            ctx.editReply({ embeds: [pages[page - 1].setFooter({ text: `Page ${page}/${pages.length} • Song ${page * 5 - 5}-${page * 5 > queue.songs.length ? queue.songs.length : page * 5}/${queue.songs.length}` })] });
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'delete') return;
            msg.edit({ components: [row(true)] });
        });
    }
};