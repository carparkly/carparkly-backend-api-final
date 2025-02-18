/**
 * Payment Repository - Functional Data Access Layer
 * 
 * This repository provides efficient and scalable payment data interactions.
 * It ensures transaction security, fraud detection, refund management, structured data handling, audit logging, and dispute resolution.
 */

const Payment = require('../models/Payment');
const mongoose = require('mongoose');

/**
 * Find a payment by ID
 * @param {string} paymentId - The payment ID
 * @returns {Promise<Object|null>} - Returns payment object or null
 */
const findById = async (paymentId) => {
  if (!mongoose.Types.ObjectId.isValid(paymentId)) return null;
  return await Payment.findById(paymentId);
};

/**
 * Create a new payment record
 * @param {Object} paymentData - The payment data
 * @returns {Promise<Object>} - Returns the created payment record
 */
const createPayment = async (paymentData) => {
  const payment = new Payment(paymentData);
  return await payment.save();
};

/**
 * Update payment details
 * @param {string} paymentId - The payment ID
 * @param {Object} updateData - The updated fields
 * @returns {Promise<Object|null>} - Returns the updated payment or null
 */
const updatePayment = async (paymentId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(paymentId)) return null;
  return await Payment.findByIdAndUpdate(paymentId, updateData, { new: true, runValidators: true });
};

/**
 * Delete a payment record
 * @param {string} paymentId - The payment ID
 * @returns {Promise<Object|null>} - Returns deleted payment object or null
 */
const deletePayment = async (paymentId) => {
  if (!mongoose.Types.ObjectId.isValid(paymentId)) return null;
  return await Payment.findByIdAndDelete(paymentId);
};

/**
 * Search payments with filters
 * @param {Object} filters - Search filters (e.g., status, user, booking ID, dispute status)
 * @param {Object} options - Pagination and sorting options
 * @returns {Promise<Array>} - Returns array of matched payments
 */
const searchPayments = async (filters = {}, options = {}) => {
  const { limit = 10, page = 1, sort = '-createdAt' } = options;
  return await Payment.find(filters)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

/**
 * Count total payments matching filters
 * @param {Object} filters - Count filters (e.g., user, status, dispute status)
 * @returns {Promise<number>} - Returns count of payments
 */
const countPayments = async (filters = {}) => {
  return await Payment.countDocuments(filters);
};

/**
 * Update payment status
 * @param {string} paymentId - The payment ID
 * @param {string} status - The new status (e.g., 'successful', 'failed', 'refunded', 'disputed')
 * @returns {Promise<Object|null>} - Returns the updated payment or null
 */
const updatePaymentStatus = async (paymentId, status) => {
  if (!mongoose.Types.ObjectId.isValid(paymentId)) return null;
  return await Payment.findByIdAndUpdate(paymentId, { status }, { new: true });
};

/**
 * Get payments for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Returns an array of user payments
 */
const findByUserId = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return await Payment.find({ userId });
};

/**
 * Process a refund for a payment
 * @param {string} paymentId - The payment ID
 * @param {number} refundAmount - The amount to refund
 * @returns {Promise<Object|null>} - Returns the updated payment with refund details
 */
const processRefund = async (paymentId, refundAmount) => {
  if (!mongoose.Types.ObjectId.isValid(paymentId) || refundAmount <= 0) return null;
  return await Payment.findByIdAndUpdate(paymentId, { isRefunded: true, refundAmount }, { new: true });
};

/**
 * Log payment transaction actions
 * @param {string} paymentId - The payment ID
 * @param {string} action - The action performed (e.g., 'initiated', 'completed', 'refunded', 'disputed')
 * @returns {Promise<Object>} - Returns the updated payment with logged history
 */
const logPaymentAction = async (paymentId, action) => {
  if (!mongoose.Types.ObjectId.isValid(paymentId)) return null;
  return await Payment.findByIdAndUpdate(paymentId, { $push: { auditLogs: { action, timestamp: new Date() } } }, { new: true });
};

/**
 * Handle payment disputes
 * @param {string} paymentId - The payment ID
 * @param {string} disputeReason - The reason for the dispute
 * @returns {Promise<Object|null>} - Returns the updated payment with dispute details
 */
const handleDispute = async (paymentId, disputeReason) => {
  if (!mongoose.Types.ObjectId.isValid(paymentId)) return null;
  return await Payment.findByIdAndUpdate(paymentId, { disputeStatus: 'open', disputeReason }, { new: true });
};

module.exports = {
  findById,
  createPayment,
  updatePayment,
  deletePayment,
  searchPayments,
  countPayments,
  updatePaymentStatus,
  findByUserId,
  processRefund,
  logPaymentAction,
  handleDispute,
};
