/**
 * PDF ↔ JPG Converter Page Logic
 */

import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

export function initPdfJpgConverter(): void {
  const form = document.getElementById('pdf-jpg-form') as HTMLFormElement;
  const modeRadios = document.querySelectorAll('input[name="conversion-mode"]') as NodeListOf<HTMLInputElement>;
  const pdfToJpgGroup = document.getElementById('pdf-to-jpg-group') as HTMLDivElement;
  const jpgToPdfGroup = document.getElementById('jpg-to-pdf-group') as HTMLDivElement;
  const pdfFileInput = document.getElementById('pdf-jpg-file-input') as HTMLInputElement;
  const jpgFileInput = document.getElementById('jpg-pdf-file-input') as HTMLInputElement;
  const statusDiv = document.getElementById('pdf-jpg-status') as HTMLDivElement;
  const resultsDiv = document.getElementById('pdf-jpg-results') as HTMLDivElement;
  const downloadsDiv = document.getElementById('pdf-jpg-downloads') as HTMLDivElement;

  if (!form || !modeRadios.length) {
    console.warn('PDF ↔ JPG Converter elements not found');
    return;
  }

  // Toggle conversion mode
  modeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'pdf-to-jpg') {
        pdfToJpgGroup?.classList.remove('view-hidden');
        jpgToPdfGroup?.classList.add('view-hidden');
      } else {
        pdfToJpgGroup?.classList.add('view-hidden');
        jpgToPdfGroup?.classList.remove('view-hidden');
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedMode = Array.from(modeRadios).find(r => r.checked)?.value;

    if (selectedMode === 'pdf-to-jpg') {
      // PDF to JPG conversion
      const file = pdfFileInput?.files?.[0];
      if (!file) {
        alert('Please select a PDF file.');
        return;
      }

      statusDiv?.classList.remove('view-hidden');
      statusDiv.textContent = 'Converting PDF to JPG...';
      statusDiv.className = 'status-message';

      try {
        // Note: pdf-lib doesn't render PDFs to images
        // For a full implementation, you'd need pdf.js or a server-side solution
        statusDiv.textContent = 'PDF to JPG conversion requires advanced rendering. This feature is in development.';
        statusDiv.className = 'status-message error';
      } catch (error: any) {
        console.error('PDF to JPG error:', error);
        statusDiv.textContent = 'Failed to convert PDF. Please try again.';
        statusDiv.className = 'status-message error';
      }
    } else {
      // JPG to PDF conversion
      const files = jpgFileInput?.files;
      if (!files || files.length === 0) {
        alert('Please select one or more image files.');
        return;
      }

      statusDiv?.classList.remove('view-hidden');
      statusDiv.textContent = 'Converting images to PDF...';
      statusDiv.className = 'status-message';

      try {
        const pdfDoc = await PDFDocument.create();

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const arrayBuffer = await file.arrayBuffer();
          
          // Embed image (simplified - assumes JPG/PNG)
          let image;
          if (file.type === 'image/png') {
            image = await pdfDoc.embedPng(arrayBuffer);
          } else {
            image = await pdfDoc.embedJpg(arrayBuffer);
          }

          const page = pdfDoc.addPage([image.width, image.height]);
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
          });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
        saveAs(blob, 'images.pdf');

        statusDiv.textContent = 'Conversion complete!';
        statusDiv.className = 'status-message success';

        if (downloadsDiv && resultsDiv) {
          downloadsDiv.innerHTML = '<a href="#" download="images.pdf">Download images.pdf</a>';
          resultsDiv.classList.remove('view-hidden');
        }
      } catch (error: any) {
        console.error('JPG to PDF error:', error);
        statusDiv.textContent = 'Failed to convert images. Please ensure files are valid JPG or PNG images.';
        statusDiv.className = 'status-message error';
      }
    }
  });
}

