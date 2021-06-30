import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import ACCOUNT from './modules/account'
import RECYCLE from './modules/recycle'


const store = new Vuex.Store({
    modules: {
        account: ACCOUNT,
        recycle: RECYCLE,
    }
})

export default store