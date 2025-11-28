/**
 * Essay Improver Page Logic
 */

export function initEssayImprover(): void {
  const form = document.getElementById('essay-improver-form') as HTMLFormElement;
  const textInput = document.getElementById('essay-text') as HTMLTextAreaElement;
  const statusDiv = document.getElementById('essay-improver-status') as HTMLDivElement;
  const resultsDiv = document.getElementById('essay-improver-results') as HTMLDivElement;
  const improvedTextDiv = document.getElementById('improved-text') as HTMLDivElement;
  const copyButton = document.getElementById('copy-improved-btn') as HTMLButtonElement;

  if (!form || !textInput || !statusDiv) {
    console.warn('Essay Improver elements not found');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = textInput.value.trim();
    if (!text) {
      alert('Please enter text to improve.');
      return;
    }

    const options = Array.from(
      document.querySelectorAll<HTMLInputElement>('input[name="improve-options"]:checked')
    ).map(cb => cb.value);

    statusDiv.classList.remove('view-hidden');
    statusDiv.textContent = 'Improving text...';
    statusDiv.className = 'status-message';

    try {
      const response = await fetch('/api/ai/essay-improver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, options }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to improve text');
      }

      const data = await response.json();

      if (improvedTextDiv) {
        improvedTextDiv.textContent = data.improvedText;
      }

      statusDiv.textContent = 'Text improved successfully!';
      statusDiv.className = 'status-message success';
      resultsDiv?.classList.remove('view-hidden');
    } catch (error: any) {
      console.error('Essay improver error:', error);
      statusDiv.textContent = error.message || 'Failed to improve text. Please try again.';
      statusDiv.className = 'status-message error';
    }
  });

  copyButton?.addEventListener('click', () => {
    if (improvedTextDiv?.textContent) {
      navigator.clipboard.writeText(improvedTextDiv.textContent).then(() => {
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 2000);
      });
    }
  });
}
