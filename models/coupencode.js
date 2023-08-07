const mongoose = require('mongoose')

const coupenSchema = mongoose.Schema({

    offerName: {
        type: String
    },
    offerPrice: {
        type: String
    },
    uploadImage: {
        type: String
    },
    offerDiscount: {
        type: String
    },
    activationdate: {
        type: String
    },
    expirydate: {
        type: String
    }

})

module.exports = mongoose.model('coupen', coupenSchema)