// let a = {
//     "count": 137,
//     "hasPrevious": true,
//     "hasNext": true,
//     "features": [
//         {
//             "id": "45bd6232-87d5-4b1d-bdf2-00655cf1f91e",
//             "geometry": {
//                 "type": "MultiPolygon",
//                 "coordinates": [[[[0.0005303888507187163,0.0003861689542066464],[0.0005303764660474347,0.0003861638461340502],[0.0005303746830355703,0.0003861663037995415],[0.0005303728518339776,0.00038616606285344105],[0.0005303723699447741,0.000386166641129171],[0.0005303767551777255,0.00038616866506878145],[0.000530380513952289,0.000386170062579064],[0.0005303806103317455,0.00038617039989597134],[0.0005303816223079588,0.00038617092996721453],[0.0005303819114463278,0.00038617064084207176],[0.0005303839835884831,0.0003861716046391958],[0.0005303854774538998,0.0003861716046391958],[0.0005303858629717252,0.00038617199014786765],[0.0005303888025289882,0.00038617203832690995],[0.0005303888507187163,0.0003861689542066464]]]]
//             },
//             "properties": {
//                 "createdAt": "2020-08-26T02:26:50.322Z",
//                 "modifiedAt": "2020-08-26T02:26:50.322Z",
//                 "name": "n47",
//                 "description": null
//             },
//             "type": "Feature"
//         },
//     ],
//     "type": "FeatureCollection"
// }
class ParseColumn {
    static btnStyle = {
        // 配色
        default: [],
        native: ['layui-btn-primary'],
        normal: ['layui-btn-normal'],
        warn: ['layui-btn-warm'],
        danger: ['layui-btn-danger'],
        disable: ['layui-btn-disabled'],
        // 尺寸
        // big: ['layui-btn-lg'],
        big: ['layui-btn-sm'],
        small: ['layui-btn-sm'],
        mini: ['layui-btn-xs'],
        // 圆角
        radius: ['layui-btn-radius']
    }
    // width 和 minWidth 都是数字，像素值
    static setting(width,minWidth) {
        return {
            width: width,
            minWidth: minWidth
        }
    }
    static defaultSetting = ParseColumn.setting(180);
    constructor() {
        this.name = [];
        this.label = [];
        this.setting = [];
        this.parseMethod = [];
        this.tableFilter = `parse-table-${new Date().getTime()}`;
        this.paginationId = `pagination-${new Date().getTime()}`;
        this.tableId = `table-${new Date().getTime()}`;
        this.btns = [];
        this.btnHeader = "";
        this.btnTr = "";
        this.buttonSetting = ParseColumn.setting(180);
    }
    add(name,label,parseMethod,setting) {
        this.name.push(name);
        this.label.push(label);
        this.setting.push(setting || ParseColumn.defaultSetting);
        this.parseMethod.push({name: name,method: parseMethod || (_ => _)});
        return this;
    }
    // id 是用于用户自己绑定事件用的
    // style = []
    // 这里添加的按钮是没有事件的，事件需要咋在 MockStaticPagination 中的 initOver 进行绑定绑定大致方法如下
    // action = function(obj,ind) { obj 是当前的记录 }
    addButton(label,tar,style,action) {
        this.btns.push({action,label,tar,style: style.concat(['layui-btn'])});
        return this;
    }
    setButtonSetting(setting) {
        this.buttonSetting = setting || ParseColumn.defaultSetting;
        return this;
    }
    _getTHSetting(setting,id) {
        let sets = [
            `field:'${id}'`,
            setting.minWidth ? `minWidth: ${setting.minWidth}` : '',
            setting.width ? `width: ${setting.width}` : ''
        ].filter(_ => _).join(',');
        return sets;
    }
    init() {
        this.btnHeader = `<th lay-data="{${this._getTHSetting(this.buttonSetting,`___op___`)}}">操作</th>`;
        this.btnTr = `<td>${
            (_ => {
                return this.btns.map(btn => {
                    return `<button type="button" tar="${btn.tar}" ind="&ind&" class="${btn.style.join(' ')}">${btn.label}</button>`
                }).join(' ');
            })()
        }</td>`;
        return this;
    }
    _getHead() {
        return `<thead>
                    <tr>
                        ${this.label.map(
                            (_,ind) => {
                                return `<th lay-data="{${this._getTHSetting(this.setting[ind],`${this.name[ind]}_${ind}`)} }">${_}</th>`;
                            }).join('\r\n')}
                        ${this.btnHeader}
                    </tr>
                </thead>`
    }
    _getTr(obj,ind) {
        return `<tr>
                    ${(() => {
                        return obj.map(_ => `<td>${_}</td>`).join('\r\n') + this.btnTr.replace(/&ind&/g,ind);
                    })()}
                </tr>`
    }
    getTable(objs) {
        return `<div id="${this.tableId}"><table lay-filter="${this.tableFilter}">
            ${this._getHead()}
            <tbody>
                ${objs.map(this._getTr.bind(this)).join('\r\n')}
            </tbody>
        </table></div>`;
    }
    getPagination() {
        return `<div id="${this.paginationId}"></div>`
    }
}
class MockStaticPagination {
    /**
     * @param dom           要挂载表格的节点
     * @param table         \
     * @param laypage       => layui 对象的内容
     * @param jquery        /
     * @param fetchMethod   请求方法 Promise(s => {})
     * @param parseColumn   表格的列信息
     * @param listName      数据集合的名称
     * @param firstPage     第一页是 0 还是 1
     * @param offset        每次请求几条信息
     */
    constructor(dom,{table,laypage,jquery/*,initOver*/},fetchMethod,parseColumn,listName,firstPage = 1,offset = 10) {
        // 这三个是 layui 的对象
        this.table = table;
        this.laypage = laypage;
        this.jquery = jquery;
        // dom 节点创建完成后，方便用户对事件进行绑定，这里的事件是指 上面的 ParseColumn 中的 addButton
        // this.initOver = initOver || (_ => _);
        // 挂在数据的节点
        this.dom = dom;
        // 请求方法
        this.fetchMethod = fetchMethod;
        // 第一页的索引，区分 0 和 1
        this.firstPage = firstPage;
        // 最多的页码
        this.lastPage = firstPage + 1;
        // 当前的页数(fetchMethod 请求参数)
        this.page = firstPage;
        // 每次请求的数量(fetchMethod 请求参数)
        this.offset = offset;
        // 解析每一个参数(只写要展示的数据)
        this.parseColumn = parseColumn;
        // 可能 shape 是 features ，raster 是 list
        this.listName = listName || 'list';
        // 当前展示内容的数据
        this.datas = [];
        this.loading = window.loading;
        if (window.parent !== window) {
            this.loading = window.parent.loading;
        }
        if (!this.loading) {
            this.loading = {
                load() {},
                close() {}
            };
        }
        // 第二次不需要再渲染分页组件（可以手动改为false以更新数据）
        this.init = false;
    }
    getThePage(page) {
        if (this.firstPage === 0) {
            page--;
        }
        if (page < this.firstPage || page > this.lastPage || page === this.page) {
            return ;
        } else {
            this.page = page;
            this.getPage();
        }
    }
    getNextPage() {
        if (this.page === this.lastPage) {
            return;
        } else {
            this.page++;
            this.getPage();
        }
    }
    getPerPage() {
        if (this.page === this.firstPage) {
            return;
        } else {
            this.page--;
            this.getPage();
        }
    }
    getPage() {
        this.loading.load("加载中...");
        this.fetchMethod(this.page,this.offset)
            .then(d => {
                let $this = this;
                let totalPage = parseInt(d.count / this.offset);
                if (totalPage * this.offset < d.count) { totalPage++; }
                this.lastPage = this.firstPage + totalPage - 1;
                this.datas = d[this.listName];
                let datas = [];
                this.datas.forEach(l => {
                    let ll = [];
                    this.parseColumn.parseMethod.forEach(pm => {
                        ll.push(pm.method(l[pm.name]));
                    });
                    datas.push(ll);
                });
                if (this.init) {
                    let tableDom = document.getElementById(this.parseColumn.tableId);
                    tableDom.innerHTML = this.parseColumn.getTable(datas);
                } else {
                    this.dom.innerHTML = this.parseColumn.getTable(datas) + this.parseColumn.getPagination();
                    this.laypage.render({
                        elem: this.parseColumn.paginationId
                        ,count: d.count
                        ,theme: '#1E9FFF'
                        ,curr : this.page
                        ,jump(obj,first) {
                            if (first) return;
                            // obj.curr obj.limit
                            $this.getThePage(obj.curr);
                        }
                    });
                }
                this.table.init(this.parseColumn.tableFilter, {});
                this.init = true;
                this._initOver();
                this.loading.close();
            }).catch(e => {
                this.loading.close();
                alert(e.message);
        });
    }
    _initOver() {
        var table = this.jquery(`#${this.parseColumn.tableId}`);
        this.parseColumn.btns.forEach(btn => {
            let btns = table.find(`[tar='${btn.tar}']`);
            btns.each((_,btnDom) => {
                btnDom.onclick = (function (mp,btn) {
                    let ind = + this.getAttribute('ind');
                    btn.action(mp.datas[ind]);
                }).bind(btnDom,this,btn);
            })
        })
    }
}

function ___fullExample__() {
    let fetchMethod = (page,pageSize) => {
        return fetch(`http://localhost:9000/api/shape?page=${page}&pageSize=${pageSize}`)
            .then(_ => _.text()).then(JSON.parse);
    }
    // 这里假定的请求结果如最上面的 JSON let a =
    let pc = new ParseColumn()
        .add("id","唯一标识")
        .add("type","type")
        .add("geometry","geometryType",_ => _.type)
        .addButton("查看","look",[].concat(ParseColumn.btnStyle.small).concat(ParseColumn.btnStyle.warn),function (obj) {

        })
        .addButton("查看属性","properties",[].concat(ParseColumn.btnStyle.small).concat(ParseColumn.btnStyle.danger))
        .init();
    window.mp = new MockStaticPagination(document.getElementById('table'),
        {
            table: layui.table,
            laypage: layui.laypage,
            jquery: layui.jquery
        },
        fetchMethod,pc,
        "features",0);
    mp.getPage();
}