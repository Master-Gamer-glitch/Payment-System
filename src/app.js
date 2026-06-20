import express from "express"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
const app = express();
// import accountRouter from "./routes/account.routes.js"
import transactionRouter from "./routes/transaction.routes.js"
import notificationRouter from "./routes/notification.routes.js"

app.use(express.json()); // ye ek middle ware jo bhi body bahar se aayingi json me usko javascript me convert karenga

app.use(cookieParser()); // ye bhi middle ware hai jo cookies se aati hai usko parse karta hai js me.....
app.use(express.static("public")) // taaki frontend and backend ek hi url pe chale;

app.use("/api/auth",authRouter);
// app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRouter);
app.use("/api/notifications",notificationRouter);

export default app