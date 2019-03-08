const util = require('../../utils/util')

const app = getApp()
const db = app.globalData.db
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Page({
  data: {
    Version,
    dbUserInfo: null,
    showLogin: false,
    icon: {
      right: '../../images/common/right.png',
      phone: '../../images/common/phone.png',
      wechat: '../../images/common/wechat.png',
    }
  },
  onLoad(options) {
    this.getUserInfo()
  },
  onReady() {
    
  },
  onShow() {
    if (app.globalData.showRefresh) {
      this.getUserInfo()
      app.globalData.showRefresh = false
    }
  },
  onHide() {
    
  },
  onUnload() {
    
  },
  onPullDownRefresh() {
    this.getUserInfo()    
  },
  onReachBottom() {
    
  },
  // 用户点击右上角分享
  onShareAppMessage() {
    
  },
  // 去登录页面
  goLoginPage() {
    wx.navigateTo({
      url: './login/index',
    })
  },
  // 去意见反馈页面
  goFeedbackPage() {
    wx.navigateTo({
      url: './feedback/index',
    })
  },
  // 去店铺认证页面
  goVerifyPage(e){
    console.log(e)
    const shopv = e.currentTarget.dataset.shopv || null
    if(shopv&&shopv.status==1){
      const uid = this.data.dbUserInfo._id
      if(uid){
        console.log(uid)
        wx.navigateTo({
          url: './shop/detail/index?uid='+uid,
        })
      }
    }else{
      wx.navigateTo({
        url: './shop/verify/index',
      })
    }
  },
  // 申请开通店铺
  applyOpenShop(){
    const dbUserInfo = app.globalData.dbUserInfo || wx.getStorageSync('dbUserInfo')
    const _id = dbUserInfo && dbUserInfo._id
    if (!_id) {
      wx.navigateTo({
        url: './login/index',
      })
      return
    }
    wx.navigateTo({
      url: './shop/open/index',
    })
  },
  // 获取用户信息
  getUserInfo() {
    const dbUserInfo = app.globalData.dbUserInfo || wx.getStorageSync('dbUserInfo')
    const _id = dbUserInfo && dbUserInfo._id
    if (!_id) {
      this.setData({
        showLogin: true
      })
      wx.navigateTo({
        url: '../me/login/index',
      })
      return
    }
    wx.showLoading({
      title: Tips.wx.showLoading,
    })
    setTimeout(function () {
      wx.hideLoading()
    }, Timeout.wx.hideLoading)
    db.collection('wa_user').doc(_id).get().then(res => {
      console.log(res)
      if (res.errMsg === 'document.get:ok') {
        const dbUserInfo = res.data || null
        if (dbUserInfo) {
          this.setData({
            dbUserInfo,
          })
        }
        app.setDBUserInfo(dbUserInfo)
      }
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  // 设置联系方式
  setContact() {
    const dbUserInfo = app.globalData.dbUserInfo || wx.getStorageSync('dbUserInfo')
    const uid = dbUserInfo._id
    if (!uid) {
      wx.navigateTo({
        url: '../me/login/index',
      })
      return
    }
    wx.navigateTo({
      url: './contact/index?uid=' + uid
    })
  },
  // 管理员审核店铺
  adminAuditShop(){
    wx.navigateTo({
      url: './shop/admin/index'
    })
  },
  // 复制UID
  wxSetClipboardData(e) {
    const uid = e.currentTarget.dataset.uid || ''
    if (uid) {
      wx.setClipboardData({
        data: uid,
        success: (res) => {
          wx.getClipboardData({
            success: (res) => {
              console.log(res.data)
            }
          })
        }
      })
    }
  },
})