const fs = require('fs');
const path = require('path');

const directory = 'src';
const searchString = 'http://localhost:5000';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(searchString)) {
    console.log('Processing: ' + filePath);
    
    // Replace URL in different contexts
    // 1. fetch('http://localhost:5000/api...') -> fetch(`${API_URL}/api...`)
    // 2. fetch(`http://localhost:5000/api...`) -> fetch(`${API_URL}/api...`)
    // 3. 'http://localhost:5000/api...' -> `${API_URL}/api...`
    
    // Let's do a smart regex replacement
    content = content.replace(/['"]http:\/\/localhost:5000([^'"]*)['"]/g, '`${API_URL}$1`');
    content = content.replace(/http:\/\/localhost:5000/g, '${API_URL}');
    
    // Add import statement at the top
    // Determine relative path to constants.ts
    // For Windows, path.sep is \
    const relativeDepth = filePath.split(path.sep).length - 2; // -1 for src, -1 for filename
    let importPath = '';
    if (relativeDepth === 0) {
        importPath = './constants';
    } else {
        importPath = '../'.repeat(relativeDepth) + 'constants';
    }
    
    // Check if API_URL is already imported
    if (!content.includes('import { API_URL }') && !content.includes('import {API_URL}')) {
        // Find the last import statement
        const importMatch = content.match(/^import .*?from .*?['"];?$/gm);
        if (importMatch) {
            const lastImport = importMatch[importMatch.length - 1];
            content = content.replace(lastImport, lastImport + '\nimport { API_URL } from \'' + importPath + '\';');
        } else {
            content = 'import { API_URL } from \'' + importPath + '\';\n' + content;
        }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      traverse(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      processFile(filePath);
    }
  }
}

traverse(directory);
console.log('Done refactoring!');
