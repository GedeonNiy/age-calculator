/**
 * Plagiarism / Text Similarity Checker Page Logic
 */

import { calculateSimilarity, getSimilarityInterpretation } from '../utils/textSimilarityUtils';

export function initPlagiarismChecker(): void {
  const form = document.getElementById('plagiarism-form') as HTMLFormElement;
  const originalText = document.getElementById('original-text') as HTMLTextAreaElement;
  const comparisonText = document.getElementById('comparison-text') as HTMLTextAreaElement;
  const resultsDiv = document.getElementById('plagiarism-results') as HTMLDivElement;
  const similarityScore = document.getElementById('similarity-score') as HTMLParagraphElement;
  const similarityInterpretation = document.getElementById('similarity-interpretation') as HTMLParagraphElement;

  if (!form || !originalText || !comparisonText || !resultsDiv) {
    console.warn('Plagiarism Checker elements not found');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const text1 = originalText.value.trim();
    const text2 = comparisonText.value.trim();

    if (!text1 || !text2) {
      alert('Please enter both texts to compare.');
      return;
    }

    const similarity = calculateSimilarity(text1, text2);
    const percentage = (similarity * 100).toFixed(1);
    const interpretation = getSimilarityInterpretation(similarity);

    similarityScore.textContent = `${percentage}%`;
    similarityInterpretation.textContent = interpretation;

    resultsDiv.classList.remove('view-hidden');
  });
}
