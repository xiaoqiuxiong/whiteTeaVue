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
// 获取社区的积贝收入记录 (社区收入)
export const apiCommunityJiBei = params => post('communityJiBei', JSON.stringify(params) || {});
// 我的团队
export const apiMyTeam = params => post('myTeam', JSON.stringify(params) || {});
// 社区业绩总额的获取
export const apiTotalIncome = params => post('totalIncome', JSON.stringify(params) || {});
// 用户主页面
export const apiUserIndex = params => post('userIndex', JSON.stringify(params) || {})
// 获取用户的账户明细 (我的资产)
export const apiAccountLog = params => post('accountLog', JSON.stringify(params) || {});


// 首页所有数据
export const apiHome = params => post('index', JSON.stringify(params) || {});
// 商品详情所有数据
export const apiGoods = params => post('goodsIndex', JSON.stringify(params) || {});
// 商品评论数据
export const apiGoodsComment = params => post('getComment', JSON.stringify(params) || {});
