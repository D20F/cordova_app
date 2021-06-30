<template>
    <div class="export_PrivateKey">
        <p class="topp">
            私钥导出后请妥善保管，不要泄露。否则可能导致个人信息泄露
        </p>
        <div class="parea">
            <p >{{ privateKey }}</p>
        </div>
        <div class="btn" @confirm="confirm">
            <p>复制私钥</p>
        </div>
    </div>
</template>
<script>
import public_mixin from "@/mixins/public.js";

export default {
    data() {
        return {};
    },
    components: {},
    mixins: [public_mixin],
    methods: {
        confirm() {
            // 复制到剪切板记得
        },
    },
    onLoad() {},
    computed: {
        privateKey() {
            // return this.$store.state.account.privateKey;
        },
    },
};
</script>

<style  lang="scss">
.export_PrivateKey {
    width: 100%;
    height: 100%;
    position: relative;
}
.topp {
    font-size: 14px;
    color: #f1485b;
    text-align: left;
    width: 80%;
    margin: 0 auto;
    padding-top: 70px;
}
.parea {
    position: relative;
    width: 80%;
    height: 78px;
    padding: 10px 5%;
    margin:  50px auto;
    text-align: left;
    word-wrap: break-word;
    border: 1px solid #e6e6e6;
    border-radius: 12px;
    p{
        font-size: 14px;
    }
}
.btn {
    width: 80%;
    height: 45px;
    border-radius: 7.5px;
    margin: 0 auto;
    text-align: center;
    background: #00b075;
    p {
        color: #ffffff;
        line-height: 45px;
        font-size: 14px;
    }
}
</style>
