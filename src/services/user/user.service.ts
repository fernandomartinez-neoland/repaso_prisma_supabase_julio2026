// importaciones
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { hashPassword, comparePass } from "../bcrypt/bcrypt.service";
import {createToken} from '../token/token.service'

// interfaces
interface setUsers {
  name: string;
  email: string;
  password: any;
}
interface setLogin {
  email: string;
  password: string;
}

// funciones
export async function setUserService(req: setUsers) {
  const { name, email, password } = req;
  try {
    const hashPass = await hashPassword(password);
    console.log("clave hasheada: ", hashPass);
    const setUser = await prisma.user.create({
      data: { name, email, password: hashPass },
    });
    console.log(setUser);
    return {
      status: 201,
      message: "usuario creado",
    };
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // 2. Comprobamos el código P2002 (Restricción única fallida)
      if (e.code === "P2002") {
        console.log("Error de duplicado en los campos:", e.meta?.target);
        return {
          status: 409, // 409 Conflict es la mejor práctica para duplicados
          message: "El correo electrónico ya está registrado",
        };
      }
    }
    console.log(e);
    return {
      status: 400,
      message: "bad request",
    };
  }
}

export async function loginService(req: setLogin) {
  try {
    const getUser = await prisma.user.findFirst({
      where: { email: req.email },
    });
    if (!getUser) {
      return {
        status: 400,
        message: "clave o correo incorrectos",
      };
    }
    const compPass = await comparePass(req.password, getUser.password);

    if (!compPass) {
      return {
        status: 400,
        message: "clave o correo incorrectos",
      };
    }
    const token=createToken({name:getUser.name, email:getUser.email})
    console.log(token)
    return { status: 200, message: {
        token
    } };
  } catch (e) {
    console.log(e)
    return { status: 400, message:"error de login"
  }
}
