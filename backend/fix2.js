const fs = require('fs');
const filePath = 'C:/ALTERNANCE/Maison_Love_Room/backend/src/controllers/adminController.ts';
let content = fs.readFileSync(filePath, 'utf8');
let lines = content.split('\n');

// Lines 1515 to 1554 (inclusive) are corrupted.
// Array indices: 1514 to 1553
lines.splice(1514, 1554 - 1514 + 1);

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Fixed lines successfully!');
