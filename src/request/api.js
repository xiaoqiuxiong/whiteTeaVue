/** 
 * api接口统一管理
 */
import {
  get,
  post  
} from './http'

// 注册
export const apiRegister = params => post('/apis/register', JSON.stringify(params) || {});
// 检查手机号是否已经注册
export const apiCheckRegister = params => post('/apis/checkRegister', JSON.stringify(params) || {});
// 获取验证码
export const apiSendCode = params => post('/apis/sendCode', JSON.stringify(params) || {});
// 登录
export const apiLogin = params => post('/apis/login', JSON.stringify(params) || {});
// 首页所有数据
export const apiHome = params => post('/apis/index', JSON.stringify(params) || {});
// 商品详情所有数据
export const apiGoods = params => post('/apis/goodsIndex', JSON.stringify(params) || {});
// 商品评论数据
export const apiGoodsComment = params => post('/apis/getComment', JSON.stringify(params) || {});
// 获取社区的积贝收入记录 (社区收入)
export const apiCommunityJiBei = params => post('/apis/communityJiBei', JSON.stringify(params) || {});
// 我的团队
export const apiMyTeam = params => post('/apis/myTeam', JSON.stringify(params) || {});
// 社区业绩总额的获取
export const apiTotalIncome = params => post('/apis/totalIncome', JSON.stringify(params) || {});
// 用户主页面
export const apiUserIndex = params => post('/apis/userIndex', JSON.stringify(params) || {})
// 获取用户的账户明细 (我的资产)
export const apiAccountLog = params => post('/apis/accountLog', JSON.stringify(params) || {});
// 获取图片的上传 token
export const apiGetUploadToken = params => post('/apis/getUploadToken', JSON.stringify(params) || {})
// 用户上传头像
export const apiUploadQiniuHeadImage = params => post('/apis/uploadQiniuHeadImage', JSON.stringify(params) || {});
// KYC 实名认证的身份证图片上传
export const apiUserQiniuKYC = params => post('/apis/userQiniuKYC', JSON.stringify(params) || {});
//  修改用户资料
export const apiUpdateUserInfo = params => post('/apis/updateUserInfo', JSON.stringify(params) || {});
//  获取用户的所有收货地址
export const apiUserAddress = params => post('/apis/userAddress', JSON.stringify(params) || {});
//  获取目前支持的省市区信息 
export const apiAllAddress = params => post('/apis/allAddress', JSON.stringify(params) || {});
//  设置为默认收货地址 
export const apiSetDefaultAddress = params => post('/apis/setDefaultAddress', JSON.stringify(params) || {});
//  删除收货地址 
export const apiDelUserAddress = params => post('/apis/delUserAddress', JSON.stringify(params) || {});
//  增加一个收货地址 
export const apiAddUserAddress = params => post('/apis/addUserAddress', JSON.stringify(params) || {});
//  修改收货地址 
export const apiUpdateRecAddress = params => post('/apis/updateRecAddress', JSON.stringify(params) || {});
//  获取用户的银行卡信息 
export const apiUserBanks = params => post('/apis/userBanks', JSON.stringify(params) || {});
//  添加银行卡 
export const apiUserAddBankCard = params => post('/apis/userAddBankCard', JSON.stringify(params) || {});
//  解绑 (删除) 银行卡 
export const apiUserDelBankCard = params => post('/apis/userDelBankCard', JSON.stringify(params) || {});
//  立即购买
export const apiBuyNow = params => post('/apis/buyNow', JSON.stringify(params) || {});
//  检测订单
export const apiCheckOrder = params => post('/apis/checkOrder', JSON.stringify(params) || {});
//  确认下单
export const apiSureOrder = params => post('/apis/sureOrder', JSON.stringify(params) || {});
//  获取用户的订单记录
export const apiGetUserOrderList = params => post('/apis/getUserOrderList', JSON.stringify(params) || {});
//  查看订单
export const apiWatchOrder = params => post('/apis/watchOrder', JSON.stringify(params) || {});
//  获取微信的 AccessToken
export const apiGetAccessToken = params => post('/apis/getWebAccessToken', JSON.stringify(params) || {});
//  取消订单
export const apiCancelOrder = params => post('/apis/cancelOrder', JSON.stringify(params) || {});
//  确认收货
export const apiConfirmOrder = params => post('/apis/confirmOrder', JSON.stringify(params) || {});
//  查看物流
export const apiWatchWuLiu = params => post('/apis/watchWuLiu', JSON.stringify(params) || {});
//  积贝的使用方式
export const apiJibeiUseWay = params => post('/apis/jibeiUseWay', JSON.stringify(params) || {});
//  我的积贝详细
export const apiUserJiBei = params => post('/apis/userJiBei', JSON.stringify(params) || {});
//  我的 基金积贝 详细 (我的收入)
export const apiUserJiJin = params => post('/apis/userJiJin', JSON.stringify(params) || {});
//  基金积贝 兑换 现金 或 积贝
export const apiExchangeJiJinJiBei = params => post('/apis/exchangeJiJinJiBei', JSON.stringify(params) || {});
//  提现申请
export const apiUserWithdraw = params => post('/apis/userWithdraw', JSON.stringify(params) || {});
//  获取 jsapi_ticket
export const apiGetWebAccessTicket = params => post('/apis/getWebAccessTicket', JSON.stringify(params) || {});
//  获取 access_token 和 openid
export const apiGetWebAccessToken = params => post('/apis/getWebAccessToken', JSON.stringify(params) || {});
//  直接付款
export const apiDoPay = params => post('/apis/doPay', JSON.stringify(params) || {});
//  根据手机号找回密码1
export const apiFindBackPwByPhone1 = params => post('/apis/findBackPwByPhone1', JSON.stringify(params) || {});
//  根据手机号找回密码2
export const apiFindBackPwByPhone2 = params => post('/apis/findBackPwByPhone2', JSON.stringify(params) || {});
//  获取热门搜索 
export const apiGetHotGoods = params => post('/apis/getHotGoods', JSON.stringify(params) || {});
//  搜索商品
export const apiSearchGoods = params => post('/apis/searchGoods', JSON.stringify(params) || {});
//  获取对冲规则文字
export const apiGetDuiChongRule = params => post('/apis/getDuiChongRule', JSON.stringify(params) || {});
//  获取生成邀请二维码的信息
export const apiGetInviteUserInfo = params => post('/apis/getInviteUserInfo', JSON.stringify(params) || {});
//  获取对冲类型的邀请二维码的信息
export const apiGetUserDuiChongInfo = params => post('/apis/getUserDuiChongInfo', JSON.stringify(params) || {});
//  扫码后绑定用户
export const apiBindUser = params => post('/apis/bindUser', JSON.stringify(params) || {});
//  立即兑换
export const apiExchangeGoods = params => post('/apis/exchangeGoods', JSON.stringify(params) || {});
//  微信登录
export const apiWxLogin = params => post('/apis/wxLogin', JSON.stringify(params) || {});
//  微信绑定手机号等信息
export const apiBindWxAppVersion = params => post('/apis/bindWxAppVersion', JSON.stringify(params) || {});
//  判断一个用户是否有资格领取面膜
export const apiIsUserCanGetMask = params => post('/apis/isUserCanGetMask', JSON.stringify(params) || {});
//  点击领取面膜
export const apiGetMask = params => post('/apis/getMask', JSON.stringify(params) || {});
//  面膜下单
export const apiSureMaskOrder = params => post('/apis/sureMaskOrder', JSON.stringify(params) || {});
//  上传评论
export const apiSendComment = params => post('/apis/sendComment', JSON.stringify(params) || {});

