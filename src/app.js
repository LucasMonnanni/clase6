import express from 'express';
import ProductManager from './productManager.js';

const app = express();
const pm = new ProductManager('./products.json')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
    let products = await pm.getProducts()
    const start = req.query.start ?? 0
    const limit = req.query.limit
    if (limit) {
        products = products.splice(start, limit)
    }
    res.send(products)
})

app.get('/products/:pid', async (req, res) => {
    const id = req.params.pid
    const product = await pm.getProductById(id)

    if (!product) {res.status(404).send({status: 'Error', error: 'No existe un producto con el ID indicado'})}

    res.send(product)
})

app.listen(8080, () => {
    console.log('Server listening on port 8080')
})
