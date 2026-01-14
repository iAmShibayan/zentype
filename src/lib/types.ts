export type SnippetCategory = 'random' | 'arrays' | 'functions' | 'async' | 'objects' | 'dom';
export type SnippetDifficulty = 'easy' | 'medium' | 'hard';

export interface Snippet {
    id: string;
    code: string;
    language: 'javascript';
    category: SnippetCategory;
    difficulty: SnippetDifficulty;
    description?: string;
    hasNumbers?: boolean;
    hasPunctuation?: boolean;
}

export type TestMode = 'time' | 'count' | 'zen';

export interface TestSettings {
    mode: TestMode;
    timeDuration: 15 | 30 | 60 | 120;
    countAmount: 10 | 25 | 50 | 100;
    allowPunctuation: boolean;
    allowNumbers: boolean;
    difficulty: SnippetDifficulty;
}

export interface Stats {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    time: number; // ms
    errors: number;
    missedChars: Record<string, number>;
}
