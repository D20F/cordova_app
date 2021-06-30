<template>
    <div class="box">
        <div id="container"></div>
        <div class="btnbox">
            <img
                @click="move(current)"
                src="@/static/img/home/map/map_icon_current@3x.png"
            />
            <img
                @click="
                    openSysMap(
                        current.longitude,
                        current.latitude,
                        current.name
                    )
                "
                src="@/static/img/home/map/map_icon_navigation@3x.png"
            />
        </div>
        <div class="details">
            <div class="site">
                <p>回收点:{{ current.name }}</p>
                <p>{{ current.distance }}</p>
            </div>
            <div class="position">
                <img src="@/static/img/home/icon2.png" />
                <p>{{ current.address }}{{ current.region }}</p>
            </div>
            <v-divider style="margin: 10px auto"></v-divider>
            <p class="titles">推荐巡航顺序:</p>
            <div class="list">
                <div class="row" v-for="(item, index) of list" :key="index">
                    <p @click="switchs(item)">
                        {{ item.name }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import public_mixin from "@/mixins/public.js";
import { recoverySelect } from "@/api/mapi";
import { Decimal } from "decimal.js";

export default {
    components: {},
    data() {
        return {
            list: [],
            current: {},
            map: {},
        };
    },
    mixins: [public_mixin],
    methods: {
        openSysMap(lng, lat, title) {
            var mapsSource = [
                {
                    title: "高德地图",
                    pname: "com.autonavi.minimap",
                    action: "amapuri://",
                    getUrl: function () {
                        var url;
                        url = "amapuri://route/plan/";
                        url +=
                            "?sourceApplication=APP&dname=" +
                            encodeURIComponent(title) +
                            "&dlat=" +
                            lat +
                            "&dlon=" +
                            lng +
                            "&dev=0";
                        return url;
                    },
                },
                {
                    title: "百度地图",
                    pname: "com.baidu.BaiduMap",
                    action: "baidumap://",
                    getUrl: function () {
                        var url =
                            "baidumap://map/direction?destination=" +
                            encodeURIComponent(
                                "latlng:" + lat + "," + lng + "|name:" + title
                            ) +
                            "&mode=driving&src=APP&coord_type=gcj02";
                        return url;
                    },
                },
            ];
            //  手机浏览器
            // location.href = mapsSource[0].getUrl()
            // 混合开发
            cordova.InAppBrowser.open(mapsSource[0].getUrl(), "_system");
        },
        move(item) {
            this.map.moveMap(item);
        },
        switchs(item) {
            this.current = item;
            this.map.moveMap(item);
        },
        unitConversion(data) {
            let distance = "";
            let datas = data + "";
            if (datas.split(".")[0] < 1000) {
                distance = datas + " M";
            } else {
                let val = new Decimal(datas.split(".")[0])
                    .div(1000)
                    .toNumber()
                    .toFixed(2);
                distance = val + " KM";
            }
            return distance;
        },
    },
    created() {
        this.current = this.$route.query;
        let data = {
            latitude: this.$store.state.account.position.latitude,
            longitude: this.$store.state.account.position.longitude,
        };
        recoverySelect(data)
            .then((res) => {
                console.log(res);
                if (res.status == 200) {
                    this.list = res.data.list;
                    for (let item of this.list) {
                        item.distance = this.unitConversion(item.distance);
                    }
                }
            })
            .catch((err) => {});
        this.$nextTick(() => {
            this.map = require("@/utils/map/index");
            this.map.generateMap(this.current, this.list);
        });
    },
};
</script>

<style scoped  lang="scss">
.box {
    width: 100%;
    height: inherit;
    overflow-y: auto;
    position: relative;
}
#container {
    width: 100%;
    height: 100%;
}
.btnbox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    left: 5%;
    bottom: 290px;
    z-index: 9999;
    position: fixed;
    img:nth-child(1) {
        width: 44px;
        height: 44px;
    }
    img:nth-child(2) {
        width: 88px;
        height: 44px;
    }
}
.details {
    width: 90%;
    border-radius: 12px;
    z-index: 9999;
    height: 250px;
    position: fixed;
    left: 5%;
    bottom: 30px;
    background: #ffffff;
    .site {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 90%;
        margin: 12px auto;
        p {
            font-size: 16px;
        }
        p:nth-child(1) {
            color: #242424;
        }
        p:nth-child(2) {
            color: #00b075;
        }
    }
    .position {
        display: flex;
        justify-content: left;
        align-items: center;
        width: 90%;
        margin: 0 auto;
        img {
            width: 16px;
            height: 16px;
            margin-right: 4px;
        }
        p {
            font-size: 16px;
            color: #b3b3b3;
        }
    }
    .titles {
        width: 90%;
        margin: 0 auto;
        font-size: 16px;
        color: #242424;
    }
    .list {
        height: 132px;
        overflow: hidden;
        overflow-y: auto;
        .row {
            margin-left: 50px;
            p {
                font-size: 16px;
                color: #242424;
            }
        }
    }
}
</style>
