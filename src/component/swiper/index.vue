<template>
    <div
        v-gesture="{
            horizontal: (v) => horizontal(v),
            start: (v) => start(v),
            end: (v) => end(v),
        }"
        id="container"
    >
        <div class="left_mask" :style="{ width: left_mask_width + 'px' }"></div>
        <div
            class="main"
            :style="{ transform: `translateX(${'-' + degree + '%'})` }"
        >
            <slot></slot>
        </div>
        <div
            class="right_mask"
            :style="{ width: right_mask_width + 'px' }"
        ></div>
    </div>
</template>
<script>
/**
 * change 索引切换时触发
 * @param {number} index
 **/
/**
 * start  开始滑动
 **/
/**
 * horizontal 滑动中
 * @param {object} val
 **/

export default {
    name: "drawer",
    data() {
        return {
            degree: 0,
            real_index: 1,
            left_mask_width: 0,
            right_mask_width: 0,
        };
    },
    props: {
        index: {
            //索引
            type: Number,
            default: 1,
        },
        mask: {
            //侧边触底显示
            type: Boolean,
            default: false,
        },
    },
    methods: {
        horizontal(val) {
            this.$emit("horizontal", val);
            // 滑动中
            if (val.direction == "right") {
                if (this.degree == 0) {
                    return this.mask ? this.maskStart(val) : 0;
                }
                this.degree = this.degree - val.distance;
            } else {
                if (this.degree >= (this.slot_length - 1) * 100) {
                    this.degree = (this.slot_length - 1) * 100;
                    this.mask ? this.maskStart(val) : 0;
                } else {
                    this.degree = this.degree + val.distance;
                }
            }
        },
        start() {
            // 滑动开始
            this.$emit("start");
        },
        end() {
            // 滑动结束

            // 防止多次添加
            let mistouch = true;

            if (this.degree == 0) {
                // console.log("最左");
                this.real_index = 1;
                this.mask ? this.maskEnd() : 0;
                return;
            } else if (this.degree >= 50 && this.real_index == 1) {
                // console.log("左左右");
                let s = setInterval(() => {
                    if (this.degree >= 100) {
                        this.degree = 100;
                        this.real_index += 1;
                        mistouch = false;
                        this.mask ? this.maskEnd() : 0;
                        clearInterval(s);
                        this.$emit("change", this.real_index);
                    }
                    if (mistouch) {
                        this.degree = this.degree + 1;
                    }
                }, 2);
                return;
            } else if (this.degree <= 50 && this.real_index == 1) {
                // console.log("左左左");
                let s = setInterval(() => {
                    if (this.degree <= 0) {
                        this.degree = 0;
                        mistouch = false;
                        this.mask ? this.maskEnd() : 0;
                        clearInterval(s);
                        this.$emit("change", this.real_index);
                    }
                    if (mistouch) {
                        this.degree = this.degree - 1;
                    }
                }, 2);
                return;
            } else if (this.degree >= (this.slot_length - 1) * 100) {
                // console.log("右触底");
                this.real_index = this.slot_length;
                this.mask ? this.maskEnd() : 0;
                return;
            } else if (
                this.degree <= (this.slot_length - 2) * 100 + 50 &&
                this.real_index == this.slot_length
            ) {
                // console.log("右右左");
                let s = setInterval(() => {
                    if (this.degree <= (this.slot_length - 2) * 100) {
                        this.degree = (this.slot_length - 2) * 100;
                        this.real_index -= 1;
                        mistouch = false;
                        this.mask ? this.maskEnd() : 0;
                        clearInterval(s);
                        this.$emit("change", this.real_index);
                    }
                    if (mistouch) {
                        this.degree = this.degree - 1;
                    }
                }, 2);
                return;
            } else if (
                this.degree >= (this.slot_length - 2) * 100 + 50 &&
                this.real_index == this.slot_length
            ) {
                // console.log("右右左");
                let s = setInterval(() => {
                    if (this.degree >= (this.slot_length - 1) * 100) {
                        this.degree = (this.slot_length - 1) * 100;
                        mistouch = false;
                        this.mask ? this.maskEnd() : 0;
                        clearInterval(s);
                        this.$emit("change", this.real_index);
                    }
                    if (mistouch) {
                        this.degree = this.degree + 1;
                    }
                }, 2);
                return;
            }

            if (
                this.degree < (this.real_index - 1) * 100 &&
                this.degree < (this.real_index - 2) * 100 + 50
            ) {
                let s = setInterval(() => {
                    if (this.degree <= (this.real_index - 2) * 100) {
                        this.degree = (this.real_index - 2) * 100;
                        this.real_index -= 1;
                        mistouch = false;
                        clearInterval(s);
                        this.$emit("change", this.real_index);
                    }
                    if (mistouch) {
                        this.degree = this.degree - 1;
                    }
                }, 2);
            } else if (
                this.degree < (this.real_index - 1) * 100 &&
                this.degree >= (this.real_index - 2) * 100 + 50
            ) {
                let s = setInterval(() => {
                    if (this.degree >= (this.real_index - 1) * 100) {
                        this.degree = (this.real_index - 1) * 100;
                        mistouch = false;
                        clearInterval(s);
                        this.$emit("change", this.real_index);
                    }
                    if (mistouch) {
                        this.degree = this.degree + 1;
                    }
                }, 2);
            } else if (
                this.degree > (this.real_index - 1) * 100 &&
                this.degree < (this.real_index - 1) * 100 + 50
            ) {
                let s = setInterval(() => {
                    if (this.degree <= (this.real_index - 1) * 100) {
                        this.degree = (this.real_index - 1) * 100;
                        mistouch = false;
                        clearInterval(s);
                        this.$emit("change", this.real_index);
                    }
                    if (mistouch) {
                        this.degree = this.degree - 1;
                    }
                }, 2);
            } else if (
                this.degree > (this.real_index - 1) * 100 &&
                this.degree >= (this.real_index - 1) * 100 + 50
            ) {
                let s = setInterval(() => {
                    if (this.degree >= this.real_index * 100) {
                        this.degree = this.real_index * 100;
                        this.real_index += 1;
                        mistouch = false;
                        clearInterval(s);
                        this.$emit("change", this.real_index);
                    }
                    if (mistouch) {
                        this.degree = this.degree + 1;
                    }
                }, 2);
            }
        },
        init() {
            this.real_index = this.index;
            this.degree = (this.real_index - 1) * 100;
        },
        maskStart(val) {
            if (val.direction == "right") {
                this.left_mask_width > 50
                    ? (this.left_mask_width = 50)
                    : (this.left_mask_width =
                          this.left_mask_width + val.distance);
            } else {
                this.right_mask_width > 50
                    ? (this.right_mask_width = 50)
                    : (this.right_mask_width =
                          this.right_mask_width + val.distance);
            }
        },
        maskEnd() {
            if (this.left_mask_width !== 0) {
                let s = setInterval(() => {
                    this.left_mask_width -= 0.3;
                    if (this.left_mask_width <= 0) {
                        this.left_mask_width = 0;
                        clearInterval(s);
                    }
                }, 2);
            } else {
                let s = setInterval(() => {
                    this.right_mask_width -= 0.3;
                    if (this.right_mask_width <= 0) {
                        this.right_mask_width = 0;
                        clearInterval(s);
                    }
                }, 2);
            }
        },
    },
    watch: {
        index: {
            //完善索引 完善侧边阴影
            handler(newVal) {
                if (newVal) {
                    this.real_index = newVal;
                    this.degree = (this.real_index - 1) * 100;
                }
            },
        },
    },
    computed: {
        slot_length() {
            return this.$slots.default.length;
        },
    },
    created() {
        this.init();
    },
};
</script>

<style lang="scss" scoped>
#container {
    position: relative;
    white-space: nowrap;
    overflow: hidden;
}
.main {
    width: 100%;
    height: 100%;
    position: relative;
}
.left_mask {
    height: 100%;
    border-top-right-radius: 100% 50%;
    border-bottom-right-radius: 100% 50%;
    z-index: 100;
    background: #eeeeee;
    opacity: 0.3;
    position: fixed;
    left: 0;
    top: 0;
}
.right_mask {
    height: 100%;
    border-top-left-radius: 100% 50%;
    border-bottom-left-radius: 100% 50%;
    z-index: 100;
    background: #eeeeee;
    opacity: 0.3;
    position: fixed;
    right: 0;
    top: 0;
}
</style>
