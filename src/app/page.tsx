"use client";

import { useState, useMemo, useEffect } from "react";
import { TypingArea } from "@/components/TypingArea";
import { StatsBoard } from "@/components/StatsBoard";
import { Controls } from "@/components/Controls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { snippets } from "@/lib/snippets";
import { SnippetCategory, TestSettings, Stats } from "@/lib/types";
import { generateTestContent } from "@/lib/test-utils";
import { motion, AnimatePresence } from "framer-motion";
import clsx from 'clsx';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<SnippetCategory>('random');

  // Default Settings
  const [settings, setSettings] = useState<TestSettings>({
    mode: 'time',
    timeDuration: 30,
    countAmount: 25,
    allowPunctuation: false,
    allowNumbers: false,
    difficulty: 'easy'
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('zenTypeSettings');
    if (saved) {
      try {
        setSettings({ ...settings, ...JSON.parse(saved) });
      } catch (e) { console.error('Failed to load settings', e); }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('zenTypeSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (partial: Partial<TestSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const [snippetIndex, setSnippetIndex] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);

  // Filter snippets based on active category and difficulty
  const filteredSnippets = useMemo(() => {
    let result = snippets;

    // 1. Filter by Category
    if (activeCategory !== 'random') {
      result = result.filter(s => s.category === activeCategory);
    }

    // 2. Filter by Difficulty
    result = result.filter(s => s.difficulty === settings.difficulty);

    // Fallback if no snippets match
    if (result.length === 0) {
      const fallback = snippets.filter(s => s.difficulty === settings.difficulty);
      if (fallback.length > 0) return fallback;
      return snippets;
    }
    return result;
  }, [activeCategory, settings.difficulty]);

  // Current snippet (safe access)
  const currentSnippet = filteredSnippets[snippetIndex % filteredSnippets.length] || snippets[0];

  const handleComplete = (result: Stats) => {
    // In Zen mode, we might not trigger this unless manually stopped? 
    // But TypingArea handles that.
    setTimeout(() => {
      setStats(result);
    }, 500);
  };

  const handleNext = () => {
    setStats(null);
    const nextIndex = Math.floor(Math.random() * filteredSnippets.length);
    setSnippetIndex(nextIndex);
  };

  // Safe check if snippets exist
  if (!currentSnippet) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading resources... or no snippets found.</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 relative overflow-hidden bg-background text-foreground">

      <div className="z-10 w-full max-w-4xl">
        <header className="mb-12 text-center space-y-3 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground/90">ZenType</h1>
          <p className="text-muted-foreground text-sm tracking-wide">Flow state for your fingers.</p>
        </header>

        {/* Filters & Controls */}
        {!stats && (
          <Controls
            settings={settings}
            onSettingsChange={updateSettings}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}

        <AnimatePresence mode="wait">
          {!stats ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="bg-muted/30 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-md border border-white/5 ring-1 ring-white/5">
                <div className="mb-8 flex justify-between items-center text-xs text-muted-foreground uppercase tracking-widest font-medium opacity-70">
                  <div className="flex gap-2">
                    <span className="bg-muted px-2 py-1 rounded">{currentSnippet.language}</span>
                    <span className={clsx("px-2 py-1 rounded border border-white/10",
                      currentSnippet.difficulty === 'easy' ? 'text-green-400' :
                        currentSnippet.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                    )}>
                      {currentSnippet.difficulty}
                    </span>
                  </div>
                  <span>{currentSnippet.description}</span>
                </div>

                <TypingArea
                  key={currentSnippet.id + JSON.stringify(settings)}
                  snippet={{
                    ...currentSnippet,
                    code: generateTestContent(currentSnippet, settings)
                  }}
                  settings={settings}
                  onComplete={handleComplete}
                  onNext={handleNext}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="bg-muted/30 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-md border border-white/5 ring-1 ring-white/5">
                <h2 className="text-center text-xl font-semibold mb-6 text-foreground/80">Session Complete</h2>
                <StatsBoard stats={stats} onNext={handleNext} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-20 text-center text-xs text-muted-foreground/40 transition-opacity hover:opacity-100 duration-500">
          <span>Type the code exactly as shown. Focus on accuracy.</span>
        </footer>
      </div>
    </main>
  );
}
