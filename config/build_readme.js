module.exports = function (projects) {
    let readme = `# main
我的所有静态页面数据将放在这个位置

# 站内链接

| Link | Descript |
| -------- | -------- |
`;
    let lines = [];
    // | Data 1   | Data 2   |
    for (let vue in projects.vue) {
        lines.push(`| [${sta.name}](${sta.path}) | ${sta.description} |`);
    }
    for (let name in projects.static) {
        let sta = projects.static[name];
        lines.push(`| [${sta.name}](${sta.path}) | ${sta.description} |`);
    }

    lines.push('');
    lines.push('## 外部链接');
    lines.push('');
    lines.push('| Link | Descript |');
    lines.push('| -------- | -------- |');
    for (let name in projects.other) {
        let sta = projects.other[name];
        lines.push(`| [${sta.name}](${sta.path}) | ${sta.description} |`);
    }
    return `${readme}${lines.join("\n")}`;
};