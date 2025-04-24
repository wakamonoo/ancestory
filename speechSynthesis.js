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

    // Event handlers
    this.onWordBoundary = null;
    this.onSpeechEnd = null;
    this.onSpeechError = null;
    this.onSpeechPause = null;

    this.init();
  }

  init() {
    // Load available voices
    this.loadVoices();

    // Some browsers don't support onvoiceschanged properly
    // So we'll poll for voices if they're not loaded immediately
    if (this.voices.length === 0) {
      const voiceCheckInterval = setInterval(() => {
        this.loadVoices();
        if (this.voices.length > 0) {
          clearInterval(voiceCheckInterval);
        }
      }, 200);

      // Give up after 5 seconds
      setTimeout(() => {
        clearInterval(voiceCheckInterval);
      }, 5000);
    }
  }

  loadVoices() {
    this.voices = this.speechSynthesis.getVoices();

    // Filter for specific voices only with fallbacks
    const preferredVoices = [
      { name: 'Angelo', lang: 'fil-PH' },
      { name: 'Blessica', lang: 'fil-PH' },
      { name: 'Google Filipino', lang: 'fil-PH' },
      { name: 'Microsoft Maria - Filipino (Philippines)', lang: 'fil-PH' },
      { name: 'Microsoft David - English (United States)', lang: 'en-US' },
      { name: 'Google US English', lang: 'en-US' },
      { name: 'Alex', lang: 'en-US' },
      { name: 'Samantha', lang: 'en-US' }
    ];

    // Try to find exact matches first
    const exactMatches = preferredVoices.filter(prefVoice =>
      this.voices.some(voice =>
        voice.name.includes(prefVoice.name) &&
        voice.lang.includes(prefVoice.lang)
    ));

    if (exactMatches.length > 0) {
      this.voices = this.voices.filter(voice =>
        exactMatches.some(match =>
          voice.name.includes(match.name) &&
          voice.lang.includes(match.lang)
        )
      );
    } else {
      // Fallback to any Filipino or English voices
      this.voices = this.voices.filter(voice =>
        voice.lang.includes('fil-') ||
        voice.lang.includes('en-')
      );
    }

    // Sort voices - Filipino first, then English
    this.voices.sort((a, b) => {
      if (a.lang.includes('fil-') && !b.lang.includes('fil-')) return -1;
      if (!a.lang.includes('fil-') && b.lang.includes('fil-')) return 1;
      return a.name.localeCompare(b.name);
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
    this.contentLength = contentText.length;

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
}

export { StorySpeechSynthesis };