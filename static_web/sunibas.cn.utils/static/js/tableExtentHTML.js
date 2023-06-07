const tableExtentHTML = () => {
    let obj = tableExtent.getObj();
    obj.columns = obj.columns.map(_ => {
        if (_.parseMethod === "_=>_") {
            delete _.parseMethod;
        }
        return _;
    });
    let objs = JSON.stringify(obj,'','\t').replace(/\n/g,'\r\n');
    return `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" href="../static/css/font.css">
    <link rel="stylesheet" href="../static/css/weadmin.css">
</head>

<body>
<div class="weadmin-body">
    <blockquote class="layui-elem-quote">表格</blockquote>
    <div id="table"></div>
</div>
</body>
<script type="text/javascript" src="../static/js/form.js" charset="utf-8"></script>
<script type="text/javascript" src="../static/js/StaticTable.js" charset="utf-8"></script>
<script type="text/javascript" src="../static/js/ShowInfomation.js" charset="utf-8"></script>
<script type="text/javascript" src="../static/js/LayerLoading.js" charset="utf-8"></script>
<script type="text/javascript" src="../static/js/tableExtent.js" charset="utf-8"></script>
<script type="text/javascript" src="../static/js/mockStatic.js" charset="utf-8"></script>
<script type="text/javascript" src="../lib/layui/layui.js" charset="utf-8"></script>
<script type="text/javascript">
    layui.extend({
        admin: '{/}../static/js/admin',
    });
    layui.config({ base: './../lib/layui/extends/' })
        .extend({
            inputTags: 'inputTags/inputTags'
        }).use(['jquery', 'element','util', 'admin', 'carousel','form','layer','inputTags','laydate','table','laypage'],
        function() {
            var element = layui.element,
                $ = layui.jquery,
                layer = layui.layer,
                table = layui.table,
                form = layui.form,
                laypage = layui.laypage,
                carousel = layui.carousel,
                laydate = layui.laydate,
                util = layui.util,
                admin = layui.admin;
            LayerLoading(layer);
            window.laydate = laydate;
            var inputTags = layui.inputTags;
            window.form = form;
            window.$ = $;
            const layuiObj = {layuiForm:form,layuiLayer:layer,layerInputTags:inputTags,layerLaydate: laydate,jQuery: $};
            const tableObj = {table:table,laypage:laypage,jquery: $};
            tableExtent.setLayuiObj(Form,layuiObj,tableObj,ShowInfomation);
            tableExtent.setDom(document.getElementById("table"));
            tableExtent.initMockStaticTable(${objs});
        });
</script>

</html>`
};