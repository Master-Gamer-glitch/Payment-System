import Notification from "../models/notification.model.js"

// Loggedin user ke liye saari notifications nikalo;
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id

    // fetch;
    const notifications = await Notification.find({ user: userId })

    res.status(200).json({ notifications })
  } catch (error) {
    console.log("Get Notifications Error:", error.message)
    res.status(500).json({ message: "Error in fetching notifs.", error: error.message })
  }
}

// markAsRead;
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id

    // find notif;
    const notification = await Notification.findById(id)
    if (!notification) {
      return res.status(404).json({ message: "Notification nahi mili" })
    }

    // user apni hi notification read kar raha hai na;
    if (notification.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Limit me rahe plz.." })
    }

    // save;
    notification.isRead = true
    await notification.save()

    res.status(200).json({ message: "Notification marked as read.", notification })
  } catch (error) {
    console.log("Mark As Read error: ", error.message)
    res.status(500).json({ message: "Failed to mark as read..", error: error.message })
  }
}

// markAllRead;
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id

    // only unread;
    const result = await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    )

    res.status(200).json({
      message: "Success",
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    console.log("MarkAllAsRead error: ", error.message)
    res.status(500).json({ message: "Some error occured", error: error.message })
  }
}