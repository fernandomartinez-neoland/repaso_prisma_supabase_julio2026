import { setInvoiceService } from '../services/invoice.service.js';
export async function setInvoiceController(req, res) {
    const setInvoice = await setInvoiceService(req.body);
    res.status(setInvoice.status).send(setInvoice.message);
}
