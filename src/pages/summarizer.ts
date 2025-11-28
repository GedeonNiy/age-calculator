/**
 * Text Summarizer Page Logic
 */

export function initSummarizer(): void {
  const form = document.getElementById('summarizer-form') as HTMLFormElement;
  const textInput = document.getElementById('summarizer-text') as HTMLTextAreaElement;
  const lengthSelect = document.getElementById('summary-length') as HTMLSelectElement;
  const statusDiv = document.getElementById('summarizer-status') as HTMLDivElement;
  const resultsDiv = document.getElementById('summarizer-results') as HTMLDivElement;
  const summaryDiv = document.getElementById('summary-text') as HTMLDivElement;

  if (!form || !textInput || !statusDiv) {
    console.warn('Summarizer elements not found');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = textInput.value.trim();
    if (!text) {
      alert('Please enter text to summarize.');
      return;
    }

    const length = lengthSelect?.value || 'medium';

    statusDiv.classList.remove('view-hidden');
    statusDiv.textContent = 'Summarizing text...';
    statusDiv.className = 'status-message';

    try {
      const response = await fetch('/api/ai/summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, length }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to summarize text');
      }

      const data = await response.json();

      if (summaryDiv) {
        summaryDiv.textContent = data.summary;
      }

      statusDiv.textContent = 'Summary generated successfully!';
      statusDiv.className = 'status-message success';
      resultsDiv?.classList.remove('view-hidden');
    } catch (error: any) {
      console.error('Summarizer error:', error);
      statusDiv.textContent = error.message || 'Failed to summarize text. Please try again.';
      statusDiv.className = 'status-message error';
    }
  });
}
