const Haruna = require('../../structures/Haruna');
const { Message } = require('discord.js');

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
                if (stamina < maxStamina) msg += `\n__**Hồi lại trong:**__ [VIP: ${Math.trunc(refill / 4 * 3 / 60)}h ${Math.trunc(refill / 4 * 3 % 60)}m] [Không VIP: ${Math.trunc(refill / 60)}h ${refill % 60}m]`;
                msg += `\n__**Số trận đánh:**__ ${(stamina - stamina % 5) / 5}`;

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
                const msg = `\n__**Level tiếp theo:**__ ${battleNeed} trận đánh, ${battleNeed * 5} stamina`;

                if (message.deletable) {
                    message.delete();
                    message.channel.send({ content: message.content + msg });
                } else message.reply({ content: msg });
            }
        };
    }
};