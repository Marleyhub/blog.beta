const express = require ('express')
const router = express.Router()

router.get('/posts', (req,res)=>{
    res.send('pagina de posts')
})
router.get('/cat', (req,res)=>{
    res.send('pagina de categorias')
})
router.get('/', (req,res)=>{
   res.render("index") // nessa parte aqui não quer renderizar, por algum motivo a função render não está achando a pasta "admin" pra renderizar o arquivo "index.hendlebars" está dando o erro "Error: ENOENT: no such file or directory, open '/home/gabriel/Documents/project/views/layouts/main.handlebars'"
})

module.exports = router
