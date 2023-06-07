// 这个脚本需要一个全局的 jQuery 对象，命名为 $

// 继承需要实现 [get value] [get valueMap] [setValue] [getDom]
class FormItem {
    /**
     * @param label     标签
     * @param formName  提交表单的字段名
     */
    // 子类需要有一个 id 字段
    constructor(label,formName,placeholder,type) {
        this.label = label;
        this.formName = formName;
        this.type = type;
        this.placeholder = placeholder;
    }
    getDom(eleDom) {
        return `<div form-type="${this.type}" lay-filter="${this.id}" class="layui-form-item" style="border: 1px solid rgba(0,0,0,0);">
    <label title="${this.placeholder}" class="layui-form-label">${this.label}</label> ${eleDom}
</div>`;
    }
}
class Input extends FormItem {
    constructor(label,formName,placeholder = "请输入",disabled) {
        super(label,formName,placeholder,'input');
        this.id = null;
        disabled = disabled ? "disabled" : "";
        this.eleDom = `    <div class="layui-input-block">
        <input type="text" autocomplete="off" name="${formName}" placeholder="${placeholder}" class="layui-input" ${disabled} value="{value}">
    </div>`
        this.defaultValue = '';
    }

    getDom() {
        return super.getDom(this.eleDom.replace('{value}',this.defaultValue ? this.defaultValue : ''));
    }
    get value() {
        return $(`[lay-filter="${this.id}"]`).find(`[name="${this.formName}"]`).val();
    }
    get valueMap() {
        return {
            [this.formName] :this.value
        };
    }
    setValue(val) {
        this.defaultValue = val;
        $(`[lay-filter="${this.id}"]`).find(`[name='${this.formName}']`).val(val);
        return this;
    }
    clear() {
        this.defaultValue = "";
        $(`[lay-filter="${this.id}"]`).find(`[name="${this.formName}"]`).val("");
    }
    render() {
        $(`[lay-filter="${this.id}"] input`).val(this.defaultValue);
    }
}
// ''
class TextArea extends Input {
    constructor(label,formName,placeholder = "请输入") {
        super(label,formName,placeholder,);
        this.type = "textarea";
        this.eleDom = `    <div class="layui-input-block">
        <textarea name="${formName}" placeholder="${placeholder}" class="layui-textarea"></textarea>
    </div>`
    }

    render() {
        $(`[lay-filter="${this.id}"] textarea`).val(this.defaultValue);
    }
}
class Select extends FormItem {
    constructor(label,formName,placeholder = "请输入") {
        super(label,formName,placeholder,'select');
        this.id = null;
        this.options = [];
        this.optionsDom = [];
        this.defaultSelectIndex = -1;
        this.eleDom = `    <div class="layui-input-block">
        <select name="${name}">
            <option value=""></option>
            $options$
        </select>
    </div>`
    }
    addOptions(value,label,selected) {
        this.options.push([value,label || value]);
        if (selected) {
            this.setSelected(this.options.length - 1);
        } else {
            this.optionsDom.push(`<option value="${value}">${label || value}</option>`);
        }
        return this;
    }
    setSelected(index) {
        if (this.defaultSelectIndex !== -1) {
            this.optionsDom[this.defaultSelectIndex] = `<option value="${this.options[this.defaultSelectIndex][0]}"}>${this.options[this.defaultSelectIndex][1]}</option>`;
        }
        this.defaultSelectIndex = index;this.optionsDom[this.defaultSelectIndex] = `<option selected value="${this.options[this.defaultSelectIndex][0]}" selected>${this.options[this.defaultSelectIndex][1]}</option>`;
        return this;
    }

    getDom() {
        return super.getDom(this.eleDom.replace("$options$",this.optionsDom.join('\r\n')));
    }
    get value() {
        return $(`[lay-filter="${this.id}"]`).find('select').val();
    }
    get valueMap() {
        return {
            [this.formName] : this.value
        };
    }
    // value 是提交服务器的值，对应 addOptions 的 value 参数
    setValue(value) {
        let label = null;
        for (let i = 0;i < this.options.length;i++) {
            if (this.options[i][0] === value) {
                label = this.options[i][1];
                break;
            }
        }
        if (!label) {
            throw new Error(`[Select.setValue]:找不到 ${value} 对应字段`)
        }
        let formItem = $(`[lay-filter="${this.id}"]`);
        formItem.find('input').val(label);
        formItem.find('select').val(value);
        formItem.find('dd[lay-value]').each((ind,dom) => {
            let value_ = dom.getAttribute('lay-value');
            if (value_ === value) {
                if (!dom.classList.contains('layui-this')) {
                    dom.classList.add('layui-this');
                }
            } else {
                dom.classList.remove('layui-this');
            }
        });
        return this;
    }
    clear() {
        this.optionsDom = [];
        let formItem = $(`[lay-filter="${this.id}"]`);
        formItem.find('input').val("");
        formItem.find('select').val("");
        formItem.find('dd[lay-value]').each((ind,dom) => {
            if (dom.classList.contains('layui-this')) {
                dom.classList.remove('layui-this');
            }
        });
    }
}
class CheckBox extends FormItem {
    constructor(label,formName,placeholder = "请输入") {
        super(label,formName,placeholder,'checkbox');
        this.id = null;
        this.options = [];
        this.optionsDom = [];
        this.eleDom = `    <div class="layui-input-block">
        $options$
    </div>`
    }
    addOptions(value,label,checked) {
        this.options.push([value,label || value]);
        this.optionsDom.push(`<input type="checkbox" name="${this.formName}" value="${value}" title="${label}" ${checked ? "checked" : ""}>`);
        return this;
    }
    setChecked(ind) {
        this.optionsDom[ind] = `<input type="checkbox" value="${this.options[i][0]}" name="${this.formName}" title="${this.options[i][1]}" checked>`;
    }
    getDom() {
        return super.getDom(this.eleDom.replace("$options$",this.optionsDom.join("\r\n")));
    }
    get value() {
        let formItem = $(`[lay-filter="${this.id}"]`);
        let vals = [];
        formItem.find('input[type="checkbox"]').each((_,inp) => {
            if (inp.checked) {
                vals.push(inp.value);
            }
        });
        return vals;
    }
    get valueMap() {
        return {
            [this.formName]: this.value
        };
    }
    // value 是提交服务器的值，对应 addOptions 的 value 参数
    setValue(value,checked) {
        let exist = false;
        let checkedClassName = 'layui-form-checked';
        for (let i = 0;i < this.options.length;i++) {
            if (this.options[i][0] === value) {
                exist = true;
                break;
            }
        }
        if (!exist) {
            throw new Error(`[Select.setValue]:找不到 ${value} 对应字段`)
        }
        let formItem = $(`[lay-filter="${this.id}"]`);
        formItem.find('input[type="checkbox"]').each((_,inp) => {
            if (inp.value === value && inp.checked !== checked) {
                inp.checked = checked;
                let div = inp.nextElementSibling;
                let hasChecked = div.classList.contains(checkedClassName);
                if (checked) {
                    //
                    if (!hasChecked) {
                        div.classList.add(checkedClassName);
                    }
                } else {
                    if (hasChecked) {
                        div.classList.remove(checkedClassName);
                    }
                }
            }
        });
        return this;
    }
    clear() {
        this.optionsDom = [];
        let formItem = $(`[lay-filter="${this.id}"]`);
        formItem.find('input').val("");
        formItem.find('select').val("");
        formItem.find('dd[lay-checkbox]').each((ind,dom) => {
            if (dom.classList.contains('layui-form-checked')) {
                dom.classList.remove('layui-form-checked');
            }
        });
    }
}
class Radio extends FormItem {
    constructor(label,formName,placeholder = "请输入") {
        super(label,formName,placeholder,'radio');
        this.id = null;
        // this.uniqueName = `radio_name_${new Date().getTime().toString().substring(10)}_${parseInt(Math.random() * 100)}`
        this.options = [];
        this.optionsDom = [];
        this.defaultSelectIndex = -1;
        this.eleDom = `    <div class="layui-input-block">
        $options$
    </div>`
    }
    addOptions(value,label,selected) {
        this.options.push([value,label || value]);
        if (selected) {
            this.setSelected(this.options.length - 1);
        } else {
            this.optionsDom.push(`<input type="radio" name="${this.formName}" value="${value}" title="${label || value}">`);
        }
        return this;
    }
    setSelected(index) {
        if (this.defaultSelectIndex !== -1) {
            this.optionsDom[this.defaultSelectIndex] =
                `<input type="radio" name="${this.formName}" value="${this.options[this.defaultSelectIndex][0]}" title="${this.options[this.defaultSelectIndex][1]}" checked/>`;
        }
        this.defaultSelectIndex = index;
        this.optionsDom[this.defaultSelectIndex] =
            `<input type="radio" name="${this.formName}" value="${this.options[this.defaultSelectIndex][0]}" title="${this.options[this.defaultSelectIndex][1]}" checked/>`;
        return this;
    }

    getDom() {
        return super.getDom(this.eleDom.replace("$options$",this.optionsDom.join('\r\n')));
    }
    get value() {
        let formItem = $(`[lay-filter="${this.id}"]`);
        let vals = [];
        formItem.find('input[type="radio"]').each((_,inp) => {
            if (inp.checked) {
                vals.push(inp.value);
            }
        });
        return vals;
    }
    get valueMap() {
        return {
            [this.formName]: this.value
        };
    }
    // value 是提交服务器的值，对应 addOptions 的 value 参数
    setValue(value,checked) {
        let exist = false;
        let checkedClassName = 'layui-form-radioed';
        let iconChart = ['','']
        for (let i = 0;i < this.options.length;i++) {
            if (this.options[i][0] === value) {
                exist = true;
                break;
            }
        }
        if (!exist) {
            throw new Error(`[Select.setValue]:找不到 ${value} 对应字段`)
        }
        let formItem = $(`[lay-filter="${this.id}"]`);
        formItem.find('input[type="radio"]').each((_,inp) => {
            if (inp.value === value) {
                if (inp.checked !== checked) {
                    inp.checked = checked;
                    let div = inp.nextElementSibling;
                    let hasChecked = div.classList.contains(checkedClassName);
                    if (checked) {
                        //
                        if (!hasChecked) {
                            div.classList.add(checkedClassName);
                            div.getElementsByTagName('i')[0].innerHTML = iconChart[1];
                        }
                    } else {
                        if (hasChecked) {
                            div.classList.remove(checkedClassName);
                            div.getElementsByTagName('i')[0].innerHTML = iconChart[0];
                        }
                    }
                }
            } else {
                inp.checked = false;
                let div = inp.nextElementSibling;
                let hasChecked = div.classList.contains(checkedClassName);
                if (hasChecked) {
                    div.classList.remove(checkedClassName);
                    div.getElementsByTagName('i')[0].innerHTML = iconChart[0];
                }
            }
        });
        return this;
    }
    clear() {
        this.optionsDom = [];
        let formItem = $(`[lay-filter="${this.id}"]`);
        formItem.find('input').val("");
        formItem.find('select').val("");
        formItem.find('input[type="radio]').each((ind,dom) => {
            if (dom.classList.contains('layui-form-radioed')) {
                dom.classList.remove('layui-form-radioed');
            }
        });
    }
}
class Switch extends FormItem {
    constructor(label,formName,placeholder = "请输入") {
        super(label,formName,placeholder,'switch');
        this.id = null;
        this.eleDom = `<div class="layui-input-block">
      <input type="checkbox" name="${formName}" lay-skin="switch" openOrClose>
    </div>`
        this.open = false;
    }
    switch(open) {
        this.open = !!open;
        return this;
    }
    getDom() {
        return super.getDom(this.eleDom.replace('openOrClose',this.open ? "checked" : ""));
    }
    get value() {
        return $(`[lay-filter="${this.id}"]`).find('input')[0].checked;
    }
    get valueMap() {
        return {
            [this.formName] : this.value
        };
    }
    // true or false 表示是否选中
    setValue(open) {
        let switchClassName = 'layui-form-onswitch';
        this.open = !!open;
        let formItem = $(`[lay-filter="${this.id}"]`);
        if (formItem.length) {
            formItem.find('input')[0].checked = open;
            let sw = formItem.find('.layui-form-switch')[0];
            if (sw.classList.contains(switchClassName) !== open) {
                if (open) {
                    sw.classList.add(switchClassName);
                } else {
                    sw.classList.remove(switchClassName);
                }
            }
            if (open) {}
        }
        return this;
    }
}
// {xxx:xxx,yyy:yyy}
class MapInput extends FormItem {
    /**
     * @param canAdd    能够添加，如果是已经指定了某一个对象的格式，可能是不能修改的
     *                  同时，如果是设置了 不能添加 则默认会设置不能删除
     * @param canChange 表示不可删的字段的 key 是否能改
     * @constructor
     */
    static Config(canAdd,canChange) {
        return {
            canAdd,
            canChange
        }
    }
    static defaultConfig = MapInput.Config(true,true);
    constructor(label,formName,placeholder = "请输入",config) {
        super(label,formName,placeholder,'map');
        this.id = null;
        this.config = config || MapInput.defaultConfig;
        this.eleDom = `    <div class="layui-input-block">
        <div mapid="$mapid$">
            $mapDom$
        </div>
        ${this.config.canAdd ? `<div><button tar="add" type="button" class="layui-btn layui-btn-fluid">添加</button></div>` : ''}
    </div>`
        this.mapDom = ``;
        this.renderOver = false;
        this._value = [];
    }
    getDom() {
        return super.getDom(this.eleDom.replace('$mapid$',this.id).replace('$mapDom$',this.mapDom));
    }
    addKeyValue(key,value,cannotDelete) {
        let canDelete = this.config.canAdd ? (!cannotDelete ? 'canDelete="yes"' : '') : '';
        this._value.push({key,value,canDelete,_delete_: false});
        $(`div[mapid="${this.id}"] [tar="kv"]`).each((_,kv) => {
            kv = $(kv);
            this._value[kv.attr('ind')].key = kv.find(`[actor="key"]`).val();
            this._value[kv.attr('ind')].value = kv.find(`[actor="value"]`).val();
        });
        this.mapDom = "";
        let disabled = "";
        if (!canDelete && !this.config.canChange) {
            disabled = "disabled";
        }
        for (let i = 0;i < this._value.length;i++) {
            if (this._value[i]._delete_) continue;
            this.mapDom += `<div tar="kv" style="padding-bottom: 5px;" ind="${i}">
                <input actor="key" type="text" class="layui-input" style="width: calc(29% - 50px);float:left;margin-right:1%;" value="${this._value[i].key}" ${disabled}>
                <input actor="value" type="text" class="layui-input" style="width: calc(69% - 50px);float:left;margin-right: 1%;" value="${this._value[i].value}">
                <button type="button" class="layui-btn ${this._value[i].canDelete ? 'layui-btn-danger' : 'layui-btn-disabled'}" style="width: 100px;" ${this._value[i].canDelete}>删除</button>
            </div>`;
        }
        if (this.renderOver) {
            let mapDiv = $(`div[mapid="${this.id}"]`);
            mapDiv[0].innerHTML = this.mapDom;
            this.renderDeleteBtn();
        }
        return this;
    }
    renderDeleteBtn() {
        let $this = this;
        let mapDiv = $(`div[mapid="${this.id}"]`);
        mapDiv.find(`[tar="kv"]`)
            .each((_,kv) => {
                let btn = $(kv).find('button');
                let ind = $(kv).attr('ind');
                if (btn.attr('canDelete') === "yes") {
                    btn.on('click',(function () {
                        kv.remove();
                        $this._value[ind]._delete_ = true;
                    }).bind(null,kv));
                }
            });
    }
    render() {
        let $this = this;
        this.renderOver = true;
        let mapDiv = $(`div[mapid="${this.id}"]`);
        this.renderDeleteBtn();
        this.config.canAdd ? $(`[lay-filter="${this.id}"]`).find(`[tar="add"]`).on('click',function () {
            $this.addKeyValue("","");
        }) : '';
    }

    get value() {
        let dic = {};
        $(`div[mapid="${this.id}"]`).find('[tar="kv"]').each((_,div) => {
            let inps = div.getElementsByTagName('input');
            if (inps.length === 2) {
                let keyInd = 0;
                if (inps[0].getAttribute("actor") === "value") keyInd = 1;
                let key = inps[keyInd].value;
                if (key) {
                    dic[key] = inps[1 - keyInd].value;
                }
            }
        });
        return dic;
    }
    get valueMap() {
        return {
            [this.formName]: this.value
        }
    }

    // dic = {key: {value: "",cannotDelete: false}}
    setValue(dic) {
        if (this.renderOver && this.config.canAdd) {
            let mapDiv = $(`div[mapid="${this.id}"]`);
            mapDiv[0].innerHTML = "";
            this.mapDom = ``;
            for (let i in dic) {
                if (dic[i] && typeof dic[i] === 'object' && `value` in dic[i]) {
                    this.addKeyValue(i,dic[i].value,this.config.canAdd ? dic[i].cannotDelete : false);
                } else {
                    this.addKeyValue(i,dic[i],!this.config.canAdd);
                }
            }
        }
    }
    clear() {
        $(`div[mapid="${this.id}"] [tar="kv"]`).each((_,kv) => {
            let btn = $(kv).find('button');
            let ind = $(kv).attr('ind');
            if (btn.attr('canDelete') === "yes") {
                kv.remove();
                this._value[ind]._delete_ = true;
                delete this._value[ind];
            }
        });
    }
}
// ['','']
class ArrayInput extends FormItem{
    constructor(label,formName,placeholder = "请输入") {
        super(label,formName,placeholder,'inputTags');
        this.id = null;
        this.inputId = `inputTags${parseInt(Math.random() * 100000)}`;
        this.eleDom = `<div style="width: unset" class="layui-input-block input_tagss">
        <input type="text" class="input_Tags_input" name="" id="${this.inputId}" placeholder="回车生成标签" autocomplete="off">
    </div>`;
        this.renderOver = false;
        // _it 是 inputTags 实例对象
        this._it = null;
        // 渲染前的值暂时放在这里
        this._tmpValue = [];
    }

    getDom() {
        return super.getDom(this.eleDom);
    }
    render(inputTags) {
        this.renderOver = true;
        this._it = inputTags.render({
            elem:'#' + this.inputId,
            content: this._tmpValue
        });
    }

    get value() {
        return this._it.value;
    }
    get valueMap() {
        return {
            [this.formName]: this.value
        }
    }
    setValue(vl) {
        vl = (vl instanceof Array) ? vl : [vl];
        if (this.renderOver) {
            this._it.clearTag();
            vl.forEach(_ => this._it.addTag(_));
        } else {
            this._tmpValue = vl;
        }
        return this;
    }
    clear() {
        this._tmpValue = [];
        this._it.clearTag();
        return this;
    }
}
// [{}]
class MapArrayInput extends FormItem {
    constructor(label,formName,placeholder = "请输入") {
        super(label,formName,placeholder = "请输入",'mapArray');
        this.id = null;
        this.layuiLayer = null;
        this.eleDom = `<div class="layui-input-block">
                <button tar="edit" type="button" class="layui-btn layui-btn-primary">编辑</button>
            </div>`;
        this.fields = [/*{label:'',vaule: ''}*/];
        this.datas = [/*{a:1,b:2}*/];
        this.editTable = new EditableTable();
        this.layerId = null;
        this.lastIndex = 0;
    }

    addField(key,label) {
        this.fields.push({key,label: label || key});
        this.editTable.addColumn(key,label);
        return this;
    }

    bindEvent() {
        let table = $(`.layui-layer[times=${this.layerId}]`).find('.layui-layer-content').find("div[tar='table']");
        let $this = this;
        table.find(`button[${this.editTable.editIconSelector}]`).on('click',function (e) {
            console.log(e);
            let target = e.target;
            if (target.tagName === "I") {
                target = target.parentElement;
            }
            let key = target.getAttribute('columnKey');
            let index = target.getAttribute('dataIndex');
            let span = table.find(`tr[dataIndex=${index}]>td[columnkey="${key}"]>span`);
            let lid = layer.open({
                id:1,
                type: 1,
                title:'请输入',
                skin:'layui-layer-rim',
                area:['450px', 'auto'],
                content: `<div style="padding: 5px;"><input type="text" class="layui-input"></div>`,
            });
            setTimeout(() => {
                let _lay = $(`.layui-layer[times=${lid}]`);
                let inp = _lay.find('input').focus().val(span.text());
                inp.keypress(function (e) {
                    if (e.which == 13) {
                        let val = inp.val();
                        span.text(val);
                        for (let i = 0;i < $this.datas.length;i++) {
                            if ($this.datas[i]._id_ === +index) {
                                $this.datas[i][key] = val;
                            }
                        }
                        layer.close(lid);
                    }
                })
                inp.focus();
            },200);
        });
        table.find(`button[${this.editTable.deleteIconSelector}]`).on('click',function (e) {
            console.log(e);
            let target = e.target;
            if (target.tagName === "I") {
                target = target.parentElement;
            }
            let index = target.getAttribute("dataIndex");
            table.find(`tr[dataIndex=${index}]`).remove();
            for (let i = 0;i < $this.datas.length;i++) {
                if ($this.datas[i]._id_ === +index) {
                    $this.datas[i]._delete_ = true;
                }
            }
        });
    }

    showTable() {
        if (this.layuiLayer) {
            let layerDom = $(`.layui-layer[times=${this.layerId}]`);
            if (layerDom.length) {
                let contentDom = layerDom.find('.layui-layer-content');
                let table = contentDom.find("div[tar='table']");
                table[0].innerHTML = this.editTable.getTable(this.datas.filter(_ => !_._delete_));
                // table[0].innerHTML = table[0].innerHTML.replace(/[,]{2,}/g,'');
                this.bindEvent();
            } else {
                let $this = this;
                this.layerId = this.layuiLayer.open({
                    closeBtn: 1,
                    btn: [],
                    area: ['100%','100%'],
                    title: this.label,
                    content: `<button tar="add" type="button" class="layui-btn layui-btn-normal">添加</button><div tar="table"></div>`
                });
                let contentDom = $(`.layui-layer[times=${this.layerId}]`).find('.layui-layer-content');
                // let table = contentDom.find("div[tar='table']");
                // table[0].innerHTML = table[0].innerHTML.replace(/[,]{2,}/g,'');
                contentDom.find("button[tar='add']").on('click',function () {
                    let obj = {};
                    $this.fields.forEach(_ => obj[_.key] = "");
                    obj._delete_ = false;
                    obj._id_ = $this.lastIndex;
                    $this.lastIndex++;
                    $this.datas.push(obj);
                    $this.showTable();
                });
                $this.showTable();
            }
        } else {
            throw new Error("找不到 layer");
        }
    }

    render() {
        let $this = this;
        $(`[lay-filter="${this.id}"]`).find(`button[tar="edit"]`).on('click',function() {
            $this.showTable();
        });
    }
    getDom() {
        return super.getDom(this.eleDom);
    }

    get value() {
        return this.datas.filter(_ => !_._delete_);
    }
    get valueMap() {
        return {
            [this.formName]: this.value
        }
    }

    setValue(datas) {
        this.datas = [];
        datas.forEach(d => {
            let obj = {};
            this.fields.forEach(_ => obj[_.key] = d[_.key]);
            obj._delete_ = false;
            obj._id_ = this.lastIndex;
            this.lastIndex++;
            this.datas.push(obj);
        });
    }

    clear() {
        this.datas = [];
        return this;
    }
}
// 将 form 作为对象编辑
class FormInput extends Input {
    /**
     * @param label
     * @param formName
     * @param placeholder
     * @param form      Form 实例
     * @param layer     layui.layer 对象
     */
    constructor(label,formName,form,layer,area) {
        super(label,formName,null);
        this.type = 'Object';
        this.layer = layer;
        this.id = null;
        this.form = form;
        this.area = area || ['auto','auto'];
        this.eleDom = `<div class="layui-input-block">
        <button style="max-width: 100px;" type="button" class="layui-btn layui-btn-fluid">编辑</button>
    </div>`;
        this.datas = {};
        this._layerId = null;
    }
    getDom() {
        return super.getDom(this.eleDom);
    }
    render() {
        let $this = this;
        $(`[lay-filter="${this.id}"]`).find(`button[type="button"]`).on('click',function () {
            let tmpFormId = `tmp_${new Date().getTime()}`
            $this._layerId = layer.open({
                area: $this.area,
                title: $this.label,
                type: 1,
                content: `<div style="padding: 10px;" id="${tmpFormId}"></div>`
            });
            setTimeout(_ => {
                $this.form.submitMethod = (obj) => {
                    $this.datas = obj;
                    $this.layer.close($this._layerId);
                    $this._layerId = null;
                }
                $this.form.reRender(tmpFormId);
                for (let i in $this.datas) {
                    $this.form.setValue(i,$this.datas[i]);
                }
            },200);
        });
    }
    get value() {
        return this.datas;
    }
    get valueMap() {
        return {
            [this.formName] :this.value
        };
    }
    setValue(val) {
        this._layerId ? this.layer.close(this._layerId) : '';
        this.datas = val;
        return this;
    }
    clear() {
        this.datas = {};
        return this;
    }
}
// 将 form [数组] 作为对象编辑
class FormArrayInput extends Input {
    /**
     * @param label
     * @param formName
     * @param placeholder
     * @param form      Form 实例
     * @param layer     layui.layer 对象
     */
    constructor(label,formName,form,layer) {
        super(label,formName,null);
        this.type = 'Object';
        this.layer = layer;
        this.id = null;
        this.form = form;
        this.eleDom = `<div tar="btns" class="layui-input-block"></div>`;
        this.datas = {};
        this._layerId = null;
    }
    getDom() {
        return super.getDom(this.eleDom);
    }
    _getId() {
        return `tmp_${new Date().getTime()}`;
    }
    render() {
        let $this = this;
        let btns = $(`[lay-filter="${this.id}"]`).find(`div[tar="btns"]`);
        let dom = ``;
        for (let i in this.datas) {
            dom += `<div class="layui-btn-group">
  <button tar="edit" tarid="${i}" type="button" class="layui-btn">编辑</button>
  <button tar="delete" tarid="${i}" type="button" class="layui-btn layui-btn-danger" style="padding: 0 4px;width: 27px;"><i class="layui-icon"></i></button>
</div>`;
        }
        btns.html(`${dom}<button tar="add" type="button" class="layui-btn" style="margin-left: ${dom ? '10px' : '0'}"><i class="layui-icon"></i>添加</button>`);
        btns.find(`button[tar="add"]`).on('click',_ => {
            this.datas[this._getId()] = {};this.render();
        });
        btns.find(`button[tar="delete"]`).on('click',function () {
            let id = this.getAttribute('tarid');
            if (id in $this.datas) {
                delete $this.datas[id];
            }
            this.parentElement.remove();
            $this.render();
        });
        btns.find(`button[tar="edit"]`).on('click',function () {
            let id = this.getAttribute('tarid');
            if (id in $this.datas) {
                let tmpFormId = `tmp_${new Date().getTime()}`
                $this._layerId = layer.open({
                    title: $this.label,
                    type: 1,
                    content: `<div style="padding: 10px;" id="${tmpFormId}"></div>`
                });
                setTimeout(_ => {
                    $this.form.submitMethod = (obj) => {
                        $this.datas[id] = obj;
                        $this.layer.close($this._layerId);
                        $this._layerId = null;
                    }
                    $this.form.reRender(tmpFormId);
                    $this.form.clear();
                    for (let i in $this.datas[id]) {
                        $this.form.setValue(i,$this.datas[id][i]);
                    }
                },200);
            }
        });
    }
    get value() {
        return this.datas;
    }
    get valueMap() {
        return {
            [this.formName] :this.value
        };
    }
    setValue(val) {
        this._layerId ? this.layer.close(this._layerId) : '';
        this.datas = val;
        return this;
    }
    clear() {
        this.datas = {};
        return this;
    }
}

class DateInput extends FormItem {
    constructor(label,formName,placeholder = "请输入",disabled) {
        super(label,formName,placeholder,'date');
        this.id = null;
        this.defaultValue = "";
        disabled = disabled ? "disabled" : "";
        this.eleDom = `<div class="layui-input-block">
        <input type="text" name="${formName}" placeholder="${placeholder}" class="layui-input" ${disabled}>
    </div>`
    }

    getDom() {
        return super.getDom(this.eleDom);
    }
    get value() {
        return $(`[lay-filter="${this.id}"]`).find(`[name="${this.formName}"]`).val();
    }
    get valueMap() {
        return {
            [this.formName] :this.value
        };
    }
    setValue(val) {
        $(`[lay-filter="${this.id}"]`).find(`[name="${this.formName}"]`).val(val);
        this.defaultValue = val;
        return this;
    }

    render(laydate) {
        laydate.render({
            elem: `[lay-filter="${this.id}"] input`, //指定元素
            value: this.defaultValue ? this.defaultValue : ''
        });
    }
}

// 点击后弹出一个选择框，里面的选项是从服务器获取的数据，
// ajax 负责提供可选数据，格式为 page(请求第几页，从0开始) => Promise
// ajax = page => new Promise(function(suc,fail) {
//      val 和 label 是必须的，obj 无所谓
//      suc({
//          data: [{val: "",label: "",obj: {}}],
//          hasNext: true, // 上一页
//          hasPrevious: true,  // 下一页
//      });
// });
// ShowInfomation 是 ShowInfomation.js 中的类，这个如果有附加信息，既 suc(data 中有 obj 则必须要
class SelectFromAjax extends FormItem {
    static Config(array) {
        return {array}
    }
    static defaultConfig = SelectFromAjax.Config(false)
    // ajax
    constructor(label,formName,ajax,ShowInfomation,config) {
        super(label,formName,null,'ajax');
        this.id = null;
        this.eleDom = `<div class="layui-input-block">
        <div class="layui-input" style="text-align: center;line-height: 38px;cursor: pointer;">{value}</div>
    </div>`
        this.defaultValue = "";
        this.ajax = ajax;
        this.currentPage = 0;
        this.layer = null;
        this.jQuery = null;
        this.config = config || SelectFromAjax.defaultConfig;
        this.selectObj = {};
        if (this.config.array) {
            this.selectObj = [];
            this.defaultValue = [];
        }
        this.ShowInfomation = ShowInfomation;// = ShowInfomation ? new ShowInfomation() : null;
        this.loading = window.loading ? window.loading : {load() {},close() {}};
    }

    getDom() {
        if (this.config.array) {
            return super.getDom(this.eleDom.replace('{value}',this.defaultValue.length ? this.defaultValue.join('#') : '点击选择'));
        } else {
            return super.getDom(this.eleDom.replace('{value}',this.defaultValue ? this.defaultValue : '点击选择'));
        }
    }
    get value() {
        if (this.config.array) {
            return this.selectObj.map(_ => _.value);
        } else {
            return this.selectObj.value;
        }
    }
    get valueMap() {
        return {
            [this.formName] :this.value
        };
    }
    setValue(val) {
        let inp = $(`[lay-filter="${this.id}"] .layui-input`);
        if (this.config.array) {
            if (this.defaultValue.indexOf(val) != -1) {
                this.defaultValue.splice(this.defaultValue.indexOf(val),1);
            } else {
                this.defaultValue.push(val);
            }
            inp.text(this.defaultValue.length ? this.defaultValue.join('#') : "点击选择");
        } else {
            this.defaultValue = val;
            inp.text(val ? val : "点击选择");
        }
        return this;
    }

    showTable(layerDom) {
        let $this = this;
        $this.loading.load("获取数据中");
        let dom = "";
        this.ajax(this.currentPage).then(d => {
            let items = 0;
            d.data.forEach((_d,ind) => {
                dom += `<div class="layui-btn-group" style="width: 300px;display: block;margin: auto;margin-top: 5px;">
    <button class="layui-btn" style="width: 170px;background-color: #dadada;color: black;">${_d.label}</button>
  <button tar="info" ind="${ind}" type="button" class="layui-btn" style="width: 65px;">查看</button>
  <button tar="selected" ind="${ind}" type="button" class="layui-btn" style="width: 65px;" val="${_d.value}">选中</button>
  </div>`;
                items++;
            });
            if (d.hasPrevious) {
                dom += `<div class="layui-btn-group" style="width: 300px;display: block;margin: auto;margin-top: 5px;">
  <button tar="prePage" type="button" class="layui-btn" style="width: 300px;">上一页</button>
  </div>`;
                items++;
            }
            if (d.hasNext) {
                dom += `<div class="layui-btn-group" style="width: 300px;display: block;margin: auto;margin-top: 5px;">
  <button tar="nextPage" type="button" class="layui-btn" style="width: 300px;">下一页</button>
  </div>`;
                items++;
            }
            $this.loading.close();
            if (layerDom) {
                layerDom.innerHTML = dom;
            } else {
                this.layerId = this.layer.open({
                    type: 1,
                    area: ["440px",(60 + items * 43) + "px"],
                    content: dom
                });
            }
            setTimeout(_ => {
                let lay = $(`.layui-layer[times=${this.layerId}]`);
                let content = lay.find('.layui-layer-content');
                lay.find(`button[tar="selected"]`).on('click',function () {
                    let ind = this.getAttribute('ind');
                    let val = d.data[ind].value;
                    if ($this.config.array) {
                        let i = 0;
                        for (;i < $this.selectObj.length;i++) {
                            if ($this.selectObj[i].value === val) {
                                break;
                            }
                        }
                        if ($this.selectObj.length && i < $this.selectObj.length) {
                            $this.selectObj.splice(i,1);
                        } else {
                            $this.selectObj.push(d.data[ind]);
                        }
                    } else {
                        $this.selectObj = d.data[ind];
                    }
                    // $this.layer.close($this.layerId);
                    $this.setValue(val);
                });
                lay.find(`button[tar="info"]`).on('click',function () {
                    let ind = this.getAttribute('ind');
                    $this.ShowInfomation.render(d.data[ind].data || {});
                });
                lay.find(`button[tar="prePage"]`).on('click',function () {
                    $this.currentPage--;
                    $this.showTable(content[0]);
                });
                lay.find(`button[tar="nextPage"]`).on('click',function () {
                    $this.currentPage++;
                    $this.showTable(content[0]);
                });
            });
        });
    }
    render(layer,jQuery) {
        this.layer = layer;
        this.jQuery = jQuery;
        this.ShowInfomation = this.ShowInfomation.getInstance(layer,jQuery,_ => "详情",[{"title":"详情","type":"json",fn(a) {return a}}]);
        let input = $(`[lay-filter="${this.id}"] .layui-input`);
        input.on('click',_ => {
            this.showTable();
        });
    }
    clear() {
        this.setValue("");
        this.selectObj = {};
    }
}

// 这个表单项不符合其他表单项的规范
class UploadInput extends FormItem {
    constructor(label,formName,onChange) {
        super(label,formName,"",'upload');
        this.onChange = onChange;
        this.eleDom = `    <div class="layui-input-block">
        <input style="line-height: 38px;" type="file" name="${formName}" class="layui-input">
    </div>`
    }
    getDom() {
        return super.getDom(this.eleDom);
    }
    getFile() {
        let inp = $(`[lay-filter="${this.id}"]`).find(`[name="${this.formName}"]`)[0];
        return inp.files;
    }

    render() {
        let inp = $(`[lay-filter="${this.id}"]`).find(`[name="${this.formName}"]`)[0];
        inp.onchange = this.onChange;
    }
    clear() {
        $(`[lay-filter="${this.id}"] [name="${this.formName}"]`).replaceWith(`<input style="line-height: 38px;" type="file" name="${this.formName}" class="layui-input">`);
        let inp = $(`[lay-filter="${this.id}"]`).find(`[name="${this.formName}"]`)[0];
        inp.onchange = this.onChange;
    }
}
/**
 * 上面对象中 value valueMap setValue 需要在 render 结束后才能调用，不然有些对象会有问题
 *
 * layuiObj = {layuiForm,layuiLayer,layerInputTags,layerLaydate,jQuery}
 * */
class Form {
    static checkDatasMethods = {
        required() {
            return v => (!v ? new Error("不能为空") : null)
        },
        requiredLength(len) {
            return (function (len,v) {
                if (v instanceof Array) {
                    return v.length < len ? new Error(`至少要选中 ${len} 个`) : null;
                } else {
                    return v.toString().length < len ? new Error(`长度不能小于 ${len}`) : null;
                }
            }).bind(null,len);
        }
    };
    static ToString(obj) {
        if (typeof obj === "string") {
            return obj;
        } else {
            return JSON.stringify(obj);
        }
    }
    static uuid(c) {
        if (!window.__counter__) {
            window.__counter__ = 0;
        }
        window.__counter__++;
        let id = `filter_id_${c}_${parseInt(Math.random() * 100)}_${window.__counter__}`
        if (window.__tmp__ && typeof window.__tmp__ === "object") {} else {
            window.__tmp__ = {};
        }
        if (id in window.__tmp__) {
            return From.uuid(c);
        }
        window.__tmp__[id] = '';
        return id;
    }

    //* @param labelWidth 单位是 像素
    constructor(parentId,layuiObj,submitMethod,btnText,labelWidth) {
        this.formItem = [];
        this.toString = [];
        this.checkDatas = {};
        this.parentId = parentId;
        // 用于渲染表单
        this.layuiForm = layuiObj.layuiForm;
        // 用于渲染 弹窗
        this.layuiLayer = layuiObj.layuiLayer;
        this.layerLaydate = layuiObj.layerLaydate;
        this.layerInputTags = layuiObj.layerInputTags;
        this.labelWidth = labelWidth;
        this.jQuery = layuiObj.jQuery;
        this.submitMethod = submitMethod;
        this.parent = parentId ? document.getElementById(parentId) : null;
        this.filterId = "_form_" + (new Date()).getTime();
        this.dom = `<div form-id="${this.filterId}" style="width:100%;"><div class="layui-form" lay-filter="${this.filterId}">$dom$$otherDom$</div>$btnDom$</div>`;
        this.btnText = btnText || "立即提交";
        // 计数器，用于避免 addFormItem 中添加是为 item 设置 id 时重复
        this.btnEventBind = false;
    }

    // checkDatas 返回内容为 Error，如果是 false 表示没有错误，默认不检查
    // checkDatas 的参数是对应字段的 值
    // checkDatas 可以是一个数组，例如
    // [
    //     _ => {
    //         if (!_) {
    //             return new Error('不能为空')
    //         }
    //     },
    //     _ => {
    //         if (_.length < 10) {
    //             return new Error('长度不能小于 5');
    //         }
    //     }
    // ]
    addFormItem(item,checkDatas,toString) {
        if (item.type === "mapArray") {
            item.layuiLayer = this.layuiLayer;
        }
        this.toString.push(toString || Form.ToString);
        this.formItem.push(item);
        if (checkDatas) {
            if (checkDatas instanceof Array) {} else {
                checkDatas = [checkDatas];
            }
        } else {
            checkDatas = [(_ => false)]
        }
        this.checkDatas[item.formName] = checkDatas;
        item.id = Form.uuid(this.formItem.length);
        return this;
    }

    // index 可以是 item 的顺序例如 0，1
    // 也可以是 formName，例如 id、name
    getFormItem(index) {
        if (typeof index === 'number') {
            return this.formItem[index];
        } else {
            index = index.toString();
            let i = 0;
            for (;i < this.formItem.length;i++) {
                if (this.formItem[i].formName === index) {
                    return this.formItem[i];
                }
            }
        }
    }

    setValues(obj) {
        for (let i in obj) {
            this.setValue(i,obj[i]);
        }
    }
    setValue(formName,value) {
        for (let i = 0;i < this.formItem.length;i++) {
            if (this.formItem[i].formName === formName) {
                this.formItem[i].setValue(value);
                break;
            }
        }
        return this;
    }

    get value() {
        let errMessage = [];
        let values = {};
        this.formItem.forEach((item,ind) => {
            let val = item.value;
            values = {
                ...values,
                ...{
                    [item.formName]: val
                },
            };
            let em = "";
            this.checkDatas[item.formName].forEach(cd => {
                let err = cd(val);
                if (err) {
                    em += "\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + err.message;
                }
            });
            if (em.length) {
                errMessage.push(`字段[${item.label}(${item.formName})]：${em}`);
                $(`[lay-filter="${item.id}"]`).css({
                    border: "1px solid red"
                });
            } else {
                $(`[lay-filter="${item.id}"]`).css({
                    border: "1px solid rgba(0,0,0,0)"
                });
            }
        });
        if (errMessage.length)
            this.layuiLayer.open({
                content: `<div>${errMessage.join('<br/>').replace(/\n/g,'<br/>')}</div>`
            });
        return {
            err: (errMessage.length ? new Error(errMessage.join('\r\n')) : null),
            values
        }
    }

    reRender(id,otherDom) {
        this.parent = null;
        this.parentId = id;
        return this.render(otherDom);
    }
    render(otherDom,noButton) {
        if (!this.parent) {
            this.parent = document.getElementById(this.parentId);
        }
        let dom = "";
        let renders = [];
        this.formItem.forEach(item => {
            dom += item.getDom() + "\r\n";
            if (item.type === "map") {
                renders.push(item.render.bind(item));
            }
            if (item.type === "mapArray") {
                renders.push(item.render.bind(item));
            }
            if (item.type === "upload") {
                renders.push(item.render.bind(item));
            }
            if (item.type === "inputTags") {
                renders.push(item.render.bind(item,this.layerInputTags));
            }
            if (item.type === "Object") {
                renders.push(item.render.bind(item));
            }
            if (item.type === "date") {
                renders.push(item.render.bind(item,this.layerLaydate));
            }
            if (item.type === "ajax") {
                renders.push(item.render.bind(item,this.layuiLayer,this.jQuery));
            }
            if (item.type === "input") {
                renders.push(item.render.bind(item));
            }
            if (item.type === "textarea") {
                renders.push(item.render.bind(item));
            }
        });
        this.parent.innerHTML = this.dom.replace("$dom$",dom).replace('$btnDom$',noButton ? '' : `<div class="layui-form-item">
    <div class="layui-input-block">
      <button style="width: 100%" class="layui-btn layui-btn-normal" tar="_submit_">${this.btnText}</button>
    </div>
  </div>`)
            .replace('$otherDom$',otherDom || '');
        if (this.labelWidth) {
            $(this.parent).find('div[form-type]').each((_,div) => {
                if (div.children[0].classList.contains('layui-form-label')) {
                    div.children[0].style.width = this.labelWidth + 'px';
                } else {
                    return;
                }
                div.children[1].style.width = `calc(100% - ${this.labelWidth + 15 * 2}px)`;
                div.children[1].style.display = `inline-block`;
                div.children[1].style.margin = `0`;
            });
        }
        this.layuiForm.render('select');
        this.layuiForm.render('radio');
        this.layuiForm.render('checkbox');
        renders.forEach(_ => _());
        setTimeout(() => {
            if (this.btnEventBind) {
                return;
            }
            this.btnEventBind = true;
            $(this.parent).find(`button[tar="_submit_"]`).on('click',(function () {
                let val = this.value;
                if (val.err) {} else {
                    this.submitMethod(val.values);
                }
            }).bind(this));
        },200);
        return this;
    }

    clear() {
        this.formItem.forEach(item => {
            if (`clear` in item) {
                item.clear();
            }
        });
    }
}
