import express from "express"
import { register, login, logout, getMe } from "../controllers/auth.controller.js"
import verifyToken from "../middleware/auth.middleware.js"

const router = express.Router()

// public routes - koi bhi access kar sakta hai
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)

// protected route - sirf logged in user access kar sakta hai
// verifyToken pehle chalega, agar sab theek toh getMe chalega
router.get("/me", verifyToken, getMe)

export default router