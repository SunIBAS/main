const formExtentHTML = () => {
    let setting = Object.assign({
        "static_js": "./../static/js",
        "static_css": "./../static/css",
        "layui": "./../lib/layui/",
        "layuiExtent": "./../lib/layui/extends/",
        "formBtnText": "提交",
        "formLabelWidth": "",
        "formSubMethod": "values => {/*提交方法*/}"
    },window.settingForm.value.values.setting);
    let o = formExtent.getObj();
    let ajaxSetting = ``;
    let requireStr = ``;
    for (i in o) {
        if (o[i].type === "SelectFromAjax") {
            console.log(o[i].value.formName)
            ajaxSetting += (ajaxSetting ? '\r\n' : '') + `\t\t\t\t//${o[i].value.formName}(page){Ajax 方法内容},`
        }
        requireStr += (requireStr ? '\r\n': '') + `\t\t\t\t//${o[i].value.formName}: []`
    }
    return `<!DOCTYPE html>
<html>

<head>
\t<meta charset="UTF-8">
\t<title>欢迎页面-WeAdmin Frame型后台管理系统-WeAdmin 1.0</title>
\t<meta name="renderer" content="webkit">
\t<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
\t<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
\t<link rel="stylesheet" href="${setting.static_css}/font.css">
\t<link rel="stylesheet" href="${setting.static_css}/weadmin.css">
</head>

<body>
<div class="weadmin-body">
\t<div id="form"></div>
</div>
</body>
<script type="text/javascript" src="${setting.static_js}/form.js" charset="utf-8"></script>
<script type="text/javascript" src="${setting.static_js}/StaticTable.js" charset="utf-8"></script>
<script type="text/javascript" src="${setting.static_js}/ShowInfomation.js" charset="utf-8"></script>
<script type="text/javascript" src="${setting.static_js}/LayerLoading.js" charset="utf-8"></script>
<script type="text/javascript" src="${setting.static_js}/formExtent.js" charset="utf-8"></script>
<script type="text/javascript" src="${setting.layui}/layui.js" charset="utf-8"></script>
<script type="text/javascript">
\tlayui.extend({
\t\tadmin: '{/}${setting.static_js}/admin',
\t});
\tlayui.config({ base: '${setting.layuiExtent}' })
\t\t\t.extend({
\t\t\t\tinputTags: 'inputTags/inputTags'
\t\t\t}).use(['jquery', 'element','util', 'admin', 'carousel','form','layer','inputTags','laydate'], function() {
\t\tvar element = layui.element,
\t\t\t\t$ = layui.jquery,
\t\t\t\tlayer = layui.layer,
\t\t\t\tform = layui.form,
\t\t\t\tcarousel = layui.carousel,
\t\t\t\tlaydate = layui.laydate,
\t\t\t\tutil = layui.util,
\t\t\t\tadmin = layui.admin;
\t\tLayerLoading(layer);
\t\twindow.laydate = laydate;
\t\tvar inputTags = layui.inputTags;
\t\twindow.form = form;
\t\twindow.$ = $;
\t\tconst layuiObj = {layuiForm:form,layuiLayer:layer,layerInputTags:inputTags,layerLaydate: laydate,jQuery: $};
\t\tformExtent.setLayuiObj(layuiObj);
\t\tformExtent.setForm(Form);
\t\tformExtent.setShowInfomation(ShowInfomation);

\t\t// req=[] 是检验字段的方法，
\t\t// 例如 req=[
\t\t//      v => { 
\t\t//          if(v.length < 5) { 
\t\t//              return new Error("长度小于5") 
\t\t//      } else {
\t\t//          return false;
\t\t//      }
\t\t//      }
\t\t//   ]
\t\tlet obj = [...表单JSON中的内容..];

\t\t// require 格式为 [_ => { if (检查(_) == "错误") {
\t\t//      return new Error("错误信息");
\t\t// }},_ => { ... }]
\t\tlet myForm = new Form("${setting.formId}",layuiObj,${setting.formSubMethod},"提交",/* 标签宽度 */);
\t\tformExtent.renderWithVls(myForm,obj,{
\t\t\tajaxMethod: {
${ajaxSetting}
\t\t\t},
\t\t\trequire: {
${requireStr}
\t\t\t},
\t\t});
\t});
</script>

</html>`;
}