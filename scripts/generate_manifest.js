const fs = require('fs');
const path = require('path');

const pdfDir = path.join(__dirname, '../pdfs');
const outputFile = path.join(__dirname, '../manifest.json');

// Ensure pdf directory exists
if (!fs.existsSync(pdfDir)) {
    console.log('Creating pdfs directory...');
    fs.mkdirSync(pdfDir);
}

const files = fs.readdirSync(pdfDir);
const articles = [];

files.forEach(file => {
    if (path.extname(file).toLowerCase() === '.pdf') {
        const filePath = path.join(pdfDir, file);
        const stats = fs.statSync(filePath);

        articles.push({
            name: file,
            path: `pdfs/${file}`,
            date: stats.mtime, // Last modified time
            size: stats.size
        });
    }
});

// Sort by date descending
articles.sort((a, b) => b.date - a.date);

fs.writeFileSync(outputFile, JSON.stringify(articles, null, 2));
console.log(`Manifest generated with ${articles.length} articles.`);
