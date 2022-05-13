const express = require ('express')
const handlebars = require ('express-handlebars')
const res = require('express/lib/response')
//const mongoose = require ('mongoose')
//const bodyparser = require ('body-parser')
const app = express()
const path = require ("path")
const admin = require('./routes/admin')


// tamplate engine 
app.engine('handlebars', handlebars.engine({defaultlayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({extended:false}))
app.use(express.json())

// rotas
app.get ('/', (req,res)=>{
   res.send('home')
})
app.get('posts', (req,res)=>{
   res.send('listas de posts')
})

// referenciando a nossa página de rotas
app.use('/admin', admin)
//referenciando local de arquivos estáticos 
app.use(express.static(path.join(__dirname,"public")))

const Port = 3002
app.listen (Port,() =>{
   console.log('servidor rodando na porta 3002')
})

