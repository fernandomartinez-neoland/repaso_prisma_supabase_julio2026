import {setUserService, loginService} from '../services/user/user.service'

export async function setUserController(req:any, res:any){
const serviceRsponse=await setUserService(req.body)
    
    res.status(serviceRsponse.status).send(serviceRsponse.message)
}

export async function loginController(req:any, res:any){

    res.send(await loginService(req.body))
}