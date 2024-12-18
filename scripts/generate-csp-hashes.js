const crypto = require('crypto');
const fs = require('fs');

function generateHash(content) {
    const hash = crypto.createHash('sha256');
    hash.update(content);
    return `'sha256-${hash.digest('base64')}'`;
}

// Read your HTML file
const html = fs.readFileSync('index.html', 'utf8');

// Find all inline scripts and styles
const scriptRegex = /<script>([^<]*)<\/script>/g;
const styleRegex = /<style>([^<]*)<\/style>/g;

const scripts = [];
const styles = [];

let match;
while ((match = scriptRegex.exec(html)) !== null) {
    const content = match[1].trim();
    scripts.push({
        content: content,
        hash: generateHash(content)
    });
}

while ((match = styleRegex.exec(html)) !== null) {
    const content = match[1].trim();
    styles.push({
        content: content,
        hash: generateHash(content)
    });
}

console.log('Scripts:');
scripts.forEach((script, index) => {
    console.log(`\n--- Script ${index + 1} ---`);
    console.log('Hash:', script.hash);
    console.log('Content:\n', script.content);
});

console.log('\nStyles:');
styles.forEach((style, index) => {
    console.log(`\n--- Style ${index + 1} ---`);
    console.log('Hash:', style.hash);
    console.log('Content:\n', style.content);
});

// Optionally, write to files
scripts.forEach((script, index) => {
    fs.writeFileSync(`js/script${index + 1}.js`, script.content);
});

styles.forEach((style, index) => {
    fs.writeFileSync(`css/style${index + 1}.css`, style.content);
}); 