/**
 * Review Model - Mongoose Schema
 * 
 * This model represents reviews left by users for parking spots and partners.
 * It ensures structured feedback management, rating calculations, sentiment analysis, response tracking, and timestamps.
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user leaving the review
      required: true,
    },
    parkingSpotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingSpot', // Reference to the reviewed parking spot
      required: false,
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the partner receiving the review
      required: false,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Ensures rating is between 1 and 5
    },
    reviewText: {
      type: String,
      trim: true,
      maxlength: 1000, // Extended review length to 1000 characters
    },
    sentimentScore: {
      type: Number,
      min: -1,
      max: 1,
      default: null, // Optional sentiment analysis (-1 negative, 1 positive)
    },
    response: {
      type: String,
      trim: true,
      maxlength: 500, // Allows partners to respond to reviews
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'pending', // Allows moderation of reviews, including flagging inappropriate ones
    },
    flaggedReason: {
      type: String,
      default: null, // Stores reason if review is flagged
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

// Index userId, parkingSpotId, partnerId, and status for efficient queries
reviewSchema.index({ userId: 1, parkingSpotId: 1, partnerId: 1, status: 1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
