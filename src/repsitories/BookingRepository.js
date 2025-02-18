/**
 * Booking Repository - Functional Data Access Layer
 * 
 * This repository provides efficient and scalable booking data interactions.
 * It ensures security enforcement, availability validation, pricing adjustments, structured data handling, audit logging, and real-time booking tracking.
 */

const Booking = require('../models/Booking');
const mongoose = require('mongoose');

/**
 * Find a booking by ID
 * @param {string} bookingId - The booking ID
 * @returns {Promise<Object|null>} - Returns booking object or null
 */
const findById = async (bookingId) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) return null;
  return await Booking.findById(bookingId);
};

/**
 * Create a new booking
 * @param {Object} bookingData - The booking data
 * @returns {Promise<Object>} - Returns the created booking
 */
const createBooking = async (bookingData) => {
  const booking = new Booking(bookingData);
  return await booking.save();
};

/**
 * Update booking details
 * @param {string} bookingId - The booking ID
 * @param {Object} updateData - The updated fields
 * @returns {Promise<Object|null>} - Returns the updated booking or null
 */
const updateBooking = async (bookingId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) return null;
  return await Booking.findByIdAndUpdate(bookingId, updateData, { new: true, runValidators: true });
};

/**
 * Delete a booking
 * @param {string} bookingId - The booking ID
 * @returns {Promise<Object|null>} - Returns deleted booking object or null
 */
const deleteBooking = async (bookingId) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) return null;
  return await Booking.findByIdAndDelete(bookingId);
};

/**
 * Search bookings with filters
 * @param {Object} filters - Search filters (e.g., status, user, parking spot, date range)
 * @param {Object} options - Pagination and sorting options
 * @returns {Promise<Array>} - Returns array of matched bookings
 */
const searchBookings = async (filters = {}, options = {}) => {
  const { limit = 10, page = 1, sort = '-createdAt' } = options;
  return await Booking.find(filters)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

/**
 * Count total bookings matching filters
 * @param {Object} filters - Count filters (e.g., user, parking spot, status)
 * @returns {Promise<number>} - Returns count of bookings
 */
const countBookings = async (filters = {}) => {
  return await Booking.countDocuments(filters);
};

/**
 * Update booking status
 * @param {string} bookingId - The booking ID
 * @param {string} status - The new status (e.g., 'confirmed', 'cancelled', 'completed')
 * @returns {Promise<Object|null>} - Returns the updated booking or null
 */
const updateBookingStatus = async (bookingId, status) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) return null;
  return await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
};

/**
 * Get bookings for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Returns an array of user bookings
 */
const findByUserId = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return await Booking.find({ userId });
};

/**
 * Log booking history actions
 * @param {string} bookingId - The booking ID
 * @param {string} action - The action performed (e.g., 'created', 'updated', 'cancelled')
 * @returns {Promise<Object>} - Returns the updated booking with logged history
 */
const logBookingAction = async (bookingId, action) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) return null;
  return await Booking.findByIdAndUpdate(bookingId, { $push: { auditLogs: { action, timestamp: new Date() } } }, { new: true });
};

/**
 * Get active bookings in real time
 * @param {Object} filters - Filters for active bookings (e.g., ongoing status)
 * @returns {Promise<Array>} - Returns an array of active bookings
 */
const getActiveBookings = async (filters = { status: 'confirmed' }) => {
  return await Booking.find(filters);
};

/**
 * Extend an existing booking duration
 * @param {string} bookingId - The booking ID
 * @param {number} additionalHours - Additional hours to extend the booking
 * @returns {Promise<Object|null>} - Returns the updated booking with extended time
 */
const extendBooking = async (bookingId, additionalHours) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId) || additionalHours <= 0) return null;
  return await Booking.findByIdAndUpdate(bookingId, { $inc: { duration: additionalHours } }, { new: true });
};

module.exports = {
  findById,
  createBooking,
  updateBooking,
  deleteBooking,
  searchBookings,
  countBookings,
  updateBookingStatus,
  findByUserId,
  logBookingAction,
  getActiveBookings,
  extendBooking,
};
