const Haruna = require('../../structures/Haruna');
const { ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction } = require('discord.js');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const yts = require('yt-search');

module.exports = {
    name: 'play',
    description: 'Play music',
    options: [
        {
            name: 'query',
            description: 'Name/YouTube link of the song',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    type: ApplicationCommandType.ChatInput,

    /**
     * 
     * @param { Haruna } haruna 
     * @param { ChatInputCommandInteraction } interaction 
     */
    run: async (haruna, interaction) => {
        if (!interaction.member.voice.channel) return interaction.followUp({ content: '⚠ You must join a voice channel first!' });
        if (
            interaction.guild.members.me.voice.channel
            && interaction.guild.members.me.voice.channel !== interaction.member.voice.channel
        ) return interaction.followUp({ content: '⚠ You must be in the same voice channel with me!' });

        const query = interaction.options.getString('query');
        var searchRes;

        try {
            var url = new URL(query);
        } catch {};

        if (url) {
            if (
                url.hostname === "youtube.com"
                || url.hostname === "www.youtube.com"
            ) {
                if (url.pathname === '/watch') searchRes = [await yts({ videoId: url.searchParams.get('v') })];
                else if (url.pathname === '/playlist') searchRes = await yts({ listId: url.searchParams.get('list') }).then(x => x.videos);
            } else if (
                url.hostname === 'youtu.be'
                || url.hostname === 'www.youtu.be'
            ) searchRes = [await yts({ videoId: url.pathname.slice(1) })];
            else return interaction.followUp({ content: '❌ I only support YouTube links!' });
        } else searchRes = [await yts(query).then(x => x.videos[0])];

        if (searchRes.length === 0) return interaction.followUp({ content: '❌ No results found!' });

        const queue = haruna.musicPlayer.get(interaction.guild.id);
        if (!queue) {
            const queueConstruct = {
                textChannel: interaction.channel,
                voiceChannel: interaction.member.voice.channel,
                connection: null,
                songs: []
            };

            haruna.musicPlayer.set(interaction.guild.id, queueConstruct);

            searchRes.forEach(song => queueConstruct.songs.push({ info: song, videoId: song.videoId, requester: interaction.user }));

            try {
                const connection = getVoiceConnection(interaction.guild.id);
                if (!connection) queueConstruct.connection = joinVoiceChannel({
                    channelId: queueConstruct.voiceChannel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                });

                haruna.functions.play(haruna, interaction.guild, queueConstruct.songs[0]);
            } catch (e) {
                console.error(e);
                queue.delete(interaction.guild.id);
                return interaction.followUp({ content: '❌ An error occurred!' });
            };
        } else searchRes.forEach(song => queue.songs.push({ info: song, requester: interaction.user }));

        interaction.followUp({ content: `✅ Added **${searchRes.length > 1 ? `${searchRes.length} songs` : searchRes[0].title}** to the queue!` });
    }
};