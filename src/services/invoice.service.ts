// importaciones
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

// interfaces
interface setInvoice {
  name: string;
  userID: number;
  price: number;
}

// funciones
export async function setInvoiceService(req: setInvoice) {
  const { name, price, userID } = req;

  const userId = Number(userID);
  if (!userId || isNaN(userId)) {
    return {
      status: 400,
      message: "el id de usuario es obligatorio y debe ser un numero",
    };
  }

  try {
    const setInvoice = await prisma.invoices.create({
      data: {
        name,
        price: Number(price),
        user: {
          connect: { id: userId },
        },
      },
    });
    return {
      status: 201,
      message: setInvoice,
    };
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025: el usuario al que queremos conectar la factura no existe
      if (e.code === "P2025") {
        return {
          status: 404,
          message: "el usuario no existe",
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
