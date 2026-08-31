import express from 'express'
import {setInvoiceController} from '../controllers/invoice.controller'

const router= express.Router()

router.post('/setInvoice', setInvoiceController)


export default router;