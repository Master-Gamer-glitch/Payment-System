import nodemailer from "nodemailer"

// transporterr;
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// sender and receiver dono ko jaaye mail;
export const sendTransactionEmail = async (senderEmail, receiverEmail, amount, note) => {
  try {

    // Sender wala;
    const senderMailOptions = {
      from: process.env.EMAIL_USER,
      to: senderEmail,
      subject: "A move towards Sadak! :)",
      text: `Hello,\n\nRs. ${amount} has been successfully debited from your account and sent to ${receiverEmail} and aap ek kadam aage aagye Sadak ke :)\n\nNote: ${note}\n\nThank you!`,
    }

    // Receiver wala;
    const receiverMailOptions = {
      from: process.env.EMAIL_USER,
      to: receiverEmail,
      subject: "A move away from Sadak :(",
      text: `Hello,\n\nRs. ${amount} has been credited to your account from ${senderEmail} and aap Sadak se dur jaa rhe hai :(\n\nNote: ${note}\n\nThank you!`,
    }

    // Send both emails ek hi saath;
    await Promise.all([
      transporter.sendMail(senderMailOptions),
      transporter.sendMail(receiverMailOptions)
    ])

    console.log("Transaction emails sent successfully.")
  } catch (error) {
    
    console.log("Failed to send transaction emails: ", error.message)
  }
}
