const fs = require('fs');
const path = require('path');
const build_reaadme = require('./build_readme');
const {
    projects
} = require('./project_config');

let root = path.join(process.mainModule.filename,'./../../');
let readme = path.join(root, 'README.md');

fs.writeFileSync(readme, build_reaadme(projects), 'utf-8')


