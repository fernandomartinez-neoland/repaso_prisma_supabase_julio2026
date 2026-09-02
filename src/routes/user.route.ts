import express from "express";
import {
  setUserController,
  loginController,
  updateUserController,
} from "../controllers/user.controller";

import {profileImg} from '../middleware/multer.middleware'
const router = express.Router();

router.post("/setUser", setUserController);
router.get("/login", loginController);
router.patch("/updateUser", profileImg, updateUserController);

export default router;
