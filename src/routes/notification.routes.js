import express from "express"
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notification.controller.js"
import verifyToken from "../middleware/auth.middleware.js"

const router = express.Router()

// yeh saari routes protected hain - verifyToken har ek pe lagega
router.get("/", verifyToken, getNotifications)
router.patch("/:id/read", verifyToken, markAsRead)
router.patch("/read-all", verifyToken, markAllAsRead)

export default router
