const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuario')


router.get('/cadastro', (req,res)=>{
    res.render('usuario/cadastro')
})

router.post('/criar',(req,res)=>{
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || typeof req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.email || typeof req.body.email == undefined || typeof req.body.email == null){
        erros.push({texto: 'Email inválido'})
    }
    if (!req.body.senha || typeof req.body.senha == undefined || typeof req.body.senha == null){
        erros.push({texto: 'Senha inválida'})
    }
    if (req.body.senha2 != req.body.senha){
        erros.push({texto: 'Senhas incompatíveis, tente novamente'})
    }    
    if(req.body.senha.length < 6 || req.body.senha.length > 10){
        erros.push({texto: 'A senha deve conter entre 6-10 caracteres'})
    }
    if(erros.length > 0){
        res.render('usuario/cadastro', {erros: erros})
       
    }else{

        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash('error_msg', 'Usuario já cadastrado')
                res.redirect('/cadastro')
            }else{
                const novoUsuario = {
                    Nome: req.body.nome,
                    Email: req.body.email,
                    Senha: req.body.senha
                }
                new Usuario(novoUsuario).save().then(()=>{
                    req.flash('succes_msg','Usuario criado com sucesso')
                    res.redirect('/usuario/cadastro')
                    console.log('foi')
                }).catch((err)=>{
                    req.flash('error_msg', 'Houve um erro registrar novo usuario')
                    res.redirect('/usuario/cadastro')
                    console.log(err)
                })
             }
        })
        
    }
})

router.get('/login', (req,res)=>{
    res.render('usuario/login')
})


module.exports = router
