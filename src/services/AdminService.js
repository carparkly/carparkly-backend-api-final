/**
 * Admin Service - Handles administrative operations including user management,
 * role-based access control (RBAC), system monitoring, security enforcement,
 * and audit logging.
 * 
 * This service ensures secure, structured, and scalable administration by 
 * providing admin authentication, access control, audit tracking, system-wide
 * settings management, and security policy enforcement.
 */

const AdminRepository = require('../repositories/AdminRepository');
const AuthService = require('./AuthService');

/**
 * Retrieve admin profile by ID.
 * @param {string} adminId - The admin ID.
 * @returns {Promise<Object|null>} - Returns admin object or null.
 */
const getAdminProfile = async (adminId) => {
  return await AdminRepository.findById(adminId);
};

/**
 * Retrieve all admins with filters.
 * @param {Object} filters - Search filters (e.g., role, status).
 * @param {Object} options - Pagination and sorting options.
 * @returns {Promise<Array>} - Returns an array of admin users.
 */
const getAllAdmins = async (filters = {}, options = {}) => {
  return await AdminRepository.searchAdmins(filters, options);
};

/**
 * Update admin profile details.
 * @param {string} adminId - The admin ID.
 * @param {Object} updateData - Admin profile update data.
 * @returns {Promise<Object|null>} - Returns updated admin object or null.
 */
const updateAdminProfile = async (adminId, updateData) => {
  return await AdminRepository.updateAdmin(adminId, updateData);
};

/**
 * Assign or update admin role securely with validation and restrictions.
 * @param {string} adminId - The admin ID.
 * @param {string} role - The new role to assign.
 * @param {string} requestingAdminRole - The role of the admin making the request.
 * @returns {Promise<Object|null>} - Returns updated admin object or null.
 */
const updateAdminRole = async (adminId, role, requestingAdminRole) => {
  const validRoles = ['superadmin', 'admin', 'moderator'];
  if (!validRoles.includes(role)) throw new Error('Invalid role assignment');
  if (requestingAdminRole !== 'superadmin' && role === 'superadmin') {
    throw new Error('Only superadmins can assign or modify superadmin roles');
  }
  return await AdminRepository.updateAdmin(adminId, { role });
};

/**
 * Enable or disable multi-factor authentication (MFA) for an admin.
 * @param {string} adminId - The admin ID.
 * @param {boolean} enable - Enable or disable MFA.
 * @returns {Promise<Object|null>} - Returns updated admin object or null.
 */
const updateMFAStatus = async (adminId, enable) => {
  return await AuthService.updateMFAStatus(adminId, enable);
};

/**
 * Track last login timestamp for an admin along with IP and device info.
 * @param {string} adminId - The admin ID.
 * @param {string} ipAddress - The IP address of the login request.
 * @param {string} deviceInfo - The device used for login.
 * @returns {Promise<Object|null>} - Returns updated admin object with login details.
 */
const updateLastLogin = async (adminId, ipAddress, deviceInfo) => {
  return await AdminRepository.updateAdmin(adminId, {
    lastLogin: new Date(),
    ipAddress,
    deviceInfo,
  });
};

/**
 * Log admin actions for auditing and security tracking.
 * @param {string} adminId - The admin ID.
 * @param {string} action - The action performed.
 * @returns {Promise<void>} - Logs the admin action.
 */
const logAdminAction = async (adminId, action) => {
  await AdminRepository.logAdminAction(adminId, action);
};

/**
 * Enforce security policies and restrictions for administrators.
 * @param {string} adminId - The admin ID.
 * @param {Object} policyUpdates - Security policies to enforce.
 * @returns {Promise<Object|null>} - Returns updated security policies.
 */
const enforceSecurityPolicy = async (adminId, policyUpdates) => {
  return await AdminRepository.updateAdmin(adminId, { securityPolicies: policyUpdates });
};

/**
 * Track active admin sessions.
 * @param {string} adminId - The admin ID.
 * @returns {Promise<Object|null>} - Returns updated session logs.
 */
const trackAdminSession = async (adminId) => {
  return await AdminRepository.updateAdmin(adminId, {
    $push: { sessionLogs: { timestamp: new Date() } },
  });
};

/**
 * Deactivate an admin account.
 * @param {string} adminId - The admin ID.
 * @returns {Promise<Object|null>} - Returns updated admin object or null.
 */
const deactivateAdminAccount = async (adminId) => {
  return await AdminRepository.updateAdmin(adminId, { status: 'inactive' });
};

/**
 * Reactivate a deactivated admin account.
 * @param {string} adminId - The admin ID.
 * @returns {Promise<Object|null>} - Returns updated admin object or null.
 */
const reactivateAdminAccount = async (adminId) => {
  return await AdminRepository.updateAdmin(adminId, { status: 'active' });
};

/**
 * Delete an admin account permanently.
 * @param {string} adminId - The admin ID.
 * @returns {Promise<Object|null>} - Returns deleted admin object or null.
 */
const deleteAdminAccount = async (adminId) => {
  return await AdminRepository.deleteAdmin(adminId);
};

module.exports = {
  getAdminProfile,
  getAllAdmins,
  updateAdminProfile,
  updateAdminRole,
  updateMFAStatus,
  updateLastLogin,
  logAdminAction,
  enforceSecurityPolicy,
  trackAdminSession,
  deactivateAdminAccount,
  reactivateAdminAccount,
  deleteAdminAccount,
};
