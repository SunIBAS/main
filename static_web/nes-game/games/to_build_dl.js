const fs = require('fs');
const fc = require('./fc.json');

let dls = [];
fc.forEach(_ => {
    if (_.nes.length > 100) {
        console.log(_.url);
    } else {
        let n = _.nes.split('/');
        dls.push(`if not EXIST "${n[n.length - 1]}" wget --no-check-certificate "${_.nes}"`);
        n = _.img.split('/');
        dls.push(`if not EXIST "${n[n.length - 1]}" wget --no-check-certificate "${_.img}"`);
    }
});

fs.writeFileSync('./dl.bat',dls.join('\r\n'),'utf-8');
