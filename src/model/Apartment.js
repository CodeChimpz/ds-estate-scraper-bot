const Mongoose = require('mongoose')
const appartmentSchema = new Mongoose.Schema({
    //Required
    price: {
        type: String,
        required: true
    },
    address:{
        type:String,
        required:true
    },
    area: {
        type: String,
    },
    img: [{
        type: String,
    }],
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: true,
    },
    //Additional
    label: {
        type: String,
    },
    minimal: {
        type: String,
    },
    city: {
        type: String,
    },
    district: {
        type: String
    },
    rooms: {
        type: String,
    },
    maxppl: {
        type: String,
    },
    descr: {
        type: String,
    },

})
const Apartment = Mongoose.model('appartment', appartmentSchema)
module.exports = Apartment
