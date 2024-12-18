const crypto = require('crypto');
const fs = require('fs');

function generateHash(content) {
    const hash = crypto.createHash('sha256');
    hash.update(content);
    return `'sha256-${hash.digest('base64')}'`;
}

function processHTMLFile(filename) {
    console.log(`\nProcessing ${filename}...`);
    const html = fs.readFileSync(filename, 'utf8');

    // Find all scripts (both inline and external)
    const inlineScriptRegex = /<script>([^<]*)<\/script>/g;
    const externalScriptRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/g;
    const styleRegex = /<style>([^<]*)<\/style>/g;

    const scripts = [];
    const externalScripts = new Set();
    const styles = [];

    let match;
    while ((match = inlineScriptRegex.exec(html)) !== null) {
        const content = match[1].trim();
        if (content) {
            scripts.push({
                content: content,
                hash: generateHash(content)
            });
        }
    }

    while ((match = externalScriptRegex.exec(html)) !== null) {
        externalScripts.add(match[1]);
    }

    while ((match = styleRegex.exec(html)) !== null) {
        const content = match[1].trim();
        if (content) {
            styles.push({
                content: content,
                hash: generateHash(content)
            });
        }
    }

    console.log('Inline Scripts:');
    scripts.forEach((script, index) => {
        console.log(`\n--- Script ${index + 1} ---`);
        console.log('Hash:', script.hash);
        console.log('Content:\n', script.content);
    });

    console.log('\nExternal Scripts:');
    externalScripts.forEach(src => {
        console.log(src);
    });

    console.log('\nStyles:');
    styles.forEach((style, index) => {
        console.log(`\n--- Style ${index + 1} ---`);
        console.log('Hash:', style.hash);
        console.log('Content:\n', style.content);
    });

    return { scripts, externalScripts, styles };
}

// Process both files
const files = ['index.html', 'daas-special.html'];
const allHashes = new Set();
const allExternalScripts = new Set();

files.forEach(file => {
    const { scripts, externalScripts, styles } = processHTMLFile(file);
    scripts.forEach(script => allHashes.add(script.hash));
    styles.forEach(style => allHashes.add(style.hash));
    externalScripts.forEach(src => allExternalScripts.add(src));
});

console.log('\nAll unique hashes for CSP:');
console.log([...allHashes].join(' \\\n'));

console.log('\nAll external scripts to include in CSP:');
console.log([...allExternalScripts].join('\n')); 