const type = {
    Vue: 'Vue',
    Static: './static_web/',
    Other: 'other'
};
class Project{
    constructor(path, name, description, _type) {
        this.type = type;
        this.path = '';
        if (_type === type.Vue) {} else if (_type === type.Static) {
            this.path = `${type.Static}/${path}`;
        } else if (_type === type.Other) {
            this.path = path;
        }
        this.name = name;
        this.description = description;
    }
}

const projects = {
    vue: {},
    static: {
        software: new Project("software.collection.html", "software", "软件分享", type.Static),
        bip39: new Project("bip39/bip39-standalone.html", "bip39", "生成加密货币 TOKEN 的工具", type.Static),
        FD: new Project("FakeData_xiaobai/index.html", "FD", "生成随机的虚假的训练变化曲线", type.Static),
        gallery: new Project("galleryAni/index.html", "Gallery", "动态相册", type.Static),
        IDCard: new Project("idcard/index.html", "IDCard", "动态生成身份证图片", type.Static),
        imageViewer: new Project("imageViewer/index.html", "imageViewer", "图片查看工具类效果", type.Static),
        ndsolve: new Project("ndsolve/index.html", "ndsolve", "使用JS 实现 Matlab 的 ndsolve ", type.Static),
        PDF: new Project("PDF/index.html", "PDF", "可用于自定义打印效果的图片转PDF工具", type.Static),
        "sunibas.cn.utils": new Project("sunibas.cn.utils/index.html", "sunibas.cn.utils", "我自己写的一些工具", type.Static),
        trans: new Project("trans/index.html", "translate", "翻译辅助工具", type.Static),
        map_fixed: new Project("map_fixed/index.html", "map_fixed", "用于手动校准”地图图片“的工具", type.Static),
        "nes-game": new Project("nes-game/index.html", "nes-game", "nes 游戏集合", type.Static),
        "vue-layui": new Project("vue-layui/index.html", "vue-layui", "使用 vue 和 layui 编写的框架 ", type.Static),
    },
    other: {
        "singleExe": new Project("https://github.com/IBAS0742/singleExe", "singleExe", "Windows下的单文工具", type.Other),
        "WebMapDev": new Project("WebMapDev/README.md", "WebMapDev", "自己开发的一些地图相关的插件", type.Static),
        "2019-nCoV-Datas": new Project("https://github.com/SunIBAS/2019-nCoV-Datas", "2019-nCoV-Datas","三年疫情做过的一些内容", type.Other),
    }
};

module.exports = {
    projects,
    type
};