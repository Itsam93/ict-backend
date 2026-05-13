import express from "express";
import { loginAdmin } from "../controllers/authController.js";

const router = express.Router();

// register only once and disable
// router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

export default router;  