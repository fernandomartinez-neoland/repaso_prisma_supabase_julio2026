import express from "express";
import { setUserController, loginController, updateUserController, } from "../controllers/user.controller.js";
import { profileImg } from '../middleware/multer.middleware.js';
const router = express.Router();
router.post("/setUser", setUserController);
router.get("/login", loginController);
router.patch("/updateUser", profileImg, updateUserController);
export default router;
