import mongoose from "mongoose"

// jab bhi koi transaction hoga ya kuch important banega, woh yahan save hoga
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // yeh User collection ka reference hai
      ref: "User",
      required: [true, "kis user ki notification hai yeh toh batao"],
      index: true, // user ke basis pe notifications dhundna fast ho jaye isliye
    },

    // kaunsi type ki notification hai
    type: {
      type: String,
      enum: ["money_sent", "money_received", "topup_success"], // sirf yeh teen values allowed hain
      required: [true, "notification type batao"],
    },

    message: {
      type: String,
      required: [true, "message toh hona chahiye"],
      trim: true,
    },

    // user ne notification dekhi ki nahi
    isRead: {
      type: Boolean,
      default: false, // nai notification hamesha unread hogi, jab user dekhe tab true ho jayegi
    },

    // kis transaction se yeh notification bani - optional hai
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null, // topup ya system notifications mein transaction nahi hoga toh null rahega
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt automatically add ho jayenge
  }
)

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification
