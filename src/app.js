import express from "express"
import authRouter from "./routes/auth.routes"
import cookieParser from "cookie-parser"
const app = express()
import accountRouter from "./routes/account.routes"
import transactionRouter from "./routes/transaction.routes"

app.use(express.json()) // ye ek middle ware jo bhi body bahar se aayingi json me usko javascript me convert karenga

app.use(cookieParser()) // ye bhi middle ware hai jo cookies se aati hai usko parse karta hai js me.....

app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRouter)


export default app
