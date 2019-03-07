const util = require('../../../../utils/util')

const app = getApp()
const db = app.globalData.db
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Page({
  data: {
    uid:null,
    shopUserInfo: null,
    shopPubCount: [0,0],
    shopPubList: [],
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
      this.setData({
        uid,
      })
      this.getShopDetail(uid)
    }
  },
  onReady() {
    
  },
  onShow() {
    if (app.globalData.showRefresh) {
      const uid = this.data.uid
      if(uid){
        this.getShopDetail(uid)
      }
      app.globalData.showRefresh = false
    }
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
  // 获取店铺详情
  getShopDetail(uid){
    db.collection('wa_user').doc(uid).get().then(res => {
      console.log(res)
      if (res.errMsg === 'document.get:ok') {
        this.setData({
          shopUserInfo: res.data
        })
        const _openid = res.data._openid
        if (_openid) {
          this.getShopPubCount(_openid)
          this.getShopPubList(_openid)
        }
      }
    })
  },
  // 获取宝贝总数
  getShopPubCount(_openid) {
    const shopPubCount = this.data.shopPubCount
    db.collection('wa_pub').where({
      _openid,
    }).count().then(res => {
      console.log(res)
      if (res.errMsg === 'collection.count:ok') {
        shopPubCount[1] = res.total || 0
        this.setData({
          shopPubCount,
        })
      }
    })
    db.collection('wa_pub').where({
      status: 1,
      _openid,
    }).count().then(res => {
      console.log(res)
      if (res.errMsg === 'collection.count:ok') {
        shopPubCount[0] = res.total || 0
        this.setData({
          shopPubCount,
        })
      }
    })
  },
  // 获取宝贝列表
  getShopPubList(_openid){
    db.collection('wa_pub').where({
      _openid,
    }).get().then(res => {
      console.log('shopPubList=>',res)
      if (res.errMsg === 'collection.get:ok') {
        this.setData({
          shopPubList: res.data || []
        })
      }
    }).catch(err => {
      console.error(err)
    })
  },
  // 去新增/编辑宝贝页面 
  goPubAddPage(){
    wx.navigateTo({
      url: '../../../pub/addOrEdit/index',
    })
  },
  // 去编辑页面
  goPubEditOrDetailPage(e){
    console.log(e)
    const pid = e.currentTarget.id || ''
    if(pid){
      wx.navigateTo({
        url: `../../../pub/addOrEdit/index?pid=${pid}`,
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