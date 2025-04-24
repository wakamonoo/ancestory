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
    this.preferredVoices = [
      { name: "Angelo", lang: "fil-PH" },
      { name: "Blessica", lang: "fil-PH" },
      { name: "Andrew", lang: "en-US" },
      { name: "Emma", lang: "en-US" }
    ];

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
    
    // Filter voices to only include English and Filipino
    this.voices = this.voices.filter(voice => 
      voice.lang.startsWith('en-') || voice.lang.startsWith('fil-')
    );
    
    // Sort voices - preferred voices first, then others
    this.voices.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Check if voice is in our preferred list
      const isAPreferred = this.preferredVoices.some(v => 
        aName.includes(v.name.toLowerCase()) && a.lang === v.lang
      );
      const isBPreferred = this.preferredVoices.some(v => 
        bName.includes(v.name.toLowerCase()) && b.lang === v.lang
      );
      
      if (isAPreferred && !isBPreferred) return -1;
      if (!isAPreferred && isBPreferred) return 1;
      
      // Then sort by language preference (Filipino first)
      if (a.lang.startsWith('fil-') && !b.lang.startsWith('fil-')) return -1;
      if (!a.lang.startsWith('fil-') && b.lang.startsWith('fil-')) return 1;
      
      return 0;
    });
  
    // Set default voice to first available preferred voice or first available
    if (this.voices.length > 0) {
      const preferred = this.voices.find(voice => 
        this.preferredVoices.some(v => 
          voice.name.toLowerCase().includes(v.name.toLowerCase()) && 
          voice.lang === v.lang
        )
      );
      this.currentVoice = preferred || this.voices[0];
    }
  }

  checkVoiceSupport() {
    // Check if any preferred voices are available
    const hasPreferred = this.voices.some(voice => 
      this.preferredVoices.some(v => 
        voice.name.toLowerCase().includes(v.name.toLowerCase()) && 
        voice.lang === v.lang
      );
    
    return {
      hasPreferred,
      supportedVoices: this.voices
    };
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
      if (this.onWordBoundary && typeof this.onWordBoundary === "function") {
        this.onWordBoundary(event);
      }
    };

    this.speechUtterance.onend = () => {
      this.isSpeaking = false;
      if (this.onSpeechEnd && typeof this.onSpeechEnd === "function") {
        this.onSpeechEnd();
      }
    };

    this.speechUtterance.onpause = () => {
      this.isSpeaking = false;
      if (this.onSpeechPause && typeof this.onSpeechPause === "function") {
        this.onSpeechPause();
      }
    };

    this.speechUtterance.onerror = (event) => {
      this.isSpeaking = false;
      if (this.onSpeechError && typeof this.onSpeechError === "function") {
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
    this.currentVoice = this.voices.find((voice) => voice.name === voiceName);
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
    return "speechSynthesis" in window;
  }
}

export { StorySpeechSynthesis };