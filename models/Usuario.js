const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Usuario = new Schema ({

    Nome: {
        type: String,
        required: true
    },
    Email: {
        type: String, 
        required: true 
    },
    eAdmin: {
        type: Number,
        default: 0
    },
    Senha: {
        type: String,
        required: true
    }
})

mongoose.model('usuario', Usuario)
