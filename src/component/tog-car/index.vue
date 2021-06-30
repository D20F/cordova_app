<template>
    <div class="car" id="longjinhecar">
        <div class="car-box">
            <p class="titles">切换出车车牌号</p>
            <div
                class="select"
                @click="
                    list.length
                        ? (listShow = true)
                        : $toast({ content: '无车牌可替换' })
                "
            >
                <p>{{ number }}</p>
                <i class="ioff"></i>
            </div>
            <div class="list" v-show="listShow">
                <div
                    class="item"
                    v-for="(item, index) of list"
                    :key="index"
                    @click="select(item)"
                >
                    <p>{{ item.licenseplatenumber }}</p>
                </div>
            </div>
            <div class="btnbox">
                <div @click="confirm">
                    <p>确认</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>





//  ---   废弃组件 






import store from "@/store/index";
import {
    transmissionModify,
    transmissionSelecticenseplatenumber,
    transmissionObtain,
} from "@/api/mapi";
import ble from "@/mixins/ble";

export default {
    data() {
        return {
            number: "选择你的车牌号",
            list: [],
            listShow: false,
            currentList: {},
        };
    },
    components: {},
    mixins: [ble],
    computed: {},
    created() {
        this.getCarNumber();
        this.getCarState();
    },
    methods: {
        getCarNumber() {
            transmissionSelecticenseplatenumber()
                .then((res) => {
                    console.log(res);
                    if (res.status == 200) {
                        this.list = res.data.list;
                    } else {
                        this.$toast({ content: "车牌号获取失败" });
                    }
                })
                .catch((err) => {
                    this.$toast({ content: "车牌号请求发送失败" });
                });
        },
        getCarState() {
            transmissionObtain()
                .then((res) => {
                    console.log(res);
                    if (res.status == 200) {
                        // 出行状态 0 未出行，1出行
                        if (res.data.state == 1) {
                            this.number = res.data.licenseplatenumber;
                            store.commit(
                                "carNumberFun",
                                res.data.licenseplatenumber
                            );
                        }
                    } else {
                        this.$toast({ content: "车牌信息获取失败" });
                    }
                })
                .catch((err) => {
                    this.$toast({ content: "车牌信息请求发送失败" });
                });
        },
        transmissionModify() {
            return new Promise((resolve, reject) => {
                let data = {
                    oldLicenseplatenumber: store.state.account.carNumber,
                    newLicenseplatenumber: this.number,
                };
                transmissionModify(data)
                    .then((res) => {
                        console.log(res);
                        if (res.status == 200) {
                            resolve(res);
                            store.commit("carNumberFun", this.number);
                            this.$toast({ content: "车牌号更改成功" });
                            this.$carHide();
                        } else {
                            reject("err");
                            this.$toast({ content: "车牌号更改失败" });
                        }
                    })
                    .catch((err) => {
                        reject("err");
                        this.$carHide();
                        this.$toast({ content: "车牌号更改失败" });
                    });
            });
        },
        select(item) {
            this.number = item.licenseplatenumber;
            this.currentList = item;
            this.listShow = false;
        },
        storeAktualisieren(){
            store.commit("leftDeviceFun", this.currentList.bluetooth_left);
            store.commit("rightDeviceFun", this.currentList.bluetooth_right);
            store.commit("leftTagDeviceFun", this.currentList.reader_left);
            store.commit("righTagtDeviceFun", this.currentList.reader_right);
            store.commit("carNumberFun", this.number);
        },
        stopTrack(){
            return new Promise((resolve, reject) => {
                cordova.plugins.AmapTrackPlugin.stopTrack((data) => {
                    resolve(data)
                    console.log(data);
                    // 这里上传给德江 data
                    // 这里上传给德江 data
                    // 这里上传给德江 data
                    // 这里上传给德江 data
                    // 这里上传给德江 data
                }, (err) => {
                    reject(err)
                });
            });
        },
        confirm() {
            if (this.number == "选择你的车牌号") {
                return this.$toast({ content: "请选择你的车牌号" });
            }
            this.transmissionModify()
                .then((res) => {
                    if (store.state.recycle.linkBle.length == 0) {
                        this.storeAktualisieren();
                        this.isEnabled();
                        this.$stopTrack().then(()=>{
                            let Gothe = 357698;
                            cordova.plugins.AmapTrackPlugin.startTrack(Gothe, this.number, true, (data) => {}, (err) => {});
                        });
                        this.$togCarHide();
                    } else if (store.state.recycle.linkBle.length == 1) {
                        Promise.all([
                            this.disconnect( store.state.recycle.linkBle[0].device )
                        ]).then((res) => {
                                this.storeAktualisieren();
                                this.$loading({ content: "重启蓝牙中", mask: true, icon: true });
                                setTimeout(() => {
                                    this.$loadingHide();
                                    this.$togCarHide();
                                    this.$stopTrack().then(()=>{
                                        let Gothe = 357698;
                                        cordova.plugins.AmapTrackPlugin.startTrack(Gothe, this.number, true, (data) => {}, (err) => {});
                                    });
                                    this.isEnabled();
                                }, 3000);
                            })
                            .catch((err) => {
                                this.$loading({ content: "请关闭蓝牙,并重启软件", mask: true, icon: true });
                                this.$togCarHide();
                            });
                    } else if (store.state.recycle.linkBle.length == 2) {
                        Promise.all([
                            this.disconnect( store.state.recycle.linkBle[0].device ),
                            this.disconnect( store.state.recycle.linkBle[1].device ),
                        ]).then((res) => {
                                this.storeAktualisieren();
                                this.$loading({ content: "重启蓝牙中", mask: true, icon: true });
                                setTimeout(() => {
                                    this.$loadingHide();
                                    this.$stopTrack().then(()=>{
                                        let Gothe = 357698;
                                        cordova.plugins.AmapTrackPlugin.startTrack(Gothe, this.number, true, (data) => {}, (err) => {});
                                    });
                                    this.isEnabled();
                                    this.$togCarHide();
                                }, 3000);
                            })
                            .catch((err) => {
                                this.$loading({ content: "请关闭蓝牙,并重启软件", mask: true, icon: true });
                                this.$togCarHide();
                            });
                    }
                })
                .catch((err) => {});
        },
    },
};
</script>

<style scoped lang="scss">
.car {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 989;
    pointer-events: auto;
    background-color: rgba(33, 33, 33, 0.5);
}

.car-box {
    width: 80%;
    height: 200px;
    background-color: #ffffff;
    position: absolute;
    border-radius: 5px;
    top: 40%;
    left: 50%;
    text-align: center;
    transform: translate(-50%, -50%);
    p {
        font-size: 15px;
    }
}
.list {
    position: absolute;
    width: 80%;
    top: 98px;
    left: 10%;
    background: #ffffff;
    z-index: 100;
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
        0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    .item {
        width: 100%;
        height: 35px;
        border-radius: 8px;
        p {
            color: #242424;
            font-size: 15px;
            line-height: 35px;
        }
    }
}
.titles {
    font-size: 15px;
    margin: 10px auto;
}
.select {
    width: 80%;
    height: 35px;
    position: relative;
    margin: 30px auto;
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
        0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    p {
        color: #242424;
        font-size: 15px;
        line-height: 35px;
    }
    i {
        position: absolute;
        top: 13px;
        right: 20px;
        &:before {
            content: "";
            position: absolute;
            background-color: rgba(255, 104, 115, 1);
            width: 3px;
            height: 9px;
        }
        &:after {
            content: "";
            position: absolute;
            background-color: rgba(255, 104, 115, 1);
            width: 3px;
            height: 9px;
        }
    }
    .ion {
        &:before {
            transform: translate(-2px, 0) rotate(45deg);
        }
        &:after {
            transform: translate(2px, 0) rotate(-45deg);
        }
    }
    .ioff {
        &:before {
            transform: translate(2px, 0) rotate(45deg);
        }
        &:after {
            transform: translate(-2px, 0) rotate(-45deg);
        }
    }
}
.btnbox {
    display: flex;
    width: 100%;
    justify-content: space-around;
    margin: 50px auto;
    div {
        height: 36px;
        min-width: 64px;
        padding: 0 16px;
        font-size: 0.875rem;
        box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
            0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
        border-radius: 3px;
        p {
            line-height: 36px;
            color: #ffffff;
        }
    }
    // div:nth-child(1) {
    //     background: #ff5252;
    // }
    div:nth-child(1) {
        background: #4caf50;
    }
}
</style>
