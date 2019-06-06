// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible'
import utils from '@/utils'
import filters from '@/filters'
import store from './store'
import {
  Row,
  Col,
  Tab,
  Tabs,
  Icon,
  Field,
  Button,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Tabbar,
  TabbarItem,
  NavBar,
  Search,
  Swipe,
  SwipeItem,
  Lazyload,
  Tag,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  ActionSheet,
  Stepper,
  List,
  Rate,
  Skeleton,
  Image,
  PullRefresh,
  Uploader,
  DatetimePicker,
  Dialog,
  AddressList,
  SwipeCell,
  Picker,
  SubmitBar,
  RadioGroup,
  Radio,
  Card,
  Step, Steps


} from "vant"

Vue.use(Tab).use(Tabs).use(Row).use(Col).use(Icon).use(Field).use(Button).use(Cell).use(CellGroup).use(Checkbox).use(CheckboxGroup).use(NavBar)
  .use(Tabbar).use(TabbarItem).use(Search).use(Swipe).use(SwipeItem).use(Lazyload).use(Tag).use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(ActionSheet)
  .use(Stepper)
  .use(List)
  .use(Rate)
  .use(Skeleton)
  .use(Image)
  .use(PullRefresh)
  .use(Uploader)
  .use(DatetimePicker)
  .use(Dialog)
  .use(AddressList)
  .use(SwipeCell)
  .use(Picker)
  .use(SubmitBar)
  .use(RadioGroup)
  .use(Radio)
  .use(Card)
  .use(Step)
  .use(Steps)

Vue.use(utils);
// 全局注册filter
Vue.filter('moneyFilter', filters.toMoney);
Vue.filter('timeFilter', filters.toTime);
Vue.filter('dateFilter', filters.toDate);
Vue.filter('numberFilter', filters.toThousands);
// import FastClick from 'fastclick'
// FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
