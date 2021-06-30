import Vue from 'vue'
Vue.directive('gesture', {
    bind: function (el, binding, vnode) {
        el.addEventListener("touchstart", touchstart, false);
        el.addEventListener("touchend", touchend, false);
        el.addEventListener("touchmove", touchmove, false);

        let x, y, clientWidth, clientHeight;
        clientWidth = document.body.clientWidth;
        clientHeight = document.body.clientHeight;
        function touchstart(event) {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
            binding.value.start()
        }
        function touchend(event) {
            binding.value.end()
        }

        function touchmove(event) {
            if (event.changedTouches[0].clientX - x >= 0 && binding.value.horizontal) {
                let data = {
                    direction: 'right',
                    distance: ((event.changedTouches[0].clientX - x) / clientWidth) * 100,
                    unit:'%'
                }
                binding.value.horizontal(data)
            } else if (event.changedTouches[0].clientX - x <= 0 && binding.value.horizontal) {
                let data = {
                    direction: 'left',
                    distance: ((x - event.changedTouches[0].clientX) / clientWidth) * 100,
                    unit:'%'
                }
                binding.value.horizontal(data)
            }
            x = event.changedTouches[0].clientX

            if (event.changedTouches[0].clientY - y >= 0 && binding.value.vertical) {
                let data = {
                    direction: 'down',
                    distance: ((y - event.changedTouches[0].clientY) / clientHeight) * 100,
                    unit:'%'
                }
                binding.value.vertical(data)
            } else if (event.changedTouches[0].clientY - y <= 0 && binding.value.vertical) {
                let data = {
                    direction: 'up',
                    distance: ((event.changedTouches[0].clientY - y) / clientHeight) * 100,
                    unit:'%'
                }
                binding.value.vertical(data)
            }
            y = event.changedTouches[0].clientY
        }



    },
    unbind: function (el, binding, vnode) {

    },
    inserted: function (el, binding, vnode) { },
    update: function (el, binding, vnode) { },
    componentUpdated: function (el, binding, vnode) { }
})