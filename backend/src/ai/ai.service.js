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

// Helper to safely parse JSON from LLM that might wrap in markdown
const parseJSONStr = (str) => {
  try {
    let cleanStr = str.trim();
    if (cleanStr.startsWith('```json')) {
      cleanStr = cleanStr.substring(7);
    } else if (cleanStr.startsWith('```')) {
      cleanStr = cleanStr.substring(3);
    }
    if (cleanStr.endsWith('```')) {
      cleanStr = cleanStr.substring(0, cleanStr.length - 3);
    }
    return JSON.parse(cleanStr.trim());
  } catch (err) {
    console.error("JSON parsing failed for string:", str);
    throw err;
  }
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
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || response.candidates[0].content.parts[0].text;
    const questionsArray = parseJSONStr(text);
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
        model: 'gemini-flash-latest',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text || response.candidates[0].content.parts[0].text;
      const feedback = parseJSONStr(text);
      
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
      model: 'gemini-flash-latest',
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


/**
 * Evaluates the ATS compatibility between a resume and a job description.
 */
export const evaluateATS = async (resumeText, jobText) => {
  const ai = getGenAI();

  if (!ai) {
    console.warn("⚠️ GEMINI_API_KEY is not set. Falling back to Mock ATS Evaluator.");
    // Provide a slightly better mock than the old utility
    return {
      score: 45,
      missingKeywords: ['JavaScript', 'React', 'Node.js'],
      proTip: "Try to incorporate more specific technical skills mentioned in the job description."
    };
  }

  try {
    const prompt = `
      You are an expert Applicant Tracking System (ATS). 
      Your task is to compare the provided Resume against the provided Job Description.
      
      Job Description:
      ${jobText}
      
      Resume:
      ${resumeText}
      
      Instructions:
      1. Extract the true technical and professional skills, frameworks, and tools required from the Job Description. Ignore stop words, generic verbs (want, work, build), and overly broad terms.
      2. Check which of these extracted skills are missing from the Resume.
      3. Calculate a match score from 0 to 100 based on how well the candidate's skills align with the required skills.
      4. Write a brief, personalized "proTip" (1-2 sentences) advising the candidate on how to improve their resume for this specific role.
      
      Format your response strictly as a JSON object with exactly these keys:
      - "score" (number: 0 to 100)
      - "missingKeywords" (array of strings: actual professional skills/nouns missing)
      - "proTip" (string: personalized advice)
      
      Do NOT include markdown block formatting (like \`\`\`json) in the response, just the raw JSON object.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || response.candidates[0].content.parts[0].text;
    const evaluation = parseJSONStr(text);
    return evaluation;
  } catch (error) {
    console.error("Error evaluating ATS with Gemini:", error);
    return {
      score: 0,
      missingKeywords: [],
      proTip: "An error occurred while evaluating your ATS score. Please try again."
    };
  }
};


/**
 * Extracts pure technical skills from a document (Resume or JD).
 */
export const extractTechnicalSkills = async (text) => {
  const ai = getGenAI();

  if (!ai) {
    console.warn("⚠️ GEMINI_API_KEY is not set. Falling back to simple keyword extraction.");
    return null;
  }

  try {
    const prompt = `
      You are an expert technical recruiter. Extract ONLY the professional technical skills, programming languages, tools, frameworks, and methodologies from the following text.
      Do NOT include names, phone numbers, addresses, emails, dates, numbers, or generic soft skills (like "leadership", "communication").
      
      Text:
      ${text}
      
      Format your response strictly as a JSON array of strings. Each string should be a distinct technical skill.
      Do NOT include markdown block formatting (like \`\`\`json) in the response, just the raw JSON array.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || response.candidates[0].content.parts[0].text;
    const skills = parseJSONStr(responseText);
    return Array.isArray(skills) ? skills : [];
  } catch (error) {
    console.error("Error extracting technical skills with Gemini:", error);
    return null;
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
