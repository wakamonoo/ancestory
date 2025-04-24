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
    
    // Our required voices with fallback configurations
    this.requiredVoices = [
      {
        name: "Angelo",
        lang: "fil-PH",
        fallback: { pitch: 1.1, rate: 0.95, voiceURI: "Angelo" }
      },
      {
        name: "Blessica",
        lang: "fil-PH",
        fallback: { pitch: 0.9, rate: 1.05, voiceURI: "Blessica" }
      },
      {
        name: "Andrew",
        lang: "en-US",
        fallback: { pitch: 1.0, rate: 1.0, voiceURI: "Andrew" }
      },
      {
        name: "Emma",
        lang: "en-US",
        fallback: { pitch: 1.05, rate: 1.0, voiceURI: "Emma" }
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
    
    // Some browsers don't support onvoiceschanged properly
    // So we'll poll for voices if they're not loaded immediately
    if (this.voices.length === 0) {
      const voiceCheckInterval = setInterval(() => {
        this.voiceLoadAttempts++;
        this.loadVoices();
        
        if (this.voices.length > 0 || this.voiceLoadAttempts >= 10) {
          clearInterval(voiceCheckInterval);
          
          // If still no voices after attempts, create our fallback voices
          if (this.voices.length === 0) {
            this.createFallbackVoices();
          }
        }
      }, 500);
    }
  }

  loadVoices() {
    const nativeVoices = this.speechSynthesis.getVoices();
    this.voices = [];
    
    // First try to find our required voices in native voices
    this.requiredVoices.forEach(reqVoice => {
      const foundVoice = nativeVoices.find(voice => 
        voice.name.includes(reqVoice.name) && 
        voice.lang.includes(reqVoice.lang)
      );
      
      if (foundVoice) {
        this.voices.push(foundVoice);
      }
    });
    
    // If we didn't find all required voices, try to find similar voices
    if (this.voices.length < this.requiredVoices.length) {
      const remainingVoices = this.requiredVoices.filter(reqVoice => 
        !this.voices.some(v => v.name.includes(reqVoice.name))
      );
      
      remainingVoices.forEach(reqVoice => {
        // Try to find any voice with matching language
        const fallbackVoice = nativeVoices.find(voice => 
          voice.lang.includes(reqVoice.lang)
        );
        
        if (fallbackVoice) {
          // Clone the voice and modify its name to match our required voice
          const modifiedVoice = Object.assign({}, fallbackVoice, {
            name: reqVoice.name,
            voiceURI: reqVoice.name
          });
          this.voices.push(modifiedVoice);
        }
      });
    }
    
    // If we still don't have voices, we'll create fallback ones later
    if (this.voices.length === 0) return;
    
    // Set default voice if available
    this.currentVoice = this.voices[0];
  }

  createFallbackVoices() {
    // Create synthetic voice objects for our required voices
    this.requiredVoices.forEach(reqVoice => {
      const syntheticVoice = {
        name: reqVoice.name,
        lang: reqVoice.lang,
        voiceURI: reqVoice.name,
        localService: true,
        default: false,
        ...reqVoice.fallback
      };
      
      this.voices.push(syntheticVoice);
    });
    
    this.currentVoice = this.voices[0];
  }

  startSpeech(title, origin, contentElement) {
    const titleText = `${title}. `;
    const originText = `From ${origin}. `;
    const contentText = contentElement.textContent;
    
    // Calculate lengths for each section
    this.titleLength = titleText.length;
    this.originLength = originText.length;
    this.contentLength = contentText.length;
    
    const fullText = titleText + originText + contentText;
    
    this.stopSpeech(); // Stop any current speech
    
    this.speechUtterance = new SpeechSynthesisUtterance(fullText);
    
    // Apply voice settings - works with both native and synthetic voices
    Object.assign(this.speechUtterance, {
      voice: this.currentVoice,
      voiceURI: this.currentVoice.voiceURI || this.currentVoice.name,
      lang: this.currentVoice.lang,
      rate: this.speechOptions.rate,
      pitch: this.currentVoice.pitch || 1,
      volume: 1
    });
    
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
    
    try {
      this.speechSynthesis.speak(this.speechUtterance);
      this.isSpeaking = true;
    } catch (e) {
      console.error('Speech synthesis error:', e);
      this.handleSpeechError();
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