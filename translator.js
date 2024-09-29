function RaveVM(javaCode) {
    // Basic translation with limited support
    let pythonCode = javaCode
        .replace(/public\s+/g, '') // Remove access modifiers
        .replace(/static\s+/g, '') // Remove static keyword
        .replace(/void\s+/g, '') // Remove void keyword
        .replace(/System\.out\.println\((.+?)\);/g, 'print($1)') // Translate print statements
        .replace(/;\s*$/g, '') // Remove semicolons
        .replace(/\{|\}/g, '') // Remove curly braces
        .replace(/(\w+)\s+(\w+)\s*=\s*(.+?);/g, '$1 $2 = $3') // Keep variable assignments
        .replace(/public class/g, 'class') // Keep class declaration
        .replace(/main\s*\(String\[\]\s*\w+\)\s*{/g, 'if __name__ == "__main__":'); // Translate main method

    return pythonCode.trim(); // Return trimmed code
}

// Example usage
const javaExample = `
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`;

const pythonResult = RaveVM(javaExample);
console.log(pythonResult);
