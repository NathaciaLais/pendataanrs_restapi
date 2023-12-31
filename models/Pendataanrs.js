const{number}=require('joi')
const mongoose = require('mongoose')

const pendataanrsSchema = mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    alamat: {
        type: String,
        required: true
    },
    deskripsi: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    versionKey: false

})
module.exports = mongoose.model('Pendataanrs', pendataanrsSchema, 'pendataanrs')