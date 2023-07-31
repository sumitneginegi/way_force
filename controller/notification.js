const Notification = require('../models/notification'); // Replace 'path/to' with the actual path to your model file.

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, body, date, time } = req.body;

    // You can perform additional validation or checks here before creating the notification.

    const newNotification = new Notification({
      userId,
      title,
      body,
      date,
      time,
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'An error occurred while creating the notification.' });
  }
};


exports.getNotificationById = async (req, res) => {
  try {
    const { notificationId } = req.params

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ error: 'An error occurred while fetching the notification.' });
  }
};


exports.updateNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { title, body, date, time, status } = req.body;

    // You can perform additional validation or checks here before updating the notification.

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { title, body, date, time, status },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    res.json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'An error occurred while updating the notification.' });
  }
};


exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params

    const deletedNotification = await Notification.findByIdAndRemove(notificationId);

    if (!deletedNotification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    res.json({ message: 'Notification deleted successfully.' })
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'An error occurred while deleting the notification.' });
  }
}
