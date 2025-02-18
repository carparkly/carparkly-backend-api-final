/**
 * Client Repository - Functional Data Access Layer
 * 
 * This repository provides efficient and scalable client data interactions.
 * It ensures security enforcement, query optimizations, logging, referral tracking, fraud detection, and structured data management.
 */

const Client = require('../models/Client');
const mongoose = require('mongoose');

/**
 * Find a client by ID
 * @param {string} clientId - The client ID
 * @returns {Promise<Object|null>} - Returns client object or null
 */
const findById = async (clientId) => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) return null;
  return await Client.findById(clientId).select('-password');
};

/**
 * Find a client by email
 * @param {string} email - The client email
 * @returns {Promise<Object|null>} - Returns client object or null
 */
const findByEmail = async (email) => {
  return await Client.findOne({ email }).select('-password');
};

/**
 * Create a new client
 * @param {Object} clientData - The client data
 * @returns {Promise<Object>} - Returns the created client
 */
const createClient = async (clientData) => {
  const client = new Client(clientData);
  return await client.save();
};

/**
 * Update client details
 * @param {string} clientId - The client ID
 * @param {Object} updateData - The updated fields
 * @returns {Promise<Object|null>} - Returns the updated client or null
 */
const updateClient = async (clientId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) return null;
  return await Client.findByIdAndUpdate(clientId, updateData, { new: true, runValidators: true }).select('-password');
};

/**
 * Delete a client
 * @param {string} clientId - The client ID
 * @returns {Promise<Object|null>} - Returns deleted client object or null
 */
const deleteClient = async (clientId) => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) return null;
  return await Client.findByIdAndDelete(clientId);
};

/**
 * Search clients with filters
 * @param {Object} filters - Search filters (e.g., status, referral code, fraud score)
 * @param {Object} options - Pagination and sorting options
 * @returns {Promise<Array>} - Returns array of matched clients
 */
const searchClients = async (filters = {}, options = {}) => {
  const { limit = 10, page = 1, sort = '-createdAt' } = options;
  return await Client.find(filters)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-password');
};

/**
 * Update client login timestamp
 * @param {string} clientId - The client ID
 * @returns {Promise<Object|null>} - Returns updated client or null
 */
const updateLastLogin = async (clientId) => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) return null;
  return await Client.findByIdAndUpdate(clientId, { lastLogin: new Date() }, { new: true }).select('-password');
};

/**
 * Count total clients matching filters
 * @param {Object} filters - Count filters (e.g., status, referral code, fraud score)
 * @returns {Promise<number>} - Returns count of clients
 */
const countClients = async (filters = {}) => {
  return await Client.countDocuments(filters);
};

/**
 * Soft delete a client by updating the status
 * @param {string} clientId - The client ID
 * @returns {Promise<Object|null>} - Returns the updated client with status 'deleted'
 */
const softDeleteClient = async (clientId) => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) return null;
  return await Client.findByIdAndUpdate(clientId, { status: 'deleted' }, { new: true }).select('-password');
};

/**
 * Retrieve clients by referral code
 * @param {string} referralCode - The referral code
 * @returns {Promise<Object|null>} - Returns client object or null
 */
const findByReferralCode = async (referralCode) => {
  return await Client.findOne({ referralCode });
};

/**
 * Audit client actions
 * @param {string} clientId - The client ID
 * @param {string} action - The action performed (e.g., 'login', 'update_profile')
 * @returns {Promise<Object>} - Returns the audit log entry
 */
const logClientAction = async (clientId, action) => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) return null;
  return await Client.findByIdAndUpdate(clientId, { $push: { auditLogs: { action, timestamp: new Date() } } }, { new: true });
};

/**
 * Update client fraud score
 * @param {string} clientId - The client ID
 * @param {number} fraudScore - The fraud score to update
 * @returns {Promise<Object|null>} - Returns the updated client or null
 */
const updateFraudScore = async (clientId, fraudScore) => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) return null;
  return await Client.findByIdAndUpdate(clientId, { fraudScore }, { new: true }).select('-password');
};

module.exports = {
  findById,
  findByEmail,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
  updateLastLogin,
  countClients,
  softDeleteClient,
  findByReferralCode,
  logClientAction,
  updateFraudScore,
};
