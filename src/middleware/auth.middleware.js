import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import "dotenv"

const verifyToken = async (req, res, next) => {
  try {
    // cookie mein se token nikalo
    const token = req.cookies?.token

    // agar token hai hi nahi toh seedha rokk do
    if (!token) {
      return res.status(401).json({ message: "pehle login karo bhai" })
    }

    // token sahi hai ya fake - verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // decoded mein userId hoga jo humne token banate waqt daala tha

    // us userId se user ka data DB se lo
    const user = await User.findById(decoded.userId).select("-password")
    // select("-password") matlab password wali field mat bhejo

    if (!user) {
      return res.status(401).json({ message: "user nahi mila" })
    }

    // user ko request object mein daaldo taaki aage controllers mein kaam aaye
    req.user = user

    // sab theek hai, aage badho
    next()
  } catch (error) {
    // agar token expire ho gaya ya galat hai
    return res.status(401).json({ message: "token sahi nahi hai, dobara login karo" })
  }
}

export default verifyToken
