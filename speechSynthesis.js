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
    this.voiceLoadAttempts = 0;

    // Event handlers
    this.onWordBoundary = null;
    this.onSpeechEnd = null;
    this.onSpeechError = null;
    this.onSpeechPause = null;

    this.init();
  }

  init() {
    // Mobile devices often need this workaround
    if (this.speechSynthesis.onvoiceschanged !== undefined) {
      this.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
    this.loadVoices();
  }

  loadVoices() {
    // Chrome needs multiple attempts to load voices
    const voices = this.speechSynthesis.getVoices();
    if (voices.length === 0 && this.voiceLoadAttempts < 10) {
      this.voiceLoadAttempts++;
      setTimeout(() => this.loadVoices(), 100);
      return;
    }

    // Filter for specific voices only
    this.voices = voices.filter((voice) => {
      const voiceName = voice.name.toLowerCase();
      return (
        voiceName.includes("angelo") ||
        voiceName.includes("blessica") ||
        voiceName.includes("andrew") ||
        voiceName.includes("emma") ||
        // Fallback voices for mobile
        voiceName.includes("fil-") || // Filipino voices
        voice.lang.includes("en-") // English voices
      );
    });

    // Prioritize preferred voices
    this.voices.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (
        aName.includes("angelo") ||
        aName.includes("blessica") ||
        aName.includes("andrew") ||
        aName.includes("emma")
      )
        return -1;
      if (
        bName.includes("angelo") ||
        bName.includes("blessica") ||
        bName.includes("andrew") ||
        bName.includes("emma")
      )
        return 1;
      return 0;
    });

    // Set default voice if available
    if (this.voices.length > 0) {
      this.currentVoice = this.voices[0];
    } else if (voices.length > 0) {
      // Fallback to any available voice
      this.currentVoice = voices[0];
    }
  }

  startSpeech(title, origin, contentElement) {
    // Mobile devices need this check
    if (!this.speechSynthesis) {
      console.error("Speech synthesis not supported");
      if (this.onSpeechError) {
        this.onSpeechError({ error: "not-supported" });
      }
      return;
    }

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

    // Mobile devices need these settings
    this.speechUtterance.volume = 1;
    this.speechUtterance.pitch = 1;

    // Set up event handlers
    this.speechUtterance.onboundary = (event) => {
      if (this.onWordBoundary && typeof this.onWordBoundary === "function") {
        // Mobile Chrome sometimes fires incorrect boundary events
        if (event.charIndex < fullText.length) {
          this.onWordBoundary(event);
        }
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

    try {
      this.speechSynthesis.speak(this.speechUtterance);
      this.isSpeaking = true;
    } catch (e) {
      console.error("Speech error:", e);
      if (this.onSpeechError) {
        this.onSpeechError({ error: "speak-failed" });
      }
    }
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
