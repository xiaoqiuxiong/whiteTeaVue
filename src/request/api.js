/** 
 * api接口统一管理
 */
import {
  get,
  post  
} from './http'

// 注册
export const apiRegister = params => post('register', JSON.stringify(params) || {});
// 检查手机号是否已经注册
export const apiCheckRegister = params => post('checkRegister', JSON.stringify(params) || {});
// 获取验证码
export const apiSendCode = params => post('sendCode', JSON.stringify(params) || {});
// 登录
export const apiLogin = params => post('login', JSON.stringify(params) || {});

// 首页所有数据
export const apiHome = params => post('index', JSON.stringify(params) || {});
// 商品详情所有数据
export const apiGoods = params => post('goodsIndex', JSON.stringify(params) || {});
// 商品评论数据
export const apiGoodsComment = params => post('getComment', JSON.stringify(params) || {});
