/**
 * Admin Model - Mongoose Schema
 * 
 * This model represents SuperAdmins and Supervisors who manage the platform.
 * It ensures structured role-based access control (RBAC) for administrators.
 * Features include audit logging, multi-factor authentication (MFA), permission inheritance, session tracking, access control restrictions, activity monitoring, and security enhancements.
 */

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the base User model
      required: true,
    },
    role: {
      type: String,
      enum: ['superadmin', 'supervisor'], // Defines hierarchical roles
      required: true,
    },
    permissions: {
      type: [String], // Stores assigned permissions for role-based access
      default: [],
    },
    inheritedPermissions: {
      type: [String], // Automatically inherited permissions based on role
      default: [],
    },
    mfaEnabled: {
      type: Boolean,
      default: false, // Multi-Factor Authentication status
    },
    lastLogin: {
      type: Date,
      default: null, // Tracks last login timestamp
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    sessionLogs: [
      {
        sessionId: { type: String, required: true },
        loginTime: { type: Date, default: Date.now },
        logoutTime: { type: Date, default: null },
        ipAddress: { type: String, default: null },
        deviceInfo: { type: String, default: null },
        location: { type: String, default: null },
      },
    ],
    accessRestrictions: {
      allowedIPs: {
        type: [String], // Defines specific IPs allowed to access the admin panel
        default: [],
      },
      allowedDevices: {
        type: [String], // Defines specific devices allowed to access the admin panel
        default: [],
      },
      restrictedHours: {
        type: [String], // Defines hours when access is restricted
        default: [],
      },
    },
    auditLogs: [
      {
        action: { type: String, required: true },
        performedAt: { type: Date, default: Date.now },
        ipAddress: { type: String, default: null },
        userAgent: { type: String, default: null },
      },
    ],
    securitySettings: {
      passwordChangedAt: { type: Date, default: null },
      failedLoginAttempts: { type: Number, default: 0 },
      accountLocked: { type: Boolean, default: false },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Index userId, role, status, and security settings for efficient queries
adminSchema.index({ userId: 1, role: 1, status: 1, 'securitySettings.accountLocked': 1 });

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
