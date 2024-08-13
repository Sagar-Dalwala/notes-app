import express from "express";
import { createUser, getUser, loginUser } from "../controllers/user.controllers.js";
import { authenticateToken } from "../utilities.js";

const router = express.Router();

router.post("/create-account",createUser);

router.post("/login",loginUser);

router.get("/get-user",authenticateToken,getUser);

export default router;