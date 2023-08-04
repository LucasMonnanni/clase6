import fs from 'fs'
export default class ProductManager {
    constructor(path) {
        this.path = path
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path, 'utf8')
            const products = JSON.parse(data)
            this.nextProductID = Math.max(...products.map((p)=> p.id)) + 1
        } else {
            this.nextProductID = 0
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        const products = await this.getProducts()
        const idx = products.findIndex((v) => v.code == code)
        if (idx != -1) {
            console.log('Código de producto ya utilizado')
            return
        }

        if (!title || !description || !price || !thumbnail || !code || !stock ) {
            console.log(`Todos los campos son obligatorios`)
            return
        }

        const id = this.nextProductID
        this.nextProductID += 1
        const product = {
            id,
            title, 
            description,
            price,
            thumbnail,
            code,
            stock
        }
        
        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }

    getProductById = async (id) => {
        const products = await this.getProducts()
        const idx = products.findIndex((v, i) => v.id == id)
        if (idx == -1) {
            console.error(`Producto con ID ${id} no encontrado`)
            return 
        }
        return products[idx]
    }

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf8')
            return JSON.parse(data)
        } else {
            return []
        }
    }

    updateProduct = async (productData) => {
        const { id, ...data } = productData

        const products = await this.getProducts()
        //Se que estoy repitiendo unas lineas pero no quise agregar mas metodos que los que pide la consigna
        const idx = products.findIndex((v, i) => v.id == id)
        if (idx == -1) {
            console.error(`Producto con ID ${id} no encontrado`)
            return
        }
        const product = products[idx]
        Object.assign(product, data)
        
        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts()
        //Se que estoy repitiendo unas lineas pero no quise agregar mas metodos que los que pide la consigna
        const idx = products.findIndex((v, i) => v.id == id)
        if (idx == -1) {
            console.error(`Producto con ID ${id} no encontrado`)
            return
        }     
        products.splice(idx, 1)

        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }
}