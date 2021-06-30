

/**
 * 
 * @property {string}   name                  名字
 * @property {string}   account               链上账号名
 * @property {string}   avatar                头像
 * @property {string}   role                  账号当前角色
 * @property {string}   carNumber             车牌号
 * @property {string}   phone                 手机号
 * @property {string}   position              地理位置   --- 废弃
**/
const ACCOUNT = {
    state: () => ({
        account: '',
        avatar: '',
        name: '',
        role: '',
        carNumber: '未选择车牌',
        phone: '',
        position: {
            latitude: '',
            longitude: '',
        },
    }),
    mutations: {
        accountFun(state, data) {
            state.account = data;
        },
        avatarFun(state, data) {
            state.avatar = data;
        },
        nameFun(state, data) {
            state.name = data;
        },
        roleFun(state, data) {
            state.role = data;
        },
        carNumberFun(state, data) {
            state.carNumber = data;
        },
        phoneFun(state, data) {
            state.phone = data;
        },
        positionFun(state, data) {
            state.position = data;
        },
    },
    actions: {

    },
    modules: {

    }
}

export default ACCOUNT

