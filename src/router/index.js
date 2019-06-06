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
import MyProperty from '@/pages/MyProperty';
import MyJibei from '@/pages/MyJibei';
import UserEdit from '@/pages/UserEdit';
import Address from '@/pages/Address';
import AddressEdit from '@/pages/AddressEdit';
import AddAddress from '@/pages/AddAddress';
import Authentication from '@/pages/Authentication';
import BankCard from '@/pages/BankCard';
import AddBankCard from '@/pages/AddBankCard';
import SureOrder from '@/pages/SureOrder';
import PayState from '@/pages/PayState';
import Orders from '@/pages/Orders';
import OrderDetail from '@/pages/OrderDetail';
import OrderLogistics from '@/pages/OrderLogistics';

Vue.use(Router)

let router = new Router({
  // mode: 'history',
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
      path: '/static/MP_verify_eB3s1tHzWkGZmrjF.txt',
      redirect: '/MP_verify_eB3s1tHzWkGZmrjF.txt'
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
    {
      path: '/userEdit',
      name: 'UserEdit',
      meta: {
        title: '个人信息'
      },
      component: UserEdit
    },
    {
      path: '/address',
      name: 'Address',
      meta: {
        title: '地址管理'
      },
      component: Address
    },
    {
      path: '/addressEdit',
      name: 'AddressEdit',
      meta: {
        title: '地址编辑'
      },
      component: AddressEdit
    },
    {
      path: '/addAddress',
      name: 'AddAddress',
      meta: {
        title: '地址增加'
      },
      component: AddAddress
    },
    {
      path: '/authentication',
      name: 'Authentication',
      meta: {
        title: '实名认证'
      },
      component: Authentication
    },
    {
      path: '/bankcard',
      name: 'BankCard',
      meta: {
        title: '我的银行卡'
      },
      component: BankCard
    },
    {
      path: '/addBankcard',
      name: 'AddBankCard',
      meta: {
        title: '添加银行卡'
      },
      component: AddBankCard
    },
    {
      path: '/sureOrder',
      name: 'SureOrder',
      meta: {
        title: '确认订单'
      },
      component: SureOrder
    },
    {
      path: '/payState',
      name: 'PayState',
      meta: {
        title: '支付订单'
      },
      component: PayState
    },
    {
      path: '/orders',
      name: 'Orders',
      meta: {
        title: '我的订单'
      },
      component: Orders
    },
    {
      path: '/orderDetail',
      name: 'OrderDetail',
      meta: {
        title: '订单详情'
      },
      component: OrderDetail
    },
    {
      path: '/orderLogistics',
      name: 'OrderLogistics',
      meta: {
        title: '物流跟踪'
      },
      component: OrderLogistics
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
