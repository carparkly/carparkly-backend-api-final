/**
 * FAQ Model - Mongoose Schema
 * 
 * This model represents frequently asked questions stored in the database.
 * It ensures structured FAQ management, including categorization, priority handling, versioning, search optimization, and timestamps.
 */

const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensures no duplicate questions
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['general', 'payments', 'bookings', 'penalties', 'technical', 'policies', 'support'],
      default: 'general',
    },
    priority: {
      type: Number,
      default: 0, // Higher numbers indicate higher priority
    },
    version: {
      type: Number,
      default: 1, // Tracks FAQ versioning for updates
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    relatedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FAQ', // References related FAQs for better UX
      },
    ],
    keywords: {
      type: [String],
      default: [], // Stores keywords for better search functionality
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Index question, category, and keywords for efficient searching
faqSchema.index({ question: 1, category: 1, keywords: 1 });

const FAQ = mongoose.model('FAQ', faqSchema);
module.exports = FAQ;
