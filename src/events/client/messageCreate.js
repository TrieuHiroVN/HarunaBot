const Haruna = require('../../structures/Haruna');
const { Message, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { exec } = require('node:child_process');

module.exports = {
    name: 'messageCreate',

    /**
     * 
     * @param { Message } message 
     * @param { Haruna } haruna 
     */
    run: async (message, haruna) => {
        if (message.author.id === '571027211407196161') { // AniGame
            if (message.content.endsWith('stamina.')) {
                var msg = '';
                var stamina, maxStamina;

                const strs = message.content.split('__');
                for (const str of strs) {
                    const stam = str.split('/');
                    if (!isNaN(stam[0]) && !isNaN(stam[1])) [stamina, maxStamina] = stam;
                };

                stamina = parseInt(stamina);
                maxStamina = parseInt(maxStamina);

                const refill = (maxStamina - stamina) * 2;
                if (stamina < maxStamina) msg += `\n__**Refill:**__ [VIP: ${Math.trunc(refill / 4 * 3 / 60)}h ${Math.trunc(refill / 4 * 3 % 60)}m] [Không VIP: ${Math.trunc(refill / 60)}h ${refill % 60}m]`;
                msg += `\n__**Battles:**__ ${(stamina - stamina % 5) / 5}`;

                if (message.deletable) {
                    message.delete();
                    message.channel.send({ content: message.content + msg });
                } else message.reply({ content: msg });
            } else if (message.content.endsWith('EXP]')) {
                const lvlstr = message.content.split('Level ').pop();
                var [level, empty, expNow, slash, expNext] = lvlstr.split(' ');
                expNow = parseInt(expNow.slice(1).split(',').join(''));
                expNext = parseInt(expNext.split(',').join(''));
                const expNeed = expNext - expNow;

                var expGetOnLevel = 2;
                if (level < 30) expGetOnLevel = 5;
                else if (level < 50) expGetOnLevel = 3;

                const battleNeed = Math.trunc(expNeed / expGetOnLevel) + (expNeed % expGetOnLevel !== 0 ? 1 : 0);
                const msg = `\n__**Next Level:**__ ${battleNeed} battles, ${battleNeed * 5} stamina`;

                if (message.deletable) {
                    message.delete();
                    message.channel.send({ content: message.content + msg });
                } else message.reply({ content: msg });
            };
        };

        if (message.author.id === '606284212332658689')  { // Me
            const devprefix = 'dev$'.toLowerCase();
            if (!message.content.toLowerCase().startsWith(devprefix)) return;
            const cmd = message.content.toLowerCase().slice(devprefix.length).trim().split(/ +/g)[0];
            if (cmd === 'eval') {
                const process = message.content.slice(`${devprefix}eval `.length);
                if (!process) return;

                var e;
                try {
                    e = eval(process);
                } catch (err) {
                    e = err;
                };

                const evalEmbed = new EmbedBuilder()
                    .setTitle('Code Evaluate')
                    .setColor('Blurple')
                    .setFields(
                        { name: '📁 Input', value: `\`\`\`js\n${process.slice(0, 1950)}\n\`\`\`` },
                        { name: '📁 Output', value: `\`\`\`js\n${e}\n\`\`\`` },
                        { name: '📁 Type of', value: `\`\`\`js\n${String(typeof e).charAt(0).toUpperCase()}${String(typeof e).slice(1)}\n\`\`\`` }
                    )
                    .setTimestamp();

                message.channel.send({ embeds: [evalEmbed] });
            }
            else if (cmd === 'terminal') {
                const stdin = message.content.slice(`${devprefix}terminal `.length);
                if (!stdin) return;
                message.channel.send(`\`\`\`$ ${stdin.slice(0, 1950)}\`\`\``)
                exec(stdin, (err, stdout, stderr) => {
                    if (err) {
                        console.log(err);
                        return message.channel.send({ content: `\`\`\`${stderr.slice(0, 1950)}\`\`\`` });
                    };
                    message.channel.send({ content: `\`\`\`${stdout.slice(0, 1950)}\`\`\`` });
                });
            }
        };

        if (
            [
                '1034443797121208320', // haruna chat - wanderers
                '1004639749174206485' // haruna chat - daydreamers
            ].includes(message.channel.id)
            && !message.author.bot
            && !message.content.startsWith('>')
        ) {
            const res = await axios.get(`http://api.brainshop.ai/get?bid=${haruna.config.brainshop.bid}&key=${haruna.config.brainshop.key}&uid=${message.author.id}&msg=${encodeURIComponent(message.content)}`);
            message.reply({ content: res.data.cnt });
        };
    }
};