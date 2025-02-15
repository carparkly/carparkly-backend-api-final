/**
 * User Model - Mongoose Schema
 * 
 * This model represents the User collection in MongoDB.
 * It follows best practices for security, performance, and scalability.
 * Includes user authentication fields, role management, timestamps, and indexing.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Exclude from queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'partner'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    lastLogin: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorCode: {
      type: String,
      select: false,
    },
    twoFactorCodeExpires: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index email field for faster queries
userSchema.index({ email: 1 });

/**
 * Pre-save hook: Hash password before saving the user document
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Method to compare passwords
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate password reset token
 */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
  return resetToken;
};

/**
 * Generate email verification token
 */
userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  return verificationToken;
};

/**
 * Generate JWT for authentication
 */
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Generate a Two-Factor Authentication Code
 */
userSchema.methods.generateTwoFactorCode = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  this.twoFactorCode = crypto.createHash('sha256').update(code).digest('hex');
  this.twoFactorCodeExpires = Date.now() + 10 * 60 * 1000; // 10-minute expiry
  return code;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
