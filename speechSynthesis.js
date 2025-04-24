// speechSynthesis.js
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
    this.contentLength = 0;
    this.currentHighlight = null;
    this.voiceLoadAttempts = 0;
    
    // Preferred voices (always shown first in UI)
    this.preferredVoices = [
      { name: "Angelo", lang: "fil-PH" },
      { name: "Blessica", lang: "fil-PH" },
      { name: "Andrew", lang: "en-US" },
      { name: "Emma", lang: "en-US" }
    ];
    
    // Fallback voice categories
    this.fallbackCategories = [
      {
        name: "Filipino Voices",
        filter: voice => voice.lang.includes('fil-')
      },
      {
        name: "English Voices",
        filter: voice => voice.lang.includes('en-')
      },
      {
        name: "Other Voices",
        filter: () => true
      }
    ];
    
    // Event handlers
    this.onWordBoundary = null;
    this.onSpeechEnd = null;
    this.onSpeechError = null;
    this.onSpeechPause = null;
    
    this.init();
  }

  init() {
    this.loadVoices();
    
    if (this.speechSynthesis.onvoiceschanged !== undefined) {
      this.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
    
    // Poll for voices if they're not loaded immediately
    if (this.voices.length === 0) {
      const voiceCheckInterval = setInterval(() => {
        this.voiceLoadAttempts++;
        this.loadVoices();
        
        if (this.voices.length > 0 || this.voiceLoadAttempts >= 5) {
          clearInterval(voiceCheckInterval);
        }
      }, 500);
    }
  }

  loadVoices() {
    const nativeVoices = this.speechSynthesis.getVoices();
    this.voices = [];
    
    // 1. First try to find our preferred voices
    this.preferredVoices.forEach(prefVoice => {
      const foundVoice = nativeVoices.find(voice => 
        voice.name.includes(prefVoice.name) && 
        voice.lang.includes(prefVoice.lang)
      );
      
      if (foundVoice) {
        this.voices.push({
          ...foundVoice,
          isPreferred: true,
          category: "Preferred"
        });
      }
    });
    
    // 2. Add other available voices grouped by categories
    this.fallbackCategories.forEach(category => {
      const matchingVoices = nativeVoices
        .filter(voice => 
          !this.voices.some(v => v.voiceURI === voice.voiceURI) && // Not already added
          category.filter(voice) // Matches category filter
        )
        .map(voice => ({
          ...voice,
          isPreferred: false,
          category: category.name
        }));
      
      this.voices.push(...matchingVoices);
    });
    
    // Set default voice (first preferred if available, otherwise first voice)
    if (this.voices.length > 0) {
      const preferred = this.voices.find(v => v.isPreferred);
      this.currentVoice = preferred || this.voices[0];
    }
  }

  isVoiceSupported(voiceName, voiceLang) {
    return this.voices.some(v => 
      v.name === voiceName && 
      v.lang === voiceLang &&
      !v.isFallback
    );
  }

  startSpeech(title, origin, contentElement) {
    // Check if selected voice is supported
    if (!this.isVoiceSupported(this.currentVoice.name, this.currentVoice.lang)) {
      this.showVoiceNotSupportedError(this.currentVoice.name);
      return;
    }
    
    const titleText = `${title}. `;
    const originText = `From ${origin}. `;
    const contentText = contentElement.textContent;
    
    // Calculate lengths for each section
    this.titleLength = titleText.length;
    this.originLength = originText.length;
    this.contentLength = contentText.length;
    
    const fullText = titleText + originText + contentText;
    
    this.stopSpeech();
    this.speechUtterance = new SpeechSynthesisUtterance(fullText);
    
    Object.assign(this.speechUtterance, {
      voice: this.currentVoice,
      voiceURI: this.currentVoice.voiceURI,
      lang: this.currentVoice.lang,
      rate: this.speechOptions.rate,
      pitch: 1,
      volume: 1
    });
    
    // Event handlers
    this.speechUtterance.onboundary = (event) => {
      if (this.onWordBoundary) this.onWordBoundary(event);
    };
    
    this.speechUtterance.onend = () => {
      this.isSpeaking = false;
      if (this.onSpeechEnd) this.onSpeechEnd();
    };
    
    this.speechUtterance.onerror = (event) => {
      this.isSpeaking = false;
      if (this.onSpeechError) this.onSpeechError(event);
      
      if (event.error === 'voice-not-found') {
        this.showVoiceNotSupportedError(this.currentVoice.name);
      }
    };
    
    try {
      this.speechSynthesis.speak(this.speechUtterance);
      this.isSpeaking = true;
    } catch (e) {
      console.error('Speech error:', e);
      this.showVoiceNotSupportedError(this.currentVoice.name);
    }
  }

  showVoiceNotSupportedError(voiceName) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: "Voice Not Supported",
        html: `
          <p>The <strong>${voiceName}</strong> voice is not supported in your current browser.</p>
          <p>Please try selecting a different voice from the options.</p>
        `,
        icon: "error",
        iconColor: "#20462f",
        confirmButtonText: "Okay",
        background: "#D29F80",
        color: "#20462f",
        confirmButtonColor: "#C09779",
      });
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
    this.removeHighlighting();
  }

  changeVoice(voiceName) {
    const newVoice = this.voices.find(voice => voice.name === voiceName);
    if (newVoice) {
      this.currentVoice = newVoice;
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
    return 'speechSynthesis' in window;
  }

  highlightSpokenWord(event) {
    if (event.name !== 'word') return;

    const charIndex = event.charIndex;
    const charLength = event.charLength;

    // Determine which section is being spoken
    let element, adjustedIndex;

    if (charIndex < this.titleLength) {
      // Title section
      element = document.getElementById('story-title');
      adjustedIndex = charIndex;
    } else if (charIndex < this.titleLength + this.originLength) {
      // Origin section
      element = document.getElementById('story-origin');
      adjustedIndex = charIndex - this.titleLength;
    } else if (charIndex < this.titleLength + this.originLength + this.contentLength) {
      // Main content section
      element = document.getElementById('story-content');
      adjustedIndex = charIndex - (this.titleLength + this.originLength);
    } else {
      return; // Outside our content
    }

    this.removeHighlighting();

    const { node, position } = this.findTextNodeAndPosition(element, adjustedIndex);

    if (node && position !== -1) {
      try {
        const range = document.createRange();
        range.setStart(node, position);
        range.setEnd(node, position + charLength);

        const span = document.createElement('span');
        span.className = 'highlight-word';
        range.surroundContents(span);

        this.currentHighlight = span;
        this.scrollToHighlight(span);
      } catch (e) {
        console.error('Could not highlight word:', e);
      }
    }
  }

  findTextNodeAndPosition(element, charIndex) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let currentIndex = 0;
    let node;

    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      if (currentIndex + nodeLength > charIndex) {
        return {
          node: node,
          position: charIndex - currentIndex
        };
      }
      currentIndex += nodeLength;
    }

    return { node: null, position: -1 };
  }

  scrollToHighlight(element) {
    const storyContainer = document.getElementById('storyContainer');
    if (!storyContainer) return;

    const containerRect = storyContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const elementTop = elementRect.top - containerRect.top;
    const elementBottom = elementRect.bottom - containerRect.top;
    const containerHeight = containerRect.height;

    if (elementTop < storyContainer.scrollTop) {
      storyContainer.scrollTop = elementTop - 20;
    } else if (elementBottom > storyContainer.scrollTop + containerHeight) {
      storyContainer.scrollTop = elementBottom - containerHeight + 20;
    }
  }

  removeHighlighting() {
    if (this.currentHighlight) {
      const highlight = this.currentHighlight;
      const parent = highlight.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
      }
      this.currentHighlight = null;
    }
  }

  handleSpeechError() {
    // If we get an error, try recreating voices and speaking again
    this.createFallbackVoices();
    
    if (this.speechUtterance) {
      try {
        this.speechSynthesis.speak(this.speechUtterance);
        this.isSpeaking = true;
      } catch (e) {
        console.error('Fallback speech synthesis failed:', e);
        this.isSpeaking = false;
        
        if (this.onSpeechError) {
          this.onSpeechError({ error: 'synthesis-failed' });
        }
      }
    }
  }
}


export { StorySpeechSynthesis };