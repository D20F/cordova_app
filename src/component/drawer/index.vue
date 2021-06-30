<template>
    <div>
        <div
            v-show="degree < 100"
            :style="{ opacity: opacity }"
            class="mask"
            @click="cutover"
        ></div>
        <div
            v-gesture="{
                horizontal: (v) => horizontal(v),
                start: (v) => start(v),
                end: (v) => end(v),
            }"
            id="container"
        >
            <div
                class="main"
                :style="{ transform: `translateX(${'-' + degree + '%'})` }"
            >
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
// 手势指令必须的
export default {
    name: "drawer",
    props: {
        show: { //控制遮罩是否显示
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            degree: 100,
        };
    },

    // 
    // 
    // 
    // 
    // 
    // 
    // 使用 requestAnimationFrame 来优化动画效果
    // 
    // 
    // 
    // 
    // 
    // 
    // 
    // 
    // 




    methods: {
        horizontal(val) {
            if (val.direction == "right") {
                this.degree >= 0
                    ? (this.degree = this.degree - val.distance)
                    : (this.degree = 0);
            } else {
                this.degree <= 100
                    ? (this.degree = this.degree + val.distance)
                    : (this.degree = 100);
            }
        },
        start(val) {},
        end(val) {
            if (this.degree < 60) {
                let s = setInterval(() => {
                    this.degree = this.degree - 1;
                    if (this.degree <= 0) {
                        this.degree = 0;
                        clearInterval(s);
                    }
                }, 2);
            } else {
                let s = setInterval(() => {
                    this.degree = this.degree + 1;
                    if (this.degree >= 100) {
                        this.degree = 100;
                        clearInterval(s);
                    }
                }, 2);
            }
        },
        cutover() {
            if (this.degree == 0) {
                let s = setInterval(() => {
                    this.degree = this.degree + 2;
                    if (this.degree >= 100) {
                        this.degree = 100;
                        clearInterval(s);
                    }
                }, 1);
            } else {
                let s = setInterval(() => {
                    this.degree = this.degree - 2;
                    if (this.degree <= 0) {
                        this.degree = 0;
                        clearInterval(s);
                    }
                }, 1);
            }
        },
    },
    computed: {
        opacity() {
            return (100 - this.degree) * 0.0045;
        },
    },
    watch: {
        show: {
            handler(newVal) {
                if (newVal) {
                    let s = setInterval(() => {
                        this.degree = this.degree - 2;
                        if (this.degree <= 0) {
                            this.degree = 0;
                            clearInterval(s);
                        }
                    }, 1);
                } else {
                    let s = setInterval(() => {
                        this.degree = this.degree + 2;
                        if (this.degree >= 100) {
                            this.degree = 100;
                            clearInterval(s);
                        }
                    }, 1);
                }
            },
        },
    },
    created() {
       
    },
};
</script>

<style lang="scss" scoped>
#container {
    width: 15px;
    height: 100%;
    position: absolute;
}
.main {
    width: 85%;
    background: RGB(223, 73, 72);
    height: 100%;
    position: fixed;
}
.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: rgb(33, 33, 33);
    border-color: rgb(33, 33, 33);
}
</style>
