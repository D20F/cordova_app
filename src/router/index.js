import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        component: () => import("@/views/home/index"),
        meta: { bar: true }
    },
    {
        path: "/home/map",
        component: () => import("@/views/home/map/index"),
        meta: { title: '附近回收机', bar: false }
    },



    {
        path: "/login",
        component: () => import("@/views/login/index"),
        meta: { bar: false }
    },


    {
        path: "/my",
        component: () => import("@/views/my/index"),
        meta: { bar: true }
    },
    {
        path: "/my/history",
        component: () => import("@/views/my/history/index"),
        meta: { title: '回收历史', bar: false }
    },
    {
        path: "/my/history/details",
        component: () => import("@/views/my/history/details"),
        meta: { title: '回收详情', bar: false }
    },

    {
        path: "/recycle/recyclingDetails",
        component: () => import("@/views/recycle/recyclingDetails/index"),
        meta: { title: '回收详情', bar: false }
    },
    {
        path: "/recycle/recyclingSite",
        component: () => import("@/views/recycle/recyclingSite/index"),
        meta: { title: '回收点详情', bar: false }
    },
    {
        path: "/recycle/uploadViolation",
        component: () => import("@/views/recycle/uploadViolation/index"),
        meta: { title: '无可回收垃圾桶', bar: false }
    },

]


const router = new VueRouter({
    // mode: 'history',
    base: __dirname,
    routes
})

router.beforeEach((to, from, next) => {
 

    next();
})

export default router