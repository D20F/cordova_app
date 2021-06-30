<template>
    <div v-show="bar" class="tabbar">
        <v-bottom-navigation height="50" v-model="value" grow color="primary">
            <v-btn
                style="max-width: none"
                color="rgba(0, 0, 0, 0);"
                text
                exact
                height="100%"
                @click="replaceRouter('/')"
            >
                <span>日常</span>
                <v-icon>mdi-dns</v-icon>
            </v-btn>
            <v-btn
                style="max-width: none"
                color="rgba(0, 0, 0, 0);"
                text
                height="100%"
                @click="replaceRouter('/my')"
            >
                <span>我的</span>
                <v-icon>mdi-account</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </div>
</template>

<script>
import publics from "@/mixins/public.js";
export default {
    components: {},
    mixins: [publics],
    data: () => ({ value: 0 }),
    computed: {},
    methods: {
  
    },
    computed: {
        bar() {
            if (this.$route.meta.bar == false) {
                return this.$route.meta.bar;
            } else if (this.$route.meta.bar == true) {
                return this.$route.meta.bar;
            } else {
                return true;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.tabbar {
    z-index: 899;
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0;
}
</style>