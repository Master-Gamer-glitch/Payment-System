import mongoose from "mongoose"
import bcrypt from "bcrypt"

// yeh define karta hai ki user ka data kaisa dikhega MongoDB mein
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "naam toh daalo bhai"],
      trim: true, // aage peeche ke spaces hata deta hai
    },

    email: {
      type: String,
      required: [true, "email chahiye"],
      unique: true, // ek hi email se ek hi account ban sakta hai
      lowercase: true, // sab lowercase mein save hoga
      trim: true,
    },

    password: {
      type: String,
      required: [true, "password bhi chahiye"],
      minlength: [6, "password kam se kam 6 characters ka hona chahiye"],
    },

    balance: {
      type: Number,
      default: 0, // naya user bana toh balance 0 se start hoga
      min: [0, "balance negative nahi ho sakta"],
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt automatically add ho jayenge
  }
)

// password save karne se pehle hash karo - yeh middleware hai mongoose ka
userSchema.pre("save", async function (next) {
  // agar password change nahi hua toh dobara hash mat karo
  if (!this.isModified("password")) return next()

  // 10 salt rounds - standard hai yeh
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// login ke time password check karne ka method
userSchema.methods.isPasswordCorrect = async function (rawPassword) {
  // bcrypt khud compare karta hai hashed aur raw password ko
  return await bcrypt.compare(rawPassword, this.password)
}

const User = mongoose.model("User", userSchema)

export default User
