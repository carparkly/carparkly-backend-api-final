/**
 * Partner Repository - Functional Data Access Layer
 * 
 * This repository provides efficient and scalable partner data interactions.
 * It ensures security enforcement, query optimizations, financial tracking, verification management, structured data handling, and audit logging.
 */

const Partner = require('../models/Partner');
const mongoose = require('mongoose');

/**
 * Find a partner by ID
 * @param {string} partnerId - The partner ID
 * @returns {Promise<Object|null>} - Returns partner object or null
 */
const findById = async (partnerId) => {
  if (!mongoose.Types.ObjectId.isValid(partnerId)) return null;
  return await Partner.findById(partnerId);
};

/**
 * Find a partner by email
 * @param {string} email - The partner email
 * @returns {Promise<Object|null>} - Returns partner object or null
 */
const findByEmail = async (email) => {
  return await Partner.findOne({ contactEmail: email });
};

/**
 * Create a new partner
 * @param {Object} partnerData - The partner data
 * @returns {Promise<Object>} - Returns the created partner
 */
const createPartner = async (partnerData) => {
  const partner = new Partner(partnerData);
  return await partner.save();
};

/**
 * Update partner details
 * @param {string} partnerId - The partner ID
 * @param {Object} updateData - The updated fields
 * @returns {Promise<Object|null>} - Returns the updated partner or null
 */
const updatePartner = async (partnerId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(partnerId)) return null;
  return await Partner.findByIdAndUpdate(partnerId, updateData, { new: true, runValidators: true });
};

/**
 * Delete a partner
 * @param {string} partnerId - The partner ID
 * @returns {Promise<Object|null>} - Returns deleted partner object or null
 */
const deletePartner = async (partnerId) => {
  if (!mongoose.Types.ObjectId.isValid(partnerId)) return null;
  return await Partner.findByIdAndDelete(partnerId);
};

/**
 * Search partners with filters
 * @param {Object} filters - Search filters (e.g., verification status, earnings)
 * @param {Object} options - Pagination and sorting options
 * @returns {Promise<Array>} - Returns array of matched partners
 */
const searchPartners = async (filters = {}, options = {}) => {
  const { limit = 10, page = 1, sort = '-createdAt' } = options;
  return await Partner.find(filters)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

/**
 * Update partner verification status
 * @param {string} partnerId - The partner ID
 * @param {boolean} isVerified - The verification status
 * @returns {Promise<Object|null>} - Returns the updated partner or null
 */
const updateVerificationStatus = async (partnerId, isVerified) => {
  if (!mongoose.Types.ObjectId.isValid(partnerId)) return null;
  return await Partner.findByIdAndUpdate(partnerId, { accountVerified: isVerified }, { new: true });
};

/**
 * Count total partners matching filters
 * @param {Object} filters - Count filters (e.g., status, verification status)
 * @returns {Promise<number>} - Returns count of partners
 */
const countPartners = async (filters = {}) => {
  return await Partner.countDocuments(filters);
};

/**
 * Track partner earnings
 * @param {string} partnerId - The partner ID
 * @returns {Promise<Object|null>} - Returns the partner with earnings details
 */
const getPartnerEarnings = async (partnerId) => {
  if (!mongoose.Types.ObjectId.isValid(partnerId)) return null;
  return await Partner.findById(partnerId).select('financials.totalEarnings financials.lastPayout financials.payoutMethod');
};

/**
 * Soft delete a partner by updating the status
 * @param {string} partnerId - The partner ID
 * @returns {Promise<Object|null>} - Returns the updated partner with status 'deleted'
 */
const softDeletePartner = async (partnerId) => {
  if (!mongoose.Types.ObjectId.isValid(partnerId)) return null;
  return await Partner.findByIdAndUpdate(partnerId, { status: 'deleted' }, { new: true });
};

/**
 * Audit partner actions
 * @param {string} partnerId - The partner ID
 * @param {string} action - The action performed (e.g., 'update_details', 'withdraw_payout')
 * @returns {Promise<Object>} - Returns the audit log entry
 */
const logPartnerAction = async (partnerId, action) => {
  if (!mongoose.Types.ObjectId.isValid(partnerId)) return null;
  return await Partner.findByIdAndUpdate(partnerId, { $push: { auditLogs: { action, timestamp: new Date() } } }, { new: true });
};

module.exports = {
  findById,
  findByEmail,
  createPartner,
  updatePartner,
  deletePartner,
  searchPartners,
  updateVerificationStatus,
  countPartners,
  getPartnerEarnings,
  softDeletePartner,
  logPartnerAction,
};
