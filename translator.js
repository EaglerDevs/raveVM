console.log(` 
ORPHAN \n
SUCKS \n
`)
function RaveVM(javaCode) {
    let indentLevel = 0; // Track current indentation level
    let pythonCode = javaCode
        .replace(/^\s*/gm, '') // Trim leading spaces for better control over indentation
        .replace(/\{\s*/g, function() {
            indentLevel++;
            return '\n' + ' '.repeat(indentLevel * 4);
        })
        .replace(/\}\s*/g, function() {
            indentLevel--;
            return '\n' + ' '.repeat(indentLevel * 4);
        })
        .replace(/if\s*\((.*?)\)\s*\{?/g, function(_, condition) {
            return '\n' + ' '.repeat(indentLevel * 4) + 'if ' + condition + ':';
        })
        .replace(/else\s*\{?/g, function() {
            return '\n' + ' '.repeat(indentLevel * 4) + 'else:';
        })
        .replace(/else\s+if\s*\((.*?)\)\s*\{?/g, function(_, condition) {
            return '\n' + ' '.repeat(indentLevel * 4) + 'elif ' + condition + ':';
        })
        .replace(/public\s+class\s+(\w+)/g, 'class $1:') // Class declarations
        .replace(/public\s+(\w+)\s+(\w+)\s*\((.*?)\)\s*\{/g, function(_, returnType, methodName, args) {
            return 'def ' + methodName + '(' + args + '):'; // Method declarations
        })
        .replace(/public\s+static\s+void\s+main\s*\(String\[\]\s*(\w+)\)\s*\{/g, 'if __name__ == "__main__":') // Main method
        .replace(/new\s+ArrayList<(\w+)>\s+(\w+)\s*=\s*new ArrayList<\1>\(\);/g, '$2 = []') // ArrayList to list
        .replace(/new\s+HashMap<(\w+),\s*(\w+)>\s+(\w+)\s*=\s*new HashMap<\1,\2>\(\);/g, '$3 = {}') // HashMap to dict
        .replace(/new\s+(\w+)\[\d+\]/g, function(_, type) {
            return '[]'; // Array initialization
        })
        .replace(/(\w+)\s+\[\]\s+(\w+)\s*=\s*new (\w+)\[\d+\];/g, '$2 = [$1 for _ in range($3)]') // Array declaration
        .replace(/private\s+/g, '') // Remove private keyword
        .replace(/protected\s+/g, '') // Remove protected keyword
        .replace(/public\s+/g, '') // Remove public keyword
        .replace(/final\s+/g, '') // Remove final keyword (in most cases, just treat as regular variable)
        .replace(/static\s+/g, '') // Remove static keyword (may need special handling later)
        .replace(/void\s+/g, '') // Remove void keyword
        .replace(/int\s+/g, '') // Remove int (Python doesn't use type declarations like this)
        .replace(/boolean\s+/g, 'bool ') // Translate boolean to Python's bool
        .replace(/String\s+/g, 'str ') // Convert String to Python's str
        .replace(/(\w+)\s+(\w+)\s*=\s*(.*?);/g, '$1 $2 = $3') // Variable declarations
        .replace(/System\.out\.println\((.+?)\);/g, 'print($1)') // System.out.println -> print
        .replace(/return\s+(.+?);/g, 'return $1') // return statement
        .replace(/(\w+)\s*\(\s*(.*?)\s*\)/g, 'def $1($2):') // Function declarations
        .replace(/this\.(\w+)\s*=\s*(.+?);/g, 'self.$1 = $2') // "this" references in classes
        .replace(/(\w+)\s*\[(\d+)\]/g, '$1[$2]') // Array access
        .replace(/break;/g, 'break') // break statement
        .replace(/continue;/g, 'continue') // continue statement
        .replace(/throw\s+new\s+(\w+)\((.*?)\);/g, 'raise $1($2)') // Exception handling (throw -> raise)
        .replace(/try\s*\{([\s\S]*?)\}\s*catch\s*\((\w+)\)\s*\{([\s\S]*?)\}/g, function(_, tryBlock, exceptionType, catchBlock) {
            return `try:\n${indentLevel * 4}    ${tryBlock}\n${' '.repeat(indentLevel * 4)}except ${exceptionType}:\n${' '.repeat(indentLevel * 4)}    ${catchBlock}`;
        })
        .replace(/super\(\)/g, 'super()') // super() calls
        .replace(/extends\s+(\w+)/g, 'extends $1') // Inheritance (handling extends)
        .replace(/implements\s+(\w+)/g, 'implements $1') // Implements interfaces
        .replace(/interface\s+(\w+)\s*\{/g, 'class $1(ABC):') // Interfaces to Python ABC
        .replace(/abstract\s+class\s+(\w+)/g, 'class $1(ABC):') // Abstract class to Python ABC class
        .replace(/synchronized\s+/g, '') // Remove synchronized (Python doesn't have synchronized blocks)
        .replace(/final\s+/g, '') // Ignore final keyword (Python doesn't support this)
        .replace(/(\w+)\s+(\w+)\s*=\s*new\s+(\w+)\[\d+\];/g, '$2 = [$1 for _ in range($3)]') // Arrays with size
        .replace(/for\s*\((.*?)\)\s*\{/g, function(_, condition) {
            return '\n' + ' '.repeat(indentLevel * 4) + 'for ' + condition + ':';
        })
        .replace(/while\s*\((.*?)\)\s*\{/g, function(_, condition) {
            return '\n' + ' '.repeat(indentLevel * 4) + 'while ' + condition + ':';
        })
        .replace(/switch\s*\((.*?)\)\s*\{/g, function(_, condition) {
            return '\n' + ' '.repeat(indentLevel * 4) + 'match ' + condition + ':';
        })
        .replace(/case\s+(\w+)\s*:/g, function(_, caseValue) {
            return '\n' + ' '.repeat(indentLevel * 4) + '    case ' + caseValue + ':';
        })
        .replace(/default\s*:/g, function() {
            return '\n' + ' '.repeat(indentLevel * 4) + '    default:';
        })
        .replace(/return\s+(\w+)\s*;/g, 'return $1') // Return statement
        .replace(/(\w+)\s*\[(\d+)\]/g, '$1[$2]') // Array access
        .replace(/(\w+)\s+\[\]\s+(\w+)\s*=\s*new\s+(\w+)\[\d+\];/g, '$2 = [$1 for _ in range($3)]') // Arrays
        .replace(/(\w+)\s*=\s*new\s+(\w+)\(\);/g, '$1 = $2()') // Object initialization (new Object())
        .replace(/(\w+)\s+\[(\d+)\]/g, '$1[$2]') // Array access
        .replace(/public\s+(\w+)\s+(\w+)\s*\((.*?)\)\s*\{/g, function(_, returnType, methodName, args) {
            return 'def ' + methodName + '(' + args + '):'; // Methods
        })
        .replace(/default\s*:/g, 'else:') // Default case in switch (converted to else)
        .replace(/private\s+(\w+)\s+(\w+)\s*=\s*new\s+(\w+)\(\);/g, '$2 = $3()') // Private object instantiation
        .replace(/(\w+)\s+\[\]\s+(\w+)\s*=\s*new\s+(\w+)\[\d+\];/g, '$2 = [$1 for _ in range($3)]') // Array declaration

    return pythonCode.trim(); // Return trimmed code
}
