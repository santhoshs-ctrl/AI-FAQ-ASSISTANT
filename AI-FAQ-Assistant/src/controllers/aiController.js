const { generateAnswer, generateFAQFromTopic } = require('../services/geminiService');
const { asyncHandler } = require('../utils/helpers');

// @desc    Generate an AI answer for an arbitrary question (not saved to DB)
// @route   POST /api/ai/answer
// @access  Private
const generateAIAnswer = asyncHandler(async (req, res) => {
  const { question } = req.body;

  const answer = await generateAnswer(question);

  res.status(200).json({
    success: true,
    message: 'AI answer generated successfully',
    data: { question, answer },
  });
});

// @desc    Generate a full FAQ (question/answer/category) from a topic
// @route   POST /api/ai/generate-faq
// @access  Private
const generateAIFAQ = asyncHandler(async (req, res) => {
  const { topic } = req.body;

  const generated = await generateFAQFromTopic(topic);

  res.status(200).json({
    success: true,
    message: 'AI FAQ generated successfully. Review and POST to /api/faqs to save it.',
    data: generated,
  });
});

module.exports = { generateAIAnswer, generateAIFAQ };
