<template>
    <div class="box">
        <div class="topbar">
            <p @click="$carShow()">{{ account.carNumber }}</p>
            <p>日常</p>
            <img :src="account.avatar" />
        </div>
        <div
            @click="jumpRouterCar('/recycle/recyclingSite', item)"
            class="content"
            v-for="(item, index) in list"
            :key="index"
        >
            <div class="top">
                <div>
                    <p>{{ item.name }}</p>
                    <img
                        @click.stop="open_map(item)"
                        src="@/static/img/home/icon1.png"
                    />
                </div>
                <div>
                    <img src="@/static/img/home/icon2.png" />
                    <p>{{ item.address }}</p>
                    <p>{{ item.distance }}</p>
                </div>
            </div>
            <div class="order_btn">
                <div></div>
                <div>
                    <p>等待回收</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import publics from "@/mixins/public.js";
import { getStorage, setStorage } from "@/utils/storage/storage.js";
import { recoverySelect } from "@/api/mapi";
import { Decimal } from "decimal.js";

export default {
    data() {
        return {
            list: [],
            latitude: 0,
            longitude: 0,
        };
    },
    mixins: [publics],
    methods: {
        init() {
            getStorage("account")
                .then((res) => {
                    this.$store.commit("accountFun", res);
                })
                .catch((err) => {});
            getStorage("name")
                .then((res) => {
                    this.$store.commit("nameFun", res);
                })
                .catch((err) => {});
            getStorage("avatar")
                .then((res) => {
                    this.$store.commit("avatarFun", res);
                })
                .catch((err) => {});
            recoverySelect()
                .then((res) => {
                    // console.log(res);
                    if (res.status == 200) {
                        this.list = res.data.list;
                        for (let item of this.list) {
                            item.distance = this.unitConversion(item.distance);
                        }
                    }
                })
                .catch((err) => {});
        },
        open_map(item) {
            this.jumpRouter("/home/map", item);
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
        this.init();
    },
    computed: {
        account() {
            return this.$store.state.account;
        },
    },
    watch: {},
};
</script>

<style scoped lang="scss">
.box {
    width: 100%;
    height: inherit;
    overflow-y: auto;
    position: relative;
    padding-top: 54px;
    background: rgb(250, 250, 250);
}
.content {
    width: 90%;
    border-radius: 12px;
    margin: 0 auto 12px auto;
    background: #ffffff;
    .order_btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 90%;
        height: 55px;
        margin: 0 auto;
        div:nth-child(2) {
            p {
                line-height: 32px;
                color: #00b075;
                font-size: 16px;
                text-align: center;
            }
        }
    }
    .top {
        padding-bottom: 5px;
        border-bottom: 1px solid #cccccc;
        div {
            width: 90%;
            margin: 0 auto;
            display: flex;
            align-content: center;
        }
        div:nth-child(1) {
            display: flex;
            padding-top: 20px;
            justify-content: space-between;
            align-items: center;
            p {
            }
            img {
                width: 32px;
                height: 32px;
            }
        }
        div:nth-child(2) {
            justify-content: left;
            margin-top: 5px;
            img {
                width: 16px;
                height: 16px;
            }
            p {
                text-align: left;
            }
            p:nth-child(2) {
                color: #b3b3b3;
                font-size: 14px;
                margin: 0 25px 0 5px;
            }
            p:nth-child(3) {
                color: #b3b3b3;
                font-size: 14px;
            }
        }
    }
}
.fulfil_mode {
    background: linear-gradient(
        87deg,
        rgba(210, 233, 221, 1) 0%,
        rgba(0, 176, 117, 0) 100%
    );
}
.topbar {
    width: 100%;
    height: 42px;
    padding: 0 5%;
    margin-bottom: 12px;
    background: #ffffff;
    // display: flex;
    // justify-content: space-between;
    // align-content: center;
    position: fixed;
    top: 0;
    z-index: 899;
    img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-top: 5px;
    }
    p:nth-child(1) {
        position: fixed;
        top: 0px;
        left: 5%;
    }
    p:nth-child(2) {
        position: fixed;
        top: 0px;
        left: 50%;
        transform: translate(-50%, 0%);
    }
    img:nth-child(3) {
        position: fixed;
        top: 0px;
        right: 5%;
    }

    p {
        line-height: 42px;
        font-size: 16px;
    }
}
</style>
