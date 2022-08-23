const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Model
require('../models/Usuario')
const Usuario = mongoose.model('usuario')

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email'},(email,senha,done)=>{
        Usuario.findOne({email: email}).then((usuario)=>{
            if(!usuario){
                return done(null, false,{message: 'Usuario ou senha incorretos'})
            }
            bcrypt.compare(senha, usuario.senha, (erro, batem)=>{
                if(batem){
                    return done(null, user)
                }else{
                    return done(null,false,{message: 'Senha incorreta'})
                }
            })
        })
    }))
}
passport.serializerUser((usuario, done)=>{
    done(null, usuario.id)
})

passport.deserializerUsser((id, done)=>{
    User.findById(id,(err, usuario)=>{
        done(err, user)
    })
})



