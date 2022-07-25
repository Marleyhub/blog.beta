const express = require ('express')
const handlebars = require ('express-handlebars')
const mongoose = require ('mongoose')
//const bodyparser = require ('body-parser')
const app = express()
const path = require ("path")
const admin = require('./routes/admin')
const session = require ('express-session')
const flash = require ('connect-flash')



// moogose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/blogapp").then(()=>{
   console.log('conectado ao Mongo')
}).catch((err)=>{
   console.log("erro ao conectar: Mongo" +err)  
})
// tamplate engine 
app.engine('handlebars', handlebars.engine({defaultlayout: 'main'}))
app.set('view engine', 'handlebars')



app.use(express.urlencoded({extended:false}))
app.use(express.json())

//session(middleware ultilizada para manipular dados de requisições ou envio de dados do servidor)
app.use(session({
   secret: 'cursodenode',
   resave: true,
   saveUninitialized: true
}))
//flash (apresenta aplicações temporarias)
app.use(flash())
// ultilizando variaveis globais em uma middleware
app.use((req,res,next)=>{
   res.locals.sucess_msg = req.flash('success_msg')
   res.locals.error_msg = req.flash('error_msg')
   next()
})
// rotas config   
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

