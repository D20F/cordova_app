
import Vue from 'vue'

import drawer from './drawer/index.vue'
import swiper from './swiper/index.vue'
import swiperItem from './swiper/swiper-item/index.vue'

// 全局注册组件
Vue.component("drawer", drawer);        //抽屉
Vue.component("swiper", swiper);        //swiper
Vue.component("swiper-item", swiperItem);//swiperItem


