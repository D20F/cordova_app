<template>
    <v-app>
        <top-bar v-show="title" />
        <div
            class="main"
            id="main"
            :style="{
                paddingTop: title ? '50px' : '0px',
                paddingBottom: bar ? '50px' : '0px',
            }"
        >
            <router-view v-if="position"></router-view>
        </div>
        <bar />

        <!-- <labelEntry />   --> <!-- -- 录入标签 -->

    </v-app>
</template>
<script>
import bar from "./component/bar/index";
import topBar from "./component/top-bar/index";
import { init, geolocation } from "@/utils/map/index";
import { transmissionGps, transmissionObtain } from "@/api/mapi";
import { getStorage } from "@/utils/storage/storage.js";
import ble from "@/mixins/ble"; // -- 蓝牙模块 
// import labelEntry from '@/component/labelEntry' // -- 录入标签

export default {
    components: {
        topBar,
        bar,
        // labelEntry, // -- 录入标签
    },
    data() {
        return {
            transitionName: "",
            position: true,  
            setIntervalObject: "",
        };
    },
    mixins: [ble],
    computed: {
        title() {
            if (this.$route.meta.title) {
                return true;
            } else {
                return false;
            }
        },
        bar() {
            if (this.$route.meta.bar) {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        // 高德api  --- 废弃
        geolocation() {  
            // timeout 超时定为10秒 定位不到超时错误了
            // 可以多设置一点
            return new Promise((resolve, reject) => {
                this.$loading({
                    content: "GPS初始化中",
                    mask: true,
                    icon: true,
                });
                this.position = false;
                init()
                    .then(() => {
                        geolocation()
                            .then((res) => {
                                this.$loadingHide();
                                resolve("win");
                                this.$store.commit("positionFun", {
                                    latitude: res.lat,
                                    longitude: res.lng,
                                });
                                this.position = true;
                            })
                            .catch((err) => {
                                this.position = true;
                                this.$loadingHide();
                                reject("err");
                                this.$toast({
                                    content: "位置获取失败,请重新打开App",
                                });
                            });

                        this.setIntervalObject = setInterval(() => {
                            geolocation()
                                .then((res) => {
                                    console.log(res);
                                    this.$store.commit("positionFun", {
                                        latitude: res.lat,
                                        longitude: res.lng,
                                    });
                                    if (
                                        this.$store.state.account.carNumber !==
                                        "未选择车牌"
                                    ) {
                                        let data = {
                                            longitude: res.lng, //经度
                                            latitude: res.lat, //纬度
                                            licenseplatenumber: this.$store
                                                .state.account.carNumber, //车牌号
                                        };
                                        transmissionGps(data)
                                            .then(() => {})
                                            .catch(() => {});
                                    }
                                })
                                .catch((err) => {});
                        }, 8000);
                    })
                    .catch(() => {
                        reject("err");
                        this.$toast({
                            content: "GPS初始化失败,请重新打开App",
                        });
                    });
            });
        },
        // cordova 高德集成   --- 废弃
        geolocations(){ 
            this.position = false;
            window.plugins.aMapLocationPlugin.getCurrentPosition((response) => {
                this.$store.commit("positionFun", {
                    latitude: response.latitude,
                    longitude: response.longitude,
                });
                this.position = true;
            },(err) => {
                this.position = true;
                this.$toast({ content: "定位获取失败" + JSON.stringify(err) });
            })
        },
        // cordova 高德集成  --- 废弃
        watchPosition(){ 
            this.$loading({
                content: "GPS初始化中",
                mask: true,
                icon: true,
            });
            this.position = false;
            window.plugins.aMapLocationPlugin.watchPosition((response) => {
                this.$store.commit("positionFun", {
                    latitude: response.latitude,
                    longitude: response.longitude,
                });
                if(!this.position){
                    this.$loadingHide();
                    this.position = true;
                }
                // this.$toast({ content: response.latitude + ',' + response.longitude });
                if (
                    this.$store.state.account.carNumber !==
                    "未选择车牌"
                ) {
                    let data = {
                        latitude: response.latitude,
                        longitude: response.longitude,
                        licenseplatenumber: this.$store
                            .state.account.carNumber, //车牌号
                    };
                    transmissionGps(data)
                        .then(() => {})
                        .catch(() => {});
                }
            },(err) => {
                if(!this.position){
                    this.$loadingHide();
                    this.position = true;
                }
                this.$toast({ content: "定位获取失败" + JSON.stringify(err) });
            },3000)
        },
        transmissionObtain(){
            transmissionObtain().then((res) => {
                if (res.status == 200) {
                    if (res.data.state == 1) {
                        this.$store.commit("carNumberFun", res.data.licenseplatenumber);
                        this.$store.commit("leftDeviceFun", res.data.bluetooth_left);
                        this.$store.commit("rightDeviceFun", res.data.bluetooth_right);
                        this.$store.commit("leftTagDeviceFun", res.data.reader_left);
                        this.$store.commit("righTagtDeviceFun", res.data.reader_right);
                        let Gothe = 357698;
                        cordova.plugins.AmapTrackPlugin.startTrack(Gothe, res.data.licenseplatenumber, true, res.data.trid, (data) => {}, (err) => {
                            this.$toast({ content: "轨迹定位失败,出车失败" });
                        });
                        this.isEnabled();
                    }
                } else {
                    this.$toast({ content: "车牌信息获取失败" });
                }
            })
        },
        init() {
            getStorage("account")
                .then(() => {
                    this.transmissionObtain();
                })
                .catch(() => {
                    this.$router.replace({ path: "/login" });
                });
        },
    },
    watch: {
        $route(to, from) {
            if (to.path == "/" && from.path == "/login") {
                // clearInterval(this.setIntervalObject);   --- 废弃
                this.transmissionObtain();
            }
        },
    },
    beforeDestroy() {
        // window.plugins.aMapLocationPlugin.clearWatch()  --- 废弃
    },
    created() {
        this.init();
    },
};
</script>

<style lang="scss" scoped>
.main {
    width: 100%;
    height: 100%;
}

.slide-left-enter-active,
.slide-left-leave-active {
    transition: opacity 0.5s;
}
.slide-left-enter,
.slide-left-leave-to {
    opacity: 0;
}
</style>
