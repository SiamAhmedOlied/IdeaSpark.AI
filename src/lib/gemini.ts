
const GEMINI_API_KEY = "AIzaSyDlP8K7FSOo_Da-iheD1eRkI-a7F4cn7-0";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

interface GeneratedIdea {
  businessName: string;
  description: string;
  niche: string;
  hashtags: string[];
}

export async function generateIdea(niche: string, hashtags: string[]): Promise<GeneratedIdea> {
  const hashtagText = hashtags.length > 0 ? ` incorporating these hashtags: ${hashtags.join(', ')}` : '';
  
  const prompt = `Generate a unique SaaS business idea for the ${niche} niche${hashtagText}. 
  
  Please respond with a JSON object containing:
  - businessName: A unique, catchy name for the business
  - description: A detailed description (100-150 words) explaining the idea, target audience, and value proposition
  - niche: The niche category
  - hashtags: An array of relevant hashtags (include the provided ones if any, plus additional relevant ones)
  
  Make sure the idea is innovative, practical, and addresses real market needs in the ${niche} space.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse response from AI');
    }

    const parsedIdea = JSON.parse(jsonMatch[0]);
    
    return {
      businessName: parsedIdea.businessName,
      description: parsedIdea.description,
      niche: niche,
      hashtags: parsedIdea.hashtags || hashtags
    };
  } catch (error) {
    console.error('Error generating idea:', error);
    throw new Error('Failed to generate idea. Please try again.');
  }
}

export async function generateCodingPrompt(idea: GeneratedIdea): Promise<string> {
  const prompt = `Create a comprehensive coding prompt for building "${idea.businessName}" - ${idea.description}

  Please provide a detailed development guide including:
  
  1. **Project Overview**
     - Brief summary of the application
     - Target audience and use cases
  
  2. **Recommended Tech Stack**
     - Frontend: React, TypeScript, Tailwind CSS
     - Backend: Node.js, Express, or Supabase
     - Authentication: Clerk
     - Database: PostgreSQL or Supabase
     - Additional libraries and tools
  
  3. **Key Features to Implement**
     - List of core features (prioritized)
     - User authentication and management
     - Main functionality specific to this SaaS
  
  4. **Database Schema**
     - Tables and relationships needed
     - Key fields for each table
  
  5. **Basic Implementation Steps**
     - Step-by-step development approach
     - Key components to build
     - API endpoints needed
  
  6. **Code Snippets**
     - Example React components
     - API route examples
     - Database queries
  
  7. **Deployment Guide**
     - Recommended hosting platforms (Netlify, Vercel)
     - Environment variables setup
     - CI/CD considerations
  
  Make this practical and actionable for a developer to start building immediately.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating coding prompt:', error);
    throw new Error('Failed to generate coding prompt. Please try again.');
  }
}
