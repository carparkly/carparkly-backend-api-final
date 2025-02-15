/**
 * Notification Model - Mongoose Schema
 * 
 * This model represents system notifications sent to users.
 * It ensures structured notification delivery, read status tracking, priority levels, action links, scheduling, expiration management, and timestamps.
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the recipient user
      required: true,
    },
    type: {
      type: String,
      enum: ['booking', 'payment', 'penalty', 'general', 'review', 'system_update', 'promotion', 'reminder'],
      required: true, // Defines the category of notification
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal', // Defines the urgency of the notification
    },
    actionLink: {
      type: String,
      default: null, // Provides a link for the user to take action
    },
    isRead: {
      type: Boolean,
      default: false, // Tracks whether the notification has been read
    },
    metadata: {
      type: Object,
      default: {}, // Stores additional details related to the notification
    },
    scheduledFor: {
      type: Date,
      default: null, // Allows scheduling notifications for future delivery
    },
    expiresAt: {
      type: Date,
      default: null, // Expiration date for time-sensitive notifications
    },
    retryCount: {
      type: Number,
      default: 0, // Tracks the number of retry attempts for failed notifications
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Index userId, isRead, priority, and expiresAt for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, priority: 1, expiresAt: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
