/**
 * Booking Service - Handles all booking-related operations, including creation,
 * modification, cancellation, payment processing, status tracking, and analytics.
 * 
 * This service ensures structured, scalable, and secure booking management by
 * providing seamless integration with users, partners, payments, and real-time
 * booking status updates while ensuring compliance, fraud prevention, and efficiency.
 */

const BookingRepository = require('../repositories/BookingRepository');
const PaymentRepository = require('../repositories/PaymentRepository');
const PartnerRepository = require('../repositories/PartnerRepository');
const ClientRepository = require('../repositories/ClientRepository');

/**
 * Create a new booking with verification, availability, and conflict detection.
 * @param {Object} bookingData - The booking details.
 * @returns {Promise<Object>} - Returns the created booking.
 */
const createBooking = async (bookingData) => {
  // Validate partner availability before booking
  const partner = await PartnerRepository.findById(bookingData.partnerId);
  if (!partner || partner.status !== 'active') {
    throw new Error('Partner is not available for booking');
  }
  
  // Check for booking conflicts
  const conflict = await BookingRepository.searchBookings({
    partnerId: bookingData.partnerId,
    status: 'confirmed',
    $or: [
      { startTime: { $lt: bookingData.endTime, $gte: bookingData.startTime } },
      { endTime: { $gt: bookingData.startTime, $lte: bookingData.endTime } }
    ]
  });
  if (conflict.length > 0) {
    throw new Error('Booking conflict detected');
  }
  
  return await BookingRepository.createBooking(bookingData);
};

/**
 * Retrieve booking details by ID.
 * @param {string} bookingId - The booking ID.
 * @returns {Promise<Object|null>} - Returns booking details or null.
 */
const getBookingById = async (bookingId) => {
  return await BookingRepository.findById(bookingId);
};

/**
 * Retrieve all bookings with filters.
 * @param {Object} filters - Search filters (e.g., status, client ID, partner ID, date range).
 * @param {Object} options - Pagination and sorting options.
 * @returns {Promise<Array>} - Returns an array of bookings.
 */
const getAllBookings = async (filters = {}, options = {}) => {
  return await BookingRepository.searchBookings(filters, options);
};

/**
 * Automatically cancel unpaid or expired bookings.
 * @returns {Promise<void>} - Cancels expired bookings.
 */
const autoCancelExpiredBookings = async () => {
  const expiredBookings = await BookingRepository.searchBookings({
    status: 'pending',
    createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) } // 30 min expiration
  });
  
  for (const booking of expiredBookings) {
    await BookingRepository.updateBooking(booking._id, { status: 'cancelled' });
    await logBookingAction(booking._id, 'Booking auto-cancelled due to expiration');
  }
};

/**
 * Update booking details with validation.
 * @param {string} bookingId - The booking ID.
 * @param {Object} updateData - Booking update data.
 * @returns {Promise<Object|null>} - Returns the updated booking or null.
 */
const updateBooking = async (bookingId, updateData) => {
  const booking = await BookingRepository.findById(bookingId);
  if (!booking) throw new Error('Booking not found');
  return await BookingRepository.updateBooking(bookingId, updateData);
};

/**
 * Cancel a booking, process refunds if applicable, and notify the partner.
 * @param {string} bookingId - The booking ID.
 * @param {string} clientId - The client ID initiating the cancellation.
 * @returns {Promise<Object|null>} - Returns updated booking or null.
 */
const cancelBooking = async (bookingId, clientId) => {
  const booking = await BookingRepository.findById(bookingId);
  if (!booking) throw new Error('Booking not found');
  if (booking.clientId !== clientId) throw new Error('Unauthorized cancellation');
  
  // Process refund if applicable
  if (booking.paymentId) {
    await PaymentRepository.processRefund(booking.paymentId, booking.amount);
  }
  
  // Notify partner about cancellation
  await PartnerRepository.logPartnerAction(booking.partnerId, 'Booking Cancelled');
  
  return await BookingRepository.updateBooking(bookingId, { status: 'cancelled' });
};

/**
 * Update the status of a booking with audit logging.
 * @param {string} bookingId - The booking ID.
 * @param {string} status - The new booking status (e.g., confirmed, completed, cancelled).
 * @returns {Promise<Object|null>} - Returns the updated booking or null.
 */
const updateBookingStatus = async (bookingId, status) => {
  const updatedBooking = await BookingRepository.updateBookingStatus(bookingId, status);
  await logBookingAction(bookingId, `Status updated to ${status}`);
  return updatedBooking;
};

/**
 * Log booking activity for auditing and compliance.
 * @param {string} bookingId - The booking ID.
 * @param {string} action - The action performed.
 * @returns {Promise<void>} - Logs the booking action.
 */
const logBookingAction = async (bookingId, action) => {
  await BookingRepository.logBookingAction(bookingId, action);
};

module.exports = {
  createBooking,
  getBookingById,
  getAllBookings,
  autoCancelExpiredBookings,
  updateBooking,
  cancelBooking,
  updateBookingStatus,
  logBookingAction,
};
