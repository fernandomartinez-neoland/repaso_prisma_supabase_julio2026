import express from 'express';
import { setInvoiceController } from '../controllers/invoice.controller.js';
const router = express.Router();
router.post('/setInvoice', setInvoiceController);
export default router;
