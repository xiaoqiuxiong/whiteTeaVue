import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/pages/Register'
import Login from '@/pages/Login'
import BindPhone from '@/pages/BindPhone'
import FindPwd from '@/pages/FindPwd'
import Main from '@/pages/Main'
import Home from '@/pages/Home'
import Community from '@/pages/Community'
import CommunityRule from '@/pages/Community_rule'
import User from '@/pages/User'
import Goods from '@/pages/Goods'
import Comment from '@/pages/Comment'
import CommunityPerformance from '@/pages/CommunityPerformance'
import CommunityTeam from '@/pages/CommunityTeam'
import MyProperty from '@/pages//MyProperty';
import MyJibei from '@/pages//MyJibei';


Vue.use(Router)

let router = new Router({
  routes: [{
      path: '/',
      name: 'Main',
      component: Main,
      redirect: 'Home',
      children: [{
          path: '/home',
          name: 'Home',
          meta: {
            index: 0,
            title: '共信新零售'
          },
          component: Home
        },
        {
          path: '/community',
          name: 'Community',
          meta: {
            index: 1,
            title: '社区中心'
          },
          component: Community
        },
        {
          path: '/user',
          name: 'User',
          meta: {
            index: 2,
            title: '个人中心'
          },
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
      path: '/bindBhone',
      name: 'BindPhone',
      meta: {
        title: '绑定手机'
      },
      component: BindPhone
    },
    {
      path: '/findPwd',
      name: 'FindPwd',
      meta: {
        title: '找回密码'
      },
      component: FindPwd
    },
    {
      path: '/goods',
      name: 'Goods',
      meta: {
        title: '商品详情'
      },
      component: Goods
    },
    {
      path: '/comment',
      name: 'Comment',
      meta: {
        title: '评论'
      },
      component: Comment
    },
    {
      path: '/communityRule',
      name: 'CommunityRule',
      meta: {
        title: '社区规则'
      },
      component: CommunityRule
    },
    {
      path: '/communityPerformance',
      name: 'CommunityPerformance',
      meta: {
        title: '社区业绩'
      },
      component: CommunityPerformance
    },
    {
      path: '/communityTeam',
      name: 'CommunityTeam',
      meta: {
        title: '我的团队'
      },
      component: CommunityTeam
    },
    {
      path: '/myProperty',
      name: 'MyProperty',
      meta: {
        title: '我的资产'
      },
      component: MyProperty
    },
    {
      path: '/myJibei',
      name: 'MyJibei',
      meta: {
        title: '我的积贝'
      },
      component: MyJibei
    },
  ]
})

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.name === 'Login' || to.name === 'Register' || to.name === 'Home' || to.name === 'Goods' || to.name === 'Comment') {
    next();
  } else {
    let token = localStorage.getItem('token');
    if (token == null || token == '') {
      console.log('#############################################');
      next('/login');
    } else {
      next();
    }
  }
});

export default router;
