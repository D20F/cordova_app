<template>
    <div class="car" id="longjinhecar">
        <div v-if="show == 1" class="car-box">
            <span class="g-right" @click="close"></span>
            <p class="titles">选择出车车牌号</p>
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

        <div v-else-if="show == 2" class="car-box">
            <span v-show="closeShow" class="g-right" @click="close"></span>
            <div class="line-box" @click="show = 3">
                <p>收车</p>
            </div>
        </div>

        <div v-else-if="show == 3" class="car-box verify">
            <span class="g-right" @click="close"></span>

            <p>收车</p>
            <p>确认已完成今日的回收任务</p>
            <div class="btnbox">
                <div @click="endWork">
                    <p>确认</p>
                </div>
                <div @click="close">
                    <p>取消</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import store from "@/store/index";
import {
    transmissionTravel,
    transmissionRegression,
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
            show: 1,
            state: 0,
        };
    },
    components: {},
    mixins: [ble],
    computed: {},
    props: {
        closeShow: {
            type: Boolean,
            default: true
        },
    },
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
                    this.$toast({ content: "车牌号获取失败" });
                });
        },
        getCarState() {
            transmissionObtain()
                .then((res) => {
                    console.log(res);
                    if (res.status == 200) {
                        // 出行状态 0 未出行，1出行
                        if (res.data.state == 1) {
                            this.state = 1;
                            this.show = 2;
                            this.number = res.data.licenseplatenumber;
                            store.commit("carNumberFun", res.data.licenseplatenumber);
                        }
                    } else {
                        this.$toast({ content: "车牌信息获取失败" });
                    }
                })
                .catch((err) => {
                    this.$toast({ content: "车牌信息获取失败" });
                });
        },
        select(item) {
            this.number = item.licenseplatenumber;
            this.currentList = item;
            this.listShow = false;
        },
        confirm() {
            if (this.number == "选择你的车牌号") {
                return this.$toast({ content: "请选择你的车牌号" });
            }
            if (this.state == 0) {
                let Gothe = 357698;
                cordova.plugins.AmapTrackPlugin.startTrack(Gothe, this.number, true, -1, (data) => {
                    let parms = {
                        licenseplatenumber: this.number,
                        trid: data,
                    }; 
                    transmissionTravel(parms)
                        .then((res) => {
                            console.log(res);
                            if (res.status == 200) {
                                store.commit("leftDeviceFun", this.currentList.bluetooth_left);
                                store.commit("rightDeviceFun", this.currentList.bluetooth_right);
                                store.commit("leftTagDeviceFun", this.currentList.reader_left);
                                store.commit("righTagtDeviceFun", this.currentList.reader_right);
                                store.commit("carNumberFun", this.number);
                                this.isEnabled();
                                this.$toast({ content: "车辆出行成功" });
                                this.$carHide();
                            } else {
                                this.$toast({ content: "车辆出行失败" });
                            }
                        })
                        .catch((err) => {
                            this.$carHide();
                            this.$toast({ content: "车辆出行失败" });
                        });
                }, (err) => {
                    this.$toast({ content: "轨迹失败" + JSON.stringify(err) });
                });
            } 
        },
        endWork() {
            cordova.plugins.AmapTrackPlugin.stopTrack((data) => {
                    let parms = {
                        licenseplatenumber: this.number,
                    };
                    transmissionRegression(parms)
                        .then((res) => {
                            if (res.status === 200) {
                                this.$toast({ content: "结束回收任务成功" });
                                store.commit("carNumberFun", "未选择车牌");
                                this.allClose().then(() => {
                                    this.$loading({
                                        content: "关闭蓝牙中",
                                        mask: true,
                                        icon: true,
                                    });
                                    setTimeout(() => {
                                        this.$loadingHide();
                                    }, 3000);
                                }).catch(() => {
                                    this.$toast({ content: "关闭所有蓝牙失败" });
                                });
                                this.$carHide();
                            } else {
                                this.$toast({ content: "结束回收任务失败" });
                            }
                        })
                        .catch((err) => {
                            this.$toast({ content: "结束回收任务失败" });
                        });
                }, (err) => {
                    this.$toast({ content: "结束定位失败,收车失败" });
                });
        },
        close() {
            this.$carHide();
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
.line-box {
    width: 80%;
    height: 36px;
    border: 1px solid #b0bec5;
    border-radius: 3px;
    margin: 43px auto;
    p {
        line-height: 36px;
        color: #242424;
        font-size: 14px;
    }
}
.verify {
    p:nth-child(2) {
        padding-top: 15px;
    }
    p:nth-child(3) {
        padding-top: 20px;
    }
    div {
        div:nth-child(2) {
            background: #ff5252;
        }
    }
}
.g-right {
    position: absolute;
    top: 14px;
    right: 5px;
    display: inline-block;
    width: 15px;
    height: 2px;
    background: #ff6873;
    line-height: 0;
    font-size: 0;
    vertical-align: middle;
    transform: rotate(45deg);
}
.g-right:after {
    content: "/";
    display: block;
    width: 15px;
    height: 2px;
    background: #ff6873;
    transform: rotate(-90deg);
}
</style>
