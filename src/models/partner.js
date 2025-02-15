/**
 * Partner Model - Mongoose Schema
 * 
 * This model represents partners (organizations and individuals) leasing their parking spaces.
 * It ensures structured partner management, account verification, financial tracking, differentiated data storage for individuals and companies, future scalability, parking analytics, and timestamps.
 */

const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user owning the partner account
      required: true,
    },
    isIndividual: {
      type: Boolean,
      default: true, // Determines if the partner is an individual or organization
    },
    individualInfo: {
      fullName: { type: String, trim: true },
      governmentId: { type: String, trim: true, unique: true, sparse: true },
      dateOfBirth: { type: Date },
      profilePicture: { type: String, default: null },
    },
    organizationInfo: {
      organizationName: { type: String, trim: true },
      registrationNumber: { type: String, trim: true, unique: true, sparse: true },
      contactPerson: { type: String, trim: true },
      businessLicense: { type: String, default: null },
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    parkingSpots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSpot',
      },
    ],
    analytics: {
      totalBookings: { type: Number, default: 0 },
      averageOccupancyRate: { type: Number, default: 0 },
      customerFeedbackScore: { type: Number, min: 0, max: 5, default: 0 },
    },
    financials: {
      totalEarnings: {
        type: Number,
        default: 0, // Tracks total revenue from leasing parking spaces
      },
      lastPayout: {
        type: Date,
        default: null, // Last payout date
      },
      payoutMethod: {
        type: String,
        enum: ['bank_transfer', 'paypal', 'crypto'],
        default: 'bank_transfer',
      },
      taxId: { type: String, trim: true, unique: true, sparse: true },
    },
    accountVerified: {
      type: Boolean,
      default: false, // Verification status of the partner
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended'],
      default: 'pending',
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

// Index userId, status, and accountVerified for efficient queries
partnerSchema.index({ userId: 1, status: 1, accountVerified: 1 });

const Partner = mongoose.model('Partner', partnerSchema);
module.exports = Partner;
