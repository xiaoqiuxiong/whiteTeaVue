import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/pages/Register'
import Login from '@/pages/Login'
import BindPhone from '@/pages/BindPhone'
import FindPwd from '@/pages/FindPwd'
import Main from '@/pages/Main'
import Home from '@/pages/Home'
import Community from '@/pages/Community'
import User from '@/pages/User'
import Goods from '@/pages/Goods'
import Comment from '@/pages/Comment'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      redirect: 'Home',
      children: [{
          path: '/home',
          name: 'Home',
          meta: { index: 0,title: '共信新零售' },
          component: Home
        },
        {
          path: '/community',
          name: 'Community',
          meta: { index: 1,title: '社区中心' },
          component: Community
        },
        {
          path: '/user',
          name: 'User',
          meta: { index: 2,title: '个人中心' },
          component: User
        },
      ]
    },
    {
      path: '/register',
      name: 'Register',
      meta: {
        title: '注册'
      },
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        title: '登录'
      },
      component: Login
    },
    {
      path: '/bind_phone',
      name: 'BindPhone',
      meta: {
        title: '绑定手机'
      },
      component: BindPhone
    },
    {
      path: '/find_pwd',
      name: 'FindPwd',
      meta: {
        title: '找回密码'
      },
      component: FindPwd
    },
    {
      path: '/goods',
      name: 'Goods',
      meta: { title: '商品详情' },
      component: Goods
    },
    {
      path: '/comment',
      name: 'Comment',
      meta: { title: '评论' },
      component: Comment
    },
  ]
})
