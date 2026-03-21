const axios = require('axios');

// Mocking AI features if GEMINI_API_KEY is not set
const getAiSummary = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Text required' });

  // Simulate AI processing
  const summary = `SIMULATED SUMMARY: The provided notes discuss ${text.substring(0, 50)}... and emphasize key concepts for upcoming exams. (Connect Gemini API for real results)`;
  
  res.json({ summary });
};

const solveDoubt = async (req, res) => {
  const { doubt } = req.body;
  if (!doubt) return res.status(400).json({ message: 'Doubt text required' });

  // Simulate AI response
  const response = `AI ASSISTANT: Based on academic resources, your doubt about "${doubt}" can be explained as... [Detailed explanation placeholder].`;
  
  res.json({ response });
};

const detectEmotion = async (req, res) => {
  const { content } = req.body;
  // Simple keyword based emotion detection for demonstration
  const stressKeywords = ['exam', 'fail', 'stress', 'hard', 'tired', 'help', 'deadline'];
  const hasStress = stressKeywords.some(word => content.toLowerCase().includes(word));

  res.json({ 
    stressLevel: hasStress ? 0.8 : 0.2, 
    sentiment: hasStress ? 'negative' : 'neutral',
    suggestion: hasStress ? 'Take a 15-minute break. Meditation improves focus by 20%.' : 'Keep up the good work!'
  });
};

module.exports = { getAiSummary, solveDoubt, detectEmotion };
