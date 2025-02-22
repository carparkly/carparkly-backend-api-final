/**
 * Payment Service - Handles all payment-related operations, including transaction processing,
 * refunds, dispute resolution, fraud detection, automated payouts, and payment tracking.
 * 
 * This service ensures structured, secure, and scalable financial transactions by
 * integrating with users, partners, and bookings while ensuring compliance, security,
 * and real-time transaction monitoring.
 */

const PaymentRepository = require('../repositories/PaymentRepository');
const BookingRepository = require('../repositories/BookingRepository');
const PartnerRepository = require('../repositories/PartnerRepository');
const FraudDetectionService = require('./FraudDetectionService');

/**
 * Process a new payment transaction with fraud detection.
 * @param {Object} paymentData - The payment details.
 * @returns {Promise<Object>} - Returns the processed payment.
 */
const processPayment = async (paymentData) => {
  // Run fraud detection before processing payment
  const isFraudulent = await FraudDetectionService.analyzeTransaction(paymentData);
  if (isFraudulent) throw new Error('Potential fraud detected, payment blocked.');
  
  return await PaymentRepository.createPayment(paymentData);
};

/**
 * Retrieve payment details by ID.
 * @param {string} paymentId - The payment ID.
 * @returns {Promise<Object|null>} - Returns payment details or null.
 */
const getPaymentById = async (paymentId) => {
  return await PaymentRepository.findById(paymentId);
};

/**
 * Retrieve all payments with filters.
 * @param {Object} filters - Search filters (e.g., status, user ID, booking ID, fraud alerts).
 * @param {Object} options - Pagination and sorting options.
 * @returns {Promise<Array>} - Returns an array of payments.
 */
const getAllPayments = async (filters = {}, options = {}) => {
  return await PaymentRepository.searchPayments(filters, options);
};

/**
 * Retry a failed payment transaction.
 * @param {string} paymentId - The payment ID.
 * @returns {Promise<Object|null>} - Returns updated payment status or null.
 */
const retryFailedPayment = async (paymentId) => {
  const payment = await PaymentRepository.findById(paymentId);
  if (!payment || payment.status !== 'failed') throw new Error('No failed payment found to retry.');
  return await processPayment(payment);
};

/**
 * Fetch complete transaction history for a user or partner.
 * @param {string} userId - The user or partner ID.
 * @returns {Promise<Array>} - Returns a list of transactions.
 */
const getTransactionHistory = async (userId) => {
  return await PaymentRepository.searchPayments({ userId });
};

/**
 * Refund a payment transaction and notify the client.
 * @param {string} paymentId - The payment ID.
 * @param {number} refundAmount - The amount to refund.
 * @returns {Promise<Object|null>} - Returns updated payment details.
 */
const processRefund = async (paymentId, refundAmount) => {
  const updatedPayment = await PaymentRepository.processRefund(paymentId, refundAmount);
  await logPaymentAction(paymentId, `Refund processed: ${refundAmount}`);
  return updatedPayment;
};

/**
 * Handle payment disputes and update status.
 * @param {string} paymentId - The payment ID.
 * @param {string} disputeReason - The reason for the dispute.
 * @returns {Promise<Object|null>} - Returns updated dispute status.
 */
const handlePaymentDispute = async (paymentId, disputeReason) => {
  return await PaymentRepository.updatePayment(paymentId, {
    disputeStatus: 'open',
    disputeReason,
  });
};

/**
 * Track total earnings and automated payouts for a partner.
 * @param {string} partnerId - The partner ID.
 * @returns {Promise<Object|null>} - Returns the partner's financial summary.
 */
const getPartnerEarnings = async (partnerId) => {
  return await PartnerRepository.getPartnerEarnings(partnerId);
};

/**
 * Schedule automatic partner payouts based on earnings threshold.
 * @returns {Promise<void>} - Processes payouts for eligible partners.
 */
const processScheduledPayouts = async () => {
  const eligiblePartners = await PartnerRepository.searchPartners({ earningsThresholdMet: true });
  for (const partner of eligiblePartners) {
    await PaymentRepository.createPayment({
      partnerId: partner._id,
      amount: partner.earnings,
      status: 'paid',
    });
    await logPaymentAction(partner._id, 'Scheduled payout processed');
  }
};

/**
 * Update payment status with security verification.
 * @param {string} paymentId - The payment ID.
 * @param {string} status - The new status (e.g., successful, failed, refunded, disputed).
 * @returns {Promise<Object|null>} - Returns updated payment object or null.
 */
const updatePaymentStatus = async (paymentId, status) => {
  return await PaymentRepository.updatePaymentStatus(paymentId, status);
};

/**
 * Log payment activity for auditing and fraud prevention.
 * @param {string} paymentId - The payment ID.
 * @param {string} action - The action performed.
 * @returns {Promise<void>} - Logs the payment action.
 */
const logPaymentAction = async (paymentId, action) => {
  await PaymentRepository.logPaymentAction(paymentId, action);
};

module.exports = {
  processPayment,
  getPaymentById,
  getAllPayments,
  retryFailedPayment,
  getTransactionHistory,
  processRefund,
  handlePaymentDispute,
  getPartnerEarnings,
  processScheduledPayouts,
  updatePaymentStatus,
  logPaymentAction,
};
