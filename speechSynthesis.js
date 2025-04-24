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
    
    // Enhanced mobile detection
    this.isMobile = this.detectMobile();
    this.lastHighlightTime = 0;
    this.highlightDebounce = this.isMobile ? 150 : 50;

    // Event handlers
    this.onWordBoundary = null;
    this.onSpeechEnd = null;
    this.onSpeechError = null;
    this.onSpeechPause = null;

    this.init();
  }

  detectMobile() {
    // More comprehensive mobile detection
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(userAgent);
    
    // Also consider viewport size
    const hasSmallScreen = window.innerWidth < 768;
    
    return isMobile || isTablet || hasSmallScreen;
  }

  init() {
    // Load available voices with retry for mobile
    this.loadVoices();
    this.speechSynthesis.onvoiceschanged = () => {
      // Some mobile browsers need this
      if (this.voices.length === 0) {
        this.loadVoices();
      }
    };
  }

  loadVoices() {
    this.voices = this.speechSynthesis.getVoices() || [];

    // Sort voices - preferred voices first, then others
    this.voices.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      const isAPreferred = aName.includes("angelo") || aName.includes("blessica") ||
                          aName.includes("andrew") || aName.includes("emma");
      const isBPreferred = bName.includes("angelo") || bName.includes("blessica") ||
                          aName.includes("andrew") || aName.includes("emma");

      if (isAPreferred && !isBPreferred) return -1;
      if (!isAPreferred && isBPreferred) return 1;
      return 0;
    });

    // Set default voice to first available voice
    if (this.voices.length > 0) {
      this.currentVoice = this.voices[0];
    } else if (!this.isMobile) {
      // On desktop, we can try again if voices aren't loaded
      setTimeout(() => this.loadVoices(), 1000);
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
      if (this.onWordBoundary && typeof this.onWordBoundary === "function") {
        // Debounce highlights on mobile
        const now = Date.now();
        if (now - this.lastHighlightTime > this.highlightDebounce) {
          this.onWordBoundary(event);
          this.lastHighlightTime = now;
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
    } catch (error) {
      console.error('Speech synthesis error:', error);
      this.handleSpeechError(error);
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
    } else {
      // Main content section
      element = document.getElementById('story-content');
      adjustedIndex = charIndex - (this.titleLength + this.originLength);
    }

    this.removeHighlighting();

    if (!element || !element.firstChild) return;

    // Different handling for mobile vs desktop
    if (this.isMobile) {
      this.highlightMobile(element, adjustedIndex, charLength);
    } else {
      this.highlightDesktop(element, adjustedIndex, charLength);
    }
  }

  highlightDesktop(element, adjustedIndex, charLength) {
    try {
      const range = document.createRange();
      const textNodes = this.getTextNodes(element);
      let currentPos = 0;
      let startNode, startOffset, endNode, endOffset;

      for (const node of textNodes) {
        const nodeLength = node.textContent.length;
        
        if (currentPos + nodeLength > adjustedIndex) {
          startNode = node;
          startOffset = adjustedIndex - currentPos;
          
          if (currentPos + nodeLength >= adjustedIndex + charLength) {
            endNode = node;
            endOffset = startOffset + charLength;
            break;
          } else {
            endNode = node;
            endOffset = nodeLength;
            charLength -= (nodeLength - startOffset);
            adjustedIndex += (nodeLength - startOffset);
          }
        }
        currentPos += nodeLength;
      }

      if (startNode && endNode) {
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);

        const span = document.createElement('span');
        span.className = 'highlight-word';
        
        try {
          range.surroundContents(span);
          this.scrollToHighlight(span);
        } catch (e) {
          console.log('Range surround failed, using fallback');
          this.highlightFallback(element, adjustedIndex, charLength);
        }
      }
    } catch (e) {
      console.error('Desktop highlighting error:', e);
      this.highlightFallback(element, adjustedIndex, charLength);
    }
  }

  highlightMobile(element, adjustedIndex, charLength) {
    try {
      const text = element.textContent;
      if (adjustedIndex + charLength > text.length) return;

      // Save current scroll position
      const scrollTop = element.scrollTop;
      const scrollLeft = element.scrollLeft;

      // Create simple highlight with bold
      const before = text.substring(0, adjustedIndex);
      const highlight = text.substring(adjustedIndex, adjustedIndex + charLength);
      const after = text.substring(adjustedIndex + charLength);

      element.innerHTML = `${this.escapeHTML(before)}<strong class="mobile-highlight">${this.escapeHTML(highlight)}</strong>${this.escapeHTML(after)}`;

      // Restore scroll position
      element.scrollTop = scrollTop;
      element.scrollLeft = scrollLeft;

      this.scrollToHighlight(element.querySelector('.mobile-highlight'));
    } catch (e) {
      console.error('Mobile highlighting error:', e);
    }
  }

  highlightFallback(element, adjustedIndex, charLength) {
    try {
      const text = element.textContent;
      if (adjustedIndex + charLength > text.length) return;

      const before = text.substring(0, adjustedIndex);
      const highlight = text.substring(adjustedIndex, adjustedIndex + charLength);
      const after = text.substring(adjustedIndex + charLength);

      element.innerHTML = `${this.escapeHTML(before)}<span class="highlight-fallback">${this.escapeHTML(highlight)}</span>${this.escapeHTML(after)}`;
      
      this.scrollToHighlight(element.querySelector('.highlight-fallback'));
    } catch (e) {
      console.error('Fallback highlighting error:', e);
    }
  }

  getTextNodes(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    return textNodes;
  }

  scrollToHighlight(element) {
    if (!element) return;
    
    const storyContainer = document.getElementById('storyContainer');
    if (!storyContainer) return;

    // Smooth scroll for better mobile experience
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }

  removeHighlighting() {
    // Remove all types of highlights
    const highlights = [
      ...document.querySelectorAll('.highlight-word'),
      ...document.querySelectorAll('.mobile-highlight'),
      ...document.querySelectorAll('.highlight-fallback')
    ];
    
    highlights.forEach(highlight => {
      const parent = highlight.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
      }
    });
  }

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  handleSpeechError(error) {
    console.error('Speech Error:', error);
    this.isSpeaking = false;
    
    if (this.onSpeechError) {
      this.onSpeechError({
        error: 'speech-error',
        message: error.message || 'Speech synthesis failed'
      });
    }
  }
}

export { StorySpeechSynthesis };