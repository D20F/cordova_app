<template>
    <div class="alert-box" :class="{ mask: mask }">
        <div class="content-box">
            <div v-if="icon" class="loader loader--style3" title="2">
                <svg
                    version="1.1"
                    id="loader-1"
                    x="0px"
                    y="0px"
                    width="40px"
                    height="40px"
                    viewBox="0 0 50 50"
                    style="enable-background: new 0 0 50 50"
                    xml:space="preserve"
                >
                    <path
                        fill="#000"
                        d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
                    >
                        <animateTransform
                            attributeType="xml"
                            attributeName="transform"
                            type="rotate"
                            from="0 25 25"
                            to="360 25 25"
                            dur="0.6s"
                            repeatCount="indefinite"
                        />
                    </path>
                </svg>
            </div>
            <p>{{ content }}</p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        mask: {
            type: Boolean,
            default: false,
        },
        content: {
            type: String,
            default: "",
        },
        icon: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {};
    },
    components: {},
};
</script>

<style lang="scss" scoped>
.alert-box {
    width: 100%;
    height: 100%;
    position: fixed;
    pointer-events: none;
    z-index: 999;
}
.mask {
    pointer-events: auto;
    background-color: rgba(33, 33, 33, 0.5);
}
.content-box {
    background-color: rgba(17, 17, 17, 0.7);
    position: absolute;
    border-radius: 5px;
    top: 40%;
    left: 50%;
    text-align: center;
    transform: translate(-50%, -50%);
    padding: 15px;
    p {
        font-size: 15px;
        color: #ffffff;
    }
}
svg path,
svg rect {
    fill: #eceff1;
}
</style>
