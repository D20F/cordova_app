<template>
    <div class="car" id="longjinhecar">
        <div class="car-box">
            <p>是否重新连接蓝牙</p>
            <div class="btnbox">
                <div @click="confirm">
                    <p>连接</p>
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
import ble from "@/mixins/ble";

export default {
    data() {
        return {};
    },
    props: {
        list: {
            type: String,
            default: () => {
                return [];
            },
        },
    },
    components: {},
    mixins: [ble],
    computed: {},
    created() {},
    methods: {
        confirm() {
            
            for (let i = 0; i < this.list.length; i++) {
                this.$loading({
                    content: "蓝牙连接中",
                    mask: true,
                    icon: true,
                });
                ble.connect(
                    this.list[i].device,
                    (res) => {
                        // 注册特征值更改
                        this.startNotification(this.list[i].device, this.list[i].type);
                        // 同步缓存到vuex
                        let arr = store.state.recycle.linkBle.concat(this.list[i]);
                        store.commit("linkBleFun", arr);
                        this.$loadingHide();
                        this.$toast({ content: "蓝牙连接成功" });
                        this.audioplay('蓝牙连接成功'); 
                        if(i == this.list.length - 1){
                            this.$bleHide();
                        }
                    },
                    (failure) => {
                        this.$loadingHide();
                        this.$toast({ content: "蓝牙连接失败" });
                        this.audioplay('蓝牙连接失败'); 
                        if(i == this.list.length - 1){
                            this.$bleHide();
                        }
                    }
                );
            }
        },
        close() {
            for (let i = 0; i < this.list.length; i++) {
                this.disconnect(this.list[i].device);                        
                if(i == this.list.length - 1){
                    this.$bleHide();
                }
            }
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
    .car-box {
        width: 80%;
        height: 200px;
        background-color: #ffffff;
        position: absolute;
        border-radius: 5px;
        top: 230px;
        left: 50%;
        text-align: center;
        transform: translate(-50%, -50%);
        padding-top: 50px;
        p {
            font-size: 15px;
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
    div:nth-child(2) {
        background: #ff5252;
    }
}
</style>
