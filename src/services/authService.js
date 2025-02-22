/**
 * Auth Service - Handles authentication and authorization logic.
 * 
 * This service provides user authentication, token management, password hashing,
 * multi-factor authentication (MFA), session tracking, role-based access control,
 * secure logout with token blacklisting, email verification, and password reset functionality.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserRepository = require('../repositories/UserRepository');
const config = require('../config');
const TokenBlacklist = new Set(); // Temporary in-memory token blacklist

/**
 * Hash user password before storing it in the database.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - Returns the hashed password.
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
  return await bcrypt.hash(password, salt);
};

/**
 * Compare provided password with the stored hash.
 * @param {string} password - The plain text password.
 * @param {string} hash - The hashed password stored in the database.
 * @returns {Promise<boolean>} - Returns true if the password matches.
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT token for user authentication.
 * @param {Object} user - The authenticated user object.
 * @returns {string} - Returns the generated token.
 */
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

/**
 * Authenticate user using email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - Returns authentication token and user data.
 */
const authenticateUser = async (email, password) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken(user);
  return { user, token };
};

/**
 * Validate JWT token.
 * @param {string} token - The JWT token.
 * @returns {Object|null} - Returns decoded token if valid, otherwise null.
 */
const verifyToken = (token) => {
  try {
    if (TokenBlacklist.has(token)) return null; // Check if token is blacklisted
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    return null;
  }
};

/**
 * Enable or disable multi-factor authentication (MFA) for a user.
 * @param {string} userId - The user ID.
 * @param {boolean} enable - Enable or disable MFA.
 * @returns {Promise<Object|null>} - Returns updated user object or null.
 */
const updateMFAStatus = async (userId, enable) => {
  return await UserRepository.updateUser(userId, { mfaEnabled: enable });
};

/**
 * Log out user by invalidating session and blacklisting token.
 * @param {string} token - The JWT token to blacklist.
 * @param {string} userId - The user ID.
 * @returns {Promise<void>} - Logs out the user securely.
 */
const logoutUser = async (token, userId) => {
  TokenBlacklist.add(token); // Add token to blacklist
  await UserRepository.logUserAction(userId, 'logout');
};

/**
 * Check if user has the required role.
 * @param {Object} user - The authenticated user object.
 * @param {Array<string>} allowedRoles - The roles that are allowed to access a resource.
 * @returns {boolean} - Returns true if user has access, false otherwise.
 */
const checkUserRole = (user, allowedRoles) => {
  return allowedRoles.includes(user.role);
};

/**
 * Generate a password reset token.
 * @param {string} userId - The user ID.
 * @returns {Promise<string>} - Returns the generated reset token.
 */
const generatePasswordResetToken = async (userId) => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  await UserRepository.updateUser(userId, { resetToken, resetTokenExpires: Date.now() + 3600000 }); // Expires in 1 hour
  return resetToken;
};

/**
 * Reset user password using reset token.
 * @param {string} resetToken - The reset token.
 * @param {string} newPassword - The new password.
 * @returns {Promise<Object|null>} - Returns updated user or null.
 */
const resetPassword = async (resetToken, newPassword) => {
  const user = await UserRepository.findByResetToken(resetToken);
  if (!user || user.resetTokenExpires < Date.now()) throw new Error('Invalid or expired reset token');

  const hashedPassword = await hashPassword(newPassword);
  return await UserRepository.updateUser(user._id, { password: hashedPassword, resetToken: null, resetTokenExpires: null });
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  authenticateUser,
  verifyToken,
  updateMFAStatus,
  logoutUser,
  checkUserRole,
  generatePasswordResetToken,
  resetPassword,
};
