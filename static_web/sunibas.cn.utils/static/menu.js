window.menu = {
    "status": 0,
    "msg": "ok",
    "data": [
        {
            "name": "文件重命名",
            "url": "./pages/Rename.html"
        },
        {
            "name": "LAADS Data 文件下载",
            "url": "./pages/LADDS_Data.html"
        },
        {
            "name": "GES DISC 文件下载",
            "url": "./pages/GES_DISC.html"
        },
        {
            "name": "GdalWarp 裁剪",
            "url": "./pages/GDALwarp_clip.html"
        },
        {
            "name": "GDAL_MERGE",
            "url": "./pages/GDALmerge.html"
        },
        {
            "name": "ffmpeg 工具",
            "url": "./pages/ffmpeg.html"
        },
        {
            "name": "表单编辑",
            "url": "./pages/表单制作.html"
        },
        {
            "name": "表格编辑",
            "url": "./pages/表格制作.html"
        },
        {
            "name": "orginfo",
            "url": "./pages/orginfo.html"
        },
        {
            "name": "自定义工具集",
            "url": "./pages/selfDefined.html"
        }
    ].map((_,ind) => {
        _.id = ind;_.icon = "";
        return _;
    })
};