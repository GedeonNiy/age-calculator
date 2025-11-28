/**
 * PDF Merger & Splitter Page Logic
 */

import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

export function initPdfMergeSplit(): void {
  const form = document.getElementById('pdf-merge-split-form') as HTMLFormElement;
  const operationRadios = document.querySelectorAll('input[name="pdf-operation"]') as NodeListOf<HTMLInputElement>;
  const mergeGroup = document.getElementById('merge-group') as HTMLDivElement;
  const splitGroup = document.getElementById('split-group') as HTMLDivElement;
  const mergeFilesInput = document.getElementById('merge-files-input') as HTMLInputElement;
  const splitFileInput = document.getElementById('split-file-input') as HTMLInputElement;
  const splitPagesInput = document.getElementById('split-pages') as HTMLInputElement;
  const mergeFilesList = document.getElementById('merge-files-list') as HTMLDivElement;
  const statusDiv = document.getElementById('pdf-merge-split-status') as HTMLDivElement;
  const resultsDiv = document.getElementById('pdf-merge-split-results') as HTMLDivElement;
  const downloadDiv = document.getElementById('pdf-merge-split-download') as HTMLDivElement;

  if (!form || !operationRadios.length) {
    console.warn('PDF Merger & Splitter elements not found');
    return;
  }

  // Toggle operation mode
  operationRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'merge') {
        mergeGroup?.classList.remove('view-hidden');
        splitGroup?.classList.add('view-hidden');
      } else {
        mergeGroup?.classList.add('view-hidden');
        splitGroup?.classList.remove('view-hidden');
      }
    });
  });

  // Show selected files for merge
  mergeFilesInput?.addEventListener('change', () => {
    if (mergeFilesList && mergeFilesInput.files) {
      mergeFilesList.innerHTML = '';
      Array.from(mergeFilesInput.files).forEach((file, index) => {
        const div = document.createElement('div');
        div.textContent = `${index + 1}. ${file.name}`;
        div.style.marginBottom = '0.5rem';
        mergeFilesList.appendChild(div);
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedOperation = Array.from(operationRadios).find(r => r.checked)?.value;

    if (selectedOperation === 'merge') {
      // Merge PDFs
      const files = mergeFilesInput?.files;
      if (!files || files.length === 0) {
        alert('Please select at least one PDF file to merge.');
        return;
      }

      statusDiv?.classList.remove('view-hidden');
      statusDiv.textContent = 'Merging PDFs...';
      statusDiv.className = 'status-message';

      try {
        const mergedPdf = await PDFDocument.create();

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach(page => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
        saveAs(blob, 'merged.pdf');

        statusDiv.textContent = 'PDFs merged successfully!';
        statusDiv.className = 'status-message success';

        if (downloadDiv && resultsDiv) {
          downloadDiv.innerHTML = '<a href="#" download="merged.pdf">Download merged.pdf</a>';
          resultsDiv.classList.remove('view-hidden');
        }
      } catch (error: any) {
        console.error('PDF merge error:', error);
        statusDiv.textContent = 'Failed to merge PDFs. Please ensure all files are valid PDFs.';
        statusDiv.className = 'status-message error';
      }
    } else {
      // Split PDF
      const file = splitFileInput?.files?.[0];
      if (!file) {
        alert('Please select a PDF file to split.');
        return;
      }

      const pagesInput = splitPagesInput?.value.trim();
      if (!pagesInput) {
        alert('Please specify which pages to extract (e.g., 1-3, 7, 10-12).');
        return;
      }

      statusDiv?.classList.remove('view-hidden');
      statusDiv.textContent = 'Splitting PDF...';
      statusDiv.className = 'status-message';

      try {
        // Parse page ranges (e.g., "1-3, 7, 10-12")
        const pageNumbers = new Set<number>();
        const ranges = pagesInput.split(',').map(r => r.trim());

        for (const range of ranges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(n => parseInt(n.trim()));
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = start; i <= end; i++) {
                pageNumbers.add(i - 1); // Convert to 0-based index
              }
            }
          } else {
            const page = parseInt(range.trim());
            if (!isNaN(page)) {
              pageNumbers.add(page - 1); // Convert to 0-based index
            }
          }
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const totalPages = pdf.getPageCount();

        // Validate page numbers
        const validPages = Array.from(pageNumbers).filter(p => p >= 0 && p < totalPages);
        if (validPages.length === 0) {
          throw new Error('No valid pages selected. Please check your page numbers.');
        }

        const splitPdf = await PDFDocument.create();
        const pagesToCopy = await splitPdf.copyPages(pdf, validPages);
        pagesToCopy.forEach(page => splitPdf.addPage(page));

        const pdfBytes = await splitPdf.save();
        const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
        saveAs(blob, 'extracted-pages.pdf');

        statusDiv.textContent = `PDF split successfully! Extracted ${validPages.length} page(s).`;
        statusDiv.className = 'status-message success';

        if (downloadDiv && resultsDiv) {
          downloadDiv.innerHTML = '<a href="#" download="extracted-pages.pdf">Download extracted-pages.pdf</a>';
          resultsDiv.classList.remove('view-hidden');
        }
      } catch (error: any) {
        console.error('PDF split error:', error);
        statusDiv.textContent = error.message || 'Failed to split PDF. Please check your page numbers and try again.';
        statusDiv.className = 'status-message error';
      }
    }
  });
}

