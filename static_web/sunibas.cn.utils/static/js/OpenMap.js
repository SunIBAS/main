class OpenMap {
    constructor(layer,mapSrc,setWindowVar) {
        this.layer = layer;
        this.mapSrc = mapSrc;
        this.layerId = null;
        this.ifr = null;
        this.GeoJsonManager = null;
        this.window = null;
        this.setWindowVar = setWindowVar || {};
    }

    open(cb) {
        cb = cb || (_ => _);
        if (!this.layerId) {
            this.layerId = layer.open({
                area: ['50%','50%'],
                offset: 'rb',
                type: 2,
                content: [this.mapSrc,'no'],
                maxmin: true,
                resize: true,
                shade: false,
                cancel: function(){
                    layer.msg('不支持关闭，因为动态创建太浪费了，要不最小化吧');
                    return false;
                }
            });
            this.ifr = jquery(`#layui-layer${this.layerId}`).find('iframe')[0];
            let $this = this;
            let id = setInterval(() => {
                if (this.ifr.contentWindow && this.ifr.contentWindow.geoJsonManager) {
                    this.GeoJsonManager = this.ifr.contentWindow.geoJsonManager;
                    clearInterval(id);
                    cb($this);
                }
                this.window = this.ifr.contentWindow;
                for (let i in this.setWindowVar) {
                    this.window[i] = this.setWindowVar[i];
                }
            },500);
        } else {
            cb(this);
        }
    }

    setIfrWindowVar(varName,varValue) {
        this.window[varName] = varValue;
        this.setWindowVar[varName] = varValue;
    }

    // [{
    //     "type": "Feature",
    //     "properties": {"party": "Democrat"},
    //     "geometry": {
    //         "type": "Polygon",
    //         "coordinates": [[
    //             [-109.05, 41.00],
    //             [-102.06, 40.99],
    //             [-102.03, 36.99],
    //             [-109.04, 36.99],
    //             [-109.05, 41.00]
    //         ]]
    //     }
    // }];
    addGeoJson(geojsons) {
        this.GeoJsonManager.addGeoJSON(geojsons);
    }
}