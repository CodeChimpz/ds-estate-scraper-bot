const {ToadScheduler, SimpleIntervalJob, AsyncTask} = require('toad-scheduler')
const path = require('path')

const parsers = require('./parser-implement')
const config = require(path.join('./', '..', '..', 'config.json'))

const Apartment = require('../model/Apartment')
const scheduler = new ToadScheduler()

const task = new AsyncTask('parse`n`write', async () => {
    try {
        console.log('Writing to db')
        console.time('write')
        //get an array of parsed apartments from all available webpages
        const data = []
        for (const parser of parsers){
            data.push(...await parser.parse())
        }
        //check if apartment data is already present - then update data, otherwise - add
        for (const apartment of data) {
            const getApartment = await Apartment.findOneAndUpdate({address: apartment.address}, {...apartment})
            if (!getApartment) {
                const newApartment = new Apartment({...apartment})
                await newApartment.save()
            }
        }
        console.timeEnd('write')
    } catch (err) {
        console.log(err)
    }
})
console.log('Writer will be working on interval: ', config.scheduler)
const job = new SimpleIntervalJob({...config.scheduler, runImmediately: true}, task, {
    preventOverrun: true
})


module.exports = {
    scheduler,
    job
}