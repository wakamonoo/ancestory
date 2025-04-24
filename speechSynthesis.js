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
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.highlightingMethod = this.isMobile ? 'inlineStyle' : 'range'; // Choose highlighting method

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

    // Sort voices - preferred voices first, then others
    this.voices.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      const isAPreferred = aName.includes("angelo") || aName.includes("blessica") ||
                           aName.includes("andrew") || aName.includes("emma");
      const isBPreferred = bName.includes("angelo") || bName.includes("blessica") ||
                           bName.includes("andrew") || bName.includes("emma");

      if (isAPreferred && !isBPreferred) return -1;
      if (!isAPreferred && isBPreferred) return 1;
      return 0;
    });

    // Set default voice to first available voice
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
    this.removeHighlighting(); // Ensure highlighting is removed on stop
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

  setHighlightingMethod(method) {
    this.highlightingMethod = method;
    this.removeHighlighting(); // Clear any existing highlighting
  }

  getHighlightingMethod() {
    return this.highlightingMethod;
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

    if (this.highlightingMethod === 'range') {
      this.highlightSpokenWordDesktop(element, adjustedIndex, charLength);
    } else if (this.highlightingMethod === 'inlineStyle') {
      this.highlightWordInlineStyleMobile(element, adjustedIndex, charLength);
    } else if (this.highlightingMethod === 'markElement') {
      this.highlightWordMarkElementMobile(element, adjustedIndex, charLength);
    } else {
      this.boldSpokenWordMobile(element, adjustedIndex, charLength); // Default to bold
    }
  }

  highlightSpokenWordDesktop(element, adjustedIndex, charLength) {
    try {
      const { node, position } = this.findTextNodeAndPosition(element, adjustedIndex);

      if (node && position !== -1) {
        const range = document.createRange();
        range.setStart(node, position);
        range.setEnd(node, position + charLength);

        const span = document.createElement('span');
        span.className = 'highlight-word';

        try {
          range.surroundContents(span);
          this.scrollToHighlight(span);
          return;
        } catch (e) {
          console.log('Modern highlighting failed, trying fallback');
          this.fallbackHighlight(element, adjustedIndex, charLength);
        }
      }
    } catch (e) {
      console.log('Modern highlighting error:', e);
      this.fallbackHighlight(element, adjustedIndex, charLength);
    }
  }

  fallbackHighlight(element, adjustedIndex, charLength) {
    try {
      const text = element.textContent || element.innerText;
      if (adjustedIndex + charLength > text.length) return;

      const before = text.substring(0, adjustedIndex);
      const highlighted = text.substring(adjustedIndex, adjustedIndex + charLength);
      const after = text.substring(adjustedIndex + charLength);

      element.innerHTML = `<span class="math-inline">\{this\.escapeHTML\(before\)\}<span class\="highlight\-word"\></span>{this.escapeHTML(highlighted)}</span>${this.escapeHTML(after)}`;

      const highlightedSpan = element.querySelector('.highlight-word');
      if (highlightedSpan) {
        this.scrollToHighlight(highlightedSpan);
      }
    } catch (e) {
      console.error('Fallback highlighting failed:', e);
      this.boldSpokenWordMobile(element, adjustedIndex, charLength); // Last resort: bold
    }
  }

  highlightWordInlineStyleMobile(element, adjustedIndex, charLength) {
    try {
      const text = element.textContent || element.innerText;
      if (adjustedIndex + charLength > text.length) return;

      const before = text.substring(0, adjustedIndex);
      const highlighted = text.substring(adjustedIndex, adjustedIndex + charLength);
      const after = text.substring(adjustedIndex + charLength);

      // Remove previous highlight
      element.innerHTML = element.innerHTML.replace(/<span class="mobile-highlight">([^<]+)<\/span>/g, '$1');

      // Apply new highlight
      element.innerHTML = `<span class="math-inline">\{this\.escapeHTML\(before\)\}<span class\="mobile\-highlight" style\="background\-color\: yellow; color\: black;"\></span>{this.escapeHTML(highlighted)}</span>${this.escapeHTML(after)}`;

      const highlightedSpan = element.querySelector('.mobile-highlight');
      if (highlightedSpan) {
        this.scrollToHighlight(highlightedSpan);
      }
    } catch (e) {
      console.error('Inline style highlighting failed on mobile:', e);
      this.boldSpokenWordMobile(element, adjustedIndex, charLength);
    }
  }

  highlightWordMarkElementMobile(element, adjustedIndex, charLength) {
    try {
      const text = element.textContent || element.innerText;
      if (adjustedIndex + charLength > text.length) return;

      const before = text.substring(0, adjustedIndex);
      const highlighted = text.substring(adjustedIndex, adjustedIndex + charLength);
      const after = text.substring(adjustedIndex + charLength);

      // Remove previous highlight
      element.innerHTML = element.innerHTML.replace(/<mark class="mobile-highlight">([^<]+)<\/mark>/g, '$1');

      // Apply new highlight
      element.innerHTML = `<span class="math-inline">\{this\.escapeHTML\(before\)\}<mark class\="mobile\-highlight" style\="background\-color\: yellow; color\: black;"\></span>{this.escapeHTML(highlighted)}</mark>${this.escapeHTML(after)}`;

      const highlightedMark = element.querySelector('mark.mobile-highlight');
      if (highlightedMark) {
        this.scrollToHighlight(highlightedMark);
      }
    } catch (e) {
      console.error('<mark> element highlighting failed on mobile:', e);
      this.boldSpokenWordMobile(element, adjustedIndex, charLength);
    }
  }

  boldSpokenWordMobile(element, adjustedIndex, charLength) {
    try {
      const text = element.textContent || element.innerText;
      if (adjustedIndex + charLength > text.length) return;

      const before = text.substring(0, adjustedIndex);
      const highlighted = text.substring(adjustedIndex, adjustedIndex + charLength);
      const after = text.substring(adjustedIndex + charLength);

      // Save the current scroll position
      const scrollPosition = element.scrollTop;

      // Use bold instead of highlight for mobile
      element.innerHTML = `<span class="math-inline">\{this\.escapeHTML\(before\)\}<strong class\="mobile\-current\-word"\></span>{this.escapeHTML(highlighted)}</strong>${this.escapeHTML(after)}`;

      // Restore the scroll position
      element.scrollTop = scrollPosition;

      const boldedWord = element.querySelector('.mobile-current-word');
      if (boldedWord) {
        this.scrollToHighlight(boldedWord);
      }
    } catch (e) {
      console.error('Mobile word bolding failed:', e);
    }
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag]));
  }

  findTextNodeAndPosition(element, charIndex) {
    if (!element) return { node: null, position: -1 };

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

    // Fallback for browsers that might not handle tree walker correctly
    if (element.nodeType === Node.TEXT_NODE) {
      if (charIndex <= element.textContent.length) {
        return {
          node: element,
          position: charIndex
        };
      }
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
    const contentElement = document.getElementById('story-content');
    const titleElement = document.getElementById('story-title');
    const originElement = document.getElementById('story-origin');

    if (contentElement) {
      contentElement.innerHTML = contentElement.innerHTML.replace(/<span class="highlight-word">([^<]+)<\/span>/g, '$1');
      contentElement.innerHTML = contentElement.innerHTML.replace(/<strong class="mobile-current-word">([^<]+)<\/strong>/g, '$1');
      contentElement.innerHTML = contentElement.innerHTML.replace(/<span class="mobile-highlight" style="background-color: yellow; color: black;">([^<]+)<\/span>/g, '$1');
      contentElement.innerHTML = contentElement.innerHTML.replace(/<mark class="mobile-highlight" style="background-color: yellow; color: black;">([^<]+)<\/mark>/g, '$1');
    }
    if (titleElement) {
      titleElement.innerHTML = titleElement.innerHTML.replace(/<span class="highlight-word">([^<]+)<\/span>/g, '$1');
      titleElement.innerHTML = titleElement.innerHTML.replace(/<strong class="mobile-current-word">([^<]+)<\/strong>/g, '$1');
      titleElement.innerHTML = titleElement.innerHTML.replace(/<span class="mobile-highlight" style="background-color: yellow; color: black;">([^<]+)<\/span>/g, '$1');
      titleElement.innerHTML = titleElement.innerHTML.replace(/<mark class="mobile-highlight" style="background-color: yellow; color: black;">([^<]+)<\/mark>/g, '$1');
    }
    if (originElement) {
      originElement.innerHTML = originElement.innerHTML.replace(/<span class="highlight-word">([^<]+)<\/span>/g, '$1');
      originElement.innerHTML = originElement.innerHTML.replace(/<strong class="mobile-current-word">([^<]+)<\/strong>/g, '$1');
      originElement.innerHTML = originElement.innerHTML.replace(/<span class="mobile-highlight" style="background-color: yellow; color: black;">([^<]+)<\/span>/g, '$1');
      originElement.innerHTML = originElement.innerHTML.replace(/<mark class="mobile-highlight" style="background-color: yellow; color: black;">([^<]+)<\/mark>/g, '$1');
    }
  }
}

export { StorySpeechSynthesis };
