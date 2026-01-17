/**
 * PDF and JPG Conversion Utilities
 */

import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

/**
 * Convert PDF pages to JPG images
 */
export async function convertPdfToJpg(_pdfFile: File): Promise<void> {
  // Note: pdf-lib doesn't render PDFs to images
  // This would require pdfjs-dist or a server-side solution
  // For browser-based implementation, pdf.js would be needed
  throw new Error('PDF to JPG conversion requires advanced PDF rendering capabilities. Please use the JPG to PDF feature to combine images into PDFs, or use dedicated PDF software for PDF to image conversion.');
}

/**
 * Convert JPG/PNG images to PDF
 */
export async function convertJpgToPdf(imageFiles: File[]): Promise<void> {
  try {
    if (!imageFiles || imageFiles.length === 0) {
      throw new Error('Please select at least one image file.');
    }

    const pdfDoc = await PDFDocument.create();

    for (const imageFile of imageFiles) {
      const arrayBuffer = await imageFile.arrayBuffer();
      let image;

      // Determine image type and embed
      if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
        image = await pdfDoc.embedJpg(arrayBuffer);
      } else if (imageFile.type === 'image/png') {
        image = await pdfDoc.embedPng(arrayBuffer);
      } else {
        throw new Error(`Unsupported image type: ${imageFile.type}`);
      }

      // Add page with image
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    // Generate and download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
    const fileName = imageFiles.length === 1
      ? imageFiles[0].name.replace(/\.(jpg|jpeg|png)$/i, '.pdf')
      : 'combined-images.pdf';
    saveAs(blob, fileName);
  } catch (error: any) {
    console.error('Error converting images to PDF:', error);
    throw new Error(error.message || 'Could not convert images to PDF. Please try again.');
  }
}

