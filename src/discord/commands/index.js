const fs = require('fs').promises
const path = require('path')
const {SlashCommandBuilder, AttachmentBuilder, Events} = require('discord.js')

const config = require('./', '..', '..', 'config.json')
const Apartment = require('../../model/Apartment')

// const handlers = require('../handlers')

//
module.exports = {
    ping: {
        command: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with pong'),
        action: {
            event: Events.InteractionCreate,
            async exec(interaction) {
                if (interaction.commandName === "ping") {
                    interaction.reply("Pong!")
                }
            }
        }
    },
    getData: {
        command: new SlashCommandBuilder()
            .setName('getdata')
            .setDescription('Uploads the apartment data'),
        action: {
            event: Events.InteractionCreate,
            async exec(interaction) {
                if (interaction.commandName === "getdata") {
                    //get all Apartments
                    await interaction.deferReply({ephemeral: true})
                    const data = await Apartment.find();
                    for (const apartment of data) {
                        await interaction.followUp(JSON.stringify(apartment))
                    }
                }
            }
        }
    }

}