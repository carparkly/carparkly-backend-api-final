/**
 * Payment Model - Mongoose Schema
 * 
 * This model represents payment transactions for bookings in MongoDB.
 * It ensures secure payment tracking, verification, and refund handling.
 * Features include user and booking references, transaction tracking, payment method details, currency support, tax handling, multi-status flow, fraud detection, webhook tracking, ledger integration, and timestamps.
 */

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user making the payment
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking', // Reference to the associated booking
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Ensures no negative payment amounts
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'INR', 'JPY', 'CNY'],
      default: 'USD', // Supports multiple currencies
    },
    taxAmount: {
      type: Number,
      default: 0, // Stores applicable tax amount
    },
    totalAmount: {
      type: Number,
      required: true, // Total amount after including tax
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'stripe', 'crypto', 'bank_transfer', 'google_pay', 'apple_pay'],
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      required: true, // Unique identifier for each payment transaction
    },
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed', 'refunded', 'disputed', 'chargeback', 'reversed', 'on-hold'],
      default: 'pending',
    },
    isRefunded: {
      type: Boolean,
      default: false,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: {
      type: String,
      default: null, // Stores reason for refund
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
    failureReason: {
      type: String,
      default: null, // Stores failure reason in case of payment failure
    },
    disputeReason: {
      type: String,
      default: null, // Stores reason if payment is disputed
    },
    chargebackInitiated: {
      type: Boolean,
      default: false, // Tracks if chargeback has been initiated
    },
    chargebackAmount: {
      type: Number,
      default: 0, // Amount involved in chargeback
    },
    fraudCheckStatus: {
      type: String,
      enum: ['clear', 'suspected', 'flagged'],
      default: 'clear', // Fraud detection status
    },
    webhookResponse: {
      type: Object,
      default: null, // Stores webhook response from payment gateway
    },
    ledgerEntryId: {
      type: String,
      default: null, // Tracks the transaction in the financial ledger
    },
    payoutStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending', // Status of payout to vendors or partners
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Index userId, bookingId, and status for efficient queries
paymentSchema.index({ userId: 1, bookingId: 1, status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
