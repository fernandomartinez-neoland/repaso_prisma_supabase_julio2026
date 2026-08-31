import { verifyToken } from "../services/token/token.service";

import{getUserService} from '../services/user/user.service'

export async function userMiddleware(req: any, res: any, next: any) {
try{
const token=  req.headers['authorization']

    
    const translateToken=verifyToken(token.replace('Bearer ', ''))
    console.log(translateToken.data.email)
    const userData= await getUserService(translateToken.data.email)
    req.body.user=userData?.id
    console.log("Este es el body:",req.body.user)
    next()
}catch(e){

    console.log(e)
    res.status(401).send("error de token");
}
    
}
