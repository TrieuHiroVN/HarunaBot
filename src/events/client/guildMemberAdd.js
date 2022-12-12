const Haruna = require('../../structures/Haruna');
const { GuildMember, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * 
     * @param { GuildMember } member 
     * @param { Haruna } haruna 
     */
    run: async (member, haruna) => {
        // for 933738059701305395
        if (member.guild.id === '933738059701305395') {
            const wlcchannel = await member.guild.channels.fetch('1037301513871179797');
            const wlcembed = new EmbedBuilder()
                .setColor('White')
                .setAuthor({ name: 'A new member arrived!', iconURL: member.user.displayAvatarURL({ size: 256 }) })
                .setThumbnail('https://media.discordapp.net/attachments/873725058030403644/892364576476266536/3acc735f21405077859b3ddead616ccc_2727809810528079521.gif')
                .setDescription(`Welcome <@${member.user.id}> to **${member.guild.name}**! Here are some places you should go before hanging out with others:\n- Read the __rules__ at <#933740614275723276>\n- Take some role about yourself at <#970958585293074443>\n- Introduce yourself at <#934633517470601238>\nHope you have a good time here!`)
                .setFooter({ text: 'Say hello to everyone!' })
                .setTimestamp();
            wlcchannel.send({ embeds: [wlcembed] });
        };
    }
};