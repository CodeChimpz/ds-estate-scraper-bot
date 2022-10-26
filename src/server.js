require('dotenv').config()
const mongoose = require('mongoose')
const ds_app = require('./discord-app')
//Import writer scheduler
const writer = require('./writer');

(async () => {
    mongoose.connect(process.env["MONGO_URI"])
        .then(() => {
            console.log('Connected to db')
            writer.scheduler.addIntervalJob(writer.job)
        })
        .catch((error) => {
            writer.scheduler.stop()
        })
    //Start the discord bot by logging in to the bot with the token
    ds_app.login(process.env["DS_BOT"])
})();
