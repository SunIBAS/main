class StaticTable {
    constructor() {
        this.columns = [];
    }

    addColumn(key,label,fn) {
        this.columns.push({key,label: label || key,fn: fn || (_ => _)});
        return this;
    }

    // datas = [{},{}]
    getTable(datas) {
        return `<table class="layui-table">
  <thead>
    <tr>
    ${this.columns.map(_ => `<th>${_.label}</th>`).join('')}
    </tr> 
  </thead>
  <tbody>
    ${(() => {
            let s = "";
            for (let i in datas) {
                s += `<tr>${this.columns.map(column => `<td>${column.fn(datas[i][column.key])}</td>`).join('')}</tr>`
            }
            return s;
        })()}
  </tbody>
</table>`.trim();
    }
}
class EditableTable {
    constructor() {
        this.columns = [];
        this.tar = `table_${new Date().getTime()}`;
        this.editIconSelector = `tar="editIcon"`;
        this.deleteIconSelector = `tar="deleteIcon"`;
    }

    addColumn(key,label) {
        this.columns.push({key,label: label || key});
        return this;
    }

    // datas = [{},{}]
    // datas 需要包含一个特定的字段 _id_ 用于索引
    getTable(datas) {
        return `<table class="layui-table" tar="${this.tar}">
  <thead>
    <tr>
    ${this.columns.map(_ => `<th>${_.label}</th>`).join('')}
    <th style="width: 50px;text-align: center;">删除</th>
    </tr> 
  </thead>
  <tbody>
    ${(() => {
            let s = "";
            for (let i in datas) {
                s += `<tr dataIndex="${datas[i]._id_}">`;
                this.columns.forEach((column) => {
                    s += `<td columnKey="${column.key}">
<span>${datas[i][column.key]}</span>
<button ${this.editIconSelector} dataIndex="${datas[i]._id_}" columnKey="${column.key}" type="button" style="float: right;" class="layui-btn layui-btn-sm layui-btn-normal"><i tar="edit" class="layui-icon">&#xe642;</i></button>
</td>`;
                });
                s += `<td style="text-align: center;"><button dataIndex="${datas[i]._id_}" type="button" ${this.deleteIconSelector} class="layui-btn layui-btn-sm layui-btn-danger"><i class="layui-icon">&#xe640;</i></button></td></tr>`
            }
            return s;
        })()}
  </tbody>
</table>`.trim();
    }
}