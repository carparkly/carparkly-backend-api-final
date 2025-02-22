/**
 * User Service - Handles user profile updates, role management, and security settings.
 * 
 * This service provides user management functionalities, including profile updates,
 * role assignments, security settings adjustments, session tracking, password management,
 * account lifecycle operations, failed login attempt handling, audit logging, and user retrieval.
 */

const UserRepository = require('../repositories/UserRepository');
const AuthService = require('./AuthService');

/**
 * Retrieve user profile by ID.
 * @param {string} userId - The user ID.
 * @returns {Promise<Object|null>} - Returns user object or null.
 */
const getUserProfile = async (userId) => {
  return await UserRepository.findById(userId);
};

/**
 * Retrieve users with filters.
 * @param {Object} filters - Filter conditions (e.g., role, status).
 * @param {Object} options - Pagination and sorting options.
 * @returns {Promise<Array>} - Returns an array of users.
 */
const getAllUsers = async (filters = {}, options = {}) => {
  return await UserRepository.searchUsers(filters, options);
};

/**
 * Update user profile details.
 * @param {string} userId - The user ID.
 * @param {Object} updateData - User profile update data.
 * @returns {Promise<Object|null>} - Returns updated user object or null.
 */
const updateUserProfile = async (userId, updateData) => {
  return await UserRepository.updateUser(userId, updateData);
};

/**
 * Assign or update user role securely.
 * @param {string} userId - The user ID.
 * @param {string} role - The new role to assign.
 * @returns {Promise<Object|null>} - Returns updated user object or null.
 */
const updateUserRole = async (userId, role) => {
  const validRoles = ['admin', 'partner', 'client', 'superadmin'];
  if (!validRoles.includes(role)) throw new Error('Invalid role assignment');
  return await UserRepository.updateUser(userId, { role });
};

/**
 * Enable or disable multi-factor authentication (MFA).
 * @param {string} userId - The user ID.
 * @param {boolean} enable - Enable or disable MFA.
 * @returns {Promise<Object|null>} - Returns updated user object or null.
 */
const updateMFAStatus = async (userId, enable) => {
  return await AuthService.updateMFAStatus(userId, enable);
};

/**
 * Verify user account.
 * @param {string} userId - The user ID.
 * @returns {Promise<Object|null>} - Returns updated user object or null.
 */
const verifyUserAccount = async (userId) => {
  return await UserRepository.updateUser(userId, { isVerified: true });
};

/**
 * Deactivate a user account.
 * @param {string} userId - The user ID.
 * @returns {Promise<Object|null>} - Returns updated user object or null.
 */
const deactivateUserAccount = async (userId) => {
  return await UserRepository.updateUser(userId, { status: 'inactive' });
};

/**
 * Reactivate a deactivated user account.
 * @param {string} userId - The user ID.
 * @returns {Promise<Object|null>} - Returns updated user object or null.
 */
const reactivateUserAccount = async (userId) => {
  return await UserRepository.updateUser(userId, { status: 'active' });
};

/**
 * Track last login timestamp.
 * @param {string} userId - The user ID.
 * @returns {Promise<Object|null>} - Returns updated user object with timestamp.
 */
const updateLastLogin = async (userId) => {
  return await UserRepository.updateUser(userId, { lastLogin: new Date() });
};

/**
 * Monitor failed login attempts and lock account if necessary.
 * @param {string} userId - The user ID.
 * @returns {Promise<Object|null>} - Returns updated user object or null.
 */
const handleFailedLogin = async (userId) => {
  const user = await UserRepository.findById(userId);
  if (!user) return null;

  const failedAttempts = (user.failedLoginAttempts || 0) + 1;
  const accountLocked = failedAttempts >= 5;
  return await UserRepository.updateUser(userId, {
    failedLoginAttempts: failedAttempts,
    accountLocked,
  });
};

/**
 * Reset failed login attempts after a successful login.
 * @param {string} userId - The user ID.
 * @returns {Promise<Object|null>} - Returns updated user object or null.
 */
const resetFailedLoginAttempts = async (userId) => {
  return await UserRepository.updateUser(userId, {
    failedLoginAttempts: 0,
    accountLocked: false,
  });
};

/**
 * Change user password securely.
 * @param {string} userId - The user ID.
 * @param {string} newPassword - The new password.
 * @returns {Promise<Object|null>} - Returns updated user object or null.
 */
const changePassword = async (userId, newPassword) => {
  const hashedPassword = await AuthService.hashPassword(newPassword);
  return await UserRepository.updateUser(userId, { password: hashedPassword });
};

/**
 * Delete a user account permanently.
 * @param {string} userId - The user ID.
 * @returns {Promise<Object|null>} - Returns deleted user object or null.
 */
const deleteUserAccount = async (userId) => {
  return await UserRepository.deleteUser(userId);
};

/**
 * Log user actions for auditing.
 * @param {string} userId - The user ID.
 * @param {string} action - The action performed.
 * @returns {Promise<void>} - Logs the user action.
 */
const logUserAction = async (userId, action) => {
  await UserRepository.logUserAction(userId, action);
};

module.exports = {
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  updateUserRole,
  updateMFAStatus,
  verifyUserAccount,
  deactivateUserAccount,
  reactivateUserAccount,
  updateLastLogin,
  handleFailedLogin,
  resetFailedLoginAttempts,
  changePassword,
  deleteUserAccount,
  logUserAction,
};
