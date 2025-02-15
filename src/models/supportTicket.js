/**
 * SupportTicket Model - Mongoose Schema
 * 
 * This model represents support tickets raised by users for disputes and complaints.
 * It ensures structured issue tracking, communication channels, status management, priority handling, escalation workflow, SLA tracking, and timestamps.
 */

const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who created the ticket
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000, // Limits description length to 2000 characters
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'escalated', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    communicationChannel: {
      type: [String],
      enum: ['in_app_chat', 'dashboard', 'email', 'phone'],
      default: ['dashboard'],
    },
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: { type: String, trim: true },
        timestamp: { type: Date, default: Date.now },
        attachment: { type: String, default: null },
      },
    ],
    assignedAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', // Reference to the admin handling the ticket
      default: null,
    },
    resolutionNotes: {
      type: String,
      trim: true,
      default: null, // Stores resolution details when closed
    },
    escalationLevel: {
      type: Number,
      default: 0, // Tracks the number of escalations
    },
    slaDeadline: {
      type: Date,
      default: null, // Tracks the deadline for SLA compliance
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5, default: null },
      comment: { type: String, trim: true, default: null },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Index userId, status, priority, and escalationLevel for efficient queries
supportTicketSchema.index({ userId: 1, status: 1, priority: -1, escalationLevel: -1 });

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
module.exports = SupportTicket;
