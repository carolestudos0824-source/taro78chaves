
import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const terms = [/ XP\b/g, /xpTotal/gi, /totalXp/gi, /"XP total"/gi, /"XP"/gi, /"xp"/gi, /faltam [0-9]+ XP/gi, /conquistou XP/gi, /ganhar XP/gi];

walk('src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
     let content = fs.readFileSync(filePath, 'utf8');
     let original = content;
     
     // Specific replacements
     content = content.replace(/XP Total/g, "Chaves conquistadas");
     content = content.replace(/XP do Nível/g, "Pontos do Nível");
     content = content.replace(/conquistou XP/g, "conquistou pontos");
     content = content.replace(/ganhar XP/g, "conquistar chaves");
     content = content.replace(/faltam ([0-9]+) XP/gi, "faltam $1 pontos");
     
     // Visual labels only (avoiding logic/variable names where possible but targetting strings)
     content = content.replace(/>XP</g, ">Pontos<");
     content = content.replace(/"XP"/g, '"Pontos"');
     content = content.replace(/'XP'/g, "'Pontos'");
     
     if (content !== original) {
       fs.writeFileSync(filePath, content);
       console.log(`Updated: ${filePath}`);
     }
  }
});
