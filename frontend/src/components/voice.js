/* ==========================================
   Vote Pilot — Voice Interaction Module
   Google Web Speech API for voice input/output
   ========================================== */

class VoiceEngine {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis || null;
    this.isListening = false;
    this.isSupported = false;
    this.onResult = null;
    this.onListeningChange = null;

    this.init();
  }

  /**
   * Initialize speech recognition (Google Web Speech API)
   */
  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.isSupported = true;

      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript && this.onResult) {
          this.onResult(finalTranscript, true);
        } else if (interimTranscript && this.onResult) {
          this.onResult(interimTranscript, false);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onListeningChange) this.onListeningChange(false);
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        if (this.onListeningChange) this.onListeningChange(false);
      };
    }
  }

  /**
   * Start listening for voice input
   */
  startListening() {
    if (!this.isSupported || !this.recognition) return false;

    try {
      this.recognition.start();
      this.isListening = true;
      if (this.onListeningChange) this.onListeningChange(true);
      return true;
    } catch (e) {
      console.warn('Could not start speech recognition:', e);
      return false;
    }
  }

  /**
   * Stop listening
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      if (this.onListeningChange) this.onListeningChange(false);
    }
  }

  /**
   * Toggle listening state
   */
  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      return this.startListening();
    }
  }

  /**
   * Speak text aloud using Google Text-to-Speech (Web Speech Synthesis)
   */
  speak(text) {
    if (!this.synthesis) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    // Strip HTML tags for clean speech
    const cleanText = text.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/💡|⚠️|🗳️|📝|📋|📍|🏛️|🧭|✅|🎉|👋|📊|📅|🔍|🪪|📮/g, '')
      .trim();

    // Split into chunks (max 200 chars) for better speech
    const chunks = this.splitIntoChunks(cleanText, 200);

    chunks.forEach((chunk, i) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 0.9;

      // Try to use a Google voice
      const voices = this.synthesis.getVoices();
      const googleVoice = voices.find(v =>
        v.name.includes('Google') && v.lang.startsWith('en')
      );
      if (googleVoice) utterance.voice = googleVoice;

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Stop speaking
   */
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  /**
   * Split text into speakable chunks
   */
  splitIntoChunks(text, maxLen) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let current = '';

    for (const sentence of sentences) {
      if ((current + sentence).length > maxLen) {
        if (current) chunks.push(current.trim());
        current = sentence;
      } else {
        current += sentence;
      }
    }
    if (current.trim()) chunks.push(current.trim());

    return chunks;
  }

  /**
   * Set the recognition language
   */
  setLanguage(langCode) {
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }
}

export const voiceEngine = new VoiceEngine();
