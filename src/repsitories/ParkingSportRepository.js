/**
 * ParkingSpot Repository - Functional Data Access Layer
 * 
 * This repository provides efficient and scalable parking spot data interactions.
 * It ensures security enforcement, availability tracking, pricing updates, geospatial indexing, structured data handling, and analytics.
 */

const ParkingSpot = require('../models/ParkingSpot');
const mongoose = require('mongoose');

/**
 * Find a parking spot by ID
 * @param {string} spotId - The parking spot ID
 * @returns {Promise<Object|null>} - Returns parking spot object or null
 */
const findById = async (spotId) => {
  if (!mongoose.Types.ObjectId.isValid(spotId)) return null;
  return await ParkingSpot.findById(spotId);
};

/**
 * Create a new parking spot
 * @param {Object} spotData - The parking spot data
 * @returns {Promise<Object>} - Returns the created parking spot
 */
const createParkingSpot = async (spotData) => {
  const spot = new ParkingSpot(spotData);
  return await spot.save();
};

/**
 * Update parking spot details
 * @param {string} spotId - The parking spot ID
 * @param {Object} updateData - The updated fields
 * @returns {Promise<Object|null>} - Returns the updated parking spot or null
 */
const updateParkingSpot = async (spotId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(spotId)) return null;
  return await ParkingSpot.findByIdAndUpdate(spotId, updateData, { new: true, runValidators: true });
};

/**
 * Delete a parking spot
 * @param {string} spotId - The parking spot ID
 * @returns {Promise<Object|null>} - Returns deleted parking spot object or null
 */
const deleteParkingSpot = async (spotId) => {
  if (!mongoose.Types.ObjectId.isValid(spotId)) return null;
  return await ParkingSpot.findByIdAndDelete(spotId);
};

/**
 * Search parking spots with filters
 * @param {Object} filters - Search filters (e.g., availability, location, pricing)
 * @param {Object} options - Pagination and sorting options
 * @returns {Promise<Array>} - Returns array of matched parking spots
 */
const searchParkingSpots = async (filters = {}, options = {}) => {
  const { limit = 10, page = 1, sort = '-createdAt' } = options;
  return await ParkingSpot.find(filters)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

/**
 * Update parking spot availability
 * @param {string} spotId - The parking spot ID
 * @param {boolean} isAvailable - The new availability status
 * @returns {Promise<Object|null>} - Returns the updated parking spot or null
 */
const updateAvailability = async (spotId, isAvailable) => {
  if (!mongoose.Types.ObjectId.isValid(spotId)) return null;
  return await ParkingSpot.findByIdAndUpdate(spotId, { isAvailable }, { new: true });
};

/**
 * Count total parking spots matching filters
 * @param {Object} filters - Count filters (e.g., location, availability)
 * @returns {Promise<number>} - Returns count of parking spots
 */
const countParkingSpots = async (filters = {}) => {
  return await ParkingSpot.countDocuments(filters);
};

/**
 * Get parking spots near a location
 * @param {Object} coordinates - Latitude and longitude
 * @param {number} maxDistance - Maximum search distance in meters
 * @returns {Promise<Array>} - Returns an array of nearby parking spots
 */
const findNearbySpots = async (coordinates, maxDistance = 5000) => {
  return await ParkingSpot.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: maxDistance,
      },
    },
  });
};

/**
 * Track parking spot usage statistics
 * @param {string} spotId - The parking spot ID
 * @returns {Promise<Object|null>} - Returns usage statistics
 */
const getUsageStatistics = async (spotId) => {
  if (!mongoose.Types.ObjectId.isValid(spotId)) return null;
  return await ParkingSpot.findById(spotId).select('totalBookings averageOccupancyRate customerFeedbackScore');
};

/**
 * Adjust dynamic pricing based on demand
 * @param {string} spotId - The parking spot ID
 * @param {number} newRate - The new hourly rate
 * @returns {Promise<Object|null>} - Returns the updated parking spot with new pricing
 */
const adjustDynamicPricing = async (spotId, newRate) => {
  if (!mongoose.Types.ObjectId.isValid(spotId) || newRate < 0) return null;
  return await ParkingSpot.findByIdAndUpdate(spotId, { hourlyRate: newRate }, { new: true });
};

module.exports = {
  findById,
  createParkingSpot,
  updateParkingSpot,
  deleteParkingSpot,
  searchParkingSpots,
  updateAvailability,
  countParkingSpots,
  findNearbySpots,
  getUsageStatistics,
  adjustDynamicPricing,
};