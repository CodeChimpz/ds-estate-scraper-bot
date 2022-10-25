const {ToadScheduler, SimpleIntervalJob, AsyncTask} = require('toad-scheduler')
const path = require('path')

const parse = require('./parser')
const config = require(path.join('./', '..', '..', 'config.json'))

const Apartment = require('../model/Apartment')
const scheduler = new ToadScheduler()

const task = new AsyncTask('parse`n`write', async () => {
    try {
        console.log('Writing to db')
        console.time('write')
        //get an array of parsed apartments from a site
        const parsed = await parse('https://www.cvs.md/ru/chisinau_apartment_rental/%D0%94%D0%BE%D0%BB%D0%B3%D0' +
            '%BE%D1%81%D1%80%D0%BE%D1%87%D0%BD%D0%B0%D1%8F-%D0%90%D1%80%D0%B5%D0%BD%D0%B4%D0%B0-%D0%B2-%D0%9A%D0%B8%D1%88%D0%B8%D0%BD%' +
            'D0%B5%D0%B2%D0%B5?is-longterm=true' + '&');
        //check if apartment data is already present - then update data, otherwise - add
        for (const apartment of parsed) {
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