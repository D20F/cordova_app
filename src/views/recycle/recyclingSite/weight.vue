<template>
    <div class="box">
        <div>
            <div class="title">
                <p>称重重量 (kg) :</p>
            </div>
            <div class="weight">
                <div>
                    <p>
                        {{ $store.state.recycle.leftWeight.weight }}
                    </p>
                </div>
                <div>
                    <p>
                        {{ $store.state.recycle.rightWeight.weight }}
                    </p>
                </div>
            </div>
            <div class="bletitle">
                <p >蓝牙连接状态</p>
            </div>
            <div class="blebox">
                <p>
                    电子秤（左）：{{
                        bleList["left_scales"] ? "已连接" : "未连接"
                    }}
                </p>
                <p>
                    电子秤（右）：{{
                        bleList["right_scales"] ? "已连接" : "未连接"
                    }}
                </p>
            </div>
            <div class="blebox">
                <p>
                    读写器（左）：{{
                        bleList["left_tag"] ? "已连接" : "未连接"
                    }}
                </p>
                <p>
                    读写器（右）：{{
                        bleList["right_tag"] ? "已连接" : "未连接"
                    }}
                </p>
            </div>
            <!-- 调试 -->

            <!-- <p>{{ $store.state.recycle.leftDevice }}</p>
            <p>{{ $store.state.recycle.rightDevice }}</p>
            <p>{{ $store.state.recycle.leftTagDevice }}</p>
            <p>{{ $store.state.recycle.righTagtDevice }}</p>
            <div v-for="(item, index) in round" :key="index">
                <p>rfid.{{ index }}{{ item.rfid }}</p>
                <p>weight.{{ index }}{{ item.weight }}</p>
            </div>
            <p>左边次数{{ left_cache_weight }}</p>
            <p>重量:{{ left_cache.weight }}状态:{{ left_cache.state }}</p>
            <p>右边次数{{ right_cache_weight }}</p>
            <p>重量:{{ right_cache.weight }}状态:{{ right_cache.state }}</p>
            <div class="weight_btn">
                <div @click="stopNotification($store.state.recycle.leftDevice)">
                    <p>停止广播</p>
                </div>
                <div
                    @click="stopNotification($store.state.recycle.rightDevice)"
                >
                    <p>停止广播</p>
                </div>
            </div>
            <div class="weight_btn">
                <div
                    @click="
                        startNotification(
                            $store.state.recycle.leftDevice,
                            'left_scales'
                        )
                    "
                >
                    <p>开启广播</p>
                </div>
                <div
                    @click="
                        startNotification(
                            $store.state.recycle.rightDevice,
                            'right_scales'
                        )
                    "
                >
                    <p>开启广播</p>
                </div>
            </div>
            <div class="btn_green" @click="round = []">
                <p>重置rifd</p>
            </div> -->

            <!-- 调试 -->

            <div class="weight_btn">
                <div @click="rest($store.state.recycle.leftDevice, 'left')">
                    <p>重置</p>
                </div>
                <div @click="rest($store.state.recycle.rightDevice, 'right')">
                    <p>重置</p>
                </div>
            </div>

            <div class="btn_green" @click="recoveryComplete">
                <p>完成回收</p>
            </div>
        </div>
    </div>
</template>

<script>
import publics from "@/mixins/public.js";
import { recoveryRecyclesubmission } from "@/api/mapi";
import ble from "@/mixins/ble";

// 没东西放上去稳定之后 稳定零点 -> 不稳定 -> 稳定
// 东西拿下来 稳定 -> 不稳定 -> 稳定零点
// 尝试直接退出 是否会断开蓝牙   是否会出现蓝牙重复连接 不能连接
/**
 * 点击链接垃圾桶 自动开启轮询扫描电子标签  自动连接蓝牙(蓝牙反复断开连接 --- 未测试 ---应该测试是否会出错)
 * 电子标签模块 蓝牙模块 连接失败 应该报错  蓝牙秤2个 有未连接的 应该电子秤界面显示未连接
 * 一轮每次只允许单个垃圾桶到称上  第一个桶放在左边 第二个桶放在右边
 * 录入电子标签    --- 待定
 * 蓝牙秤重量获取  --- 待定   称重稳定后拿走  可以看终端确认
 * 2个称放满了开始倾倒 倾倒完毕存储起来 --- 待定 重复上步
 * 最后点击完成回收
 */

// 1. 无法识别rfid 对应重量   需要严格按照顺序

export default {
    data() {
        return {
            ashcanList: [],
            round: [],
            readState: false,
            ws: "",
            // 调试
            // left_cache_weight: 0,
            // right_cache_weight: 0,
            // left_cache: {},
            // right_cache: {},
            // 调试
        };
    },
    props: {
        list: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    mixins: [publics, ble],
    computed: {
        bleList() {
            let list = {};
            for (const item of this.$store.state.recycle.linkBle) {
                list[item.type] = item.device;
            }
            return list;
        },
    },
    methods: {
        recoveryComplete() {
            this.$loading({
                content: "提交中",
                mask: true,
                icon: true,
            });
            let data = {
                list: this.ashcanList,
                address: this.list.address, // 回收站地址
                name: this.list.name, // 回收站名字
                licenseplatenumber: this.$store.state.account.carNumber, //车牌号
            };
            recoveryRecyclesubmission(data)
                .then((res) => {
                    console.log(res);
                    this.$loadingHide();
                    if (res.status == 200) {
                        this.replaceRouter(
                            "/recycle/recyclingDetails",
                            this.ashcanList
                        );
                    } else {
                        this.$toast({ content: "提交失败" });
                    }
                })
                .catch((err) => {
                    this.$loadingHide();
                    this.$toast({ content: "提交失败" });
                });
        },
        discover(arr, val) {
            for (let item of arr) {
                if (item.rfid == val) {
                    return true; // 缓存内有相同的rfid
                }
            }
            return false; // 缓存内没有相同的rfid
        },
        detectStable() {
            for (let item of this.round) {
                if (item.weight == "") {
                    return false; // 未全部稳定
                }
            }
            return true; // 重量全部稳定 写入完毕
        },
        initSocket() {
            let ws = new WebSocket("ws://ljh-log.dufook.cn");
            ws.onopen = () => {
                this.ws = ws;
                this.ws.onmessage = function (evt) {
                    console.log("数据已接收", evt.data);
                };
                this.ws.onclose = function () {
                    console.log("连接已关闭");
                };
                this.ws.onerror = function () {
                    console.log("连接错误");
                };
            };
        },
        socketSend() {
            let data = {
                address: this.list.address, // 回收站地址
                name: this.list.name, // 回收站名字
                licenseplatenumber: this.$store.state.account.carNumber, //车牌号
                bluetooth_left: this.$store.state.recycle.leftDevice, //蓝牙左 mac
                bluetooth_right: this.$store.state.recycle.rightDevice, //蓝牙右 mac
                weight_left: this.$store.state.recycle.leftWeight.weight, // 左秤 重量
                weight_right: this.$store.state.recycle.rightWeight.weight, // 右秤 重量
                reader_left: this.$store.state.recycle.leftTagDevice, //rfid mac
                reader_right: this.$store.state.recycle.righTagtDevice, //rfid mac
            };
            this.ws.send(JSON.stringify(data));
        },
    },
    watch: {
        // 有线rfid 暂时弃用
        // "$store.state.recycle.RFIDCache": {
        //     handler(newVal) {
        //         let state = this.discover(this.round, newVal);
        //         if (!state) {
        //             if (this.round.length < 2) {
        //                 this.round.push({
        //                     rfid: newVal,
        //                     weight: "",
        //                 });
        //                 this.readState = true; // 开始读写重量
        //             } else {
        //                 this.$toast({ content: "一轮只可获取2个桶的标签" });
        //             }
        //         }
        //     },
        // },
        // 左蓝牙rfid
        "$store.state.recycle.leftRFIDCache": {
            handler(newVal) {
                this.socketSend();
                let state = this.discover(this.round, newVal);
                if (!state) {
                    if (this.round.length < 2) {
                        this.audioplay("标签读取成功");
                        this.round.push({
                            rfid: newVal,
                            weight: "",
                        });
                        this.readState = true; // 开始读写重量
                    } else {
                        this.audioplay("本轮已获取标签");
                        this.$toast({ content: "一轮只可获取2个桶的标签" });
                    }
                }
            },
        },
        // 右蓝牙rfid
        "$store.state.recycle.rightRFIDCache": {
            handler(newVal) {
                this.socketSend();
                let state = this.discover(this.round, newVal);
                if (!state) {
                    if (this.round.length < 2) {
                        this.audioplay("标签读取成功");
                        this.round.push({
                            rfid: newVal,
                            weight: "",
                        });
                        this.readState = true; // 开始读写重量
                    } else {
                        this.audioplay("本轮已获取标签");
                        this.$toast({ content: "一轮只可获取2个桶的标签" });
                    }
                }
            },
        },
        // 左秤重量
        "$store.state.recycle.leftWeight": {
            handler(newVal, oldVal) {
                this.socketSend();
                if (this.readState) {
                    let str = "";
                    for (let item of newVal.state) {
                        str += item;
                    }

                    // 调试
                    // this.left_cache_weight += 1;
                    // this.left_cache = {
                    //     weight: newVal.weight,
                    //     state: str,
                    // };
                    // 调试
                   

                    if (str == "稳定") {
                        // 只有一个直接赋值给第一个就行了
                        this.round[0].weight = newVal.weight;
                        if (this.round.length == 1) {
                            if( newVal.weight > 10){
                                this.audioplay("开启下一轮");
                                this.$toast({ content: "开启下一轮" });
                                //   单个不检测 直接开始下一轮
                                this.ashcanList = this.ashcanList.concat(
                                    this.round
                                );
                                // 清空缓存数组
                                this.round = [];
                                // 读写状态重置
                                this.readState = false;
                            }
                        } else {
                            // 全部稳定开始下一轮
                            if (this.detectStable()) {
                                if( newVal.weight > 10){
                                    this.audioplay("开启下一轮");
                                    this.$toast({ content: "开启下一轮" });
                                    this.ashcanList = this.ashcanList.concat(
                                        this.round
                                    );
                                    // 清空缓存数组
                                    this.round = [];
                                    // 读写状态重置
                                    this.readState = false;
                                }
                            }
                        }
                                 
                    }
                } else {
                    // this.$toast({ content: "请开启下一轮" });
                }
            },
        },
        // 右秤重量
        "$store.state.recycle.rightWeight": {
            handler(newVal, oldVal) {
                this.socketSend();
                if (this.readState) {
                    let str = "";
                    for (let item of newVal.state) {
                        str += item;
                    }

                    // 调试
                    // this.right_cache_weight += 1;
                    // this.right_cache = {
                    //     weight: newVal.weight,
                    //     state: str,
                    // };
                    // 调试

                    if (str == "稳定") {
                        if (this.round.length == 1) {
                            // 只有一个直接赋值给第一个就行了
                            this.round[0].weight = newVal.weight;
                            if( newVal.weight > 10){
                                this.audioplay("开启下一轮");
                                this.$toast({ content: "可以开启下一轮称重" });
                                //   单个不检测 直接开始下一轮
                                this.ashcanList = this.ashcanList.concat(
                                    this.round
                                );
                                // 清空缓存数组
                                this.round = [];
                                // 读写状态重置
                                this.readState = false;
                            }
                        } else {
                            this.round[1].weight = newVal.weight;
                            // 全部稳定开始下一轮
                            if (this.detectStable()) {
                                if( newVal.weight > 10){
                                    this.audioplay("开启下一轮");
                                    this.$toast({ content: "可以开启下一轮称重" });
                                    this.ashcanList = this.ashcanList.concat(
                                        this.round
                                    );
                                    // 清空缓存数组
                                    this.round = [];
                                    // 读写状态重置
                                    this.readState = false;
                                }
                            }
                        }
                    }
                } else {
                    // this.$toast({ content: "一轮只可获取2个桶的标签" });
                }
            },
        },
    },
    created() {
        this.initSocket();
    },
    beforeDestroy() {
        this.ws.close();
    },
};
</script>

<style scoped lang="scss">
.box {
    width: 100%;
    height: inherit;
    position: relative;
}
.title {
    width: 90%;
    height: 40px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: left;
    p {
        font-weight: 600;
        margin-right: 5px;
        color: #242424;
        font-size: 15px;
    }
}
.weight {
    display: flex;
    div {
        width: 40%;
        height: 100px;
        margin: 0 auto;
        border: 2px solid #00b075;
        border-radius: 7px;
        text-align: center;
        p {
            font-weight: 600;
            line-height: 100px;
            color: #242424;
            font-size: 22px;
        }
    }
}

.weight_btn {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 10px 0;
    div {
        width: 40%;
        height: 48px;
        border-radius: 12px;
        background: #29b6f6;
        p {
            text-align: center;
            color: #ffffff;
            line-height: 48px;
            font-size: 14px;
        }
    }
}
.btn_green {
    width: 90%;
    height: 48px;
    border-radius: 12px;
    background: #00b075;
    padding: 0;
    margin: 35px auto;
    p {
        text-align: center;
        color: #ffffff;
        line-height: 48px;
        font-size: 14px;
    }
}
.bletitle {
    p {
        margin-left: 17px;
        font-weight: 600;
        color: #242424;
        font-size: 15px;
    }
}
.blebox {
    display: flex;
    justify-content: space-around;
    align-items: center;
    p {
        color: #242424;
        font-size: 15px;
    }
}
</style>
