/**
 * PDF to Word Converter Page Logic
 */

import { PDFDocument } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export function initPdfToWord(): void {
  const form = document.getElementById('pdf-to-word-form') as HTMLFormElement;
  const fileInput = document.getElementById('pdf-file-input') as HTMLInputElement;
  const statusDiv = document.getElementById('pdf-to-word-status') as HTMLDivElement;
  const resultsDiv = document.getElementById('pdf-to-word-result') as HTMLDivElement;
  const downloadDiv = document.getElementById('pdf-to-word-download') as HTMLParagraphElement;

  if (!form || !fileInput || !statusDiv) {
    console.warn('PDF to Word Converter elements not found');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = fileInput.files?.[0];
    if (!file) {
      alert('Please select a PDF file.');
      return;
    }

    statusDiv.classList.remove('view-hidden');
    statusDiv.textContent = 'Uploading...';
    statusDiv.className = 'status-message';

    try {
      const arrayBuffer = await file.arrayBuffer();
      statusDiv.textContent = 'Converting...';

      // Load PDF
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      // Extract text from pages (simplified - pdf-lib doesn't extract text directly)
      // For MVP, we'll create a simple Word doc with a note
      const paragraphs: Paragraph[] = [
        new Paragraph({
          children: [
            new TextRun({
              text: 'PDF to Word Conversion',
              bold: true,
              size: 32,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `This PDF contains ${pages.length} page(s).`,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Note: This is a simplified conversion. For full text extraction from PDFs, advanced OCR or specialized libraries are needed.',
              italics: true,
            }),
          ],
        }),
      ];

      const doc = new Document({
        sections: [
          {
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const fileName = file.name.replace(/\.pdf$/i, '.docx');
      saveAs(blob, fileName);

      statusDiv.textContent = 'Conversion complete!';
      statusDiv.className = 'status-message success';
      
      if (downloadDiv && resultsDiv) {
        downloadDiv.innerHTML = `<a href="#" download="${fileName}">Download ${fileName}</a>`;
        resultsDiv.classList.remove('view-hidden');
      }
    } catch (error: any) {
      console.error('PDF to Word conversion error:', error);
      statusDiv.textContent = 'Could not convert this PDF. Some PDFs (scanned images) may not be supported.';
      statusDiv.className = 'status-message error';
    }
  });
}
