import { verifyToken } from "../services/token/token.service.js";
import { getUserService } from '../services/user/user.service.js';
export async function userMiddleware(req, res, next) {
    try {
        const token = req.headers['authorization'];
        const translateToken = verifyToken(token.replace('Bearer ', ''));
        console.log(translateToken.data.email);
        const userData = await getUserService(translateToken.data.email);
        req.body.userID = userData?.id;
        console.log("Este es el body:", req.body.user);
        next();
    }
    catch (e) {
        console.log(e);
        res.status(401).send("error de token");
    }
}
