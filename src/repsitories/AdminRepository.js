/**
 * Admin Repository - Functional Data Access Layer
 * 
 * This repository provides efficient and scalable admin data interactions.
 * It ensures security enforcement, role-based access management, multi-factor authentication tracking, session logging, audit logging, and structured data handling.
 */

const Admin = require('../models/Admin');
const mongoose = require('mongoose');

/**
 * Find an admin by ID
 * @param {string} adminId - The admin ID
 * @returns {Promise<Object|null>} - Returns admin object or null
 */
const findById = async (adminId) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) return null;
  return await Admin.findById(adminId);
};

/**
 * Find an admin by email
 * @param {string} email - The admin email
 * @returns {Promise<Object|null>} - Returns admin object or null
 */
const findByEmail = async (email) => {
  return await Admin.findOne({ email });
};

/**
 * Create a new admin
 * @param {Object} adminData - The admin data
 * @returns {Promise<Object>} - Returns the created admin
 */
const createAdmin = async (adminData) => {
  const admin = new Admin(adminData);
  return await admin.save();
};

/**
 * Update admin details
 * @param {string} adminId - The admin ID
 * @param {Object} updateData - The updated fields
 * @returns {Promise<Object|null>} - Returns the updated admin or null
 */
const updateAdmin = async (adminId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) return null;
  return await Admin.findByIdAndUpdate(adminId, updateData, { new: true, runValidators: true });
};

/**
 * Delete an admin
 * @param {string} adminId - The admin ID
 * @returns {Promise<Object|null>} - Returns deleted admin object or null
 */
const deleteAdmin = async (adminId) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) return null;
  return await Admin.findByIdAndDelete(adminId);
};

/**
 * Search admins with filters
 * @param {Object} filters - Search filters (e.g., role, status, MFA status)
 * @param {Object} options - Pagination and sorting options
 * @returns {Promise<Array>} - Returns array of matched admins
 */
const searchAdmins = async (filters = {}, options = {}) => {
  const { limit = 10, page = 1, sort = '-createdAt' } = options;
  return await Admin.find(filters)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

/**
 * Update admin role
 * @param {string} adminId - The admin ID
 * @param {string} role - The new role
 * @returns {Promise<Object|null>} - Returns the updated admin or null
 */
const updateAdminRole = async (adminId, role) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) return null;
  return await Admin.findByIdAndUpdate(adminId, { role }, { new: true });
};

/**
 * Count total admins matching filters
 * @param {Object} filters - Count filters (e.g., role, status)
 * @returns {Promise<number>} - Returns count of admins
 */
const countAdmins = async (filters = {}) => {
  return await Admin.countDocuments(filters);
};

/**
 * Log admin actions
 * @param {string} adminId - The admin ID
 * @param {string} action - The action performed (e.g., 'update_settings', 'manage_users')
 * @returns {Promise<Object>} - Returns the audit log entry
 */
const logAdminAction = async (adminId, action) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) return null;
  return await Admin.findByIdAndUpdate(adminId, { $push: { auditLogs: { action, timestamp: new Date() } } }, { new: true });
};

/**
 * Track admin sessions
 * @param {string} adminId - The admin ID
 * @param {Object} sessionData - Session details including IP and device info
 * @returns {Promise<Object|null>} - Returns the updated admin with session logs
 */
const logAdminSession = async (adminId, sessionData) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) return null;
  return await Admin.findByIdAndUpdate(adminId, { $push: { sessionLogs: sessionData } }, { new: true });
};

/**
 * Enable or disable Multi-Factor Authentication (MFA) for an admin
 * @param {string} adminId - The admin ID
 * @param {boolean} mfaStatus - The MFA enable or disable flag
 * @returns {Promise<Object|null>} - Returns the updated admin with MFA status
 */
const updateMFAStatus = async (adminId, mfaStatus) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) return null;
  return await Admin.findByIdAndUpdate(adminId, { mfaEnabled: mfaStatus }, { new: true });
};

module.exports = {
  findById,
  findByEmail,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  searchAdmins,
  updateAdminRole,
  countAdmins,
  logAdminAction,
  logAdminSession,
  updateMFAStatus,
};
