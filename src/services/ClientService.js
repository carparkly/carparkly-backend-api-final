/**
 * Client Service - Handles client-specific operations, including profile updates,
 * loyalty management, referral tracking, security settings, fraud detection,
 * session monitoring, notification preferences, engagement tracking, and rewards.
 * 
 * This service ensures secure, scalable, and efficient client management with 
 * enhanced fraud monitoring, session tracking, engagement analytics, and client rewards.
 */

const ClientRepository = require('../repositories/ClientRepository');
const AuthService = require('./AuthService');

/**
 * Retrieve client profile by ID.
 * @param {string} clientId - The client ID.
 * @returns {Promise<Object|null>} - Returns client object or null.
 */
const getClientProfile = async (clientId) => {
  return await ClientRepository.findById(clientId);
};

/**
 * Retrieve clients with filters.
 * @param {Object} filters - Filter conditions (e.g., status, referral code, fraud risk).
 * @param {Object} options - Pagination and sorting options.
 * @returns {Promise<Array>} - Returns an array of clients.
 */
const getAllClients = async (filters = {}, options = {}) => {
  return await ClientRepository.searchClients(filters, options);
};

/**
 * Update client profile details.
 * @param {string} clientId - The client ID.
 * @param {Object} updateData - Client profile update data.
 * @returns {Promise<Object|null>} - Returns updated client object or null.
 */
const updateClientProfile = async (clientId, updateData) => {
  return await ClientRepository.updateClient(clientId, updateData);
};

/**
 * Track client referral usage and history.
 * @param {string} referralCode - The referral code.
 * @returns {Promise<Object|null>} - Returns client object or null.
 */
const trackReferral = async (referralCode) => {
  return await ClientRepository.findByReferralCode(referralCode);
};

/**
 * Enable or disable multi-factor authentication (MFA).
 * @param {string} clientId - The client ID.
 * @param {boolean} enable - Enable or disable MFA.
 * @returns {Promise<Object|null>} - Returns updated client object or null.
 */
const updateMFAStatus = async (clientId, enable) => {
  return await AuthService.updateMFAStatus(clientId, enable);
};

/**
 * Track last login timestamp along with device and IP info.
 * @param {string} clientId - The client ID.
 * @param {string} ipAddress - The IP address.
 * @param {string} deviceInfo - The device information.
 * @returns {Promise<Object|null>} - Returns updated client object with timestamp.
 */
const updateLastLogin = async (clientId, ipAddress, deviceInfo) => {
  return await ClientRepository.updateClient(clientId, {
    lastLogin: new Date(),
    ipAddress,
    deviceInfo,
  });
};

/**
 * Manage client loyalty points.
 * @param {string} clientId - The client ID.
 * @param {number} points - Points to add or subtract.
 * @returns {Promise<Object|null>} - Returns updated client object or null.
 */
const updateLoyaltyPoints = async (clientId, points) => {
  return await ClientRepository.updateClient(clientId, { $inc: { loyaltyPoints: points } });
};

/**
 * Update fraud risk score for a client.
 * @param {string} clientId - The client ID.
 * @param {number} fraudScore - The new fraud risk score.
 * @returns {Promise<Object|null>} - Returns updated client object or null.
 */
const updateFraudScore = async (clientId, fraudScore) => {
  return await ClientRepository.updateClient(clientId, { fraudScore });
};

/**
 * Update client notification preferences.
 * @param {string} clientId - The client ID.
 * @param {Object} preferences - Notification preferences.
 * @returns {Promise<Object|null>} - Returns updated client object or null.
 */
const updateNotificationPreferences = async (clientId, preferences) => {
  return await ClientRepository.updateClient(clientId, { notificationPreferences: preferences });
};

/**
 * Track client engagement, including session frequency and interactions.
 * @param {string} clientId - The client ID.
 * @param {string} interactionType - Type of interaction (e.g., 'search', 'booking', 'review').
 * @returns {Promise<Object|null>} - Returns updated client engagement log.
 */
const trackClientEngagement = async (clientId, interactionType) => {
  return await ClientRepository.updateClient(clientId, {
    $push: { engagementLogs: { interactionType, timestamp: new Date() } },
  });
};

/**
 * Retrieve client engagement history.
 * @param {string} clientId - The client ID.
 * @returns {Promise<Array>} - Returns an array of engagement logs.
 */
const getClientEngagementHistory = async (clientId) => {
  const client = await ClientRepository.findById(clientId);
  return client ? client.engagementLogs || [] : [];
};

/**
 * Grant client rewards based on engagement.
 * @param {string} clientId - The client ID.
 * @param {string} reward - The reward to grant.
 * @returns {Promise<Object|null>} - Returns updated client object with rewards.
 */
const grantClientReward = async (clientId, reward) => {
  return await ClientRepository.updateClient(clientId, {
    $push: { rewards: { reward, timestamp: new Date() } },
  });
};

/**
 * Soft delete a client account (mark as deleted).
 * @param {string} clientId - The client ID.
 * @returns {Promise<Object|null>} - Returns updated client object or null.
 */
const softDeleteClientAccount = async (clientId) => {
  return await ClientRepository.updateClient(clientId, { status: 'deleted' });
};

/**
 * Reactivate a soft-deleted client account.
 * @param {string} clientId - The client ID.
 * @returns {Promise<Object|null>} - Returns updated client object or null.
 */
const reactivateClientAccount = async (clientId) => {
  return await ClientRepository.updateClient(clientId, { status: 'active' });
};

/**
 * Log client actions for auditing.
 * @param {string} clientId - The client ID.
 * @param {string} action - The action performed.
 * @returns {Promise<void>} - Logs the client action.
 */
const logClientAction = async (clientId, action) => {
  await ClientRepository.logClientAction(clientId, action);
};

module.exports = {
  getClientProfile,
  getAllClients,
  updateClientProfile,
  trackReferral,
  updateMFAStatus,
  updateLastLogin,
  updateLoyaltyPoints,
  updateFraudScore,
  updateNotificationPreferences,
  trackClientEngagement,
  getClientEngagementHistory,
  grantClientReward,
  softDeleteClientAccount,
  reactivateClientAccount,
  logClientAction,
};
