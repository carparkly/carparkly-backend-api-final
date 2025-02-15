/**
 * Payout Model - Mongoose Schema
 * 
 * This model tracks partner earnings, payout methods, and transaction logs.
 * It ensures structured financial tracking, automated payouts, transaction verification, tax compliance, dispute resolution, and timestamps.
 */

const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner', // Reference to the partner receiving the payout
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Ensures no negative payout amounts
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'INR', 'JPY', 'CNY'],
      default: 'USD', // Supports multiple currencies
    },
    payoutMethod: {
      type: String,
      enum: ['bank_transfer', 'paypal', 'crypto'],
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      required: true, // Unique identifier for each payout transaction
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'disputed', 'on_hold'],
      default: 'pending',
    },
    failureReason: {
      type: String,
      default: null, // Stores reason if payout fails
    },
    taxWithheld: {
      type: Number,
      default: 0, // Tracks any tax deductions from payouts
    },
    invoiceId: {
      type: String,
      unique: true,
      sparse: true, // Links payout to a financial invoice if applicable
    },
    disputeDetails: {
      reason: { type: String, default: null },
      resolutionStatus: {
        type: String,
        enum: ['open', 'under_review', 'resolved'],
        default: null,
      },
    },
    processedAt: {
      type: Date,
      default: null, // Stores the date the payout was processed
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

// Index partnerId, status, and invoiceId for efficient queries
payoutSchema.index({ partnerId: 1, status: 1, invoiceId: 1 });

const Payout = mongoose.model('Payout', payoutSchema);
module.exports = Payout;

