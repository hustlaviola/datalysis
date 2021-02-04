const { mongoose } = require('../config/config');

const { Schema } = mongoose;

const MD5Schema = new Schema({
    md5: {
        type: String
    },
    fileName: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
})

const MD5 = mongoose.model('md5', MD5Schema);

module.exports = MD5;
