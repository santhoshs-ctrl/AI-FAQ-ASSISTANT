const FAQ = require('../models/FAQ');
const { asyncHandler } = require('../utils/helpers');

// @desc    Create a new FAQ
// @route   POST /api/faqs
// @access  Private
const createFAQ = asyncHandler(async (req, res) => {
  const { question, answer, category } = req.body;

  const faq = await FAQ.create({
    question,
    answer,
    category,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'FAQ created successfully',
    data: faq,
  });
});

// @desc    Get all FAQs (public list)
// @route   GET /api/faqs
// @access  Public
const getAllFAQs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'FAQs retrieved successfully',
    count: faqs.length,
    data: faqs,
  });
});

// @desc    Get a single FAQ by id
// @route   GET /api/faqs/:id
// @access  Public
const getFAQById = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id).populate('createdBy', 'name email');

  if (!faq) {
    res.status(404);
    throw new Error('FAQ not found');
  }

  res.status(200).json({ success: true, data: faq });
});

// @desc    Update an FAQ (only the original author or an admin)
// @route   PUT /api/faqs/:id
// @access  Private
const updateFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    res.status(404);
    throw new Error('FAQ not found');
  }

  if (faq.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this FAQ');
  }

  const { question, answer, category } = req.body;
  faq.question = question ?? faq.question;
  faq.answer = answer ?? faq.answer;
  faq.category = category ?? faq.category;

  const updated = await faq.save();

  res.status(200).json({
    success: true,
    message: 'FAQ updated successfully',
    data: updated,
  });
});

// @desc    Delete an FAQ (only the original author or an admin)
// @route   DELETE /api/faqs/:id
// @access  Private
const deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    res.status(404);
    throw new Error('FAQ not found');
  }

  if (faq.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this FAQ');
  }

  await faq.deleteOne();

  res.status(200).json({
    success: true,
    message: 'FAQ deleted successfully',
  });
});

// @desc    Keyword search across FAQs
// @route   GET /api/faqs/search?q=keyword
// @access  Public
const searchFAQs = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    res.status(400);
    throw new Error('A search query parameter "q" is required');
  }

  const faqs = await FAQ.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'FAQs retrieved successfully',
    count: faqs.length,
    data: faqs,
  });
});

module.exports = {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
  searchFAQs,
};
