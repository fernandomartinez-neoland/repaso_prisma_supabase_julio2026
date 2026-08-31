import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { hashPassword } from "../bcrypt/bcrypt.service";
interface setUsers {
  name: string;
  email: string;
  password: any;
}
export async function setUserService(req: setUsers) {
  const { name, email, password } = req;
  try {
    const hashPass = await hashPassword(password);
    console.log("clave hasheada: ",hashPass)
    const setUser = await prisma.user.create({
      data: { name, email, "password": hashPass },
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
