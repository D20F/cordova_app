<template>
    <div class="box">
        <div class="title">
            <p>回收点:</p>
            <p>{{ list.name }}</p>
        </div>
        <!-- <div class="attribution">
            <p>垃圾桶归属:</p>
            <p>{{ list.region }}</p>
        </div>
        <div class="attribution">
            <p>时间:</p>
            <p>{{ list.time }}</p>
        </div> -->
        <div v-if="step == 1">
            <div class="btn_green" @click="step = 2">
                <p>链接垃圾桶</p>
            </div>
            <div class="btn_green" @click="jumpRouter('/recycle/uploadViolation',list)">
                <p>无可回收垃圾桶</p>
            </div>
        </div>
        <div v-else-if="step == 2">
            <weight :list="list" />
        </div>
    </div>
</template>

<script>
import publics from "@/mixins/public.js";
import weight from "./weight";
export default {
    data() {
        return {
            list: {},
            step:1,
        };
    },
    components: {
        weight,
    },
    mixins: [publics],
    methods: {

    },
    watch: {},
    created() {
        this.list = this.$route.query;
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
    p:nth-child(1) {
        font-weight: 600;
        margin-right: 5px;
    }

    p {
        color: #242424;
        font-size: 15px;
    }
}
.time {
    width: 90%;
    height: 40px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: left;
    p:nth-child(1) {
        font-weight: 600;
        margin-right: 5px;
    }

    p {
        color: #242424;
        font-size: 15px;
    }
}
.attribution {
    width: 90%;
    height: 40px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: left;
    p:nth-child(1) {
        font-weight: 600;
        margin-right: 5px;
    }

    p {
        color: #242424;
        font-size: 15px;
    }
}
.btn_green {
    width: 50%;
    height: 48px;
    border-radius: 12px;
    background: #00b075;
    padding: 0;
    margin: 70px auto;
    p {
        text-align: center;
        color: #ffffff;
        line-height: 48px;
        font-size: 14px;
    }
}
</style>
