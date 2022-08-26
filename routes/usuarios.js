const bcrypt = require('bcryptjs/dist/bcrypt')
const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuario')
const passport = require('passport')


router.get('/cadastro', (req,res)=>{
    res.render('usuario/cadastro')
})
//Criando usuario
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
        //Conferindo email no banco de dados 
        Usuario.findOne({Email: req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash('error_msg', 'Usuario já cadastrado')
                res.redirect('/usuario/cadastro')
                console.log(usuario)
            }else{
                const novoUsuario = new Usuario({
                    Nome: req.body.nome,
                    Email: req.body.email,
                    Senha: req.body.senha
                })
                bcrypt.genSalt(10,(erro,salt)=>{
                    bcrypt.hash(novoUsuario.Senha, salt, (erro,hash) =>{
                        if(erro){
                        req.flash("error_msg", 'houve um erro interno no cadastro da senha')
                        res.redirect('/')
                        console.log('erro no hash')
                    }
                    novoUsuario.Senha = hash
                    
                    novoUsuario.save().then(()=>{
                        req.flash('success_msg','Usuario criado com sucesso')
                        res.redirect('/')
                        console.log('foi')
                    }).catch((err)=>{
                        req.flash('error_msg', 'Houve um erro registrar novo usuario')
                        res.send('/')
                        console.log(err)
                        console.log('erro no salvamento')
                    })

                    })
                })
               
             }
        
        })
        
    }
})

router.get('/log', (req,res)=>{
 res.render('usuario/log')
})

router.post('/login', (req,res,next)=>{
    passport.authenticate("local",  {
        successRedirect: "/",
        failureRedirect: "/usuario/log",
        failureFlash: true
    })(req,res,next)
    
})


module.exports = router
