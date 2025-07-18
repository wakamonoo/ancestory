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

    this.onWordBoundary = null;
    this.onSpeechEnd = null;
    this.onSpeechError = null;
    this.onSpeechPause = null;

    this.init();
  }

  init() {
    this.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    this.loadVoices();
  }

  loadVoices() {
    this.voices = this.speechSynthesis.getVoices();

    this.voices.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      const isAPreferred =
        aName.includes("angelo") ||
        aName.includes("blessica") ||
        aName.includes("andrew") ||
        aName.includes("emma");
      const isBPreferred =
        bName.includes("angelo") ||
        bName.includes("blessica") ||
        bName.includes("andrew") ||
        bName.includes("emma");

      if (isAPreferred && !isBPreferred) return -1;
      if (!isAPreferred && isBPreferred) return 1;
      return 0;
    });

    if (this.voices.length > 0 && !this.currentVoice) {
      this.currentVoice = this.voices[0];
    }
  }

  startSpeech(title, origin, contentElement) {
    const titleText = `${title}. `;
    const originText = `From ${origin}. `;
    const contentText = contentElement.textContent;

    this.titleLength = titleText.length;
    this.originLength = originText.length;

    const fullText = titleText + originText + contentText;

    this.stopSpeech();

    this.speechUtterance = new SpeechSynthesisUtterance(fullText);
    this.speechUtterance.voice = this.currentVoice;
    this.speechUtterance.rate = this.speechOptions.rate;

    this.speechUtterance.onstart = () => {
      // Alert removed
    };

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
    const selected = this.voices.find((v) => v.name === voiceName);
    if (selected) {
      this.currentVoice = selected;
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
