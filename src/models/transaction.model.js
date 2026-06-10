import mongoose from "mongoose"

// har ek transaction ka record yahan save hoga
const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId, // yeh User collection ka reference hai
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: [true, "kitna paisa bheja yeh toh batao"],
      min: [1, "kam se kam 1 rupaya toh bhejo"],
    },

    // debit matlab paisa gaya, credit matlab paisa aaya
    type: {
      type: String,
      enum: ["debit", "credit"], // sirf yeh do values allowed hain
      required: true,
    },

    // kuch note likhna ho toh
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

const Transaction = mongoose.model("Transaction", transactionSchema)

export default Transaction
