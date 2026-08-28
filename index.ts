// importaciones
import express from 'express'
import router from './src/routes/user.route'

// config
const app = express()
app.use(express.json())
const port = 3000


app.get('/', (req, res)=>{
    res.send("Hola mundo!")
})

app.use('/api/user', router)

app.listen(port, ()=>{
    console.log("http://localhost:"+port)
})