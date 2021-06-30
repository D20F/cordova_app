
import loading from '@/component/loading/loading'
import toast from '@/component/loading/toast'
import car from "@/component/car-number";
import togCar from "@/component/tog-car";
import ble from "@/component/ble";


export default {
    install(Vue) {
        var loadingDom;
        var carDom;
        var bleDom;
        var togCarDom;

        Vue.prototype.$loading = (val) => {
            var Profile = Vue.extend({
                components: {
                    loading
                },
                render(h) {
                    let props = {
                        content: val.content,
                        mask: val.mask,
                        icon: val.icon,
                    }
                    return h('loading', { props })

                },
            });
            loadingDom = new Profile().$mount();
            document.getElementById('app').appendChild(loadingDom.$el)
        }
        Vue.prototype.$loadingHide = () => { 
            loadingDom.$el.remove();
        }
        Vue.prototype.$toast = (val) => {
            let time;
            val.time ? time = val.time : time = 2;
            var Profile = Vue.extend({
                components: {
                    toast
                },
                render(h) {
                    let props = {
                        content: val.content,
                    }
                    return h('toast', { props })
                },
            });
            var component = new Profile().$mount();

            document.getElementById('app').appendChild(component.$el)
            setTimeout(() => { component.$el.style.opacity = 1; }, 0)
            setTimeout(() => { component.$el.style.opacity = 0; }, time * 1000)
            setTimeout(() => { component.$el.remove(); }, time * 2 * 1000)
        }
        Vue.prototype.$carShow = (val) => {
            var Profile = Vue.extend({
                components: {
                    car
                },
                render(h) {
                    let props = {
                        closeShow: val,
                    }
                    return h('car', { props })

                },
            });
            carDom = new Profile().$mount();
            document.getElementById('app').appendChild(carDom.$el)

        },
        Vue.prototype.$carHide = () => {
            carDom.$el.remove();
        }
        Vue.prototype.$bleShow = (val) => {
            var Profile = Vue.extend({
                components: {
                    ble
                },
                render(h) {
                    let props = {
                        list: val.list,
                    }
                    return h('ble', { props })
                },
            });
            bleDom = new Profile().$mount();
            document.getElementById('app').appendChild(bleDom.$el)

        },
        Vue.prototype.$bleHide = (val) => {
            bleDom.$el.remove();
        }
        Vue.prototype.$togCarShow = (val) => {
            var Profile = Vue.extend({
                components: {
                    togCar
                },
                render(h) {
                    return h('togCar',)
                },
            });
            togCarDom = new Profile().$mount();
            document.getElementById('app').appendChild(togCarDom.$el)

        },
        Vue.prototype.$togCarHide = (val) => {
            togCarDom.$el.remove();
        }
    }
}

