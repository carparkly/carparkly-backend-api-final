/**
 * Client Model - Mongoose Schema
 * 
 * This model represents clients who use the platform for booking and parking services.
 * It ensures structured client data management, activity tracking, loyalty program integration, security settings, personalized recommendations, referral tracking, fraud detection, and timestamps.
 */

const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the base User model
      required: true,
    },
    preferredPaymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'stripe', 'crypto', 'bank_transfer'],
      default: 'card',
    },
    loyaltyPoints: {
      type: Number,
      default: 0, // Tracks points earned through bookings
    },
    totalBookings: {
      type: Number,
      default: 0, // Total number of bookings made by the client
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0, // Client's overall rating based on feedback
    },
    favoriteLocations: {
      type: [String], // Tracks frequently used locations for personalized recommendations
      default: [],
    },
    lastLogin: {
      type: Date,
      default: null, // Tracks last login timestamp
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'banned'],
      default: 'active',
    },
    sessionLogs: [
      {
        sessionId: { type: String, required: true },
        loginTime: { type: Date, default: Date.now },
        logoutTime: { type: Date, default: null },
        ipAddress: { type: String, default: null },
        deviceInfo: { type: String, default: null },
        location: { type: String, default: null },
      },
    ],
    securitySettings: {
      passwordChangedAt: { type: Date, default: null },
      failedLoginAttempts: { type: Number, default: 0 },
      accountLocked: { type: Boolean, default: false },
      suspiciousActivityFlag: { type: Boolean, default: false },
    },
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification', // References client's notifications
      },
    ],
    preferences: {
      preferredParkingDuration: { type: Number, default: 2 }, // Default preferred booking duration in hours
      receivePromotions: { type: Boolean, default: true },
      preferredVehicleType: { type: String, default: null },
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true, // Stores referral code for new signups
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client', // Tracks the client who referred this user
      default: null,
    },
    fraudScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0, // AI/ML-based fraud detection scoring system
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

// Index userId, status, loyaltyPoints, referralCode, and fraudScore for efficient queries
clientSchema.index({ userId: 1, status: 1, loyaltyPoints: -1, referralCode: 1, fraudScore: -1 });

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
