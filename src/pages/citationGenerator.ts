/**
 * Citation Generator Page Logic
 */

import { generateCitation, type CitationData, type CitationStyle, type SourceType } from '../utils/citationUtils';

export function initCitationGenerator(): void {
  const form = document.getElementById('citation-form') as HTMLFormElement;
  const styleSelect = document.getElementById('citation-style') as HTMLSelectElement;
  const sourceTypeSelect = document.getElementById('source-type') as HTMLSelectElement;
  const fieldsContainer = document.getElementById('citation-fields') as HTMLDivElement;
  const resultsDiv = document.getElementById('citation-results') as HTMLDivElement;
  const citationOutput = document.getElementById('citation-output') as HTMLDivElement;
  const copyButton = document.getElementById('copy-citation-btn') as HTMLButtonElement;

  if (!form || !styleSelect || !sourceTypeSelect || !fieldsContainer) {
    console.warn('Citation Generator elements not found');
    return;
  }

  // Render fields based on source type
  const renderFields = (type: SourceType) => {
    fieldsContainer.innerHTML = '';

    if (type === 'book') {
      fieldsContainer.innerHTML = `
        <div class="form-group">
          <label for="citation-author">Author(s):</label>
          <input type="text" id="citation-author" placeholder="Last, First">
        </div>
        <div class="form-group">
          <label for="citation-year">Year:</label>
          <input type="text" id="citation-year" placeholder="2024">
        </div>
        <div class="form-group">
          <label for="citation-title">Title:</label>
          <input type="text" id="citation-title" placeholder="Book Title">
        </div>
        <div class="form-group">
          <label for="citation-publisher">Publisher:</label>
          <input type="text" id="citation-publisher" placeholder="Publisher Name">
        </div>
      `;
    } else if (type === 'article') {
      fieldsContainer.innerHTML = `
        <div class="form-group">
          <label for="citation-author">Author(s):</label>
          <input type="text" id="citation-author" placeholder="Last, First">
        </div>
        <div class="form-group">
          <label for="citation-year">Year:</label>
          <input type="text" id="citation-year" placeholder="2024">
        </div>
        <div class="form-group">
          <label for="citation-title">Article Title:</label>
          <input type="text" id="citation-title" placeholder="Article Title">
        </div>
        <div class="form-group">
          <label for="citation-journal">Journal Name:</label>
          <input type="text" id="citation-journal" placeholder="Journal Name">
        </div>
        <div class="form-group">
          <label for="citation-volume">Volume:</label>
          <input type="text" id="citation-volume" placeholder="Volume Number">
        </div>
        <div class="form-group">
          <label for="citation-issue">Issue:</label>
          <input type="text" id="citation-issue" placeholder="Issue Number">
        </div>
        <div class="form-group">
          <label for="citation-pages">Pages:</label>
          <input type="text" id="citation-pages" placeholder="1-10">
        </div>
      `;
    } else if (type === 'website') {
      fieldsContainer.innerHTML = `
        <div class="form-group">
          <label for="citation-author">Author:</label>
          <input type="text" id="citation-author" placeholder="Author Name">
        </div>
        <div class="form-group">
          <label for="citation-title">Page Title:</label>
          <input type="text" id="citation-title" placeholder="Page Title">
        </div>
        <div class="form-group">
          <label for="citation-website">Website Name:</label>
          <input type="text" id="citation-website" placeholder="Website Name">
        </div>
        <div class="form-group">
          <label for="citation-url">URL:</label>
          <input type="url" id="citation-url" placeholder="https://example.com">
        </div>
        <div class="form-group">
          <label for="citation-date-accessed">Date Accessed (optional):</label>
          <input type="date" id="citation-date-accessed">
        </div>
      `;
    } else if (type === 'youtube') {
      fieldsContainer.innerHTML = `
        <div class="form-group">
          <label for="citation-channel">Channel Name:</label>
          <input type="text" id="citation-channel" placeholder="Channel Name">
        </div>
        <div class="form-group">
          <label for="citation-video-title">Video Title:</label>
          <input type="text" id="citation-video-title" placeholder="Video Title">
        </div>
        <div class="form-group">
          <label for="citation-upload-date">Upload Date:</label>
          <input type="date" id="citation-upload-date">
        </div>
        <div class="form-group">
          <label for="citation-url">Video URL:</label>
          <input type="url" id="citation-url" placeholder="https://youtube.com/watch?v=...">
        </div>
      `;
    }
  };

  sourceTypeSelect.addEventListener('change', () => {
    renderFields(sourceTypeSelect.value as SourceType);
  });

  // Initial render
  renderFields(sourceTypeSelect.value as SourceType);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const style = (styleSelect.value.toUpperCase() as CitationStyle);
    const type = (sourceTypeSelect.value as SourceType);

    const data: CitationData = {
      style,
      type,
    };

    // Get field values based on type
    if (type === 'book') {
      data.author = (document.getElementById('citation-author') as HTMLInputElement)?.value;
      data.year = (document.getElementById('citation-year') as HTMLInputElement)?.value;
      data.title = (document.getElementById('citation-title') as HTMLInputElement)?.value;
      data.publisher = (document.getElementById('citation-publisher') as HTMLInputElement)?.value;
    } else if (type === 'article') {
      data.author = (document.getElementById('citation-author') as HTMLInputElement)?.value;
      data.year = (document.getElementById('citation-year') as HTMLInputElement)?.value;
      data.title = (document.getElementById('citation-title') as HTMLInputElement)?.value;
      data.journal = (document.getElementById('citation-journal') as HTMLInputElement)?.value;
      data.volume = (document.getElementById('citation-volume') as HTMLInputElement)?.value;
      data.issue = (document.getElementById('citation-issue') as HTMLInputElement)?.value;
      data.pages = (document.getElementById('citation-pages') as HTMLInputElement)?.value;
    } else if (type === 'website') {
      data.author = (document.getElementById('citation-author') as HTMLInputElement)?.value;
      data.title = (document.getElementById('citation-title') as HTMLInputElement)?.value;
      data.websiteName = (document.getElementById('citation-website') as HTMLInputElement)?.value;
      data.url = (document.getElementById('citation-url') as HTMLInputElement)?.value;
      const dateAccessed = (document.getElementById('citation-date-accessed') as HTMLInputElement)?.value;
      if (dateAccessed) data.dateAccessed = dateAccessed;
    } else if (type === 'youtube') {
      data.channelName = (document.getElementById('citation-channel') as HTMLInputElement)?.value;
      data.videoTitle = (document.getElementById('citation-video-title') as HTMLInputElement)?.value;
      data.uploadDate = (document.getElementById('citation-upload-date') as HTMLInputElement)?.value;
      data.url = (document.getElementById('citation-url') as HTMLInputElement)?.value;
    }

    const citation = generateCitation(data);

    if (citationOutput) {
      citationOutput.textContent = citation;
    }

    resultsDiv?.classList.remove('view-hidden');
  });

  copyButton?.addEventListener('click', () => {
    if (citationOutput?.textContent) {
      navigator.clipboard.writeText(citationOutput.textContent).then(() => {
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 2000);
      });
    }
  });
}
