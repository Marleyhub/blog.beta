const express = require ('express')
const handlebars = require ('express-handlebars')
const mongoose = require ('mongoose')
const app = express()
const path = require ("path")
const session = require('express-session')
const admin = require('./routes/admin')
const usuario = require('./routes/usuarios')
const flash = require ('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
require ('./models/Categoria')
const Categoria = mongoose.model('categorias')
const passport = require('passport')

const Port = 3002


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
//ao chamar "postagens" em "/then" é feita referência a declaração feita pra chamar o model referente, lá foi declarado e aqui solicitado 
   Postagem.find().populate("categoria").sort({data: "desc"}).lean().then((postagens)=>{
      res.render("index",{postagens: postagens})
   }).catch((err)=>{
      req.flash('error_msg', 'erro ao carregar postagens')
      res.redirect('/404')
      console.log(err)
   })
})

app.get('/log',(req,res)=>{
   res.render('usuarios/cadastro')
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
app.get('/categorias/:slug',(req,res)=>{
   Postagem.findOne({slug: req.params.slug}).lean().then((categoria)=>{
      if(categoria){
         Postagem.find({categorias: categorias._id}).lean().then((postagens)=>{
            res.render('categorias/posts', {categoria: categoria , postagens: postagens})
         }).catch((err)=>{
            res.redirect('/')
            req.flash('error_msg', "Erro ao carregar categoria")
            console.log(err)
         })
      }else{
         req.flash ('error_msg', "Categoria não existe")
         res.redirect('/')
         console.log('deu ruim')
      }
   })
})

//Página de erros
app.get('/404', (req,res) =>{
   res.send('Error 404')
   res.end()
})

// referenciando as nossas página de rotas
app.use('/admin', admin)
app.use('/usuario', usuario)


//referenciando local de arquivos estáticos
app.use(express.static(path.join(__dirname,"public")))

// express http server 
app.listen (Port,() =>{
   console.log('servidor rodando na porta 3002')

})

