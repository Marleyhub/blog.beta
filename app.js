const express = require ('express')
const handlebars = require ('express-handlebars')
const mongoose = require ('mongoose')
//const bodyparser = require ('body-parser')
const app = express()
const path = require ("path")
const admin = require('./routes/admin')
const session = require ('express-session')
const flash = require ('connect-flash')
const req = require('express/lib/request')
const res = require('express/lib/response')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
require ('./models/Categoria')
const Categoria = mongoose.model('categorias')




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
//ao chamar arquivos soltos da view não existe a necessidade da barra 
app.get('/posts', (req,res)=>{
//ao chamar "postagens" em "/then" é feita referência a declaração feita pra chamar o model referente, lá foi declarado e aqui  
   Postagem.find().populate("categoria").sort({data: "desc"}).lean().then((postagens)=>{
      res.render("index",{postagens: postagens})
   }).catch((err)=>{
      req.flash('error_msg', 'erro ao carregar postagens')
      res.redirect('/404')
      console.log(err)
   })
})

// pagina de categorias
app.get('/categorias', (req,res)=>{
   Categoria.find().sort({date: "desc"}).lean().then((categorias)=>{
      res.render('categorias/index', {categorias: categorias})
   }).catch((err)=>{
      req.flash('error_msg', "Erro ao carregar categorias")
      res.redirect('/')
      console.log(err)
   })
   
})

//Direcionando para a descrição de uma categoria específica
app.get('categorias/:slug',(req,res)=>{
   Postagem.findOne({slug: req.params.slug}).sort({date:"desc"}).lean().then((categorias)=>{
      res.render('categorias/posts',{categorias: categorias, postagens: postagens})
   }).catch((err)=>{
      res.redirect('/categorias')
      req.flash('error_msg', "Erro ao carregar categoria")
      console.log(err)
   })
})

//Página de erros
app.get('/404', (req,res) =>{
   res.send('Error 404')
   res.end()
})

// referenciando a nossa página de rotas
app.use('/admin', admin)
//referenciando local de arquivos estáticos 
app.use(express.static(path.join(__dirname,"public")))


const Port = 3002
app.listen (Port,() =>{
   console.log('servidor rodando na porta 3002')
})

