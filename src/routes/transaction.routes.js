import express from "express"
import { sendMoney, getHistory, topUp } from "../controllers/transaction.controller.js"
import verifyToken from "../middleware/auth.middleware.js"

const router = express.Router()

// yeh saari routes protected hain - verifyToken har ek pe lagega
router.post("/send", verifyToken, sendMoney)
router.get("/history", verifyToken, getHistory)
router.post("/topup", verifyToken, topUp)

export default router
