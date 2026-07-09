const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Report = require('../models/Report');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  const { input } = req.body;

  if (!input) return res.status(400).json({ error: 'No input provided' });

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a fraud detection expert specializing in Indian cybercrime, especially digital arrest scams, UPI fraud, phishing, and fake government official scams. Always respond ONLY in valid JSON format with no extra text, no markdown, no code blocks.`
        },
        {
          role: 'user',
          content: `Analyze this message or call description from an Indian citizen:

"${input}"

Respond ONLY in this exact JSON format, nothing else:
{
  "verdict": "SCAM" or "SUSPICIOUS" or "SAFE",
  "scamType": "Digital Arrest Scam" or "UPI Fraud" or "Phishing" or "Fake Offer" or "Other" or "None",
  "confidence": "High" or "Medium" or "Low",
  "explanation": "2-3 sentence explanation in simple English",
  "explanationHindi": "Same explanation in Hindi",
  "whatToDo": "Specific next steps for the user"
}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const text = completion.choices[0].message.content;

    // Clean and parse JSON
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Save to MongoDB
    const report = new Report({
      input,
      verdict: parsed.verdict,
      scamType: parsed.scamType,
      confidence: parsed.confidence,
      explanation: parsed.explanation,
      whatToDo: parsed.whatToDo
    });
    await report.save();

    res.json(parsed);

  } catch (err) {
    console.error('FULL ERROR:', JSON.stringify(err, null, 2));
    console.error('ERROR MESSAGE:', err.message);
    res.status(500).json({ error: 'Analysis failed. Try again.' });
  }
});

module.exports = router;