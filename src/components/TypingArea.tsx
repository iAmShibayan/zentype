"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Snippet, TestSettings, Stats } from "@/lib/types";
import { tokenize } from "@/lib/highlight";
import clsx from "clsx";
import { RotateCcw, SkipForward } from "lucide-react";

interface TypingAreaProps {
  snippet: Snippet;
  settings: TestSettings;
  onComplete?: (stats: Stats) => void;
  onNext?: () => void;
}

export function TypingArea({ snippet, settings, onComplete, onNext }: TypingAreaProps) {
  // State
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const [missedChars, setMissedChars] = useState<Record<string, number>>({});

  // Timer State
  const [timeLeft, setTimeLeft] = useState(settings.mode === "time" ? settings.timeDuration : 0);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Computed (tokenize into per-character array)
  const chars = useMemo(() => {
    const tokens = tokenize(snippet.code);
    const result: { char: string; type: string }[] = [];

    tokens.forEach((token) => {
      for (const char of token.content) {
        result.push({ char, type: token.type });
      }
    });

    return result;
  }, [snippet.code]);

  const lineCount = useMemo(() => snippet.code.split("\n").length, [snippet.code]);

  // Derived Stats
  const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
  const currWpm = timeElapsed > 0 ? Math.round(input.length / 5 / (timeElapsed / 60)) : 0;
  const currAcc =
    input.length > 0 ? Math.max(0, Math.round(((input.length - mistakes) / input.length) * 100)) : 100;

  const finishTest = () => {
    if (!onComplete) return;

    const now = Date.now();
    const durationMs = startTime ? now - startTime : 0;

    onComplete({
      wpm: currWpm,
      rawWpm: Math.round(input.length / 5 / (durationMs / 60000)) || 0,
      accuracy: currAcc,
      time: durationMs,
      errors: mistakes,
      missedChars,
    });
  };

  // Cursor Positioning (single source of truth)
  const updateCursorPos = (index: number) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    let x = 0;
    let y = 0;

    const activeSpan = container.querySelector(`[data-index="${index}"]`) as HTMLElement | null;

    if (activeSpan) {
      const rect = activeSpan.getBoundingClientRect();
      x = rect.left - containerRect.left + container.scrollLeft;
      y = rect.top - containerRect.top + container.scrollTop;
    } else {
      // fallback: end of previous char
      const prevIndex = Math.max(0, index - 1);
      const prevSpan = container.querySelector(`[data-index="${prevIndex}"]`) as HTMLElement | null;

      if (prevSpan) {
        const rect = prevSpan.getBoundingClientRect();
        x = rect.right - containerRect.left + container.scrollLeft;
        y = rect.top - containerRect.top + container.scrollTop;
      } else {
        x = 0;
        y = 0;
      }
    }

    setCursorPos({ x, y });
  };

  // Reset Session
  const resetSession = () => {
    setInput("");
    setMistakes(0);
    setMissedChars({});
    setStartTime(null);
    setTimerActive(false);
    setIsTyping(false);

    if (settings.mode === "time") setTimeLeft(settings.timeDuration);
    else setTimeLeft(0);

    if (timerRef.current) clearInterval(timerRef.current);
    if (focused) inputRef.current?.focus();

    requestAnimationFrame(() => updateCursorPos(0));
  };

  // Effect: Reset when snippet or settings change
  useEffect(() => {
    resetSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippet.id, settings.mode, settings.timeDuration]);

  // Timer Logic (Time Mode)
  useEffect(() => {
    if (timerActive && settings.mode === "time" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive, settings.mode]);

  // Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        resetSession();
      }

      if (e.key === "Escape") {
        resetSession();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onNext]);

  // Keep cursor synced with typing
  useEffect(() => {
    updateCursorPos(input.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.length]);

  // Handle typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const now = Date.now();

    if (!startTime && value.length > 0) {
      setStartTime(now);
      if (settings.mode === "time") setTimerActive(true);
    }

    // Blink pause while typing
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 500);

    // Error tracking
    if (value.length > input.length) {
      const charIndex = value.length - 1;
      const expected = snippet.code[charIndex];
      const typed = value[charIndex];

      if (expected && typed !== expected) {
        setMistakes((m) => m + 1);
        setMissedChars((prev) => ({
          ...prev,
          [expected]: (prev[expected] || 0) + 1,
        }));
      }
    }

    if (value.length <= snippet.code.length) {
      setInput(value);

      // Completion (Non-Time Mode)
      if (value.length === snippet.code.length && settings.mode !== "time") {
        finishTest();
      }
    }
  };

  const handleFocus = () => {
    inputRef.current?.focus();
    setFocused(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header: Mode-Specific Info */}
      <div className="flex justify-between items-end px-2 select-none">
        <div className="flex items-center gap-4 text-xs font-mono text-primary/80">
          {settings.mode === "time" && <div className="text-xl font-bold text-primary">{timeLeft}s</div>}
          {settings.mode === "count" && (
            <div className="text-xl font-bold text-primary">
              {input.length}/{snippet.code.length}
            </div>
          )}
        </div>

        <div className="flex gap-6 text-xs font-mono font-medium tracking-wider text-muted-foreground opacity-80 mb-1">
          {startTime && (
            <>
              <span className={clsx("transition-colors duration-300", currWpm > 0 ? "text-primary" : "")}>
                WPM {currWpm}
              </span>
              <span>ACC {currAcc}%</span>
            </>
          )}
        </div>
      </div>

      {/* Editor */}
      <div
        className="relative font-mono text-lg leading-relaxed outline-none cursor-text min-h-[300px] bg-black/20 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5"
        onClick={handleFocus}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 h-[2px] bg-primary/20 w-full z-20">
          <motion.div
            className="h-full bg-primary shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            initial={{ width: 0 }}
            animate={{ width: `${(input.length / Math.max(1, snippet.code.length)) * 100}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>

        {/* Hidden input for capturing typing */}
        <input
          ref={inputRef}
          type="text"
          className="absolute inset-0 opacity-0 cursor-default z-0 h-full w-full"
          value={input}
          onChange={handleChange}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        <div className="flex min-h-[300px] max-h-[60vh] overflow-auto">
          {/* Gutter */}
          <div className="sticky top-0 left-0 z-10 flex-none w-12 bg-black/10 border-r border-white/5 py-6 text-right select-none h-full">
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i} className="text-muted-foreground/30 text-sm leading-relaxed pr-3 font-mono">
                {i + 1}
              </div>
            ))}
          </div>

          <div ref={containerRef} className="relative flex-1 py-0 px-0 outline-none">
            {/* Cursor */}
            {focused && (
              <motion.div
                className="absolute bg-[var(--cursor)] w-[2px] h-[1.6em] rounded-sm z-30 pointer-events-none shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                initial={false}
                animate={{
                  x: cursorPos.x,
                  y: cursorPos.y,
                  opacity: isTyping ? 1 : [1, 0, 1],
                }}
                transition={{
                  x: { type: "spring", stiffness: 900, damping: 40, mass: 0.2 },
                  y: { type: "spring", stiffness: 900, damping: 40, mass: 0.2 },
                  opacity: { duration: 0.9, repeat: Infinity, ease: "linear", delay: isTyping ? 0 : 0.4 },
                }}
              />
            )}

            {/* Code */}
            <pre className="preserve-code whitespace-pre-wrap break-normal font-inherit m-0 p-0 relative z-10 text-muted-foreground/50">
              {chars.map((item, index) => {
                const isTyped = index < input.length;
                const isCorrect = isTyped && input[index] === item.char;

                let colorVar = "var(--foreground)";
                if (!isTyped) {
                  switch (item.type) {
                    case "keyword":
                      colorVar = "var(--token-keyword)";
                      break;
                    case "function":
                      colorVar = "var(--token-function)";
                      break;
                    case "string":
                      colorVar = "var(--token-string)";
                      break;
                    case "number":
                      colorVar = "var(--token-number)";
                      break;
                    case "comment":
                      colorVar = "var(--token-comment)";
                      break;
                    case "punctuation":
                      colorVar = "var(--token-punctuation)";
                      break;
                    default:
                      colorVar = "var(--foreground)";
                  }
                }

                return (
                  <span
                    key={index}
                    data-index={index}
                    className={clsx(
                      // ✅ THIS FIXES BASELINE MISMATCH (main reason your caret looked lower)
                      "inline-block align-top",
                      isTyped &&
                        !isCorrect &&
                        "underline decoration-pink-500/50 underline-offset-4 text-pink-400"
                    )}
                    style={{
                      color: isTyped ? (isCorrect ? "var(--foreground)" : undefined) : colorVar,
                      opacity: isTyped ? 1 : 0.6,
                      textShadow: isTyped && !isCorrect ? "0 0 8px rgba(244, 114, 182, 0.4)" : "none",
                    }}
                  >
                    {item.char}
                  </span>
                );
              })}
            </pre>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-30 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={resetSession}
            className="flex items-center gap-1 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          >
            <RotateCcw className="w-3 h-3" /> Restart
          </button>

          {onNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-1 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              Next <SkipForward className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Hint Footer */}
      <div className="flex justify-center gap-8 text-[10px] text-muted-foreground/30 uppercase tracking-widest font-medium pt-4 select-none">
        <span>Tab • Restart</span>
        <span>Esc • Reset</span>
        <span>Enter • Next</span>
      </div>
    </div>
  );
}