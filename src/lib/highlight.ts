export type TokenType = 'keyword' | 'function' | 'string' | 'number' | 'comment' | 'punctuation' | 'text';

export interface Token {
    type: TokenType;
    content: string;
}

const keywords = new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'async', 'await', 'try', 'catch', 'import', 'export', 'from', 'class', 'extends', 'new', 'this', 'true', 'false', 'null', 'undefined'
]);

export function tokenize(code: string): Token[] {
    const tokens: Token[] = [];
    let current = 0;

    while (current < code.length) {
        const char = code[current];

        // Comments (single line)
        if (char === '/' && code[current + 1] === '/') {
            let value = '';
            while (current < code.length && code[current] !== '\n') {
                value += code[current];
                current++;
            }
            tokens.push({ type: 'comment', content: value });
            continue;
        }

        // Strings (single and double quotes, backticks)
        if (char === '"' || char === "'" || char === '`') {
            let value = char;
            current++;
            while (current < code.length && code[current] !== char) {
                if (code[current] === '\\') {
                    value += code[current]; // escape char
                    current++;
                }
                value += code[current];
                current++;
            }
            if (current < code.length) {
                value += code[current]; // closing quote
                current++;
            }
            tokens.push({ type: 'string', content: value });
            continue;
        }

        // Numbers
        if (/[0-9]/.test(char)) {
            let value = '';
            while (current < code.length && /[0-9.]/.test(code[current])) {
                value += code[current];
                current++;
            }
            tokens.push({ type: 'number', content: value });
            continue;
        }

        // Identifiers (keywords, functions, variables)
        if (/[a-zA-Z_$]/.test(char)) {
            let value = '';
            while (current < code.length && /[a-zA-Z0-9_$]/.test(code[current])) {
                value += code[current];
                current++;
            }

            if (keywords.has(value)) {
                tokens.push({ type: 'keyword', content: value });
            } else if (code[current] === '(') {
                // rough heuristic for function calls
                tokens.push({ type: 'function', content: value });
            } else {
                tokens.push({ type: 'text', content: value });
            }
            continue;
        }

        // Punctuation and Operators
        if (/[(){}\[\].,;=><!+\-*/&|?:]/.test(char)) {
            tokens.push({ type: 'punctuation', content: char });
            current++;
            continue;
        }

        // Whitespace
        if (/\s/.test(char)) {
            tokens.push({ type: 'text', content: char });
            current++;
            continue;
        }

        // Fallback
        tokens.push({ type: 'text', content: char });
        current++;
    }

    return tokens;
}
