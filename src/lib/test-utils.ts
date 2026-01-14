import { Snippet, TestSettings } from './types';

/**
 * Generates the test content string based on the active snippet and settings.
 * Handles:
 * - Count Mode: Repeats/Slices content to match word/line count (approx).
 * - Numbers Toggle: Removes digits if disabled.
 * - Punctuation Toggle: Removes symbols if disabled.
 */
export function generateTestContent(snippet: Snippet, settings: TestSettings): string {
    let content = snippet.code;

    // 1. Handle Count Mode
    // If we are in 'count' mode, we need to ensure the content roughly matches the target count.
    // For code, 'count' usually implies 'lines' or 'words'.
    // Given the options (10, 25, 50, 100), 'lines' makes sense for code, 'words' for prose.
    // Let's go with WORDS to be safe, as lines can vary wildly in length.
    if (settings.mode === 'count') {
        const targetCount = settings.countAmount;
        const words = content.split(/\s+/);

        if (words.length < targetCount) {
            // Repeat content until we have enough
            while (words.length < targetCount) {
                const extraWords = snippet.code.split(/\s+/);
                words.push(...extraWords);
            }
        }

        // Slice to exact count and join
        // We reject the join here because we want to preserve code structure if possible,
        // but slicing words destroys formatting.
        // A better approach for code might be repeating the whole block until we exceed the count, 
        // then just taking that string. preserving structure is better than exact word count for code.

        let result = snippet.code;
        while (result.split(/\s+/).length < targetCount) {
            result += '\n\n' + snippet.code;
        }
        // Limit to reasonably close to target to avoid infinite scroll
        // We won't slice exact words because it leaves dangling "fun" or "cons"
        content = result;
    }

    // 2. Handle Numbers Toggle (Allows 0-9)
    if (!settings.allowNumbers) {
        // Strip numbers if disabled
        content = content.replace(/[0-9]/g, '');
    } else {
        // INJECT numbers if enabled
        // We want to sprinkle numbers into identifiers to ensure practice
        const keywords = new Set([
            'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
            'do', 'switch', 'case', 'break', 'continue', 'default', 'try', 'catch',
            'finally', 'throw', 'class', 'extends', 'super', 'this', 'new', 'import',
            'export', 'from', 'as', 'async', 'await', 'void', 'typeof', 'instanceof',
            'delete', 'in', 'of', 'true', 'false', 'null', 'undefined', 'console', 'log'
        ]);

        // Regex to find words (identifiers)
        content = content.replace(/\b[a-zA-Z_]\w*\b/g, (match) => {
            // Skip keywords and short words
            if (keywords.has(match) || match.length < 3) return match;

            // 30% chance to append a number
            if (Math.random() < 0.3) {
                return match + Math.floor(Math.random() * 10);
            }
            return match;
        });
    }

    // 3. Handle Punctuation Toggle (Allows symbols)
    if (!settings.allowPunctuation) {
        // Keep letters, whitespace, and maybe basic structure?
        // If we remove {};() etc, code becomes just words.
        // Regex: Replace anything that IS NOT (Letter, Number, Whitespace) with empty string.
        // But wait, if allowNumbers is TRUE, we keep numbers.
        // So we keep [a-zA-Z0-9\s]

        content = content.replace(/[^a-zA-Z0-9\s]/g, '');

        // Cleanup double spaces created by removal
        content = content.replace(/  +/g, ' ');
    }

    // Trim start/end
    return content.trim();
}
