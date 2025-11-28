/**
 * Grammar Checker Page Logic
 */

export function initGrammarChecker(): void {
  const form = document.getElementById('grammar-form') as HTMLFormElement;
  const textInput = document.getElementById('grammar-text') as HTMLTextAreaElement;
  const statusDiv = document.getElementById('grammar-status') as HTMLDivElement;
  const resultsDiv = document.getElementById('grammar-results') as HTMLDivElement;
  const correctedTextDiv = document.getElementById('corrected-text') as HTMLDivElement;

  if (!form || !textInput || !statusDiv) {
    console.warn('Grammar Checker elements not found');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = textInput.value.trim();
    if (!text) {
      alert('Please enter text to check.');
      return;
    }

    statusDiv.classList.remove('view-hidden');
    statusDiv.textContent = 'Checking grammar...';
    statusDiv.className = 'status-message';

    try {
      const response = await fetch('/api/ai/grammar-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check grammar');
      }

      const data = await response.json();

      if (correctedTextDiv) {
        correctedTextDiv.textContent = data.correctedText;
      }

      statusDiv.textContent = 'Grammar check complete!';
      statusDiv.className = 'status-message success';
      resultsDiv?.classList.remove('view-hidden');
    } catch (error: any) {
      console.error('Grammar checker error:', error);
      statusDiv.textContent = error.message || 'Failed to check grammar. Please try again.';
      statusDiv.className = 'status-message error';
    }
  });
}
