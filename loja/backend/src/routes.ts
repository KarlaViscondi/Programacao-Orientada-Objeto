
import { prisma } from './lib/prisma'
import {z} from 'zod'
import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'

export async function AppRoutes(app: FastifyInstance){
    //define rota - criar usário
    app.post('/user', async (request) => {
        const userPost = z.object({
            username: z.string(),
            password: z.string(),
            email: z.string().email()
        })
        const {username, password, email} = userPost.parse(request.body)
        const newUser = await prisma.user.create({
            data:{
                username,
                password,
                email
            }
        })
        return newUser
    })
    //define uma rota que consulta todos os produtos 
    app.get('/products', async()=>{
        const products = await prisma.product.findMany()
        return products
    })
    //
    app.get('/users', async()=>{
        const users = await prisma.user.findMany()
        return users
    })
    //define rota que consulta todos os produtos de um determinado usuario
    app.get('/products/:userid', async(request)=>{
        const userIdParams = z.object({
            userid: z.string().uuid()
        })
        const {userid} = userIdParams.parse(request.params)
        const products = await prisma.product.findMany({
            where: {
                userid: userid
            }
        })
        return products
    })
    app.get('/productById/:id', async (request) => {
        const idParam = z.object({
            id: z.string().uuid()
        })
        const {id} = idParam.parse(request.params)
        const product = await prisma.product.findUnique({
            where: {
                id
            }
        })
        return product
    })
    // define uma rota que consulta os produtos no bd que inicia com o nome x
    app.get('/productByName/:name', async(request)=>{
        // recupera o name informado pelo frontend
        const nameParam = z.object({
            name: z.string()
        })
        const {name} = nameParam.parse(request.params)
        const products = await prisma.product.findMany({
            where: {
                name:{
                    startsWith: name}}
        })
        return products
    })
    //define uma rota que cria um produto no banco de dados, usando o verbo  post
    app.post('/product', async (request) =>{
        //recupera os dados do corpo da requisição
        //baixr zod, npm install zod
        const createProductBody = z.object({
            name: z.string(),
            description: z.string(),
            quantity: z.number(),
            userid: z.string().uuid()
        })
        const {name, description, quantity, userid} = createProductBody.parse(request.body)
        //insere o produto no bd
        //recupera a data atual - de hoje
        // baixar biblioteca dayjs
        //criar data
        const today = dayjs().startOf('day').toDate() // sem hora, min e seg
        let newProduct = await prisma.product.create({
            data: {
                name,
                description,
                quantity,
                created_at: today,
                userid
            }
        })
        return newProduct
    })
    //rota para atualizar a quantidade em estoque - compra
    app.patch('/product/compra', async (request) => {
        const compraBody = z.object({
            id: z.string().uuid(),
            x: z.number()
        })
        const {id, x} = compraBody.parse(request.body)
        let productUpdated = await prisma.product.update({
            where: {
                id: id
            },
            data: {
                quantity: {
                    increment: x
                }
            }
        })
        return productUpdated
    })
    //rota para atualizar a quantidade em estoque - venda
    app.patch('/product/venda', async (request) => {
        const vendaBody = z.object({
            id: z.string().uuid(),
            x: z.number()
        })
        const {id, x} = vendaBody.parse(request.body)
        let resp = await prisma.product.updateMany({
            where: {
                id: id,
                quantity: {
                    gte: x
                }
            },
            data: {
                quantity: {
                    decrement: x
                }
            }
        })
        if (resp.count>0) {
            let productUpdated = await prisma.product.findMany({
                where: {
                    id:id
                }
            })
            let response = {
                status: "Venda com sucesso",
                product: productUpdated
            }
            return response
        }else {
            let response = {
                status: "Itens insuficientes"
            }
            return response
        }
    })
    //rota para remover produto, usando o verbo delete
    app.delete('/product/:id', async (request) => {
        //recupe o id para a remoção
        const idParam = z.object({
            id: z.string().uuid()
        })
        const {id} = idParam.parse(request.params)
        //remove o produto
        let productDelete = await prisma.product.delete({
            where: {
                id: id
            }
        })
        return productDelete
    })
    //rota para atualizar mais de um campo
    app.put('/product', async (request) => {
        //cria objeto zod
        const putBody = z.object({
            id: z.string().uuid(),
            name: z.string(),
            description: z.string(),
            quantity: z.number()
        })
        //recupera os dados do frontend
        const{id, name, description, quantity} = putBody.parse(request.body)
        //atualiza no banco de dados
        const productUpdate = await prisma.product.update({
            where: {
                id: id,
            },
            data: {
                name,
                description,
                quantity
            }
        })
        return productUpdate
    })
}

//get - consulta
//post - insere
//delete - remove
//put - atualiza registro inteiro
//patch - atualiza um campo específicio
//teste