import {setUserService} from '../services/user.service'

export async function setUserController(req:any, res:any){
const serviceRsponse=await setUserService(req.body)
    
    res.status(serviceRsponse.status).send(serviceRsponse.message)
}