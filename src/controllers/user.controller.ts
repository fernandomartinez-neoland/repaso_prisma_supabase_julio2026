import {setUserService} from '../services/user.service'

export async function setUserController(req:any, res:any){
    res.send(await setUserService(req.body))
}