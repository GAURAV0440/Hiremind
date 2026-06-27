import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type VoiceState = "idle" | "listening" | "thinking" | "speaking";

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly 0: { transcript: string };
}

interface SpeechRecognitionEventLike {
  readonly results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorLike {
  readonly error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}

interface SpeechInterviewOptions {
  question: string;
  questionKey: string | number;
  thinking: boolean;
  onTranscript: (transcript: string) => void;
}

const MUTED_KEY = "hiremind-voice-muted";

function initialMuted() {
  return localStorage.getItem(MUTED_KEY) === "true";
}

function recognitionErrorMessage(error: string) {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "Microphone access was blocked. Allow it in your browser settings and try again.";
  }
  if (error === "no-speech") return "No speech was detected. Try speaking a little closer to your microphone.";
  if (error === "audio-capture") return "No microphone was found.";
  if (error === "network") return "Speech recognition could not reach the browser speech service.";
  return "Speech recognition stopped unexpectedly.";
}

export function useSpeechInterview({ question, questionKey, thinking, onTranscript }: SpeechInterviewOptions) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastSpokenQuestionRef = useRef<string | number | null>(null);
  const [activity, setActivity] = useState<Exclude<VoiceState, "thinking">>("idle");
  const [muted, setMuted] = useState(initialMuted);
  const [error, setError] = useState<string | null>(null);

  const recognitionSupported = useMemo(() => {
    const speechWindow = window as SpeechRecognitionWindow;
    return Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition);
  }, []);
  const synthesisSupported = useMemo(
    () => "speechSynthesis" in window && "SpeechSynthesisUtterance" in window,
    [],
  );

  const stopRecognition = useCallback((abort = false) => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (abort) recognition.abort();
    else recognition.stop();
    recognitionRef.current = null;
  }, []);

  const stop = useCallback(() => {
    stopRecognition();
    if (synthesisSupported) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setActivity("idle");
  }, [stopRecognition, synthesisSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!text.trim() || !synthesisSupported || muted || thinking) return;
      stopRecognition(true);
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find((voice) =>
        /^en(-|_)/i.test(voice.lang) && /natural|samantha|google|microsoft/i.test(voice.name),
      ) ?? voices.find((voice) => /^en(-|_)/i.test(voice.lang));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 0.96;
      utterance.pitch = 1;
      utterance.onstart = () => setActivity("speaking");
      utterance.onend = () => {
        utteranceRef.current = null;
        setActivity("idle");
      };
      utterance.onerror = () => {
        utteranceRef.current = null;
        setActivity("idle");
      };
      utteranceRef.current = utterance;
      setError(null);
      window.speechSynthesis.speak(utterance);
    },
    [muted, synthesisSupported, thinking, stopRecognition],
  );

  const startListening = useCallback(() => {
    const speechWindow = window as SpeechRecognitionWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (synthesisSupported) window.speechSynthesis.cancel();
    stopRecognition(true);
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";
    recognition.onstart = () => {
      setError(null);
      setActivity("listening");
    };
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = 0; index < event.results.length; index += 1) {
        transcript += `${event.results[index][0].transcript} `;
      }
      onTranscript(transcript.trim());
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted") setError(recognitionErrorMessage(event.error));
      recognitionRef.current = null;
      setActivity("idle");
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setActivity((current) => current === "listening" ? "idle" : current);
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setActivity("idle");
      setError("The microphone could not be started. Please try again.");
    }
  }, [onTranscript, stopRecognition, synthesisSupported]);

  const replay = useCallback(() => speak(question), [question, speak]);

  const toggleMute = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      localStorage.setItem(MUTED_KEY, String(next));
      if (next && synthesisSupported) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
        setActivity("idle");
      }
      return next;
    });
  }, [synthesisSupported]);

  useEffect(() => {
    if (!question || muted || thinking || lastSpokenQuestionRef.current === questionKey) return;
    const timeout = window.setTimeout(() => {
      lastSpokenQuestionRef.current = questionKey;
      speak(question);
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [muted, question, questionKey, speak, thinking]);

  useEffect(() => {
    if (!thinking) return;
    stopRecognition();
    if (synthesisSupported) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setActivity("idle");
  }, [synthesisSupported, thinking, stopRecognition]);

  useEffect(() => () => {
    recognitionRef.current?.abort();
    if (synthesisSupported) window.speechSynthesis.cancel();
  }, [synthesisSupported]);

  return {
    state: thinking ? "thinking" as const : activity,
    muted,
    error,
    recognitionSupported,
    synthesisSupported,
    startListening,
    stop,
    replay,
    toggleMute,
  };
}
