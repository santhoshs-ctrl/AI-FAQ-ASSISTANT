const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-3.6-flash';

// Generates a direct answer to a support question
const generateAnswer = async (question) => {
  const prompt = `You are a helpful customer support assistant. Answer the following
customer question clearly and concisely, in 2-4 sentences, in plain text (no markdown):

Question: "${question}"`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  return response.text.trim();
};

// Generates a full question/answer/category FAQ triple from a topic
const generateFAQFromTopic = async (topic) => {
  const prompt = `You are drafting a single FAQ entry for a support knowledge base.
Given the topic below, produce ONLY a raw JSON object (no markdown fences, no preamble)
with exactly these keys: "question", "answer", "category".
The "category" must be one of: Technology, Education, Health, Banking, General, Configuration.

Topic: "${topic}"`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const raw = response.text.trim().replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(raw);
  } catch (err) {
    const error = new Error('AI response could not be parsed as valid JSON');
    error.status = 502;
    throw error;
  }
};

module.exports = { generateAnswer, generateFAQFromTopic };
