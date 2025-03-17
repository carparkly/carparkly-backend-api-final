/**
 * Parking Spot Model - Mongoose Schema
 * 
 * This model represents individual parking spots in MongoDB.
 * It ensures high performance, scalability, and real-time availability tracking.
 * Features include geospatial indexing, dynamic pricing, QR code support, penalty enforcement, 
 * advanced analytics, security settings, revenue tracking, and automated maintenance tracking.
 */

const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner', // Reference to the partner who owns the parking spot
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Parking spot name is required'],
      trim: true,
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: [true, 'Address is required'], trim: true },
      googleMapsLink: { type: String, default: null },
    },
    capacity: { type: Number, required: true, min: 1 },
    availableSpots: { type: Number, required: true },
    
    pricing: {
      hourlyRate: { type: Number, required: true, min: 0 },
      dailyRate: { type: Number, default: 0 },
      monthlySubscription: { type: Number, default: 0 }, // Supports subscription-based free parking
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
      pushUpPrice: { type: Number, default: 0 }, // Temporary pricing increase
    },
    
    liveStatus: {
      isOccupied: { type: Boolean, default: false },
      currentBookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
      startedAt: { type: Date, default: null },
      overstayDetected: { type: Boolean, default: false },
    },
    
    securityLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    amenities: {
      cctv: { type: Boolean, default: false },
      gatedEntry: { type: Boolean, default: false },
      onSiteStaff: { type: Boolean, default: false },
      evChargingStations: { type: Number, default: 0 },
      coveredParking: { type: Boolean, default: false },
      twentyFourSevenAccess: { type: Boolean, default: false },
    },
    
    operatingHours: {
      weekdays: {
        openTime: { type: String, default: '08:00 AM' },
        closeTime: { type: String, default: '08:00 PM' },
        status: { type: String, enum: ['open', 'closed'], default: 'open' },
      },
      weekends: {
        openTime: { type: String, default: '08:00 AM' },
        closeTime: { type: String, default: '08:00 PM' },
        status: { type: String, enum: ['open', 'closed'], default: 'open' },
      },
      holidays: [
        {
          date: { type: Date, required: true },
          reason: { type: String, required: true },
          status: { type: String, enum: ['open', 'closed'], default: 'closed' },
        },
      ],
    },
    
    accessInstructions: {
      parkingRules: { type: String, default: '' },
      accessInstructions: { type: String, default: '' },
      securityNotes: { type: String, default: '' },
      entryInstructions: { type: String, default: '' },
      exitInstructions: { type: String, default: '' },
    },
    
    qrCode: { type: String, default: null }, // QR code for check-in validation
    penaltyRules: [
      {
        violation: { type: String, required: true },
        fineAmount: { type: Number, required: true, min: 0 },
      },
    ],
    
    revenueGenerated: { type: Number, default: 0 },
    
    maintenance: {
      lastMaintenanceDate: { type: Date, default: null },
      isUnderMaintenance: { type: Boolean, default: false },
      maintenanceLogs: [
        {
          performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          description: { type: String, required: true },
          maintenanceDate: { type: Date, default: Date.now },
        },
      ],
      automaticAvailabilityReset: { type: Boolean, default: false },
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
