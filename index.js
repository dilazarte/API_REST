const express = require('express')
const {Router} = express
const {Contenedor} = require('./contenedor')

const app = express()
const router = Router()
const container = new Contenedor('./productos.json')

const server = app.listen(8080, ()=>{
    console.log("Server listening on port 8080")
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api', router); //Uso la ruta /API para el router--

//Defino las rutas del router con sus metodos

//Rutas GET para obtener todos los producto y por id
router.get('/productos', async (req, res)=>{
    try{
        let productos = await container.getAll()
        //res.json(productos)
        if(productos.length > 0){
            res.status(200).json(productos)
        }else{
            res.status(404).json({"error":"productos no encontrados"})
        }
    }
    catch(err){
        res.json({"error": err})
    }
})

router.get('/productos/:id', async (req, res)=>{
    try{
        let producto =  await container.getById(req.params.id)
        if(producto.length > 0){
            res.status(200).json(producto)
        }else{
            res.status(404).json({"error":"producto no encontrado"})
        }
    }
    catch(err){
        res.json({"error:": err})
    }
})


//POST para agregar nuevo producto:
router.post('/productos', async (req, res)=>{
    let producto = req.body
    producto.price = parseInt(producto.price)
    let id = await container.save(producto)
    res.json({"Estado:":`Se agrego correctamente el nuevo producto con nro de id: ${id}`})
})

//PUT para editar!

router.put('/productos/:id', async (req, res)=>{
    try{
        let data = await container.editById(req.params.id, req.body)
        res.json({status: data})
    }
    catch(err){
        res.json({"error": err})
    }
})

//DELETE
router.delete('/productos/:id', async (req, res)=>{
    try{
        let id = parseInt(req.params.id)
        await container.deleteById(id)
        res.status(200).json({status: `Se borro el producto con id: ${id}`})
    }
    catch(error){
        res.json({"error": error})
    }
})

//Carpeta public e index.html.-
app.use(express.static('public'))
app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/public/index.html')
})