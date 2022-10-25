require('dotenv').config()
const {REST, Routes} = require('discord.js');

const commands = Object.values(require('../discord/commands')).map((comm) => {
    return comm.command
});

//Parse commands from files in ./commands dir and upload them to the Discord app through the Discord API

const rest = new REST({version: '10'}).setToken(process.env["DS_BOT"]);
(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env["DS_CLIENT_ID"]), {body: commands});
    } catch (error) {
        console.error(error);
    }
})();