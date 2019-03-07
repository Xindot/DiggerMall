const util = require('../../utils/util')

const app = getApp()
const db = app.globalData.db
// const _ = db.command
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Page({
  data: {
    shopPubCount: 0,
    shopPubList: null,
  },
  onLoad(options) {
    this.getShopPubCount()
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
  // 获取宝贝总数
  getShopPubCount(){
    db.collection('wa_pub').where({
      status: 1
    }).count().then(res => {
      console.log(res)
      if (res.errMsg ==='collection.count:ok'){
        this.setData({
          shopPubCount: res.total || 0
        })
      }
    })
  },
  // 获取宝贝列表
  getShopPubList() {

    wx.showLoading({
      title: Tips.wx.showLoading,
    })
    setTimeout(function () {
      wx.hideLoading()
    }, Timeout.wx.hideLoading)
    
    db.collection('wa_pub').where({
      status: 1
    }).get().then(res => {
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
  // 去详情页面
  goPubEditOrDetailPage(e) {
    // console.log(e)
    const pid = e.currentTarget.id || ''
    if (pid) {
      wx.navigateTo({
        url: `./detail/index?pid=${pid}`,
      })
    }
  }
})