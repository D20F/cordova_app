<template>
    <div class="box_inherit">
        <div class="topbar">
            <div class="login">
                <img
                    @click="upload"
                    v-if="account.avatar"
                    :src="account.avatar"
                />
                <img @click="upload" v-else src="@/static/img/my/avatar.png" />
                <div>
                    <p>{{ account.name ? account.name : "请命名昵称" }}</p>
                    <p>{{ account.account }}</p>
                </div>
            </div>
        </div>

        <div class="features">
            <div
                class="vertical_columnImg_layout"
                v-for="(item, index) of list"
                :key="index"
                @click="jumpRouter(item.router)"
            >
                <div>
                    <img :src="item.src" />
                    <p>{{ item.title }}</p>
                </div>

                <img class="icon" src="@/static/img/my/icon_next_gray@3x.png" />
            </div>
        </div>

        <div @click="quit" class="btn">
            <p>退出登录</p>
        </div>
    </div>
</template>

<script>
import public_mixin from "@/mixins/public.js";
import {
    setStorage,
    clearStorage,
    getStorage,
} from "@/utils/storage/storage.js";
import { switchStatus, getTotalNum } from "@/api/mapi";
import axios from "axios";
import ble from "@/mixins/ble";

export default {
    data() {
        return {
            list: [
                {
                    title: "历史记录",
                    router: "/my/history",
                    src: require("@/static/img/my/equipment.png"),
                    content: "",
                },
            ],
        };
    },
    mixins: [public_mixin,ble],
    components: {},
    methods: {
        quit() {
            // 退出登录
            clearStorage();
            this.replaceRouter("/login");
            this.$store.commit("carNumberFun", "未选择车牌");
            // 断开蓝牙
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
                this.$loading({
                    content: "关闭蓝牙失败,请重启软件",
                    mask: true,
                    icon: true,
                });
            });
            
        },

        upload() {
            if (document.querySelector("#avatar")) {
                document.querySelector("#avatar").remove();
            }
            let input = document.createElement("input");
            input.type = "file";
            input.id = "avatar";
            input.multiple = "multiple";
            input.style.display = "none";
            input.accept = "image/*";
            document.body.appendChild(input);
            input.click();
            input.onchange = () => {
                let data = new FormData();
                data.append("file", input.files[0]);
                axios
                    .post("http://106.55.6.193:3000/upload", data)
                    .then((res) => {
                        console.log(res);
                        this.$toast({
                            content: "头像更改成功",
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        this.$toast({
                            content: "头像更改失败",
                        });
                    });
            };
        },
    },
    created() {},
    computed: {
        account() {
            return this.$store.state.account;
        },
        status() {
            return this.$store.state.account.status;
        },
    },
    beforeDestroy() {
        if (document.querySelector("#avatar")) {
            document.querySelector("#avatar").remove();
        }
    },
};
</script>

<style scoped lang="scss">
.box_inherit {
    width: 100%;
    height: inherit;
}
.topbar {
    width: 100%;
    padding-top: 20px;
    margin: 0px auto 25px auto;
    .no {
        margin: 0 auto;
        width: 90%;
        height: 72px;
        display: flex;
        justify-content: left;
        align-items: center;
        img {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            margin-right: 15px;
        }
        p {
            font-size: 24px;
            font-weight: 600;
            color: #1f2124;
        }
    }
    .login {
        margin: 0 auto;
        width: 90%;
        height: 72px;
        display: flex;
        justify-content: left;
        align-items: center;
        img {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            margin-right: 15px;
        }
        div {
            p:nth-child(1) {
                text-align: left;
                font-size: 24px;
                font-weight: 600;
                color: #1f2124;
            }
            p:nth-child(2) {
                text-align: left;
                font-size: 16px;
                color: #1f2124;
            }
        }
    }
}
.card {
    width: 90%;
    margin: 0 auto 25px auto;
    padding: 0 15px;
    height: 140px;
    background: url("../../static/img/my/card_pg.png") no-repeat;
    background-size: 100%;
    p:nth-child(1) {
        text-align: left;
        font-size: 16px;
        color: #eb782b;
        line-height: 75px;
    }
    div:nth-child(2) {
        display: flex;
        justify-content: left;
        align-items: baseline;
        p:nth-child(1) {
            font-size: 16px;
            font-weight: 600;
            color: #eb782b;
            line-height: 0px;
        }
        p:nth-child(2) {
            font-size: 32px;
            font-weight: 600;
            color: #eb782b;
        }
        div:nth-child(3) {
            position: absolute;
            right: 0;
            top: 10px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #fcf3e2;
            img {
                width: 24px;
                height: 24px;
            }
        }
    }
}
.features {
    width: 90%;
    margin: 0 auto;
    .vertical_columnImg_layout {
        display: flex;
        width: 100%;
        height: 60px;
        justify-content: space-between;
        align-items: center;
        div:nth-child(1) {
            display: flex;
            align-items: center;
            img:nth-child(1) {
                width: 24px;
                height: 24px;
                margin-right: 25px;
            }
            p:nth-child(2) {
                width: 150px;
                text-align: left;
                font-weight: 600;
                font-size: 16px;
                color: #1f2124;
            }
        }
        .icon {
            width: 20px;
            height: 20px;
        }
    }
}

.btn {
    width: 80%;
    height: 45px;
    border-radius: 7px;
    left: 10%;
    background: #00b075;
    text-align: center;
    position: absolute;
    bottom: 10%;
    p {
        color: #ffffff;
        line-height: 45px;
        font-size: 16px;
    }
}

.gary {
    background: #f7f8f9;
}
.greens {
    background: RGB(176, 218, 197);
}
</style>
