const express = require ('express')
const router = express.Router()
const mongoose = require ('mongoose')
require ('../models/Categoria')
// referenciando um model a uma constante 
const Categoria = mongoose.model('categorias')
//const Postagem = mongoose.model('postagens')


// rotas

router.get('/posts', (req,res)=>{
    res.send('pagina de posts')
})
router.get('/categorias', (req,res)=>{
    Categoria.find().sort({date:'desc'}).lean().then((categorias)=>{
       res.render('admin/categorias',{categorias: categorias})
    })
   // res.render('admin/categorias')
})
router.get('/', (req,res)=>{
   res.render("admin/index") 
})
router.get('/categorias/add', (req,res)=>{
    res.render("admin/addcategorias")    
})
router.get('/categorias/edit/:id', (req,res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategorias',({categoria: categoria}))
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao permitir edição desta categoria")
    })
    
})
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
router.get('/postagem', (req,res)=>{
    res.render('admin/postagem')
})
router.get('/postagem/add',(req,res) =>{
    res.render('admin/addpostagens')
})
router.post('postagem/add/:id',(req,res)=>{
    Postagem.save({_id: req.body.id}).then(()=> {
        req.flash("Postagem salva com sucesso")
        res.redirect('admin/postagem')
    }).catch((err)=>{
        req.flash('Erro ao salvar postagem')
        res.redirect('admin/postagem')
        
    })
})
module.exports = router
