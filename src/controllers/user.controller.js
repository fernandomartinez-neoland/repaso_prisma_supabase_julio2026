import { setUserService, loginService, updateUserService, } from "../services/user/user.service.js";
export async function setUserController(req, res) {
    const serviceRsponse = await setUserService(req.body);
    res.status(serviceRsponse.status).send(serviceRsponse.message);
}
export async function loginController(req, res) {
    const login = await loginService(req.body);
    res.status(login.status).send(login.message);
}
export async function updateUserController(req, res) {
    const response = await updateUserService(req.body, req.file?.path ?? null);
    res.status(response.status).send(response.message);
}
