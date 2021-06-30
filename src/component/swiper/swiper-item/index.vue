<template>
    <div class="swiper-item">
        <slot></slot>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    methods: {},
    props: {},
    computed: {},
    created() {},
};
</script>

<style lang="scss" scoped>
.swiper-item {
    width: 100%;
    height: 100%;
    display: inline-block;
    position: relative;
}
</style>
