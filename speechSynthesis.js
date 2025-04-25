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
    this.voicesReady = false;

    // Event handlers
    this.onWordBoundary = null;
    this.onSpeechEnd = null;
    this.onSpeechError = null;
    this.onSpeechPause = null;
    this.onVoicesReady = null;

    this.init();
  }

  init() {
    if (typeof speechSynthesis === "undefined") {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    // Handle voices load (desktop + mobile)
    this.speechSynthesis.onvoiceschanged = () => {
      this.loadVoices();
    };

    // Try loading voices right away (some browsers may load them immediately)
    this.loadVoices();
  }

  loadVoices() {
    const allVoices = this.speechSynthesis.getVoices();
    if (!allVoices.length) {
      console.warn("No voices available yet. They may load after user interaction.");
      return;
    }

    this.voices = allVoices.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const preferred = ["angelo", "blessica", "andrew", "emma"];
      const isAPreferred = preferred.some(p => aName.includes(p));
      const isBPreferred = preferred.some(p => bName.includes(p));

      if (isAPreferred && !isBPreferred) return -1;
      if (!isAPreferred && isBPreferred) return 1;
      return 0;
    });

    this.currentVoice = this.voices[0];
    this.voicesReady = true;

    if (typeof this.onVoicesReady === "function") {
      this.onVoicesReady(this.voices);
    }

    console.log("Voices loaded:", this.voices.map(v => v.name));
  }

  startSpeech(title, origin, contentElement) {
    if (!this.voicesReady) {
      console.warn("Voices not ready yet.");
      return;
    }

    const titleText = `${title}. `;
    const originText = `From ${origin}. `;
    const contentText = contentElement.textContent;
    const fullText = titleText + originText + contentText;

    this.stopSpeech();

    this.speechUtterance = new SpeechSynthesisUtterance(fullText);
    this.speechUtterance.voice = this.currentVoice;
    this.speechUtterance.rate = this.speechOptions.rate;

    this.speechUtterance.onboundary = (event) => {
      if (typeof this.onWordBoundary === "function") {
        this.onWordBoundary(event);
      }
    };

    this.speechUtterance.onend = () => {
      this.isSpeaking = false;
      if (typeof this.onSpeechEnd === "function") {
        this.onSpeechEnd();
      }
    };

    this.speechUtterance.onpause = () => {
      this.isSpeaking = false;
      if (typeof this.onSpeechPause === "function") {
        this.onSpeechPause();
      }
    };

    this.speechUtterance.onerror = (event) => {
      this.isSpeaking = false;
      if (typeof this.onSpeechError === "function") {
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
    const voice = this.voices.find((v) => v.name === voiceName);
    if (voice) {
      this.currentVoice = voice;
      console.log(`Voice changed to: ${voice.name}`);
    } else {
      console.warn(`Voice "${voiceName}" not found. Using default voice.`);
    }
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
