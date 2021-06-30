<template>
    <div>
        <p class="titles">地址信息:</p>
        <div class="write">
            <div>
                <p>省市区</p>
                <v-distpicker @selected="selected"></v-distpicker>
            </div>
            <div>
                <p>街道</p>
                <input
                    v-model="street"
                    type="text"
                    placeholder="请输入街道名"
                />
            </div>
            <div>
                <p>小区</p>
                <input
                    v-model="community"
                    type="text"
                    placeholder="请输入小区名"
                />
            </div>
        </div>
        <p class="titles">已读RFID标签:</p>
        <div class="rfid">
            <v-simple-table height="300px">
                <template v-slot:default>
                    <tbody>
                        <tr v-for="(item, index) in desserts" :key="index">
                            <td>{{ item }}</td>
                            <td>
                                <v-btn
                                    height="25"
                                    width="30"
                                    depressed
                                    color="error"
                                    @click="desserts.splice(index, 1)"
                                >
                                    删除
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <div v-if="desserts.length == 0" class="btn_green" @click="start">
            <p>开始读取</p>
        </div>
        <div v-else class="btn_green" @click="upload">
            <p>上传</p>
        </div>
    </div>
</template>
<script>
import VDistpicker from "./Distpicker";
import axios from "axios";

export default {
    components: {
        VDistpicker,
    },
    data() {
        return {
            desserts: [],
            interval: null,
            address: "",
            street: "",
            community: "",
        };
    },
    created() {
        this.initSerial();
    },
    destroyed() {
        clearInterval(this.interval);
        if (typeof Serial != "undefined") {
            // 关闭串口
            Serial.close(
                {},
                function () {},
                function (err) {}
            );
        }
    },
    methods: {
        selected(res) {
            this.address = res.province.value + res.city.value + res.area.value;
        },
        upload() {
            axios({
                method: "post",
                url: "http://temp.dufook.cn/app/rfid/adds",
                data: {
                    address: this.address,
                    street: this.street + "街道",
                    community: this.community + "小区",
                    rfidList: this.desserts,
                },
            })
                .then((res) => {
                    if (res.data.status == 200) {
                        clearInterval(this.interval);
                        this.desserts = [];
                        this.$toast({ content: "上传成功" });
                    } else {
                        this.$toast({ content: "上传失败" });
                    }
                })
                .catch((err) => {
                    this.$toast({ content: "上传失败" });
                });
        },
        discover(val) {
            for (let item of this.desserts) {
                if (item == val) {
                    return true; // 缓存内有相同的rfid
                }
            }
            this.desserts.push(val);
        },
        initSerial() {
            var that = this;
            that.$loading({
                content: "插件获取中",
                mask: true,
                icon: true,
            });
            if (typeof Serial != "undefined") {
                // 打开串口
                Serial.open(
                    {},
                    // 串口已被打开
                    function () {
                        that.$loadingHide();
                        // 注册一个read回调
                        Serial.registerReadCallback(
                            function success(res) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        res,
                                        "data"
                                    )
                                ) {
                                    // 'ff16210000100014110000002ee28011700000020febeaeb56d3c6f949'
                                    // 'ff162100001000141100000030e28011700000020febead3b592b76bcc'
                                    // e28011700000020febeaeb56
                                    // e28011700000020febead3b5
                                    let str = res.data;
                                    let v = str.substr(26, 24);
                                    if (str.length == 58) {
                                        that.discover(v);
                                        // that.$toast({ content: "获取标签成功" });
                                    } else {
                                        // that.$toast({
                                        //     content:
                                        //         "获取标签失败,请贴近桶标签",
                                        // });
                                    }
                                }
                            },
                            //read错误回调
                            function (err) {
                                that.$toast({ content: "获取标签失败" });
                                console.error(err);
                            }
                        );
                        // 上电后，模块处于非应用模式，只能接受一些基本指令。不能进行RFID相关指令操作。必须使用启动应用固件指令
                        Serial.writeHex("FF00041D0B");
                    },
                    // 打开串口失败的回调
                    function (err) {
                        console.error(err);
                        that.$loadingHide();
                        that.$toast({
                            content: "RFID 插件初始化失败,请重新进入页面",
                        });
                    }
                );
            } else {
                that.$toast({ content: "Serial 为空" });
            }
        },
        searchSerial() {
            // 切割返回的数据
            // 发送指令 FF052101E81000142F6D
            if (
                typeof Serial != "undefined" &&
                typeof Serial.writeHex != "undefined"
            ) {
                Serial.writeHex("FF052101E81000142F6D");
            } else {
                this.$toast({ content: "serial 为空" });
            }
        },
        start() {
            let that = this;
            this.interval = setInterval(() => {
                // 读取标签
                that.searchSerial();
            }, 1000);
        },
    },
};
</script>

<style lang="scss" scoped>
.write {
    width: 95%;
    margin: 0 auto;
    div {
        margin: 3px 0;
        display: flex;
        justify-content: left;
        align-items: center;
        p {
            font-size: 15px;
            margin-right: 5px;
        }
        input {
            width: 80%;
            font-size: 15px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            border-radius: 3px;
        }
    }
}
.picker {
    width: 100%;
    padding: 10% 10%;
    height: 80%;
    position: relative;
    margin: 0 auto;
    background-color: rgba(17, 17, 17, 0.7);
}
.titles {
    margin: 0;
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
.rfid {
    width: 95%;
    margin: 0 auto;
    border-radius: 5px;
    border: 1px solid #eceff1;
}
</style>
