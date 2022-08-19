const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')

router.get('/cadastro', (req,res)=>{
    res.render('usuario/cadastro')
})

module.exports = router
