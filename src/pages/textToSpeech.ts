/**
 * Text-to-Speech Converter Page Logic
 */

export function initTextToSpeech(): void {
  const form = document.getElementById('tts-form') as HTMLFormElement;
  const textInput = document.getElementById('tts-text') as HTMLTextAreaElement;
  const voiceSelect = document.getElementById('tts-voice') as HTMLSelectElement;
  const playButton = document.getElementById('tts-play-btn') as HTMLButtonElement;
  const stopButton = document.getElementById('tts-stop-btn') as HTMLButtonElement;

  if (!form || !textInput || !voiceSelect || !playButton) {
    console.warn('Text-to-Speech elements not found');
    return;
  }

  // Check if browser supports Speech Synthesis
  if (!('speechSynthesis' in window)) {
    alert('Your browser does not support text-to-speech. Please use a modern browser like Chrome, Firefox, or Edge.');
    return;
  }

  // let currentUtterance: SpeechSynthesisUtterance | null = null;

  // Load available voices
  const loadVoices = () => {
    const voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '<option value="default">Default voice (browser)</option>';
    
    // Categorize voices
    const maleVoices: SpeechSynthesisVoice[] = [];
    const femaleVoices: SpeechSynthesisVoice[] = [];

    voices.forEach(voice => {
      if (voice.name.toLowerCase().includes('male') || 
          voice.name.toLowerCase().includes('david') ||
          voice.name.toLowerCase().includes('james')) {
        maleVoices.push(voice);
      } else if (voice.name.toLowerCase().includes('female') ||
                 voice.name.toLowerCase().includes('zira') ||
                 voice.name.toLowerCase().includes('susan')) {
        femaleVoices.push(voice);
      }
    });

    if (maleVoices.length > 0) {
      const option = document.createElement('option');
      option.value = 'male';
      option.textContent = `Male-like voice (${maleVoices[0].name})`;
      voiceSelect.appendChild(option);
    }

    if (femaleVoices.length > 0) {
      const option = document.createElement('option');
      option.value = 'female';
      option.textContent = `Female-like voice (${femaleVoices[0].name})`;
      voiceSelect.appendChild(option);
    }
  };

  // Load voices when available
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  loadVoices();

  playButton.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) {
      alert('Please enter text to convert to speech.');
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // currentUtterance = utterance;

    // Select voice based on dropdown
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voiceSelect.value;

    if (selectedVoice === 'male') {
      const maleVoice = voices.find(v => 
        v.name.toLowerCase().includes('male') || 
        v.name.toLowerCase().includes('david')
      );
      if (maleVoice) utterance.voice = maleVoice;
    } else if (selectedVoice === 'female') {
      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('zira')
      );
      if (femaleVoice) utterance.voice = femaleVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    speechSynthesis.speak(utterance);
  });

  stopButton?.addEventListener('click', () => {
    speechSynthesis.cancel();
    // currentUtterance = null;
  });
}
