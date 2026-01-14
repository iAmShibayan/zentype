"use client";

import { motion } from "framer-motion";
import { Stats } from "@/lib/types";
import { RotateCcw, SkipForward, AlertOctagon, Zap, Target, Clock as ClockIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatsBoardProps {
    stats: Stats;
    onNext: () => void;
}

export function StatsBoard({ stats, onNext }: StatsBoardProps) {
    // Sort missed chars
    const topMissed = Object.entries(stats.missedChars)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="col-span-2 md:col-span-1 bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col justify-between group hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        <Zap className="w-3 h-3" /> WPM
                    </div>
                    <div className="text-5xl font-bold text-primary tabular-nums mt-2">{stats.wpm}</div>
                    <div className="text-xs text-muted-foreground/50">Raw: {stats.rawWpm}</div>
                </div>

                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col justify-between group hover:border-green-500/20 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        <Target className="w-3 h-3" /> ACC
                    </div>
                    <div className="text-4xl font-bold text-foreground tabular-nums mt-2">{stats.accuracy}%</div>
                </div>

                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col justify-between group hover:border-blue-500/20 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        <ClockIcon className="w-3 h-3" /> Time
                    </div>
                    <div className="text-4xl font-bold text-foreground tabular-nums mt-2">{(stats.time / 1000).toFixed(1)}s</div>
                </div>

                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col justify-between group hover:border-red-500/20 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        <AlertOctagon className="w-3 h-3" /> Errors
                    </div>
                    <div className="text-4xl font-bold text-red-400 tabular-nums mt-2">{stats.errors}</div>
                </div>

            </div>

            {/* Weak Keys */}
            {topMissed.length > 0 && (
                <div className="bg-black/10 rounded-xl p-4 border border-white/5">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Most Missed Characters</div>
                    <div className="flex gap-4">
                        {topMissed.map(([char, count]) => (
                            <div key={char} className="flex flex-col items-center gap-1">
                                <div className="w-10 h-10 flex items-center justify-center bg-red-400/10 text-red-400 rounded-lg text-lg font-mono border border-red-400/20">
                                    {char === ' ' ? '␣' : char}
                                </div>
                                <span className="text-[10px] text-muted-foreground">{count}x</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-4 pt-8">
                <button
                    onClick={() => window.location.reload()} // Simple restart, or we can add a restart prop
                    className="flex items-center gap-2 px-6 py-3 bg-muted/10 hover:bg-muted/20 border border-white/5 rounded-xl text-sm font-medium transition-all"
                >
                    <RotateCcw className="w-4 h-4" /> Restart Test
                </button>
                <button
                    onClick={onNext}
                    className="flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-sm font-medium transition-all shadow-lg shadow-white/5"
                >
                    Next Snippet <SkipForward className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
