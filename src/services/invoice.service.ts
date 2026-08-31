import { prisma } from "../lib/prisma";

interface setInvoice {
  name: string;
  user: number;
  price: number;
}

export async function setInvoiceService(req: setInvoice) {
  const { name, price, user } = req;
  const setInvoice = await prisma.invoices.create({
    data: {
      name,
      price,
      user: {
        connect: { id: user },
      },
    },
  });
  return {
    status: 200,
    message: setInvoice,
  };
}
