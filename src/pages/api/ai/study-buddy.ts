import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

// This would typically use OpenAI or another AI service
// For this example, we'll simulate responses
const generateAnswer = (question: string, courseTitle: string, moduleTitle: string) => {
  // Simple keyword-based responses
  const keywords = {
    'what': `Based on the ${moduleTitle} module in ${courseTitle}, `,
    'how': `Here's how you can approach this in ${moduleTitle}: `,
    'why': `In ${moduleTitle}, we learn that `,
    'explain': `Let me explain this concept from ${moduleTitle}: `,
    'example': `Here's an example from ${moduleTitle}: `,
    'difference': `The key difference is that `,
    'help': `I'd be happy to help with ${moduleTitle}. `
  };
  
  // Find matching keyword
  const matchingKeyword = Object.keys(keywords).find(key => 
    question.toLowerCase().includes(key)
  );
  
  const prefix = matchingKeyword ? keywords[matchingKeyword] : `Regarding ${moduleTitle}, `;
  
  // Generate a generic but contextual response
  return `${prefix}This is a simulated AI response that would normally be generated by an AI model like GPT-3.5 or GPT-4. In a production environment, this would provide specific information about the course content, examples, explanations, or guidance based on your question.`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const { question, courseTitle, moduleTitle } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    
    // Generate answer (in a real app, this would call an AI service)
    const answer = generateAnswer(question, courseTitle, moduleTitle);
    
    res.status(200).json({ answer });
  } catch (error) {
    console.error('Error generating answer:', error);
    res.status(500).json({ message: 'Error generating answer' });
  }
} 