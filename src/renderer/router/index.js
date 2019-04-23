import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Home',
            component: require('@/components/Home').default
        },
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/reader',
            name: 'Reader',
            component: require('@/components/Reader').default
        }
    ]
})