const Mongoose = require('mongoose')
const appartmentSchema = new Mongoose.Schema({
    //Required
    label: {
        type: String,
        required: true
    },
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
    minimal: {
        type: String,
        required: false
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
