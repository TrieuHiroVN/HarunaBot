const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { readdirSync, lstatSync } = require('node:fs');
const { join } = require('node:path');
const chalk = require('chalk');
const moment = require('moment');
const mongoose = require('mongoose');

module.exports = class Haruna extends Client {
    constructor () {
        super({
            intents: [
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildScheduledEvents,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.Message,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User
            ],
            failIfNotExists: false,
            allowedMentions: {
                users: [],
                roles: [],
                repliedUser: false
            }
        });

        this.config = require('../../config');
        this.musicPlayer = new Collection();
        this.functions = require('../requires').functions;
    };

    _loadCommands() {
        this.commandsLoaded = 0;
        this.commands = new Collection();

        const commandpath = join(__dirname, '../commands');

        readdirSync(commandpath)
            .filter(dir => lstatSync(join(commandpath, dir)).isDirectory())
            .forEach(dir => {
                const dirpath = join(commandpath, dir);

                readdirSync(dirpath)
                    .filter(file => lstatSync(join(dirpath, file)).isFile() && file.endsWith('js'))
                    .forEach(file => {
                        const command = require(`../commands/${dir}/${file}`);
                        if (!command.name) return;
                        command.dir = dir;
                        this.commands.set(command.name, command);
                        this.commandsLoaded++;
                    });
            });
    };

    _loadEvents() {
        this.eventsLoaded = 0;

        const eventpath = join(__dirname, '../events/client');

        readdirSync(eventpath)
            .filter(file => lstatSync(join(eventpath, file)).isFile() && file.endsWith('.js'))
            .forEach(file => {
                const event = require(`../events/client/${file}`);
                if (!event.name) return;
                this.on(event.name, (...args) => event.run(...args, this));
                this.eventsLoaded++;
            });
    };

    _loadMongoDB() {
        this.database = require('../database');

        mongoose.set('strictQuery', false);
        mongoose.connect(this.config.mongoSRV);
        const eventpath = join(__dirname, '../events/mongodb');

        readdirSync(eventpath)
            .filter(file => lstatSync(join(eventpath, file)).isFile() && file.endsWith('.js'))
            .forEach(file => {
                const event = require(`../events/mongodb/${file}`);
                if (!event.name) return;
                mongoose.connection.on(event.name, (...args) => event.run(...args, this));
            });
    };

    build() {
        this._loadCommands();
        this._loadEvents();
        this._loadMongoDB();

        this.log(`Loaded ${this.commandsLoaded} commands!`);
        this.log(`Loaded ${this.eventsLoaded} events!`);

        this.login(this.config.token);
    };

    /**
     * Log message to console with timestamp
     * @param { any } message 
     */
     log(message) {
        console.log(chalk.underline.greenBright(moment().utcOffset(7).format('ddd, DD/MM/YYYY HH:mm:ss')) + ' ' + chalk.cyanBright(message));
    };
};