const Haruna = require('../structures/Haruna');
const { Guild, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus, createAudioResource } = require('@discordjs/voice');
const yts = require('yt-search');
const playdl = require('play-dl');

/**
 * @param { Haruna } haruna
 * @param { Guild } guild 
 * @param { any } song 
 */

module.exports = async (haruna, guild, song) => {
    const queue = haruna.musicPlayer.get(guild.id);
    if (!song) {
        queue.connection.destroy();
        queue.textChannel.send({ content: '🎶 Đã hết hàng đợi!' });
        haruna.musicPlayer.delete(guild.id);
        return;
    };

    const audioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause
        }
    });

    audioPlayer.on(AudioPlayerStatus.Idle, () => {
        queue.songs.shift();
        haruna.functions.play(haruna, guild, queue.songs[0]);
    });

    const video = await yts({ videoId: song.videoId });
    const resource = await playdl.stream(video.url);
    const audioResource = createAudioResource(resource.stream, { inputType: resource.type });
    audioPlayer.play(audioResource);
    queue.connection.subscription = queue.connection.subscribe(audioPlayer);

    const musicEmbed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('🎶 Đã bắt đầu chơi')
        .setThumbnail(video.thumbnail)
        .setDescription(`**⋙ ${video.title}**\n**${video.author.name}** - ${video.ago}\nThời lượng: ${video.duration.timestamp} - Lượt xem: ${numberWithCommas(video.views)}`)
        .setFooter({ text: `Được yêu cầu bởi ${song.requester.tag}`, iconURL: song.requester.displayAvatarURL({ size: 256 }) });

    queue.textChannel.send({ embeds: [musicEmbed] });
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};