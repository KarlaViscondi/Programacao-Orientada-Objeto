import Fastify from 'fastify'
const app = Fastify()
import cors from '@fastify/cors'
app.register(cors) //perimite que qualquer pc ou ip utilize as rotas
import {AppRoutes} from './routes'
app.register(AppRoutes)

//fica escutando esperando a requisição
app.listen({
    port: 3333,
})
.then( () => {
    console.log('Http Server running')
})

//get - consulta
//post - insere
//delete - remove
//put - atualiza registro inteiro
//patch - atualiza um campo específicio