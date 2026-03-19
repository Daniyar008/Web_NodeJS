import { Request, Response } from 'express';

// Mock AI Service until actual OpenAI integration is configured by user
export const generateTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, difficulty, questionCount } = req.body;
    
    // Placeholder AI simulation
    const questions = Array.from({ length: questionCount || 5 }).map((_, i) => ({
      text: `Generated question ${i + 1} about ${topic}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      explanation: `AI explanation for why Option A is correct.`
    }));

    res.json({
      title: `AI Generated Test: ${topic}`,
      difficulty,
      questions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating test', error });
  }
};

export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    // Return mock course or university recommendations based on student's profile
    res.json({
      recommendedCourses: ['Advanced Mathematics', 'Introduction to Physics'],
      recommendedUniversities: ['MIT', 'Stanford', 'Oxford'],
      studyTips: 'Try the Pomodoro technique for better focus!'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting recommendations', error });
  }
};

export const chatWithAssistant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    
    // Echo back with an AI prefix
    res.json({
      reply: `AI Assistant: I received your message "${message}". How can I help you further with your studies?`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error communicating with AI', error });
  }
};
