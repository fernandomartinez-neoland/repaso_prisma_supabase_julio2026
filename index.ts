// importaciones
import express from 'express'
import userRouter from './src/routes/user.route'
import invoiceRouter from './src/routes/invoice.route'
import { userMiddleware } from './src/middleware/middleware'

// config
const app = express()
app.use(express.json())
const port = 3000


app.get('/', (req, res)=>{
    res.send("Hola mundo!")
})

app.use('/api/user', userRouter)
app.use('/api/invoices',userMiddleware, invoiceRouter )

app.listen(port, ()=>{
    console.log("http://localhost:"+port)
})