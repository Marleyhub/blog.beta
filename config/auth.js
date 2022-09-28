const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Model
require('../models/Usuario')
const Usuario = mongoose.model('usuario')

//autenticando login
module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'},(email,senha,done)=>{
        Usuario.findOne({email: email}).then((usuario)=>{
            if(!usuario){
                return done(null, false,{message: 'Usuario ou senha incorretos'})
            }
            bcrypt.compare(senha, usuario.Senha, (erro, batem)=>{
                if(erro){
                    return done(null,false,{message: 'Senha incorreta'})
                }else{
                    return done(null, usuario)
                }
            })
        })
    }))
}
passport.serializeUser((usuario, done)=>{
    done(null, usuario.id)
})

passport.deserializeUser((id, done)=>{
    Usuario.findById(id,(err, usuario)=>{
        done(err, usuario)
    })
})



