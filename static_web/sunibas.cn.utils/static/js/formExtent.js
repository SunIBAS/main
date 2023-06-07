// 为 form 表单扩展方法
const formExtent = (function () {
    let Form = null;
    let layuiObj = null;
    let ShowInfomation = null;
    let obj = {};
    let counter = 0;
    let base = function(id, {noLabel, noName, noPlaceholder, noDefaultValue, noLength, noRequire, noDisable},typeName) {
        let formInstance = new Form(id,layuiObj,_=>_);
        formInstance.addFormItem(new Input("类型","type","",true).setValue(typeName))
        !noLabel ? formInstance.addFormItem(new Input("标签","label").setValue("标签")) : false;
        !noName ? formInstance.addFormItem(new Input("字段名称","formName").setValue("字段名称_" + counter)) : false;
        !noPlaceholder ? formInstance.addFormItem(new Input("提示","placeholder").setValue("提示")) : false;
        !noDefaultValue ? formInstance.addFormItem(new Input("默认值","defaultValue").setValue("默认值")) : false;
        !noDisable ? formInstance.addFormItem(new Switch("不可用","disable")) : false;
        !noRequire ? formInstance.addFormItem(new Switch("必填","require")) : false;
        !noLength ? formInstance.addFormItem(new Switch("限制长度","lengthRequire")) : false;
        !noLength ? formInstance.addFormItem(new Input("限制长度","length").setValue(8)) : false;
        counter++;
        return formInstance;
    }
    let require = function(required,lengthRequire,length,req) {
        // let req = [];
        required ? req.push(Form.checkDatasMethods.required()) : false;
        lengthRequire && length ? req.push(Form.checkDatasMethods.requiredLength(length)) : false;
        return req;
    };
    let defaultAjaxMethod = page => {
        return new Promise(function (suc) {
            setTimeout(_ => {
                suc({
                    hasPrevious: page != 0,
                    hasNext: page < 10,
                    data: (function () {
                        let d = [];
                        for (let i = 0;i < 10;i++) {
                            d.push({
                                data: {name: `#${page}_${i}`,id: Math.random() + ""},
                                value: i + page * 10,
                                label: `label_${page}_${i}`
                            });
                        }
                        return d;
                    })()
                });
            },1000);
        });
    };
    let render = {
        input(formInst,vls,req) {
            let inp = new Input(vls.label,vls.formName,vls.placeholder,vls.disable);
            if (vls.defaultValue) inp.setValue(vls.defaultValue);
            formInst.addFormItem(inp,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        textarea(formInst,vls,req) {
            let inp = new TextArea(vls.label,vls.formName,vls.placeholder,vls.disable);
            if (vls.defaultValue) inp.setValue(vls.defaultValue);
            formInst.addFormItem(inp,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        select(formInst,vls,req) {
            let select = new Select(vls.label,vls.formName);
            let defaultValue = vls.defaultValue;
            for (let i in vls.options) {
                if (i === defaultValue) {
                    select.addOptions(i,vls.options[i],true);
                } else {
                    select.addOptions(i,vls.options[i],false);
                }
            }
            formInst.addFormItem(select,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        checkbox(formInst,vls,req) {
            let checkbox = new CheckBox(vls.label,vls.formName);
            let defaultValue = vls.defaultValue;
            for (let i in vls.options) {
                if (defaultValue.includes(i)) {
                    checkbox.addOptions(i,vls.options[i],true);
                } else {
                    checkbox.addOptions(i,vls.options[i],false);
                }
            }
            formInst.addFormItem(checkbox,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        radio(formInst,vls,req) {
            let radio = new Radio(vls.label,vls.formName);
            let defaultValue = vls.defaultValue;
            for (let i in vls.options) {
                if (i === defaultValue) {
                    radio.addOptions(i,vls.options[i],true);
                } else {
                    radio.addOptions(i,vls.options[i],false);
                }
            }
            formInst.addFormItem(radio,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        switch(formInst,vls,req) {
            let sw = new Switch(vls.label,vls.formName).setValue(vls.defaultValue);
            formInst.addFormItem(sw,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        mapInput(formInst,vls,req) {
            let dv = vls.defaultValue //JSON.parse(vls.defaultValue)
            let mi = new MapInput(vls.label,vls.formName,"",MapInput.Config(!vls.noadd,!vls.nochange));
            dv.forEach(d => {
                mi.addKeyValue(d.key,d.value,d.cannotDelete.toString().toLowerCase() === 'true');
            });
            formInst.addFormItem(mi,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        arrayInput(formInst,vls,req) {
            let ai = new ArrayInput(vls.label,vls.formName);
            ai.setValue(vls.defaultValue);
            formInst.addFormItem(ai,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        mapArrayInput(formInst,vls,req) {
            let mai = new MapArrayInput(vls.label,vls.formName);
            for (let i in vls.fields) {
                mai.addField(i,vls.fields[i]);
            }
            formInst.addFormItem(mai,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        formInput(formInst,vls,req) {
            let mai = new FormInput(vls.label,vls.formName,
                new Form(null,layuiObj,"提交").addFormItem(new Input('名称','name')).addFormItem(new Input('age','年龄')),
                layuiObj.layuiLayer);
            for (let i in vls.fields) {
                mai.addField(i,vls.fields[i]);
            }
            formInst.addFormItem(mai,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        formArrayInput(formInst,vls,req) {
            let mai = new FormArrayInput(vls.label,vls.formName,
                new Form(null,layuiObj,"提交").addFormItem(new Input('名称','name')).addFormItem(new Input('age','年龄')),
                layuiObj.layuiLayer);
            for (let i in vls.fields) {
                mai.addField(i,vls.fields[i]);
            }
            formInst.addFormItem(mai,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        dateInput(formInst,vls,req) {
            let mai = new DateInput(vls.label,vls.formName,vls.placeholder).setValue(vls.defaultValue);
            formInst.addFormItem(mai,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        selectFromAjax(formInst,vls,req,ajaxMethod) {
            let SFA = new SelectFromAjax(vls.label,vls.formName,ajaxMethod || defaultAjaxMethod,ShowInfomation,SelectFromAjax.Config(vls.array));
            formInst.addFormItem(SFA,require(vls.require,vls.lengthRequire,vls.length,req || []));
            return formInst;
        },
        uploadInput(formInst,vls,req) {
            let ui = new UploadInput(vls.label,vls.formName,console.log);
            formInst.addFormItem(ui,req || []);
            return formInst;
        },
    };
    const selectBase = function (id,type,typeName) {
        let fi = base(id, {noPlaceholder:true,noLength:true,noDisable:true,noDefaultValue:true},typeName);
        fi._type = type;
        obj[id] = fi;
        return fi;
    }
    return {
        _obj() {return obj;},
        clear() {
            obj = {};
        },
        getObj() {
            let o = {};
            for (let i in obj) {
                o[i] = {
                    value: obj[i].value.values,
                    type: obj[i]._ctype
                };
            }
            return o;
        },
        remove(id) {
            delete obj[id];
        },
        setForm(_form) {
            Form = _form;
        },
        setShowInfomation(_ShowInfomation) {
            ShowInfomation = _ShowInfomation;
        },
        setLayuiObj(_layuiObj) {
            layuiObj = _layuiObj;
        },
        render(formInst) {
            for (let i in obj) {
                formInst = render[obj[i]._type](formInst,obj[i].value.values);
            }
            formInst.render();
            return formInst;
        },
        getRenderVls() {
            let vls = [];
            for (let i in obj) {
                vls.push({
                    _type: obj[i]._type,
                    vls: obj[i].value.values
                });
            }
            return vls;
        },
        renderWithVls(formInst,vls,{ajaxMethod,require}) {
            vls.forEach(v => {
                let req = [];
                require = require || {};
                if (v.vls.formName in require) {
                    req = require[v.vls.formName];
                    if (req && !(req instanceof Array)) {
                        req = [req];
                    }
                }
                // 如果时异步表单且有定义方法则在这里放入
                if (v._type === "selectFromAjax") {
                    if (v.vls.formName in ajaxMethod) {
                        formInst = render[v._type](formInst,v.vls,v.req,ajaxMethod[v.vls.formName]);
                        return;
                    }
                }
                formInst = render[v._type](formInst,v.vls,req.concat(v.req ? (v.req instanceof Array ? v.req : [v.req]) : []));
            });
            formInst.render();
            return formInst;
        },
        // 开始编写各种字段类型的组件
        Input(id) {
            let fi = base(id,{},'输入框');
            fi._type = "input";
            fi._ctype = "Input";
            obj[id] = fi;
            return fi;
        },
        Textarea(id) {
            let fi = base(id,{},'文本框');
            fi._type = "textarea";
            fi._ctype = "Textarea";
            obj[id] = fi;
            return fi;
        },
        Select(id) {
            let fi = selectBase(id,"select",'下拉框');
            fi._ctype = "Select";
            fi.addFormItem(new Input("默认值","defaultValue").setValue('beijing'));
            fi.addFormItem(new MapInput("选项","options")
                .addKeyValue("beijing","北京")
                .addKeyValue("shanghai","上海"));
            return fi;
        },
        Checkbox(id) {
            let fi = selectBase(id,"checkbox",'复选框');
            fi._ctype = "Checkbox";
            fi.addFormItem(new ArrayInput("默认值","defaultValue").setValue(["beijing","shanghai"]));
            fi.addFormItem(new MapInput("选项","options")
                .addKeyValue("beijing","北京")
                .addKeyValue("shanghai","上海"));
            return fi;
        },
        Radio(id) {
            let fi = selectBase(id,"radio",'单选');
            fi._ctype = "Radio";
            fi.addFormItem(new Input("默认值","defaultValue").setValue('beijing'));
            fi.addFormItem(new MapInput("选项","options")
                .addKeyValue("beijing","北京")
                .addKeyValue("shanghai","上海"));
            return fi;
        },
        Switch(id) {
            let fi = base(id, {noPlaceholder:true,noDefaultValue:true,noDisable:true,noRequire:true,noLength:true},'开关');
            fi._type = 'switch';
            fi._ctype = "Switch";
            obj[id] = fi;
            fi.addFormItem(new Switch("默认值","defaultValue").setValue(false));
            return fi;
        },
        MapInput(id) {
            let fi = base(id, {noPlaceholder:true,noDefaultValue:true,noDisable:true,noRequire:true,noLength:true},'对象编辑');
            fi._type = 'mapInput';
            fi._ctype = "MapInput";
            obj[id] = fi;
            fi.addFormItem(new Switch("不可添加","noadd").setValue(false));
            fi.addFormItem(new Switch("不可修改键","nochange","对于不可删除字段而言").setValue(false));
            // fi.addFormItem(new TextArea("默认值","defaultValue").setValue(JSON.stringify([
            //     { key: '键1', value: '值1', cannotDelete: true},
            //     { key: '键2', value: '值2', cannotDelete: false, desc: "cannotDelete ture表示不可删，否则可删"},
            // ])));
            fi.addFormItem(new MapArrayInput("默认值","defaultValue")
                .addField("key","键")
                .addField("value","值")
                .addField("cannotDelete","不可删(填true或false)")
            )
            return fi;
        },
        ArrayInput(id) {
            let fi = base(id, {noPlaceholder:true,noDefaultValue:true,noDisable:true,noRequire:true,noLength:true},'数组');
            fi._type = 'arrayInput';
            fi._ctype = "ArrayInput";
            obj[id] = fi;
            fi.addFormItem(new ArrayInput("默认值","defaultValue").setValue(["第一个","第二个"]));
            return fi;
        },
        MapArrayInput(id) {
            let fi = base(id, {noPlaceholder:true,noDefaultValue:true,noDisable:true,noRequire:true,noLength:true},'表格');
            fi._type = 'mapArrayInput';
            fi._ctype = "MapArrayInput";
            obj[id] = fi;
            fi.addFormItem(new MapInput("字段","fields").addKeyValue("id","id").addKeyValue("name","名称"));
            return fi;
        },
        FormInput(id) {
            let fi = base(id, {noPlaceholder:true,noDefaultValue:true,noDisable:true,noRequire:true,noLength:true},'表单');
            fi._type = 'formInput';
            fi._ctype = "FormInput";
            obj[id] = fi;
            // fi.addFormItem(new MapInput("字段","fields").addKeyValue("id","id").addKeyValue("name","名称"));
            fi.addFormItem(new TextArea("说明","desc").setValue("这个字段太复杂，本质上是要将整个表单制作复制一份作为他的子组件，既套娃，但是没必要也很繁琐，可以单独制作一个表单作为他的参数"))
            return fi;
        },
        FormArrayInput(id) {
            let fi = base(id, {noPlaceholder:true,noDefaultValue:true,noDisable:true,noRequire:true,noLength:true},'表单数组');
            fi._type = 'formArrayInput';
            fi._ctype = "FormArrayInput";
            obj[id] = fi;
            // fi.addFormItem(new MapInput("字段","fields").addKeyValue("id","id").addKeyValue("name","名称"));
            fi.addFormItem(new TextArea("说明","desc").setValue("这个字段太复杂，本质上是要将整个表单制作复制一份作为他的子组件，既套娃，但是没必要也很繁琐，可以单独制作一个表单作为他的参数"))
            return fi;
        },
        DateInput(id) {
            let fi = base(id, {noDefaultValue:true,noDisable:true,noLength:true},'日期');
            fi._type = 'dateInput';
            fi._ctype = "DateInput";
            fi.addFormItem(new DateInput("默认值","defaultValue").setValue("2020-01-01"));
            obj[id] = fi;
            return fi;
        },
        SelectFromAjax(id) {
            let fi = base(id, {noPlaceholder:true,noDefaultValue:true,noDisable:true,noLength:true},'异步选择');
            fi._type = 'selectFromAjax';
            fi._ctype = "SelectFromAjax";
            fi.addFormItem(new Switch("多选","array").setValue(false));
            fi.addFormItem(new Input("说明","desc","",true).setValue("这里给出一个默认的模拟请求"));
            obj[id] = fi;
            return fi;
        },
        UploadInput(id) {
            let fi = base(id, {noRequire:true,noPlaceholder:true,noDefaultValue:true,noDisable:true,noLength:true},'上传文件');
            fi._type = 'uploadInput';
            fi._ctype = "UploadInput";
            fi.addFormItem(new TextArea("说明","desc").setValue("获取文件后的处理这里不展开写"));
            obj[id] = fi;
            return fi;
        },
    };
})();