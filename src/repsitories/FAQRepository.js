/**
 * FAQ Repository - Functional Data Access Layer
 * 
 * This repository provides efficient and scalable FAQ data interactions.
 * It ensures structured FAQ retrieval, search optimization, keyword-based matching, and version tracking.
 */

const FAQ = require('../models/FAQ');
const mongoose = require('mongoose');

/**
 * Find an FAQ by ID
 * @param {string} faqId - The FAQ ID
 * @returns {Promise<Object|null>} - Returns FAQ object or null
 */
const findById = async (faqId) => {
  if (!mongoose.Types.ObjectId.isValid(faqId)) return null;
  return await FAQ.findById(faqId);
};

/**
 * Create a new FAQ record
 * @param {Object} faqData - The FAQ data
 * @returns {Promise<Object>} - Returns the created FAQ record
 */
const createFAQ = async (faqData) => {
  const faq = new FAQ(faqData);
  return await faq.save();
};

/**
 * Update an FAQ entry
 * @param {string} faqId - The FAQ ID
 * @param {Object} updateData - The updated fields
 * @returns {Promise<Object|null>} - Returns the updated FAQ or null
 */
const updateFAQ = async (faqId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(faqId)) return null;
  return await FAQ.findByIdAndUpdate(faqId, updateData, { new: true, runValidators: true });
};

/**
 * Delete an FAQ record
 * @param {string} faqId - The FAQ ID
 * @returns {Promise<Object|null>} - Returns deleted FAQ object or null
 */
const deleteFAQ = async (faqId) => {
  if (!mongoose.Types.ObjectId.isValid(faqId)) return null;
  return await FAQ.findByIdAndDelete(faqId);
};

/**
 * Search FAQs with filters
 * @param {Object} filters - Search filters (e.g., category, status, keywords)
 * @param {Object} options - Pagination and sorting options
 * @returns {Promise<Array>} - Returns array of matched FAQs
 */
const searchFAQs = async (filters = {}, options = {}) => {
  const { limit = 10, page = 1, sort = '-priority' } = options;
  return await FAQ.find(filters)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

/**
 * Count total FAQs matching filters
 * @param {Object} filters - Count filters (e.g., category, status)
 * @returns {Promise<number>} - Returns count of FAQs
 */
const countFAQs = async (filters = {}) => {
  return await FAQ.countDocuments(filters);
};

/**
 * Get related FAQs
 * @param {string} faqId - The FAQ ID
 * @returns {Promise<Array>} - Returns an array of related FAQs
 */
const getRelatedFAQs = async (faqId) => {
  if (!mongoose.Types.ObjectId.isValid(faqId)) return null;
  const faq = await FAQ.findById(faqId).populate('relatedQuestions');
  return faq ? faq.relatedQuestions : [];
};

/**
 * Increment FAQ version
 * @param {string} faqId - The FAQ ID
 * @returns {Promise<Object|null>} - Returns the updated FAQ with a new version number
 */
const incrementVersion = async (faqId) => {
  if (!mongoose.Types.ObjectId.isValid(faqId)) return null;
  return await FAQ.findByIdAndUpdate(faqId, { $inc: { version: 1 } }, { new: true });
};

module.exports = {
  findById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  searchFAQs,
  countFAQs,
  getRelatedFAQs,
  incrementVersion,
};
