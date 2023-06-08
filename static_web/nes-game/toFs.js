const games = require('./games/all.json');
const fs = require('fs');

const js = games.flatMap(_=>_).filter(_=>_.tag.includes('FC'));
fs.writeFileSync('./games/fc.json',JSON.stringify(js),'utf-8');
console.log(`len = ${js.length}`);
console.log(JSON.stringify(js[0],'','\t'));
