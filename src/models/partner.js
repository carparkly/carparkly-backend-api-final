/**
 * Partner Model - Mongoose Schema
 * 
 * This model represents partners (organizations and individuals) leasing their parking spaces.
 * It ensures structured partner management, account verification, financial tracking, business legal compliance,
 * flexible pricing mechanisms, parking analytics, and real-time earnings tracking.
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
      businessType: { type: String, enum: ['Private Limited', 'Nonprofit', 'Sole Proprietorship'], default: 'Private Limited' },
      gstRegistered: { type: Boolean, default: false }, // GST registration flag
      companyAddress: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true },
        country: { type: String, trim: true },
      },
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
    parkingSpots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSpot',
      },
    ],
    parkingDetails: {
      totalParkingSpaces: { type: Number, default: 0 },
      features: {
        cctv: { type: Boolean, default: false },
        gatedEntry: { type: Boolean, default: false },
        onSiteStaff: { type: Boolean, default: false },
        evChargingStations: { type: Number, default: 0 },
        coveredParking: { type: Boolean, default: false },
        twentyFourSevenAccess: { type: Boolean, default: false },
      }
    },
    pricing: {
      hourlyRate: { type: Number, default: 0 },
      dailyRate: { type: Number, default: 0 },
      monthlySubscription: { type: Number, default: 0 },
      peakHourPricing: { 
        enabled: { type: Boolean, default: false }, 
        increasePercentage: { type: Number, default: 10 }, 
        startTime: { type: String, default: '07:00' }, 
        endTime: { type: String, default: '20:00' }, 
      },
      specialEventPricing: {
        enabled: { type: Boolean, default: false },
        eventName: { type: String, default: null },
        adjustedRate: { type: Number, default: 0 },
      },
    },
    financials: {
      totalEarnings: { type: Number, default: 0 },
      pendingPayouts: { type: Number, default: 0 },
      lastPayout: { type: Date, default: null },
      payoutMethod: { type: String, enum: ['bank_transfer', 'paypal', 'crypto'], default: 'bank_transfer' },
      taxId: { type: String, trim: true, unique: true, sparse: true },
      bankDetails: {
        accountNumber: { type: String, trim: true },
        bankName: { type: String, trim: true },
        swiftCode: { type: String, trim: true },
        bsbCode: { type: String, trim: true },
      },
    },
    subscription: {
      isSubscribed: { type: Boolean, default: false },
      plan: { type: String, enum: ['Free', 'Standard', 'Premium'], default: 'Free' },
      nextBillingDate: { type: Date, default: null },
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
