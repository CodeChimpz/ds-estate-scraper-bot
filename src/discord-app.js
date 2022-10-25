//
const {Client, GatewayIntentBits} = require("discord.js")
//discord.js client to interact with the discord bot with according intents
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]})

//Register event handlers
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//
//todo: greeting on user arrival

//register event handlers from custom commands
const handlers = Object.values(require('./discord/commands')).map((comm) => {
    return comm.action
});
(async () => {
    for (const action of handlers) {
        client.on(action.event, (...args) => {
            action.exec(...args)
        })
    }
})();

module.exports = client