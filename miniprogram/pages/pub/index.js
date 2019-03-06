const util = require('../../utils/util')

const app = getApp()
const db = app.globalData.db
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Page({
  data: {
    shopPubList: null,
  },
  onLoad(options) {
    this.getShopPubList()   
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
    this.getShopPubList()    
  },
  onReachBottom() {
    
  },
  onShareAppMessage() {
    
  },
  // 获取宝贝列表
  getShopPubList() {

    wx.showLoading({
      title: Tips.wx.showLoading,
    })
    setTimeout(function () {
      wx.hideLoading()
    }, Timeout.wx.hideLoading)
    
    db.collection('wa_pub').get().then(res => {
      console.log('shopPubList=>', res)
      if (res.errMsg === 'collection.get:ok') {
        this.setData({
          shopPubList: res.data || []
        })
      }

      wx.stopPullDownRefresh()
      wx.hideLoading()

    }).catch(err => {
      console.error(err)
    })
  },
})