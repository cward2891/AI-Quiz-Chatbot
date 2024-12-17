import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const generateQuiz = async (topic) => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert quiz question generator. Create engaging multiple-choice questions."
          },
          {
            role: "user",
            content: `Generate 5 multiple-choice questions about ${topic}. 
            Format each question with:
            - A clear, interesting question
            - 4 possible answers
            - The correct answer
            
            Use this JSON format:
            {
              "questions": [
                {
                  "question": "...",
                  "options": ["A", "B", "C", "D"],
                  "correctAnswer": "A"
                }
              ]
            }`
          }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse the response
    const quizData = JSON.parse(response.data.choices[0].message.content);
    return quizData.questions;
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    throw error;
  }
};