
import axios from 'axios';
import r from '@/router'
import Vue from 'vue'
var baseURL = 'http://temp.dufook.cn/app';

import toast from '@/component/loading/toast'
let toasts = (val) => {
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

let token = localStorage.getItem('longjinhetoken');

export const xhr = axios.create({
    baseURL,
    timeout: 10000,
    headers: { token: token }
});
xhr.interceptors.response.use((res) => {
    // console.log(res.config.url,res.data.status)
    // console.log(token)

    if (res.data.status == 700) {
        toasts({
            content: '登录状态过期,请重新登录',
        })
        return r.replace({ path: '/login' });
    }
    return res
}, (err) => {
    return err
});


export const postData = (url, data, needHeader) => {
    let cookei = {};
    if (needHeader) {
        cookei = {
            token: token
        }
    }
    return new Promise((resolve, reject) => {
        xhr({ url, data, cookei, method: 'post' })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => reject(err))
    })
}

export const getData = (url, params, needHeader) => {
    let cookei = {};
    if (needHeader) {
        cookei = {
            token: token
        }
    }
    return new Promise((resolve, reject) => {
        xhr({ url, params, cookei, method: 'get' })
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    })
}










































