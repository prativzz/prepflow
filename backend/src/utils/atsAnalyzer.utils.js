import { removeStopwords } from 'stopword';

/**
 * Extremely basic keyword extraction algorithm.
 * 1. Lowercase text
 * 2. Remove punctuation
 * 3. Tokenize by space
 * 4. Remove common English stopwords
 * 5. Return unique keywords
 */
export const extractKeywords = (text) => {
  if (!text) return [];
  
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const tokens = cleanText.split(/\s+/).filter(Boolean);
  const meaningfulTokens = removeStopwords(tokens);
  
  return [...new Set(meaningfulTokens)];
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
