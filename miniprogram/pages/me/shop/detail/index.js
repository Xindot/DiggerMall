const util = require('../../../../utils/util')

const app = getApp()
const db = app.globalData.db
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Page({
  data: {
    shopUserInfo: null,
    shop: {
      dbg: ['cloud://test-5ada43.7465-test-5ada43/static/shop/d-bg/0001.jpeg']
    },
    icon: {
      right: '../../../../images/common/right.png',
      phone: '../../../../images/common/phone.png',
      wechat: '../../../../images/common/wechat.png',
    }
  },
  onLoad(options) {
    const uid = options.uid
    if(uid){
      this.getShopDetail(uid)
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
  getShopDetail(uid){
    db.collection('wa_user').doc(uid).get().then(res => {
      console.log(res)
      if (res.errMsg === 'document.get:ok') {
        this.setData({
          shopUserInfo: res.data
        })
      }
    })
  }
})