// importaciones
import { prisma } from "../lib/prisma";
import { Prisma } from "../../generated/prisma/client";

// interfaces
interface setInvoice {
  name: string;
  user: number;
  price: number;
}

// funciones
export async function setInvoiceService(req: setInvoice) {
  const { name, price, user } = req;

  const userId = Number(user);
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
