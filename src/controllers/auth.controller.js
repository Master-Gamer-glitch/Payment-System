import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

// Registeration logic;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
   
    // hamariii adhuri bodyyy;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "kyc bhi ni krte aati kuch logo ko..."});
    }

    // already acc banake toh ni baitha;
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error("Alr existing user..");
    }
    
    // Create new user (password is automatically hashed by db schema: thanks aayush 🙏🏻);
    const user = await User.create({ name, email, password })
    
    // JWT signing;
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })
    
    //cookieeee
    const exp = Number(process.env.JWT_EXPIRES_IN.split("d")[0]); // aaiyo very smartttt 
    
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * exp, // hehe sab dynamic hoshiyaar hu m 🗿
    })
    
    // Send response (excluding password)
    res.status(201).json ({ message: "SadakPe aapka khata khul gya hai :)", user: { id: user._id, name: user.name, email: user.email, balance: user.balance }})
  } 
  
  catch (error) {
    console.log(error);
    return res.status(400).json({ message: "appreciate your love towards SadakPe but kripya hame SadakPe na laaye..!" })
  }
}

// Login logic;
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).send({ message: "hoshiyaar banegaaa??" })
    }
  
    // galat email ya account banaye bina toh nahi login krra;
    const user = await User.findOne({ email })
  
    if(!user){
      return res.status(401).send({ message: "Wrong email..Register krle pehle??" })    
    }

    // pwd galat toh nahi? hecker hai bhai;
    const isPasswordMatch = await user.isPasswordCorrect(password) // User model me aayush ki di hui method huehue;
    if (!isPasswordMatch) {
      return res.status(401).send({ message: "Wrong password, 1 attempt left before I explode your account and take all money for myself.💥" })
    }

    // jwt againnn;
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    // coookieee: udhay bhaiya ke liye 🍪;
    const exp = Number(process.env.JWT_EXPIRES_IN.split("d")[0]); // 7 as int;

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 *  exp})

    // yayy success;
    res.status(200).json({
      message: "Login done babyy",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
      },
    })

  } catch (err) {
    res.status(401).json({ message: "Politely speaking dubara ye harkat na kare; ", error: err.message })
  }
}

// Logout logic;
export const logout = async (req, res) => {
  try {

    // bas cookie overwrite krdo... basically tempering w the og cookie taaki next time verification fail ho jaye;

    res.cookie("token", null , { httpOnly: true, expires: new Date(0) }) // lol expires in 1970 baba adam ke zamaane me hi margya login;

    res.status(200).send({ message: "Ji ham aapke hai kon?? " })

  } 
  catch (err) {
    console.log("Logout Error:", err)
    res.status(500).send({ message: "We just coudnt let such a cutie go :(\n\n", error: err.message })
  }
}

// GetMe babyy;
export const getMe = async (req, res) => {
  try {

    // middleware ne alr token verify krke req me daaldia tha userinfo;
    return res.status(200).send({ user: { id: req.user._id, name: req.user.name, email: req.user.email, balance: req.user.balance }})

  } catch (err) {
    console.log("getMe Error: ", err)
    res.status(500).send({ message: "charishma so good we fell..\n\n", error: err.message })
  }
}