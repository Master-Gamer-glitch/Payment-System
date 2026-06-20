import User from "../models/user.model.js"
import Transaction from "../models/transaction.model.js"
import Notification from "../models/notification.model.js"
import mongoose from "mongoose"
import { sendTransactionEmail } from "../utils/email.js"

// SendMonehhhh;
export const sendMoney = async (req, res) => {

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { receiverEmail, amount, note } = req.body
    const senderId = req.user._id

    // dono fields validation;
    if (!receiverEmail || !amount) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ message: "Receiver email aur amount dono zaroori hain bhai..." })
    }

    // ulti harkat;
    if (amount <= 0) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ message: "krlia test application? aagya maza??" })
    }

    // reciever na ho;
    const receiver = await User.findOne({ email: receiverEmail.toLowerCase() }).session(session)

    if (!receiver) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ message: "Doob jaate abhi pese..." })
    }

    // self transfer;
    if (senderId.toString() === receiver._id.toString()) {

      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ message: "Biggest hoshiyaar award 👏..." })
    }

    // sender ka data;
    const sender = await User.findById(senderId).session(session)

    if (sender.balance < amount) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ message: "AAP.... SadakPe hai..." })
    }

    // main kaam;

    // Sender ke account se paise kaato;
    sender.balance -= amount
    await sender.save({ session })

    // Receiver ke account mein paise daalo;
    receiver.balance += amount
    await receiver.save({ session })

    // 3. Transaction ka record banao
    const transaction = await Transaction.create(

        {
          sender: senderId,
          receiver: receiver._id,
          amount,
          type: "debit",
          note: note || "With ❤️ from Sadak",
        },
      
       session 
    )

    // notifications banao;
    await Notification.create(
      [
        {
          user: senderId,
          type: "money_sent",
          message: `You sent Rs. ${amount} to ${receiver.name}`,
          transaction: transaction._id,
        },
        {
          user: receiver._id,
          type: "money_received",
          message: `You received Rs. ${amount} from ${sender.name}`,
          transaction: transaction._id,
        },
      ],
      { session }
    )

    // Commit!!!!!
    await session.commitTransaction()
    session.endSession()

    // NodeMailer;
    sendTransactionEmail(sender.email, receiver.email, amount, note)

    res.status(200).json({
      message: "A move towards the Sadak!!!",
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        type: transaction.type,
        note: transaction.note,
        createdAt: transaction.createdAt,
      },
      newBalance: sender.balance,
    })
  } catch (error) {

    // rollbackk;
    await session.abortTransaction()
    session.endSession()
    console.log("Send Money Error: ", error.message)
    res.status(500).json({ message: "Transaction failed.", error: error.message })
  }
}

// History;
export const getHistory = async (req, res) => {
  try {
    const userId = req.user._id

    // woh saari transactions nikaalo jismein user sender ho ya receiver;
    const history = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })

    res.status(200).json({ history })
  } catch (error) {
    
    console.log("Get History Error: ", error.message)
    res.status(500).json({ message: "Itni gandi history rahi hai aapki ki hame sharm aagyi...", error: error.message })
  }
}

// TopUp;
export const topUp = async (req, res) => {
  try {
    const { amount } = req.body
    const userId = req.user._id

    // validation;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "SadakPe aane ki itni jaldi bhi acchi nahi!!" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "Aakhir kehna kya chahte ho?? (user not found)" })
    }

    // balance update;
    user.balance += Number(amount)
    await user.save()

    // transaction for history;
    const transaction = await Transaction.create({
      sender: userId,
      receiver: userId,
      amount,
      type: "credit",
      note: "Account Topup",
    })

    // topup success ka notification;
    await Notification.create({
      user: userId,
      type: "topup_success",
      message: `Successfully topped up Rs. ${amount}`,
      transaction: transaction._id,
    })

    res.status(200).json({
      message: "Topup success!",
      newBalance: user.balance,
      transaction,
    })
  } catch (error) {

    console.log("Topup Error:", error.message)
    res.status(500).json({ message: "Topup failed hahahahahaHAHAHAHAHAHAHA", error: error.message })
  }
}