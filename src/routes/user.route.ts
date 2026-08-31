import express from 'express'
import { setUserController, loginController } from '../controllers/user.controller'

const router= express.Router()

router.post('/setUser', setUserController)
router.get('/login', loginController)

export default router