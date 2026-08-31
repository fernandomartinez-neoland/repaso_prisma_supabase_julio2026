import { prisma } from '../../lib/prisma';
import { Prisma } from '../../../generated/prisma/client';

interface setUsers {
    name: string,
    email: string,
    password: string
}
export async function setUserService(req: setUsers) {
    const { name, email, password } = req
    try {

        const setUser = await prisma.user.create({ data: { name, email } })
        console.log(setUser)
        return {
            status: 201,
            message: "usuario creado"
        }
    } catch (e: any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // 2. Comprobamos el código P2002 (Restricción única fallida)
            if (e.code === 'P2002') {
                console.log("Error de duplicado en los campos:", e.meta?.target);
                return {
                    status: 409, // 409 Conflict es la mejor práctica para duplicados
                    message: "El correo electrónico ya está registrado"
                };
            }
        }
        return {
            status: 400,
            message: "bad request"
        }
    }


}