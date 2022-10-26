const fs = require('fs').promises
const path = require('path')
const {SlashCommandBuilder, EmbedBuilder, AttachmentBuilder,  Events} = require('discord.js')

const config = require('../../../config.json')
const Apartment = require('../../model/Apartment')

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
    getrooms: {
        command: new SlashCommandBuilder()
            .setName('get-rooms')
            .setDescription('Uploads the newest apartment data into chat')
            .addStringOption(option => option.setName('page').setDescription('Scroll data until you find something you like')
            ),
        action: {
            event: Events.InteractionCreate,
            async exec(interaction) {
                if (interaction.commandName === "get-rooms") {
                    const page = interaction.options.getString('page')
                    //get all Apartments
                    await interaction.deferReply({ephemeral: true})
                    const MAX = config.ds.max_per_page
                    const data = await Apartment.find().skip(page*MAX).limit(page*MAX+MAX);
                    //Mapper function todo: a service for Apartment?
                    function ApartmentToSend(apt){
                        const templ = `Адрес - ${apt.address}\n${apt.area ? 'Площадь'+apt.area+'\n':''}\t${apt.descr}\n${apt.rooms?'Комнаты: '+apt.rooms+'\n':''}${apt.maxppl?'Максимум людей: '+apt.maxppl+'\n':''}\nЦена : ${apt.price}${apt.minimal?',Миимальный срок сдачи: '+apt.minimal+'\n':''}`
                        const embed = new EmbedBuilder()
                            .setTitle(apt.label || apt.address)
                            .setImage(apt.img[0])
                            .setURL(apt.link)
                            .setFields([
                                {name:'Номер телефона',value:apt.phone},
                                {name:'Email',value:apt.email}
                            ])
                        return {templ,embed}
                    }
                    //
                    for (const apartment of data) {
                        const response = ApartmentToSend(apartment)
                        await interaction.followUp({ content:response.templ,embeds:[response.embed]})
                    }
                }
            }
        }
    }

}