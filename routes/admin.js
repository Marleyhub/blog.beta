const express = require ('express')
const router = express.Router()

router.get('/posts', (req,res)=>{
    res.send('pagina de posts')
})
router.get('/cat', (req,res)=>{
    res.send('pagina de categorias')
})
router.get('/', (req,res)=>{
   res.render("admin/index")
})

module.exports = router