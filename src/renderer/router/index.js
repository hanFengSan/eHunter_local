import Vue from 'vue'
import Router from 'vue-router'
import Home from '../Home'
import CoreApp from '../CoreApp'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/CoreApp',
            name: 'CoreApp',
            component: CoreApp
        }
    ]
})