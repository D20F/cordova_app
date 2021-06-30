<template>
    <div  class="title-column">
        <v-icon @click="back">mdi-arrow-left</v-icon>
        <p>{{ $route.meta.title }}</p>
        <div class="space"></div>
        <!-- <v-btn depressed disabled outlined>
            <v-icon>mdi-format-list-bulleted-type</v-icon>
        </v-btn> -->
    </div>
</template>




<script>
export default {
    name: "notify",
    props: {},
    data() {
        return {};
    },
    computed: {

    },
    created() {},
    methods: {
        back(){
            this.$router.go(-1);
        }
    },
};
</script>

<style lang="scss" scoped>
.title-column {
    width: 90%;
    height: 50px;
    margin: 0 auto;
    left: 5%;
    position: fixed;
    display: flex;
    z-index: 899;
    background: #ffffff;
    justify-content: space-between;
    align-items: center;
    .space{
        width: 24px;
        height: 24px;
    }
}

</style>
