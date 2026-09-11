// importaciones
import express from 'express'
import userRouter from './src/routes/user.route.js'
import invoiceRouter from './src/routes/invoice.route.js'
import { userMiddleware } from './src/middleware/middleware.js'
import ragRouter from './src/routes/rag.route.js';
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

// config
const app = express()
app.use(express.json())
app.use(cors({
  origin: '*', // Da acceso explícito a tu app de Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Permite estos métodos
  allowedHeaders: ['Content-Type', 'Authorization'], // ¡CRÍTICO! Permite el header que envía tu interceptor
  optionsSuccessStatus: 200
}));
const port = process.env.PORT;


app.get('/', (req, res) => {
    console.log("holi")
    res.send("Hola mundo!")
})

app.use('/api/user', userRouter)
app.use('/api/invoices', userMiddleware, invoiceRouter)
app.use('/api/rag', ragRouter);

app.listen(port, () => {
    console.log("http://localhost:" + port)
})