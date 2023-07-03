function LayerLoading(layer) {
    window.loading = (new class {
        constructor() {
            this.id = null;
            this.text = null;
        }
        close() {
            if (this.id) {
                layer.close(this.id);
                this.id = null;
                this.text = null;
            }
        }
        load(text) {
            text = text || "加载中...";
            if (this.id) {
                this.text.innerText = text;
            } else {
                this.id = layer.msg(
                    `<div>
<i class="layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop" style="font-size: 30px; color: #1E9FFF;float:left;"></i>
<div style="float: left;padding-left: 5px;" class="text">${text}</div>
</div>`, {
                        shade: 0.3,
                        time: -1
                    });
                let div = document.getElementById("layui-layer" + this.id);
                div.classList.remove('layui-layer-hui');
                this.text = div.getElementsByClassName('text')[0];
            }
        }
    });
}