class StorySpeechSynthesis {
  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.speechUtterance = null;
    this.voices = [];
    this.currentVoice = null;
    this.speechOptions = { rate: 1 };
    this.isSpeaking = false;
    this.titleLength = 0;
    this.originLength = 0;
    
    // Event handlers
    this.onWordBoundary = null;
    this.onSpeechEnd = null;
    this.onSpeechError = null;
    this.onSpeechPause = null;
    
    this.init();
  }

  init() {
    // Load available voices
    this.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    this.loadVoices();
  }

  loadVoices() {
    this.voices = this.speechSynthesis.getVoices();
    
    // Filter for specific voices only
    this.voices = this.voices.filter(voice => {
      const voiceName = voice.name.toLowerCase();
      return (
        voiceName.includes('angelo') || 
        voiceName.includes('blessica') ||
        voiceName.includes('andrew') ||
        voiceName.includes('emma')
      );
    });
    
    // Set default voice if available
    if (this.voices.length > 0) {
      this.currentVoice = this.voices[0];
    }
  }

  startSpeech(title, origin, contentElement) {
    const titleText = `${title}. `;
    const originText = `From ${origin}. `;
    const contentText = contentElement.textContent;
    
    // Calculate lengths for each section
    this.titleLength = titleText.length;
    this.originLength = originText.length;
    
    const fullText = titleText + originText + contentText;
    
    this.stopSpeech(); // Stop any current speech
    
    this.speechUtterance = new SpeechSynthesisUtterance(fullText);
    this.speechUtterance.voice = this.currentVoice;
    this.speechUtterance.rate = this.speechOptions.rate;
    
    // Set up event handlers
    this.speechUtterance.onboundary = (event) => {
      if (this.onWordBoundary && typeof this.onWordBoundary === 'function') {
        this.onWordBoundary(event);
      }
    };
    
    this.speechUtterance.onend = () => {
      this.isSpeaking = false;
      if (this.onSpeechEnd && typeof this.onSpeechEnd === 'function') {
        this.onSpeechEnd();
      }
    };
    
    this.speechUtterance.onpause = () => {
      this.isSpeaking = false;
      if (this.onSpeechPause && typeof this.onSpeechPause === 'function') {
        this.onSpeechPause();
      }
    };
    
    this.speechUtterance.onerror = (event) => {
      this.isSpeaking = false;
      if (this.onSpeechError && typeof this.onSpeechError === 'function') {
        this.onSpeechError(event);
      }
    };
    
    this.speechSynthesis.speak(this.speechUtterance);
    this.isSpeaking = true;
  }

  pauseSpeech() {
    if (this.isSpeaking) {
      this.speechSynthesis.pause();
      this.isSpeaking = false;
    }
  }

  resumeSpeech() {
    if (this.speechSynthesis.paused) {
      this.speechSynthesis.resume();
      this.isSpeaking = true;
    }
  }

  stopSpeech() {
    if (this.speechSynthesis.speaking || this.speechSynthesis.paused) {
      this.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }

  changeVoice(voiceName) {
    this.currentVoice = this.voices.find(voice => voice.name === voiceName);
  }

  changeRate(rate) {
    this.speechOptions.rate = parseFloat(rate);
  }

  getVoices() {
    return this.voices;
  }

  getCurrentVoice() {
    return this.currentVoice;
  }

  getCurrentRate() {
    return this.speechOptions.rate;
  }

  isSpeechSupported() {
    return 'speechSynthesis' in window;
  }
}

export { StorySpeechSynthesis };