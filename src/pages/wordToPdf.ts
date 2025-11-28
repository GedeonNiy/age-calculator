/**
 * Word to PDF Converter Page Logic
 */

import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

export function initWordToPdf(): void {
  const form = document.getElementById('word-to-pdf-form') as HTMLFormElement;
  const inputMethodRadios = document.querySelectorAll('input[name="input-method"]') as NodeListOf<HTMLInputElement>;
  const fileInput = document.getElementById('word-file-input') as HTMLInputElement;
  const textInput = document.getElementById('word-text-input') as HTMLTextAreaElement;
  const fileGroup = document.getElementById('word-file-group') as HTMLDivElement;
  const textGroup = document.getElementById('word-text-group') as HTMLDivElement;
  const statusDiv = document.getElementById('word-to-pdf-status') as HTMLDivElement;
  const resultsDiv = document.getElementById('word-to-pdf-result') as HTMLDivElement;
  const downloadDiv = document.getElementById('word-to-pdf-download') as HTMLParagraphElement;

  if (!form || !inputMethodRadios.length) {
    console.warn('Word to PDF Converter elements not found');
    return;
  }

  // Toggle input method
  inputMethodRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'file') {
        fileGroup?.classList.remove('view-hidden');
        textGroup?.classList.add('view-hidden');
      } else {
        fileGroup?.classList.add('view-hidden');
        textGroup?.classList.remove('view-hidden');
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedMethod = Array.from(inputMethodRadios).find(r => r.checked)?.value;
    let text = '';

    if (selectedMethod === 'file') {
      const file = fileInput?.files?.[0];
      if (!file) {
        alert('Please select a Word file or switch to text input.');
        return;
      }

      // For MVP, we'll show a message that .docx parsing requires a library
      // In a full implementation, you'd use mammoth.js or similar
      statusDiv?.classList.remove('view-hidden');
      statusDiv.textContent = 'Word file parsing is not fully implemented in this MVP. Please use the "Paste Text" option instead.';
      statusDiv.className = 'status-message error';
      return;
    } else {
      text = textInput?.value.trim() || '';
      if (!text) {
        alert('Please enter or paste text.');
        return;
      }
    }

    try {
      statusDiv?.classList.remove('view-hidden');
      statusDiv.textContent = 'Converting to PDF...';
      statusDiv.className = 'status-message';

      // Create PDF from text
      const pdf = new jsPDF();
      const lines = pdf.splitTextToSize(text, 180); // 180mm width
      pdf.text(lines, 10, 10);

      const blob = pdf.output('blob');
      const fileName = 'document.pdf';
      saveAs(blob, fileName);

      statusDiv.textContent = 'Conversion complete!';
      statusDiv.className = 'status-message success';

      if (downloadDiv && resultsDiv) {
        downloadDiv.innerHTML = `<a href="#" download="${fileName}">Download ${fileName}</a>`;
        resultsDiv.classList.remove('view-hidden');
      }
    } catch (error: any) {
      console.error('Word to PDF conversion error:', error);
      statusDiv.textContent = 'Failed to create PDF. Please try again.';
      statusDiv.className = 'status-message error';
    }
  });
}
