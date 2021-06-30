<template>
    <div class="box">
        <!-- <v-col cols="12" sm="2" md="2">
            <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date"
                        label="选择日期"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title locale="zh-cn">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                        Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">
                        OK
                    </v-btn>
                </v-date-picker>
            </v-menu>
        </v-col> -->

        <div
            @click="jumpRouter('/my/history/details', item)"
            class="content"
            v-for="(item, index) in list"
            :key="index"
        >
            <div class="top">
                <div>
                    <p>{{ item.address }}</p>
                    <img src="@/static/img/home/icon1.png" />
                </div>
                <div>
                    <img src="@/static/img/home/icon2.png" />
                    <p>{{ item.time }}</p>
                    <p>{{ item.name }}</p>
                </div>
            </div>
            <div class="order_btn">
                <div></div>
                <div>
                    <p>回收完成</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import publics from "@/mixins/public.js";
import { recoveryHistory } from "@/api/mapi";
export default {
    data() {
        return {
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            list: [],
            page: 1,
        };
    },
    components: {},
    mixins: [publics],
    methods: {
        recoveryHistory() {
            let data = {
                page: this.page,
                limit: 10,
            };
            recoveryHistory(data)
                .then((res) => {
                    console.log(res);
                    if (res.status == 200) {
                        this.list = this.list.concat(res.data.list);
                    }
                })
                .catch((err) => {});
        },
    },
    watch: {},
    computed: {},
    created() {
        this.$nextTick(() => {
            let box = document.getElementsByClassName("box")[0];
            box.addEventListener("scroll", () => {
                let scrollHeight = box.scrollHeight;
                let clientHeight = box.clientHeight;
                let scrollTop = box.scrollTop;
                if (clientHeight + scrollTop == scrollHeight) {
                    this.page += 1;
                    this.recoveryHistory();
                }
            });
        });
        this.recoveryHistory();
    },
};
</script>

<style scoped lang="scss">
.box {
    width: 100%;
    height: inherit;
    overflow-y: auto;
    position: relative;
    background: #f7f8f9;
}
.space {
    width: 100%;
    height: 50px;
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
            display: block;
            padding-top: 20px;
            p {
                width: 270px;
                vertical-align: top;
                display: inline-block;
                text-align: left;
            }
            img {
                display: inline-block;
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
</style>
