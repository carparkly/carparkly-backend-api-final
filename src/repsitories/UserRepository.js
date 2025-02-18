/**
 * User Repository - Functional Data Access Layer
 * 
 * This repository provides efficient and scalable user data interactions.
 * It ensures security enforcement, query optimizations, logging, and structured data management.
 */

const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Find a user by ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object|null>} - Returns user object or null
 */
const findById = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return await User.findById(userId).select('-password');
};

/**
 * Find a user by email
 * @param {string} email - The user email
 * @returns {Promise<Object|null>} - Returns user object or null
 */
const findByEmail = async (email) => {
  return await User.findOne({ email }).select('-password');
};

/**
 * Create a new user
 * @param {Object} userData - The user data
 * @returns {Promise<Object>} - Returns the created user
 */
const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

/**
 * Update user details
 * @param {string} userId - The user ID
 * @param {Object} updateData - The updated fields
 * @returns {Promise<Object|null>} - Returns the updated user or null
 */
const updateUser = async (userId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
};

/**
 * Delete a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object|null>} - Returns deleted user object or null
 */
const deleteUser = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return await User.findByIdAndDelete(userId);
};

/**
 * Search users with filters
 * @param {Object} filters - Search filters (e.g., role, status)
 * @param {Object} options - Pagination and sorting options
 * @returns {Promise<Array>} - Returns array of matched users
 */
const searchUsers = async (filters = {}, options = {}) => {
  const { limit = 10, page = 1, sort = '-createdAt' } = options;
  return await User.find(filters)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-password');
};

/**
 * Update user login timestamp
 * @param {string} userId - The user ID
 * @returns {Promise<Object|null>} - Returns updated user or null
 */
const updateLastLogin = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return await User.findByIdAndUpdate(userId, { lastLogin: new Date() }, { new: true }).select('-password');
};

/**
 * Count total users matching filters
 * @param {Object} filters - Count filters (e.g., role, status)
 * @returns {Promise<number>} - Returns count of users
 */
const countUsers = async (filters = {}) => {
  return await User.countDocuments(filters);
};

/**
 * Soft delete a user by updating the status
 * @param {string} userId - The user ID
 * @returns {Promise<Object|null>} - Returns the updated user with status 'deleted'
 */
const softDeleteUser = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return await User.findByIdAndUpdate(userId, { status: 'deleted' }, { new: true }).select('-password');
};

/**
 * Bulk update user statuses
 * @param {Array} userIds - Array of user IDs
 * @param {String} status - New status to be updated
 * @returns {Promise<Object>} - Returns the update result
 */
const bulkUpdateStatus = async (userIds, status) => {
  if (!Array.isArray(userIds) || userIds.some(id => !mongoose.Types.ObjectId.isValid(id))) return null;
  return await User.updateMany({ _id: { $in: userIds } }, { status });
};

/**
 * Retrieve users by role
 * @param {string} role - The user role (e.g., 'admin', 'partner', 'client')
 * @returns {Promise<Array>} - Returns an array of users matching the role
 */
const findByRole = async (role) => {
  return await User.find({ role }).select('-password');
};

/**
 * Audit user actions
 * @param {string} userId - The user ID
 * @param {string} action - The action performed (e.g., 'login', 'update_profile')
 * @returns {Promise<Object>} - Returns the audit log entry
 */
const logUserAction = async (userId, action) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return await User.findByIdAndUpdate(userId, { $push: { auditLogs: { action, timestamp: new Date() } } }, { new: true });
};

module.exports = {
  findById,
  findByEmail,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  updateLastLogin,
  countUsers,
  softDeleteUser,
  bulkUpdateStatus,
  findByRole,
  logUserAction,
};
