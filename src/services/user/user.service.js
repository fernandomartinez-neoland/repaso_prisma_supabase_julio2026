// importaciones
import { prisma } from "../../lib/prisma.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { hashPassword, comparePass } from "../bcrypt/bcrypt.service.js";
import { createToken } from "../token/token.service.js";
// funciones
export async function setUserService(req) {
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
    }
    catch (e) {
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
export async function loginService(req) {
    try {
        const getUser = await getUserService(req.email);
        if (!getUser || !getUser.password) {
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
        const token = createToken({ name: getUser.name, email: getUser.email });
        console.log(token);
        return {
            status: 200,
            message: {
                token,
            },
        };
    }
    catch (e) {
        console.log(e);
        return { status: 400, message: "error de login" };
    }
}
export async function getUserService(email) {
    return await prisma.user.findFirst({
        where: { email },
    });
}
export async function updateUserService(req, file = null) {
    const { name, email, password } = req;
    try {
        const updateUser = await prisma.user.update({
            where: {
                email,
            },
            data: {
                name,
                email,
                password,
                img: file ? file.replace("\\", "/") : null,
            },
        });
        return {
            status: 200,
            message: "todo bien",
        };
    }
    catch (e) {
        console.log(e);
        return {
            status: 400,
            message: "todo mal"
        };
    }
}
