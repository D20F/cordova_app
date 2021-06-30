/*用法
this.$nextTick(() => {
    let Prism = require("@/utils/map/index");
    Prism.init();
});*/
/* <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=af03e24afc46e68e83a70eb8062edf31"></script> */
// 在地图绘制点 坐标 点显示详细信息 我都没看 可以慢慢看
// 高德  web端   name为id
let key = 'af03e24afc46e68e83a70eb8062edf31';
let map;
export let init = () => {
    return new Promise((resolve, reject) => {
        window.onLoad = function () {
            resolve('成功')
        }
        var url = `https://webapi.amap.com/maps?v=1.4.15&key=${key}&callback=onLoad`;
        var jsapi = document.createElement('script');
        jsapi.charset = 'utf-8';
        jsapi.src = url;
        document.head.appendChild(jsapi);
    })
}
export let generateMap = (res, list) => {
    map = new AMap.Map('container', {
        zoom: 13,
        center: [res.longitude, res.latitude],
    });

    let adr = map.getCenter();
    map.setCenter([adr.R, adr.Q]);
    map.setZoomAndCenter(15, [adr.R, adr.Q]);

    for (const item of list) {
        let endIcon = new AMap.Icon({
            size: new AMap.Size(30, 30),
            image: require('@/static/img/home/map/map_bin_selected.png'),
            imageSize: new AMap.Size(30, 30),
        });
        let marker = new AMap.Marker({
            icon: endIcon,
            position: [item.longitude, item.latitude],
            label: { content: `<p style="font-size: 14px;color: #242424;">${item.name}</p>`, direction: 'top' }
        });
        map.add(marker);
    }
}
export let moveMap = (res) => {
    map.panTo([res.longitude, res.latitude]);
}
// export let openMap = (res) => {
//     marker 是new AMap.Marker
//     marker.markOnAMAP({
//         name: res.name,
//         position: [res.longitude, res.latitude]
//     })
// }
export let geolocation = () => {
    return new Promise((resolve, reject) => {
        AMap.plugin('AMap.Geolocation', function () {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：5s
            });
            geolocation.getCurrentPosition(function (status, result) {
                if (status == 'complete') {
                    resolve(result.position)
                } else {
                    reject(result)
                }
            });
        });
    })
}



