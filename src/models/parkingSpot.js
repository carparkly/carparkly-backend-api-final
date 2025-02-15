/**
 * Parking Spot Model - Mongoose Schema
 * 
 * This model represents individual parking spots in MongoDB.
 * It ensures high performance, scalability, and real-time availability tracking.
 * Features include geospatial indexing, dynamic pricing, QR code support, penalty enforcement, advanced analytics, and automated maintenance tracking.
 */

const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the partner who owns the parking spot
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Parking spot name is required'],
      trim: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
    },
    capacity: {
      type: Number,
      required: true,
      min: 1, // A parking spot should at least have one available space
    },
    availableSpots: {
      type: Number,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0, // No negative pricing
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rules: {
      type: [String],
      default: [],
    },
    qrCode: {
      type: String, // QR code for payment and check-in validation
    },
    dynamicPricing: {
      type: Boolean,
      default: false,
    },
    penaltyRules: [
      {
        violation: { type: String, required: true },
        fineAmount: { type: Number, required: true, min: 0 },
      },
    ],
    amenities: {
      type: [String], // List of amenities available (e.g., EV charging, security, covered parking)
      default: [],
    },
    securityLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    peakHours: {
      start: {
        type: String,
        required: false,
      },
      end: {
        type: String,
        required: false,
      },
    },
    bookingHistory: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        bookedAt: { type: Date, default: Date.now },
        duration: { type: Number, required: true },
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        review: { type: String, trim: true },
        rating: { type: Number, min: 0, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageOccupancyRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0, // Percentage-based occupancy rate
    },
    revenueGenerated: {
      type: Number,
      default: 0, // Tracks total earnings from this parking spot
    },
    lastMaintenanceDate: {
      type: Date,
    },
    isUnderMaintenance: {
      type: Boolean,
      default: false,
    },
    maintenanceLogs: [
      {
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        description: { type: String, required: true },
        maintenanceDate: { type: Date, default: Date.now },
      },
    ],
    automaticAvailabilityReset: {
      type: Boolean,
      default: false, // If enabled, automatically resets availability based on occupancy rate
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Index location for geospatial queries
parkingSpotSchema.index({ location: '2dsphere' });

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);
module.exports = ParkingSpot;
