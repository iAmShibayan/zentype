import React from 'react';
import { TestMode, TestSettings, SnippetCategory } from '@/lib/types';
import clsx from 'clsx';
import { Clock, Hash, AlignJustify, Infinity as InfinityIcon, Type, FileCode, Hash as HashIcon, Quote } from 'lucide-react';

interface ControlsProps {
    settings: TestSettings;
    onSettingsChange: (newSettings: Partial<TestSettings>) => void;
    activeCategory: SnippetCategory;
    onCategoryChange: (cat: SnippetCategory) => void;
}

export function Controls({ settings, onSettingsChange, activeCategory, onCategoryChange }: ControlsProps) {

    const modes: { id: TestMode; icon: React.ReactNode; label: string }[] = [
        { id: 'time', icon: <Clock className="w-3 h-3" />, label: 'Time' },
        { id: 'count', icon: <Type className="w-3 h-3" />, label: 'Count' },
        { id: 'zen', icon: <InfinityIcon className="w-3 h-3" />, label: 'Zen' },
    ];

    const timeOptions = [15, 30, 60, 120];
    const countOptions = [10, 25, 50, 100];

    return (
        <div className="flex flex-col items-center gap-4 mb-8 bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-sm w-full max-w-2xl mx-auto transition-all hover:bg-black/30">

            {/* Top Row: Modes & Toggles */}
            <div className="flex flex-wrap items-center justify-center gap-6 w-full">

                {/* Modes */}
                <div className="flex bg-muted/20 p-1 rounded-lg">
                    {modes.map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => onSettingsChange({ mode: mode.id })}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                settings.mode === mode.id
                                    ? "bg-foreground text-background shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {mode.icon}
                            <span>{mode.label}</span>
                        </button>
                    ))}
                </div>

                <div className="w-[1px] h-6 bg-white/10 hidden sm:block"></div>

                {/* Difficulty */}
                <div className="flex bg-muted/20 p-1 rounded-lg">
                    {(['easy', 'medium', 'hard'] as const).map(diff => (
                        <button
                            key={diff}
                            onClick={() => onSettingsChange({ difficulty: diff })}
                            className={clsx(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                                settings.difficulty === diff
                                    ? "bg-foreground text-background shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {diff}
                        </button>
                    ))}
                </div>

                <div className="w-[1px] h-6 bg-white/10 hidden sm:block"></div>

                {/* Difficulty / Toggles */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onSettingsChange({ allowPunctuation: !settings.allowPunctuation })}
                        className={clsx(
                            "flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent",
                            settings.allowPunctuation
                                ? "text-primary bg-primary/10 border-primary/20"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        title="Toggle Punctuation"
                    >
                        <Quote className="w-3 h-3" />
                        <span>@#</span>
                    </button>

                    <button
                        onClick={() => onSettingsChange({ allowNumbers: !settings.allowNumbers })}
                        className={clsx(
                            "flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent",
                            settings.allowNumbers
                                ? "text-primary bg-primary/10 border-primary/20"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        title="Toggle Numbers"
                    >
                        <HashIcon className="w-3 h-3" />
                        <span>123</span>
                    </button>
                </div>
            </div>

            {/* Bottom Row: Context Options (Duration / Count) */}
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground animate-in fade-in slide-in-from-top-1 duration-300">
                {settings.mode === 'time' && (
                    <div className="flex gap-1 bg-muted/10 p-1 rounded-full px-2">
                        {timeOptions.map(t => (
                            <button
                                key={t}
                                onClick={() => onSettingsChange({ timeDuration: t as any })}
                                className={clsx(
                                    "px-2 py-0.5 rounded-full transition-colors",
                                    settings.timeDuration === t ? "text-foreground font-bold" : "hover:text-foreground/80"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                        <span className="opacity-50 ml-1">seconds</span>
                    </div>
                )}

                {settings.mode === 'count' && (
                    <div className="flex gap-1 bg-muted/10 p-1 rounded-full px-2">
                        {countOptions.map(c => (
                            <button
                                key={c}
                                onClick={() => onSettingsChange({ countAmount: c as any })}
                                className={clsx(
                                    "px-2 py-0.5 rounded-full transition-colors",
                                    settings.countAmount === c ? "text-foreground font-bold" : "hover:text-foreground/80"
                                )}
                            >
                                {c}
                            </button>
                        ))}
                        <span className="opacity-50 ml-1">words/lines</span>
                    </div>
                )}

                {settings.mode === 'zen' && (
                    <span className="opacity-60 italic">Type forever. No limits.</span>
                )}
            </div>

        </div>
    );
}
