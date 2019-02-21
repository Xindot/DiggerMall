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
  },
  onLoad(options) {
    this.getUserInfo()
  },
  onReady() {
    
  },
  onShow() {
    
  },
  onHide() {
    
  },
  onUnload() {
    
  },
  onPullDownRefresh() {
    
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

})