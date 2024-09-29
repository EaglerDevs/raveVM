function RaveVM(javaCode) {
    // Enhanced translation with more features
    let pythonCode = javaCode
        .replace(/public\s+/g, '') // Remove access modifiers
        .replace(/private\s+/g, '') // Remove private modifier
        .replace(/protected\s+/g, '') // Remove protected modifier
        .replace(/static\s+/g, '') // Remove static keyword
        .replace(/void\s+/g, '') // Remove void keyword
        .replace(/System\.out\.println\((.+?)\);/g, 'print($1)') // Translate print statements
        .replace(/;\s*$/g, '') // Remove semicolons
        .replace(/\{|\}/g, '') // Remove curly braces
        .replace(/(\w+)\s+(\w+)\s*=\s*(.+?);/g, '$1 $2 = $3') // Variable assignments
        .replace(/public class/g, 'class') // Class declaration
        .replace(/main\s*\(String\[\]\s*\w+\)\s*{/g, 'if __name__ == "__main__":') // Main method
        .replace(/for\s*\((.*?)\)\s*{/g, 'for $1:') // For loops
        .replace(/while\s*\((.*?)\)\s*{/g, 'while $1:') // While loops
        .replace(/if\s*\((.*?)\)\s*{/g, 'if $1:') // If statements
        .replace(/else\s*{/g, 'else:') // Else statements
        .replace(/else\s+if\s*\((.*?)\)\s*{/g, 'elif $1:') // Else if statements
        .replace(/return\s+(.+?);/g, 'return $1') // Return statements
        .replace(/int\s+/g, '') // Remove int keyword for simplicity
        .replace(/String\s+/g, '') // Remove String keyword for simplicity
        .replace(/boolean\s+/g, 'bool ') // Translate boolean type
        .replace(/(true|false)\s*;/g, '$1') // Boolean values
        .replace(/ArrayList<(\w+)>\s+(\w+)\s*=\s*new ArrayList<\1>\(\);/g, '$2 = []') // ArrayList to list
        .replace(/(\w+)\s+\[\]\s+(\w+)\s*=\s*new (\w+)\[\d+\];/g, '$2 = [$1 for _ in range(0)]') // Array declaration
        .replace(/this\.(\w+)\s*=\s*(.+?);/g, 'self.$1 = $2') // 'this' keyword handling for class attributes
        .replace(/(\w+)\s*\(\s*(.*?)\s*\)/g, 'def $1($2):') // Method declarations
        .replace(/new\s+(\w+)\s*\(\)/g, '$1()') // Object instantiation
        .replace(/(\w+)\s*\[(\d+)\]/g, '$1[$2]') // Array access
        .replace(/break;/g, 'break') // Break statement
        .replace(/continue;/g, 'continue') // Continue statement

    return pythonCode.trim(); // Return trimmed code
}

// Event listener for button click
document.getElementById("translateBtn").addEventListener("click", function() {
    const javaInput = document.getElementById("javaInput").value;
    const pythonOutput = RaveVM(javaInput);
    document.getElementById("pythonOutput").textContent = pythonOutput;
});
