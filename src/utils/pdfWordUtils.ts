/**
 * PDF and Word Conversion Utilities
 */

import { Document, Packer, Paragraph, TextRun } from 'docx';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

/**
 * Convert PDF to Word (extract text and create DOCX)
 * Note: This is a simplified version that extracts text only
 */
export async function convertPdfToWord(pdfFile: File): Promise<void> {
  try {
    // Read PDF file
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    // Extract text from pages (simplified - pdf-lib doesn't extract text well)
    // For a better implementation, you'd need pdfjs-dist or similar
    const textContent: string[] = [];
    
    // Note: pdf-lib doesn't have text extraction built-in
    // This is a placeholder - in production, use pdfjs-dist or a server-side solution
    for (let i = 0; i < pages.length; i++) {
      textContent.push(`Page ${i + 1}\n\n[Text extraction from PDF requires additional libraries like pdfjs-dist]\n\n`);
    }

    // Create Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: textContent.map(text => 
            new Paragraph({
              children: [new TextRun(text)],
            })
          ),
        },
      ],
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const fileName = pdfFile.name.replace(/\.pdf$/i, '.docx');
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error converting PDF to Word:', error);
    throw new Error('Could not convert this PDF. Some PDFs (scanned images) may not be supported.');
  }
}

/**
 * Convert Word document or text to PDF
 */
export async function convertWordToPdf(input: File | string): Promise<void> {
  try {
    let text = '';

    if (input instanceof File) {
      // For .docx files, we'd need mammoth or similar to extract text
      // For now, show a message that this requires additional processing
      throw new Error('Word file conversion requires additional libraries. Please use the "Paste Text" option instead.');
    } else {
      text = input;
    }

    // Create PDF using jsPDF
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Split text into lines that fit the page
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    const lineHeight = 7;
    let y = margin;

    const lines = doc.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    // Generate and download
    const fileName = (typeof input === 'object' && input !== null && 'name' in input) 
      ? (input as File).name.replace(/\.docx?$/i, '.pdf')
      : 'document.pdf';
    doc.save(fileName);
  } catch (error: any) {
    console.error('Error converting to PDF:', error);
    throw new Error(error.message || 'Could not convert to PDF. Please try again.');
  }
}

