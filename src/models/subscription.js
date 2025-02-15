/**
 * Subscription Model - Mongoose Schema
 * 
 * This model represents user subscriptions for premium features.
 * It ensures structured subscription management, plan tracking, billing cycle, renewal status, discounts, trial periods, grace periods, cancellation policies, and timestamps.
 */

const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the subscribed user
      required: true,
    },
    planName: {
      type: String,
      enum: ['basic', 'standard', 'premium', 'enterprise'],
      required: true, // Defines the type of subscription plan
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Ensures no negative pricing
    },
    discountApplied: {
      type: Number,
      default: 0, // Tracks any discount applied to the subscription
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'INR', 'JPY', 'CNY'],
      default: 'USD', // Supports multiple currencies
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      required: true, // Defines the billing frequency
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled', 'pending', 'suspended', 'grace_period'],
      default: 'pending',
    },
    renewalDate: {
      type: Date,
      required: true, // Next billing date for the subscription
    },
    autoRenew: {
      type: Boolean,
      default: true, // Determines if the subscription auto-renews
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'stripe', 'crypto', 'bank_transfer'],
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      required: true, // Stores the last transaction ID for reference
    },
    trialPeriodEnds: {
      type: Date,
      default: null, // Tracks if a trial period is active
    },
    gracePeriodEnds: {
      type: Date,
      default: null, // Allows users extra time after expiry before cancellation
    },
    cancellationReason: {
      type: String,
      default: null, // Logs the reason for subscription cancellation
    },
    refundAmount: {
      type: Number,
      default: 0, // Tracks any refund amount issued
    },
    lastUpdated: {
      type: Date,
      default: Date.now, // Tracks the last modification date
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

// Index userId, status, renewalDate, and gracePeriodEnds for efficient queries
subscriptionSchema.index({ userId: 1, status: 1, renewalDate: 1, gracePeriodEnds: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
