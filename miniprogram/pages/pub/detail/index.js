const util = require('../../../utils/util')

const app = getApp()
const db = app.globalData.db
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Page({

  data: {
    pubDetail: null,
    shopDetail: null,
    icon: {
      phone: '../../../images/common/phone.png',
      wechat: '../../../images/common/wechat.png',
    }
  },
  onLoad(options) {
    const pid = options.pid
    if(pid){
      this.getPubDetail(pid)
    }
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
  onShareAppMessage() {
    
  },
  // 获取宝贝详情
  getPubDetail(pid) {
    db.collection('wa_pub').doc(pid).get().then(res => {
      console.log(res)
      if (res.errMsg === 'document.get:ok') {
        this.setData({
          pubDetail: res.data,
        })
        const _openid = res.data._openid
        if (_openid){
          this.getPubShopInfo(_openid)
        }
      }
    })
  },
  // 获取店铺信息
  getPubShopInfo(_openid){
    db.collection('wa_user').where({
      _openid,
    }).get().then(res => {
      if (res.errMsg ==='collection.get:ok'){
        console.log(res.data[0])
        this.setData({
          shopDetail: res.data[0]
        })
      }
    }).catch(err => {
      console.error(err)
    })
  },
  // 去店铺详情页面
  goShopDetailPage(e){
    const uid = e.currentTarget.id
    if (uid) {
      console.log(uid)
      wx.navigateTo({
        url: '../../me/shop/detail/index?uid=' + uid,
      })
    }
  },
  // 复制
  wxSetClipboardData(e) {
    const wechat = e.currentTarget.dataset.wechat || ''
    if (wechat) {
      wx.setClipboardData({
        data: wechat,
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
  // 打电话
  callPhone(e) {
    // console.log(e)
    const phoneNumber = e.currentTarget.dataset.phone || ''
    if (phoneNumber) {
      wx.makePhoneCall({
        phoneNumber,
      })
    }
  },
})