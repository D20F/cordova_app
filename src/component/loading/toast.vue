<template>
    <div class="alert-box">
        <div class="content-box">
            <p>{{ content }}</p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        content: {
            type: String,
            default: "",
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
    position: absolute;
    color: #ffffff;
    font-size: 15px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    display: flex;
    transition: opacity .5s;
    pointer-events: none;
    z-index: 999;
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
    }
}

</style>
