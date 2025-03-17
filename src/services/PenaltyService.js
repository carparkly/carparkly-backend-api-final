/**
 * Penalty Service - Handles all penalty-related operations, including issuance,
 * dispute resolution, payments, tracking, and compliance enforcement.
 * 
 * This service ensures structured, secure, and efficient penalty management by
 * integrating with users, partners, and payments while ensuring compliance,
 * security, and real-time monitoring.
 */

const PenaltyRepository = require('../repositories/PenaltyRepository');
const PaymentRepository = require('../repositories/PaymentRepository');
const ClientRepository = require('../repositories/ClientRepository');

/**
 * Issue a new penalty.
 * @param {Object} penaltyData - The penalty details.
 * @returns {Promise<Object>} - Returns the issued penalty.
 */
const issuePenalty = async (penaltyData) => {
  return await PenaltyRepository.createPenalty(penaltyData);
};

/**
 * Retrieve penalty details by ID.
 * @param {string} penaltyId - The penalty ID.
 * @returns {Promise<Object|null>} - Returns penalty details or null.
 */
const getPenaltyById = async (penaltyId) => {
  return await PenaltyRepository.findById(penaltyId);
};

/**
 * Retrieve all penalties with filters.
 * @param {Object} filters - Search filters (e.g., status, client ID, dispute status).
 * @param {Object} options - Pagination and sorting options.
 * @returns {Promise<Array>} - Returns an array of penalties.
 */
const getAllPenalties = async (filters = {}, options = {}) => {
  return await PenaltyRepository.searchPenalties(filters, options);
};

/**
 * Dispute a penalty.
 * @param {string} penaltyId - The penalty ID.
 * @param {string} disputeReason - The reason for the dispute.
 * @returns {Promise<Object|null>} - Returns updated dispute status.
 */
const disputePenalty = async (penaltyId, disputeReason) => {
  return await PenaltyRepository.updatePenalty(penaltyId, {
    disputeStatus: 'open',
    disputeReason,
  });
};

/**
 * Process penalty payment.
 * @param {string} penaltyId - The penalty ID.
 * @param {Object} paymentData - The payment details.
 * @returns {Promise<Object|null>} - Returns updated penalty status.
 */
const payPenalty = async (penaltyId, paymentData) => {
  const payment = await PaymentRepository.createPayment(paymentData);
  return await PenaltyRepository.updatePenalty(penaltyId, {
    status: 'paid',
    paymentId: payment._id,
  });
};

/**
 * Resolve a penalty dispute.
 * @param {string} penaltyId - The penalty ID.
 * @param {string} resolution - The resolution decision (e.g., approved, denied).
 * @returns {Promise<Object|null>} - Returns updated penalty dispute status.
 */
const resolvePenaltyDispute = async (penaltyId, resolution) => {
  return await PenaltyRepository.updatePenalty(penaltyId, {
    disputeStatus: 'resolved',
    resolution,
  });
};

/**
 * Track total penalties issued for a client.
 * @param {string} clientId - The client ID.
 * @returns {Promise<number>} - Returns the total penalties issued.
 */
const getTotalPenaltiesForClient = async (clientId) => {
  return await PenaltyRepository.countPenalties({ clientId });
};

/**
 * Log penalty activity for auditing and compliance.
 * @param {string} penaltyId - The penalty ID.
 * @param {string} action - The action performed.
 * @returns {Promise<void>} - Logs the penalty action.
 */
const logPenaltyAction = async (penaltyId, action) => {
  await PenaltyRepository.logPenaltyAction(penaltyId, action);
};

module.exports = {
  issuePenalty,
  getPenaltyById,
  getAllPenalties,
  disputePenalty,
  payPenalty,
  resolvePenaltyDispute,
  getTotalPenaltiesForClient,
  logPenaltyAction,
};
