import {
  setUserService,
  loginService,
  updateUserService,
} from "../services/user/user.service";

export async function setUserController(req: any, res: any) {
  const serviceRsponse = await setUserService(req.body);

  res.status(serviceRsponse.status).send(serviceRsponse.message);
}

export async function loginController(req: any, res: any) {
  const login = await loginService(req.body);
  res.status(login.status).send(login.message);
}

export async function updateUserController(req: any, res: any) {

    const response = await updateUserService(req.body)
  res.status(response.status).send(response.message);
}
