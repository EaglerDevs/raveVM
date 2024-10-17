class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class Lexer {
    constructor(input) {
        this.input = input;
        this.current = 0;
    }

    nextToken() {
        while (this.current < this.input.length) {
            const char = this.input[this.current];

            // Skip whitespace
            if (/\s/.test(char)) {
                this.current++;
                continue;
            }

            // Handle keywords and identifiers
            if (/[a-zA-Z]/.test(char)) {
                let start = this.current;
                while (/[a-zA-Z0-9]/.test(this.input[this.current])) {
                    this.current++;
                }
                const value = this.input.slice(start, this.current);
                return new Token('IDENTIFIER', value);
            }

            // Handle symbols
            if (char === '{') {
                this.current++;
                return new Token('LBRACE', '{');
            }
            if (char === '}') {
                this.current++;
                return new Token('RBRACE', '}');
            }
            if (char === ';') {
                this.current++;
                return new Token('SEMICOLON', ';');
            }
            if (char === '(') {
                this.current++;
                return new Token('LPAREN', '(');
            }
            if (char === ')') {
                this.current++;
                return new Token('RPAREN', ')');
            }
            if (char === '=') {
                this.current++;
                return new Token('ASSIGN', '=');
            }
            if (char === 'i' && this.input.substr(this.current, 1) === 'f') {
                this.current += 2;
                return new Token('IF', 'if');
            }
            // Add more keywords and symbols as needed...

            throw new Error(`Unexpected character: ${char}`);
        }

        return new Token('EOF', null);
    }
}

class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.nextToken();
    }

    parse() {
        const statements = [];
        while (this.currentToken.type !== 'EOF') {
            statements.push(this.statement());
        }
        return statements;
    }

    statement() {
        if (this.currentToken.type === 'IF') {
            return this.ifStatement();
        }
        // Handle other statements...
        throw new Error('Unknown statement type');
    }

    ifStatement() {
        this.eat('IF');
        this.eat('LPAREN');
        const condition = this.currentToken.value; // Simplified for demo
        this.eat('IDENTIFIER'); // consume condition
        this.eat('RPAREN');
        this.eat('LBRACE');
        const body = this.body();
        this.eat('RBRACE');
        return { type: 'IF', condition, body };
    }

    body() {
        // Simplified for demo, would parse multiple statements
        const statement = this.currentToken.value; // Placeholder
        this.eat('IDENTIFIER'); // consume statement
        this.eat('SEMICOLON');
        return [statement];
    }

    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            const token = this.currentToken;
            this.currentToken = this.lexer.nextToken();
            return token;
        }
        throw new Error(`Expected token type: ${tokenType}, got: ${this.currentToken.type}`);
    }
}

class JavaToPythonConverter {
    convert(javaCode) {
        const lexer = new Lexer(javaCode);
        const parser = new Parser(lexer);
        const ast = parser.parse();
        return this.generatePython(ast);
    }

    generatePython(statements) {
        return statements.map(statement => {
            if (statement.type === 'IF') {
                return `if ${statement.condition}:\n    ${statement.body.join('\n    ')}`;
            }
            // Handle other types...
        }).join('\n');
    }
}

// Add event listener to the "Translate" button
document.getElementById('translateBtn').addEventListener('click', function() {
    const javaCode = document.getElementById('javaInput').value; // Get the Java input
    const converter = new JavaToPythonConverter();
    const pythonCode = converter.convert(javaCode); // Translate Java to Python
    document.getElementById('pythonOutput').textContent = pythonCode; // Display Python code
});

// Add event listener for the "Copy Code" button
document.getElementById('copyBtn').addEventListener('click', function() {
    const pythonCode = document.getElementById('pythonOutput').textContent;
    navigator.clipboard.writeText(pythonCode).then(function() {
        alert('Python code copied to clipboard!');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
});
