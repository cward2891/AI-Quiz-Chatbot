import React, { useState } from 'react';
import { generateQuiz } from '../services/openaiService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AIChatbot = () => {
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const generatedQuiz = await generateQuiz(topic);
      setQuiz(generatedQuiz);
      setCurrentQuestion(0);
      setScore(0);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (selectedOption) => {
    setSelectedAnswer(selectedOption);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct
    if (selectedAnswer === quiz[currentQuestion].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    // Move to next question
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz completed
      setCurrentQuestion(-1);
    }
  };

  const renderQuizContent = () => {
    if (isLoading) return <div>Generating quiz...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    
    if (!quiz) {
      return (
        <div className="space-y-4">
          <Input 
            placeholder="Enter a topic for your quiz"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button 
            onClick={handleGenerateQuiz}
            disabled={!topic}
          >
            Generate Quiz
          </Button>
        </div>
      );
    }

    if (currentQuestion === -1) {
      return (
        <div className="text-center">
          <h2 className="text-2xl">Quiz Completed!</h2>
          <p className="text-xl">
            Your Score: {score} out of {quiz.length}
          </p>
          <Button onClick={() => setQuiz(null)} className="mt-4">
            Start New Quiz
          </Button>
        </div>
      );
    }

    const current = quiz[currentQuestion];
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{current.question}</h2>
        <div className="space-y-2">
          {current.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              variant={selectedAnswer === option ? "default" : "outline"}
              className="w-full"
            >
              {option}
            </Button>
          ))}
        </div>
        <Button 
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className="mt-4"
        >
          {currentQuestion < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </Button>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>AI Quiz Generator</CardTitle>
      </CardHeader>
      <CardContent>
        {renderQuizContent()}
      </CardContent>
    </Card>
  );
};

export default AIChatbot;