/**
 * Booking Model - Mongoose Schema
 * 
 * This model represents bookings made for parking spots in MongoDB.
 * It ensures efficiency, security, and real-time tracking of reservations.
 * Features include user and parking spot references, payment tracking, status management, QR code verification, cancellation policies, automated notifications, loyalty program tracking, and timestamps.
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user making the booking
      required: true,
    },
    parkingSpotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingSpot', // Reference to the booked parking spot
      required: true,
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the partner who owns the spot
      required: true,
    },
    bookingStart: {
      type: Date,
      required: true,
    },
    bookingEnd: {
      type: Date,
      required: true,
    },
    durationInHours: {
      type: Number,
      required: true,
      min: 1, // Ensures a minimum of 1-hour booking
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'expired', 'no-show'],
      default: 'pending',
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0, // Ensures no negative payments
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'stripe', 'crypto', 'bank_transfer', 'google_pay', 'apple_pay'],
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Allows null but ensures uniqueness when provided
    },
    qrCodeUsed: {
      type: Boolean,
      default: false, // Indicates whether the QR code was used for check-in
    },
    cancellationPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      default: 'moderate',
    },
    cancellationFee: {
      type: Number,
      default: 0, // Fee applied if the user cancels based on policy
    },
    isRefunded: {
      type: Boolean,
      default: false,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    autoCancelIfUnpaid: {
      type: Boolean,
      default: false, // Automatically cancels booking if unpaid within a timeframe
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    notificationsSent: {
      type: [String], // Logs notification types sent (e.g., "reminder", "cancellation")
      default: [],
    },
    loyaltyPointsEarned: {
      type: Number,
      default: 0, // Points earned from booking for loyalty program
    },
    promoCodeUsed: {
      type: String,
      default: null, // Stores any applied promo code
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Index userId, parkingSpotId, and status for efficient queries
bookingSchema.index({ userId: 1, parkingSpotId: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
