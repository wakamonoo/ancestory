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
    this.detectMobileLimitations();
  }

  init() {
    this.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    this.loadVoices();
  }

  detectMobileLimitations() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      Swal.fire({
        title: 'Voice Change May Not Work',
        text: 'On mobile browsers, voice selection may not apply. The device default voice will be used.',
        icon: 'info',
        background: '#C09779',
        color: '#20462F',
        confirmButtonColor: '#D29F80',
        confirmButtonText: 'Understood',
      });
    }
  }

  loadVoices() {
    this.voices = this.speechSynthesis.getVoices();

    this.voices.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const isAPreferred = aName.includes("angelo") || aName.includes("blessica") || aName.includes("andrew") || aName.includes("emma");
      const isBPreferred = bName.includes("angelo") || bName.includes("blessica") || bName.includes("andrew") || bName.includes("emma");

      if (isAPreferred && !isBPreferred) return -1;
      if (!isAPreferred && isBPreferred) return 1;
      return 0;
    });

    if (this.voices.length > 0) {
      this.currentVoice = this.voices[0];
    }
  }

  startSpeech(title, origin, contentElement) {
    const titleText = `${title}. `;
    const originText = `From ${origin}. `;
    const contentText = contentElement.textContent;
    const fullText = titleText + originText + contentText;

    this.stopSpeech();

    this.speechUtterance = new SpeechSynthesisUtterance(fullText);
    this.speechUtterance.voice = this.currentVoice;
    this.speechUtterance.rate = this.speechOptions.rate;

    // Event Handlers
    this.speechUtterance.onstart = () => {
      this.isSpeaking = true;
      Swal.fire({
        title: 'Speech Started',
        text: `Narrating: ${title}`,
        icon: 'success',
        background: '#C09779',
        color: '#20462F',
        confirmButtonColor: '#D29F80',
      });
    };

    this.speechUtterance.onend = () => {
      this.isSpeaking = false;
      if (this.onSpeechEnd && typeof this.onSpeechEnd === "function") {
        this.onSpeechEnd();
      }
      Swal.fire({
        title: 'Speech Finished',
        icon: 'success',
        background: '#C09779',
        color: '#20462F',
        confirmButtonColor: '#D29F80',
      });
    };

    this.speechUtterance.onerror = (event) => {
      this.isSpeaking = false;
      if (this.onSpeechError && typeof this.onSpeechError === "function") {
        this.onSpeechError(event);
      }
      Swal.fire({
        title: 'Speech Error',
        text: 'An error occurred while narrating.',
        icon: 'error',
        background: '#C09779',
        color: '#20462F',
        confirmButtonColor: '#D29F80',
      });
    };

    this.speechUtterance.onpause = () => {
      this.isSpeaking = false;
      if (this.onSpeechPause && typeof this.onSpeechPause === "function") {
        this.onSpeechPause();
      }
    };

    this.speechUtterance.onboundary = (event) => {
      if (this.onWordBoundary && typeof this.onWordBoundary === "function") {
        this.onWordBoundary(event);
      }
    };

    this.speechSynthesis.speak(this.speechUtterance);
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
      Swal.fire({
        title: 'Voice Changed',
        text: `Now using: ${selected.name}`,
        icon: 'info',
        background: '#C09779',
        color: '#20462F',
        confirmButtonColor: '#D29F80',
      });
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
