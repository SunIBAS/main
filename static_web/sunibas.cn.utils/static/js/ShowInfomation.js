// 这个代码是用于显示 表格 和 json 信息，为所有的管理页面显示方便调用
// addJson 和 addTable 中的 fn 参数是指 如果传递一个对象，通过 fn 将对象内容取出
//      例如：
//      想要渲染 obj 对象中 table 字段为表格
//      add("table",new StaticTable(),_ => _.table);
class ShowInfomation {
    static infoType = {
        json: `json`,
        table: `table`,
    }
    static tab = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
    // 在不修改源码的情况下，为新的代码添加适应性调用代码
    // 可以如下使用
    // a = ShowInfomation;
    // a = a.getInstance(layer,jQuery,title,infos);
    // a = a.getInstance(layer,jQuery,title,infos); <- 就是 a 本身
    static getInstance(layer,jQuery,title,infos) {
        let inst = new ShowInfomation(layer,jQuery,title);
        inst._infos = infos;
        return inst;
    }
    constructor(layer,jQuery,title) {
        this.layer = layer;
        this.jQuery = jQuery;
        this.title = "";
        this._infos = [
            /*{type:'json'},{type:table}*/
        ];
        this.title = title || (obj => `属性和描述[id=${obj.id}]`)
    }
    getInstance() {
        return this;
    }
    addJson(title,fn) {
        this._infos.push({
            title,
            type: ShowInfomation.infoType.json,
            fn: fn || (_ => _)
        });
        return this;
    }
    // staticTableObj 是 StaticTable.js 中的对象
    addTable(title,staticTableObj,fn) {
        this._infos.push({
            title,
            type: ShowInfomation.infoType.table,
            table: staticTableObj,
            fn: fn || (_ => _)
        });
        return this;
    }
    _toJsonString(obj) {
        return JSON.stringify(obj,'','\t').replace(/\t/g,ShowInfomation.tab).replace(/\n/g,'<br/>');
    }
    render(obj) {
        let dom = `<div>`;
        this._infos.forEach(info => {
            if (info.type === ShowInfomation.infoType.table) {
                dom += `${info.title}：<br/>${info.table.getTable(info.fn(obj))}<br/>`;
            } else if (info.type === ShowInfomation.infoType.json) {
                dom += `${info.title}：<br/>${this._toJsonString(info.fn(obj))}<br/>`
            }
        });
        dom += "</div>"
        let layerId = this.layer.open({
            closeBtn: 1,
            btn: [],
            area: ['80%'],
            title: this.title(obj),
            content: dom
        });
    }
}