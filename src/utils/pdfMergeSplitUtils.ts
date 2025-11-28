/**
 * PDF Merge and Split Utilities
 */

import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

/**
 * Merge multiple PDF files into one
 */
export async function mergePdfs(pdfFiles: File[]): Promise<void> {
  try {
    if (!pdfFiles || pdfFiles.length === 0) {
      throw new Error('Please select at least one PDF file.');
    }

    const mergedPdf = await PDFDocument.create();

    for (const pdfFile of pdfFiles) {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }

    // Generate and download
    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
    const fileName = pdfFiles.length === 1
      ? pdfFiles[0].name
      : 'merged-document.pdf';
    saveAs(blob, fileName);
  } catch (error: any) {
    console.error('Error merging PDFs:', error);
    throw new Error(error.message || 'Could not merge PDFs. Please try again.');
  }
}

/**
 * Parse page range string (e.g., "1-3, 7, 10-12")
 */
function parsePageRange(rangeStr: string, maxPages: number): number[] {
  const pages: number[] = [];
  const parts = rangeStr.split(',').map(s => s.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(s => parseInt(s.trim(), 10));
      if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
        throw new Error(`Invalid page range: ${part}`);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i - 1); // Convert to 0-based index
      }
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page) || page < 1 || page > maxPages) {
        throw new Error(`Invalid page number: ${part}`);
      }
      pages.push(page - 1); // Convert to 0-based index
    }
  }

  return [...new Set(pages)].sort((a, b) => a - b);
}

/**
 * Split PDF by page range
 */
export async function splitPdf(pdfFile: File, pageRange: string): Promise<void> {
  try {
    if (!pageRange.trim()) {
      throw new Error('Please specify pages to extract.');
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();

    const pageIndices = parsePageRange(pageRange, totalPages);

    if (pageIndices.length === 0) {
      throw new Error('No valid pages specified.');
    }

    // Create new PDF with selected pages
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdf, pageIndices);
    pages.forEach(page => newPdf.addPage(page));

    // Generate and download
    const pdfBytes = await newPdf.save();
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
    const fileName = pdfFile.name.replace(/\.pdf$/i, `-pages-${pageRange.replace(/\s+/g, '')}.pdf`);
    saveAs(blob, fileName);
  } catch (error: any) {
    console.error('Error splitting PDF:', error);
    throw new Error(error.message || 'Could not split PDF. Please check your page range.');
  }
}

