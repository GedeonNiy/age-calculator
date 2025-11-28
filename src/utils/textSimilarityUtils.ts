/**
 * Text Similarity / Plagiarism Checker Utilities
 * Local text comparison using Jaccard similarity
 */

/**
 * Tokenize text into words (lowercase, remove punctuation)
 */
function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0)
  );
}

/**
 * Calculate Jaccard similarity between two texts
 * Returns a value between 0 and 1 (0 = no similarity, 1 = identical)
 */
export function calculateSimilarity(text1: string, text2: string): number {
  if (!text1.trim() || !text2.trim()) {
    return 0;
  }

  const set1 = tokenize(text1);
  const set2 = tokenize(text2);

  if (set1.size === 0 && set2.size === 0) {
    return 1;
  }

  // Calculate intersection and union
  const intersection = new Set([...set1].filter(word => set2.has(word)));
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) {
    return 0;
  }

  return intersection.size / union.size;
}

/**
 * Get similarity interpretation
 */
export function getSimilarityInterpretation(similarity: number): string {
  if (similarity >= 0.8) {
    return 'Very High Similarity';
  } else if (similarity >= 0.6) {
    return 'High Similarity';
  } else if (similarity >= 0.4) {
    return 'Moderate Similarity';
  } else if (similarity >= 0.2) {
    return 'Low Similarity';
  } else {
    return 'Very Low Similarity';
  }
}
