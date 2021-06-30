
var public_component = {
    data() {
        return {

        }
    },
    methods: {
        jumpRouter(path, data) {
            this.$router.push({
                path: path,
                query: data
            })
        },
        replaceRouter(path, data) {
            this.$router.replace({
                path: path,
                query: data
            });
        },
        jumpRouterCar(path, data) {
            if (this.$store.state.account.carNumber == '未选择车牌') {
                this.$carShow();
            } else {
                this.$router.push({
                    path: path,
                    query: data
                })
            }
        },
        replaceRouterCar(path, data) {
            if (this.$store.state.account.carNumber == '未选择车牌') {
                this.$carShow();
            } else {
                this.$router.replace({
                    path: path,
                    query: data
                })

            }
        },

    },



}
export default public_component;



