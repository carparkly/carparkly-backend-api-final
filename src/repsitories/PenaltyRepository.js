/**
 * Penalty Repository - Functional Data Access Layer
 * 
 * This repository provides efficient and scalable penalty data interactions.
 * It ensures security enforcement, violation tracking, dispute resolution, structured data handling, audit logging, and financial tracking.
 */

const Penalty = require('../models/Penalty');
const mongoose = require('mongoose');

/**
 * Find a penalty by ID
 * @param {string} penaltyId - The penalty ID
 * @returns {Promise<Object|null>} - Returns penalty object or null
 */
const findById = async (penaltyId) => {
  if (!mongoose.Types.ObjectId.isValid(penaltyId)) return null;
  return await Penalty.findById(penaltyId);
};

/**
 * Create a new penalty record
 * @param {Object} penaltyData - The penalty data
 * @returns {Promise<Object>} - Returns the created penalty record
 */
const createPenalty = async (penaltyData) => {
  const penalty = new Penalty(penaltyData);
  return await penalty.save();
};

/**
 * Update penalty details
 * @param {string} penaltyId - The penalty ID
 * @param {Object} updateData - The updated fields
 * @returns {Promise<Object|null>} - Returns the updated penalty or null
 */
const updatePenalty = async (penaltyId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(penaltyId)) return null;
  return await Penalty.findByIdAndUpdate(penaltyId, updateData, { new: true, runValidators: true });
};

/**
 * Delete a penalty record
 * @param {string} penaltyId - The penalty ID
 * @returns {Promise<Object|null>} - Returns deleted penalty object or null
 */
const deletePenalty = async (penaltyId) => {
  if (!mongoose.Types.ObjectId.isValid(penaltyId)) return null;
  return await Penalty.findByIdAndDelete(penaltyId);
};

/**
 * Search penalties with filters
 * @param {Object} filters - Search filters (e.g., status, user, violation type, amount range)
 * @param {Object} options - Pagination and sorting options
 * @returns {Promise<Array>} - Returns array of matched penalties
 */
const searchPenalties = async (filters = {}, options = {}) => {
  const { limit = 10, page = 1, sort = '-createdAt' } = options;
  return await Penalty.find(filters)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

/**
 * Count total penalties matching filters
 * @param {Object} filters - Count filters (e.g., user, status, violation type)
 * @returns {Promise<number>} - Returns count of penalties
 */
const countPenalties = async (filters = {}) => {
  return await Penalty.countDocuments(filters);
};

/**
 * Update penalty status
 * @param {string} penaltyId - The penalty ID
 * @param {string} status - The new status (e.g., 'paid', 'disputed', 'waived')
 * @returns {Promise<Object|null>} - Returns the updated penalty or null
 */
const updatePenaltyStatus = async (penaltyId, status) => {
  if (!mongoose.Types.ObjectId.isValid(penaltyId)) return null;
  return await Penalty.findByIdAndUpdate(penaltyId, { status }, { new: true });
};

/**
 * Get penalties for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Returns an array of user penalties
 */
const findByUserId = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return await Penalty.find({ userId });
};

/**
 * Handle penalty disputes
 * @param {string} penaltyId - The penalty ID
 * @param {string} disputeReason - The reason for the dispute
 * @returns {Promise<Object|null>} - Returns the updated penalty with dispute details
 */
const handleDispute = async (penaltyId, disputeReason) => {
  if (!mongoose.Types.ObjectId.isValid(penaltyId)) return null;
  return await Penalty.findByIdAndUpdate(penaltyId, { disputeStatus: 'open', disputeReason }, { new: true });
};

/**
 * Log penalty actions
 * @param {string} penaltyId - The penalty ID
 * @param {string} action - The action performed (e.g., 'issued', 'disputed', 'resolved')
 * @returns {Promise<Object>} - Returns the updated penalty with logged history
 */
const logPenaltyAction = async (penaltyId, action) => {
  if (!mongoose.Types.ObjectId.isValid(penaltyId)) return null;
  return await Penalty.findByIdAndUpdate(penaltyId, { $push: { auditLogs: { action, timestamp: new Date() } } }, { new: true });
};

/**
 * Calculate total penalties for a user
 * @param {string} userId - The user ID
 * @returns {Promise<number>} - Returns the total amount of penalties for the user
 */
const calculateTotalPenalties = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  const penalties = await Penalty.find({ userId, status: 'unpaid' });
  return penalties.reduce((total, penalty) => total + (penalty.fineAmount || 0), 0);
};

module.exports = {
  findById,
  createPenalty,
  updatePenalty,
  deletePenalty,
  searchPenalties,
  countPenalties,
  updatePenaltyStatus,
  findByUserId,
  handleDispute,
  logPenaltyAction,
  calculateTotalPenalties,
};
