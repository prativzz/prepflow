import { GoogleGenAI } from '@google/genai';

// Determine if AI should be used or fallback to mock
const useRealAI = () => {
  return process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE';
};

const getGenAI = () => {
  if (useRealAI()) {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return null;
};

/**
 * Generates questions using Google Gemini API.
 */
export const generateQuestions = async (resume, job, difficultyLevel, numQuestions = 5) => {
  const ai = getGenAI();

  if (!ai) {
    console.warn("⚠️ GEMINI_API_KEY is not set or is using placeholder. Falling back to Mock AI.");
    return generateMockQuestions(resume, job, difficultyLevel, numQuestions);
  }

  try {
    const prompt = `
      You are an expert technical interviewer. Generate exactly ${numQuestions} interview questions based on the candidate's resume keywords and the job description.
      Difficulty level: ${difficultyLevel}.
      
      Resume Keywords: ${resume.extractedKeywords.join(', ')}
      Job Keywords: ${job.extractedKeywords.join(', ')}
      
      Requirements:
      1. One 'resume-based' question asking them to introduce themselves.
      2. One 'behavioral' question.
      3. One 'technical' question focused on the skills they share with the job.
      4. One 'technical-coding' question (give a brief coding problem).
      5. One 'situational' question.
      
      Format your response strictly as a JSON array of objects. Each object must have:
      - "type" (string: 'resume-based', 'behavioral', 'technical', 'technical-coding', 'situational')
      - "content" (string: the actual question text)
      - "order" (number: 1 to ${numQuestions})
      
      Do NOT include markdown block formatting (like \`\`\`json) in the response, just the raw JSON array.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || response.candidates[0].content.parts[0].text;
    const questionsArray = JSON.parse(text);
    return questionsArray;
  } catch (error) {
    console.error("Error generating questions with Gemini:", error);
    console.warn("Falling back to Mock AI due to error.");
    return generateMockQuestions(resume, job, difficultyLevel, numQuestions);
  }
};

/**
 * Analyzes the completed interview session and generates feedback.
 */
export const analyzeSession = async (session, questions) => {
  const ai = getGenAI();

  if (!ai) {
    console.warn("⚠️ GEMINI_API_KEY is not set or is using placeholder. Falling back to Mock AI.");
    return analyzeMockSession(session, questions);
  }

  try {
    let totalScore = 0;

    for (let q of questions) {
      // Analyze individual answer
      const answerText = q.userAnswer || "The candidate did not provide an answer.";
      
      const prompt = `
        You are an expert technical interviewer evaluating a candidate's answer.
        
        Question Type: ${q.type}
        Question: ${q.content}
        Candidate's Answer (Transcript/Code): ${answerText}
        
        Evaluate the answer. Provide a score out of 100, a list of strengths, and a list of improvements.
        Format your response strictly as a JSON object with:
        - "score" (number from 0 to 100)
        - "strengths" (array of strings)
        - "improvements" (array of strings)
        
        Do NOT include markdown block formatting, just the raw JSON object.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text || response.candidates[0].content.parts[0].text;
      const feedback = JSON.parse(text);
      
      q.feedback = feedback;
      totalScore += feedback.score;
      await q.save();
    }

    session.overallScore = Math.round(totalScore / questions.length);
    
    // Generate overall feedback summary
    const summaryPrompt = `
      You are an expert technical interviewer. The candidate just finished a ${questions.length}-question interview and scored an average of ${session.overallScore} out of 100.
      Provide a brief (2-3 sentences), encouraging, and constructive overall summary of their performance.
    `;
    const summaryResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: summaryPrompt
    });

    session.overallFeedback = summaryResponse.text || summaryResponse.candidates[0].content.parts[0].text;
    await session.save();

  } catch (error) {
    console.error("Error analyzing session with Gemini:", error);
    console.warn("Falling back to Mock AI due to error.");
    return analyzeMockSession(session, questions);
  }
};


// -------------------------------------------------------------
// MOCK FALLBACKS (If API key is missing)
// -------------------------------------------------------------

const generateMockQuestions = (resume, job, difficultyLevel, numQuestions = 5) => {
  const allKeywords = [...new Set([...resume.extractedKeywords, ...job.extractedKeywords])];
  
  const behavioralPool = [
    "Tell me about a time you had to overcome a significant technical challenge.",
    "Describe a situation where you disagreed with a team member. How did you handle it?",
    "How do you prioritize tasks when you have multiple tight deadlines?",
    "Tell me about your greatest professional achievement so far.",
  ];

  const questions = [];
  
  questions.push({
    type: 'resume-based',
    content: "Please introduce yourself and briefly walk me through your background as it relates to this role.",
    order: 1
  });

  questions.push({
    type: 'behavioral',
    content: behavioralPool[Math.floor(Math.random() * behavioralPool.length)],
    order: 2
  });

  const techKeyword1 = allKeywords.length > 0 ? allKeywords[0] : 'software engineering';
  questions.push({
    type: 'technical',
    content: `I see you have experience with ${techKeyword1}. Can you explain how you've used it in a past project and what challenges you faced?`,
    order: 3
  });

  questions.push({
    type: 'technical-coding',
    content: `Please write a function in JavaScript to solve this problem: Given an array of integers, return the indices of the two numbers that add up to a specific target. Explain your time and space complexity.`,
    order: 4
  });

  questions.push({
    type: 'situational',
    content: "If you were asked to implement a feature but realized the requirements were highly ambiguous, what steps would you take?",
    order: 5
  });

  return questions.slice(0, numQuestions);
};

const analyzeMockSession = async (session, questions) => {
  let totalScore = 0;
  
  for (let q of questions) {
    const score = Math.floor(Math.random() * (95 - 60 + 1) + 60);
    totalScore += score;
    
    q.feedback = {
      score,
      strengths: ["Clear communication", "Addressed the core problem"],
      improvements: ["Could provide more specific metrics", "Consider edge cases more deeply"]
    };
    
    if (q.type === 'technical-coding') {
      q.feedback.strengths.push("Good syntax usage");
    }
    
    await q.save();
  }
  
  session.overallScore = Math.round(totalScore / questions.length);
  session.overallFeedback = "You demonstrated strong fundamental knowledge, but there is room to improve on providing concrete examples using the STAR method.";
  await session.save();
};
