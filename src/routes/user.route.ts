import express from 'express'
import { setUserController } from '../controllers/user.controller'

const router= express.Router()

router.post('/setUser', setUserController)

export default router