/**
 * Penalty Model - Mongoose Schema
 * 
 * This model represents penalties imposed on users for parking violations.
 * It tracks violation types, associated booking and user details, fine amounts, payment status, dispute tracking, appeal process, resolution history, automated notifications, and timestamps.
 */

const mongoose = require('mongoose');

const penaltySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user receiving the penalty
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking', // Reference to the related booking (if applicable)
      required: false,
    },
    parkingSpotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingSpot', // Reference to the parking spot where the violation occurred
      required: true,
    },
    violationType: {
      type: String,
      enum: ['overstay', 'unauthorized_parking', 'non-payment', 'incorrect_parking', 'fraudulent_booking', 'misuse_of_spot'],
      required: true,
    },
    fineAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['unpaid', 'paid', 'disputed', 'waived', 'under_review', 'escalated', 'partially_paid'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'stripe', 'crypto', 'bank_transfer', 'google_pay', 'apple_pay'],
      default: null,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    disputeReason: {
      type: String,
      default: null, // Stores the reason if the penalty is disputed
    },
    appealStatus: {
      type: String,
      enum: ['not_applied', 'pending_review', 'approved', 'rejected'],
      default: 'not_applied',
    },
    appealNotes: {
      type: String,
      default: null, // Additional notes regarding the appeal process
    },
    resolvedAt: {
      type: Date,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    notificationStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending', // Tracks whether the penalty notification has been sent
    },
    resolutionHistory: [
      {
        action: { type: String, required: true },
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        notes: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Index userId, status, appealStatus, and notificationStatus for efficient queries
penaltySchema.index({ userId: 1, status: 1, appealStatus: 1, notificationStatus: 1 });

const Penalty = mongoose.model('Penalty', penaltySchema);
module.exports = Penalty;
