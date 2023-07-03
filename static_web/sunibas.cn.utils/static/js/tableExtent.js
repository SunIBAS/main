// 为 form 表单扩展方法
const tableExtent = (function () {
    let Form = null;
    let layuiObj = null;
    let tableLayuiObj = null;
    let ShowInfomation = null;
    // 挂载表格的节点
    let dom = null;
    let obj = {
        column: {},
        table: null,
        btns: {}
    };
    let safeEval = function(code,defaultVls) {
        let parseMethod = defaultVls;
        if (typeof code === "function") {
            return code;
        }
        if (!code) {
            return parseMethod;
        }
        try {
            parseMethod = eval(code);
        } catch (e) {
            parseMethod = defaultVls;
        }
        if (parseMethod && typeof parseMethod !== "function") {
            parseMethod = defaultVls;
        }
        return parseMethod;
    }
    // vls => getObj 的内容
    let renderByVls = function(vls) {
        dom.innerHTMK = "";
        let pc = new ParseColumn();
        for (let i in vls.columns) {
            let v = vls.columns[i];
            let parseMethod = safeEval(v.parseMethod,null);
            pc.add(v.fieldName,v.labelName,parseMethod,ParseColumn.setting(v.width,v.minWidth));
        }
        for (let i in vls.btns) {
            let btn = vls.btns[i];
            pc.addButton(
                btn.labelName,
                btn.tag,
                [].concat(ParseColumn.btnStyle[btn.btnColor])
                    .concat(ParseColumn.btnStyle[btn.size])
                    .concat(btn.radius ? ParseColumn.btnStyle.radius : []),
                safeEval(btn.action,console.log)
            )
        }
        pc.init();
        let v = vls.table;
        let _mockData = v.mockData;
        if (_mockData && typeof _mockData === "string") {
            try {
                _mockData = eval(_mockData);
            } catch (e) {
                _mockData = null;
            }
        }
        pc.setButtonSetting(ParseColumn.setting(v.btnWidth));
        _mockData = _mockData || mockAjax;
        let mp = new MockStaticPagination(
            dom,tableLayuiObj,
            _mockData,pc,
            // todo : 有些查询可能是返回 results 或 features 或 list
            v.list,v.firstPage,v.offset);
        mp.getPage();
        return {pc,mp};
    }
    let getObj = function () {
        let o = {columns: [],btns: [],table:{}};
        o.table = obj.table.value.values;
        for (let i in obj.column) {
            o.columns.push(obj.column[i].value.values);
        }
        for (let i in obj.btns) {
            o.btns.push(obj.btns[i].value.values);
        }
        return o;
    }
    return {
        _obj() {return obj;},
        clear() {
            obj.column = {};
            obj.btns = {};
        },
        setLayuiObj(_Form,_layuiObj,_tableObj,_ShowInfomation) {
            Form = _Form;
            layuiObj = _layuiObj;
            tableLayuiObj = _tableObj;
            ShowInfomation = _ShowInfomation;
        },
        remove(id) {
            if (id in obj.column) {
                delete obj.column[id];
            } else if (id in obj.btns) {
                delete obj.btns[id];
            }
        },
        getObj() {
            return getObj();
        },
        setDom(_dom) {
            dom = _dom;
        },
        getMockStaticTableSettingForm(id) {
            if (obj.table) {
                return obj.table;
            }
            let fi = new Form(id,layuiObj,_=>_,"",130)
            fi.addFormItem(new TextArea("请求方法","mockData","不填将使用默认数据"))
            fi.addFormItem(new Input("列表字段名称",'list',"看自己的数据").setValue("list"))
            fi.addFormItem(new Input("首页索引",'firstPage',"默认是1").setValue("1"))
            fi.addFormItem(new Input("每次请求的条目",'offset',"默认是10(如果接口没开放字段则自己看着办)").setValue("10"))
            fi.addFormItem(new Input("按钮列宽",'btnWidth',"").setValue(""))
            obj.table = fi;
            fi.render("",true);
            return fi;
        },
        // 开始编写各种字段类型的组件
        addColumn(id) {
            let fi = new Form(id,layuiObj,_=>_,'',);
            fi  .addFormItem(new Input("字段名","fieldName","例如id").setValue(""))
                .addFormItem(new Input("表头名称","labelName","例如 唯一标志").setValue(""))
                .addFormItem(new Input("宽度","width").setValue(180))
                .addFormItem(new Input("最小宽度","minWidth","默认和“宽度”一致").setValue(180))
                .addFormItem(new TextArea("解析方法","parseMethod","默认为 _=>_").setValue("_=>_"));
            obj.column[id] = fi;
            return fi;
        },
        addButton(id) {
            let fi = new Form(id,layuiObj,_=>_,'',);
            fi  .addFormItem(new Input("标志","tag","例如 update").setValue(""))
                .addFormItem(new Input("表头名称","labelName","例如 更新").setValue(""))
                .addFormItem(
                    new Select("颜色","btnColor")
                        .addOptions("default","默认")
                        .addOptions("native","主色调")
                        .addOptions("normal","常规")
                        .addOptions("warn","暖色")
                        .addOptions("danger","危险")
                        .addOptions("disabled","禁用")
                )
                .addFormItem(
                    new Select("尺寸","size")
                        // .addOptions("big","大")
                        .addOptions("small","小")
                        .addOptions("mini","迷你")
                )
                .addFormItem(new Switch("圆角","radius").setValue(false))
                .addFormItem(new TextArea("执行方法","action","默认为 console.log").setValue("console.log"));
            obj.btns[id] = fi;
            return fi;
        },
        exampleColumn() {
            return {
                columns: [
                    {
                        "fieldName": "id",
                        "labelName": "索引",
                        "width": "180",
                        "minWidth": "180",
                        "parseMethod": "_=>_"
                    },
                    {
                        "fieldName": "prop",
                        "labelName": "名称",
                        "width": "",
                        "minWidth": "",
                        "parseMethod": "_=>_.name"
                    },
                    {
                        "fieldName": "prop",
                        "labelName": "年龄",
                        "width": "180",
                        "minWidth": "180",
                        "parseMethod": "_=>_.age"
                    }
                ],
                table: {
                    "mockData": `(page,pageSize) => {
    let total = 37;
    let from = page * pageSize - pageSize;
    let datas = {
        "count": total,
        "hasPrevious": from > 0,
        "hasNext": from < total,
        "list": (_ => {
            let d = [];
            for (let i = from;i < from + pageSize && i < total;i++) {
                d.push({id: i,prop: {name: "name_" + i,age: "age_" + i}});
            }
            return d;
        })()
    }
    return new Promise(function (s) {
        s(datas);
    });
}`,
                    "list": "list",
                    "firstPage": "1",
                    "offset": "10",
                    "btnWidth": ""
                },
                btns: [
                    {
                        "tag": "look",
                        "labelName": "查看",
                        "btnColor": "native",
                        "size": "small",
                        "radius": false,
                        "action": "console.log"
                    }
                ]
            };
        },
        setTableForm(_obj) {
            obj.table.setValues(_obj);
        },
        initMockStaticTable(vls) {
            if (vls && `table` in vls && `columns` in vls) {
                return renderByVls(vls);
            } else {
                return renderByVls(getObj())
            }
        },
    };
})();
