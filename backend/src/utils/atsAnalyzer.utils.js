import { removeStopwords } from 'stopword';

const COMMON_SKILLS = new Set([
  'javascript', 'js', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust', 'typescript', 'ts',
  'html', 'css', 'react', 'reactjs', 'angular', 'vue', 'vuejs', 'svelte', 'next.js', 'nextjs', 'node.js', 'nodejs', 'express', 'django', 'flask',
  'spring', 'laravel', 'rails', 'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'mongo', 'redis', 'cassandra',
  'oracle', 'docker', 'kubernetes', 'k8s', 'aws', 'azure', 'gcp', 'git', 'github', 'gitlab', 'ci/cd', 'jenkins', 'linux',
  'bash', 'agile', 'scrum', 'machine learning', 'ml', 'ai', 'tensorflow', 'pytorch', 'pandas', 'numpy',
  'graphql', 'rest', 'api', 'microservices', 'serverless', 'firebase', 'tailwind', 'tailwindcss', 'sass', 'webpack',
  'jest', 'cypress', 'selenium', 'jira', 'figma', 'redux', 'flutter', 'react native', 'android', 'ios',
  'c', 'scala', 'dart', 'matlab', 'r', 'shell', 'objective-c', 'spring boot', 'aws', 'amazon web services', 'c++'
]);

export const extractKeywords = (text) => {
  if (!text) return [];
  
  const cleanText = text.toLowerCase().replace(/[^\w\s\.\+#]/g, ' '); // Allow dot, plus, hash for Node.js, C++, C#
  const tokens = cleanText.split(/\s+/).filter(Boolean);
  
  const extractedSkills = new Set();
  
  tokens.forEach(token => {
    if (COMMON_SKILLS.has(token)) {
      extractedSkills.add(token);
    }
  });

  // If we couldn't find any common skills, fallback to words that are > 3 chars and don't contain numbers
  if (extractedSkills.size === 0) {
    const meaningfulTokens = removeStopwords(tokens).filter(word => word.length > 3 && !/\d/.test(word));
    return [...new Set(meaningfulTokens)].slice(0, 15); // Return at most 15 to avoid polluting the UI
  }
  
  return [...extractedSkills];
};

/**
 * Compares resume keywords against JD keywords
 * Returns a score and missing keywords.
 */
export const analyzeATS = (resumeKeywords, jdKeywords) => {
  if (!jdKeywords.length) return { score: 0, missingKeywords: [] };

  const missingKeywords = jdKeywords.filter(kw => !resumeKeywords.includes(kw));
  
  const matchCount = jdKeywords.length - missingKeywords.length;
  const score = Math.round((matchCount / jdKeywords.length) * 100);

  return {
    score,
    missingKeywords,
  };
};
