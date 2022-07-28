const express = require ('express')
const req = require('express/lib/request')
const res = require('express/lib/response')
const router = express.Router()
const mongoose = require ('mongoose')
//models
require ('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')


// rotas
router.get('/posts', (req,res)=>{
    res.send('pagina de posts')  
})
// listanfo categorias 
router.get('/categorias', (req,res)=>{
    Categoria.find().sort({date:'desc'}).lean().then((categorias)=>{
       res.render('admin/categorias',{categorias: categorias})
    })
})
// aparentemente uma rota duplicada
router.get('/', (req,res)=>{
   res.render("admin/index") 
})

//adicionando categoria
router.get('/categorias/add', (req,res)=>{
    res.render("admin/addcategorias")    
})
//botão de edição 
router.get('/categorias/edit/:id', (req,res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategorias',({categoria: categoria}))
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao permitir edição desta categoria")
    })
})

//editando categoria
router.post('/categorias/edit/',(req,res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug 
        
        categoria.save().then(()=>{
            req.flash("success_msg", "Categoria editada com sucesso") // não esou conseguindo renderizar esse .flash
            res.redirect('/admin/categorias')
        }).catch((err)=>{
           
            req.flash('error_msg ','Erro ao salvar categoria')
            res.redirect('/admin/categorias')
        })

    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect('/admin/categorias')
       
    })
})
//deletando categoria
router.post('/categorias/delete', (req,res) =>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg','Categoria deletada')
        res.redirect('/admin/categorias')
        console.log('FOI')
    }).catch((err)=>{
        req.flash('error_msg', 'Erro ao deletar categoria')
        res.redirect('/admin/categorias')
        console.log('Nao foi ' +err)
    })
})
// limitandoi possibilidades do usuário em criar nomes e slugs com me
router.post('/categorias/nova', (req,res)=>{

    var erros = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        erros.push({texto: "Nome invalido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.name == null){
        erros.push({texto: "Slug invalida"})
    }
    if(erros.length > 0){
        res.render("admin/addcategorias",{erros: erros})
    }else{
    const novaCategoria = {
        nome: req.body.name,
        slug: req.body.slug
}

    new Categoria(novaCategoria).save().then(()=>{
    req.flash('success_msg','Categoria criada com sucesso')
    res.redirect("/admin/categorias")
}).catch((err)=>{
    req.flash('error_msg','Houve um erro na criação da categoria' )
    res.redirect("/admin")
    })
}
})
//listando postagens
router.get('/postagens', (req,res)=>{
    Postagem.find().populate("categoria").sort({date:"desc"}).lean().then((postagens)=>{
        res.render('admin/postagens', {postagens: postagens})
    }).catch((err)=>{
        req.flash('Erro ao listar categorias')
        res.redirect('/') 
        console.log(err)
    })
   
})
// listando categorias dentro da view addpostagens.handlebars
router.get('/postagem/add',(req,res) =>{
    Categoria.find().lean().then((categoria)=>{
    res.render('admin/addpostagens',{categoria: categoria}) 
    }).catch((err)=>{
        req.flash('error_msg', 'Erro ao listar categorias')
        res.redirect('admin')   
    })  
})
//salvando postagem
router.post('/postagem/nova',(req,res)=>{
    var erros = []
    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria invalida, registre uma nova categoria"})
        
    }if(erros.length > 0){
        res.render("admin/addpostagens",{erros: erros})
    }else{
        const novaPostagem ={
            titulo: req.body.titulo,
            slug: req.body.slug,
            categoria: req.body.categoria,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo
            // os nomes estavam incompatíveis com o fomulário criado em "addpostagens" sendo assim os dados não eram salvos no banco de dados pois o que estavam com os nomes incompatíveis simplesmente não salvavam e todos os itens do objeto Postagem são obrigatórios pelo "required"
        }
            new Postagem(novaPostagem).save().then(()=>{
            req.flash ('success_msg','categoria salva com sucesso')
            res.render('admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg', 'houve um erro durante o salvamento da posatgem')
            res.render('admin/postagens')
            
        })
    }
})
router.get('/postagem/edit/:id', (req,res)=>{
 res.render('admin/editpostagem') // colocar este trecho sem a barra no começo faz o sistema entender como um arquivo dentro da view
 
})


//editando postagem
router.post('/postagem/edit/', (req,res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagens)=>{
        
       postagens.titulo = req.body.titulo
        postagens.slug = req.body.slug

        postagens.save().then(()=>{
            req.flash("success_msg", 'Postagem salva')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('Erro ao salvar postagem')
            res.redirect('success_msg', 'Erro ao salvar categoria')
            console.log('não foi salvo')
        })
    }).catch((err)=>{
        req.flash('error_msg','Erro ao editar categoria')
        res.redirect('/admin/postagens')
        console.log('não foi')
    })
    
})
// deletando postagem
router.post ('/postagem/delete', (req,res) =>{
    Postagem.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Postagem deletada')
        res.redirect('/admin/postagens')
        console.log('foi')
        console.log(id)
    }).catch((err) =>{
        req.flash('error_msg', 'Nao foi possivel deletar postagem')
        res.redirect('/admin/postagens')
        console.log('Nao foi')
    })
})

module.exports = router
