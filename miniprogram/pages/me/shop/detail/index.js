const util = require('../../../../utils/util')

const app = getApp()
const db = app.globalData.db
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Page({
  data: {
    uid:null,
    isMe: false,
    shopUserInfo: null,
    shopPubCount: [0,0],
    shopPubList: null,
    shop: {
      limit: 100,
      dbg:['cloud://test-5ada43.7465-test-5ada43/static/shop/d-bg/0001.jpeg', 'cloud://test-5ada43.7465-test-5ada43/static/shop/d-bg/0002.jpeg', 'cloud://test-5ada43.7465-test-5ada43/static/shop/d-bg/0003.jpeg', 'cloud://test-5ada43.7465-test-5ada43/static/shop/d-bg/0004.jpeg'],
      dbgRand: 0
    },
    icon: {
      right: '../../../../images/common/right.png',
      phone: '../../../../images/common/phone.png',
      wechat: '../../../../images/common/wechat.png',
    }
  },
  onLoad(options) {
    const dbg = this.data.shop.dbg || []
    const dbgRand = Math.floor(Math.random() * dbg.length)
    this.setData({
      'shop.dbgRand': dbgRand
    })

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
        // console.log('uid=>',uid)
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

    wx.showLoading({
      title: Tips.wx.showLoading,
    })
    setTimeout(function () {
      wx.hideLoading()
    }, Timeout.wx.hideLoading)

    db.collection('wa_user').doc(uid).get().then(res => {
      // console.log(res)
      if (res.errMsg === 'document.get:ok') {
        const dbUserInfoNew = res.data
        this.setData({
          shopUserInfo: dbUserInfoNew
        })
        const _openid = dbUserInfoNew._openid
        if (_openid) {
          this.checkUser(dbUserInfoNew)
          this.getShopPubCount(_openid)
          this.getShopPubList(_openid)
        }
      }
      wx.hideLoading()
    })
  },
  // 判断用户
  checkUser(dbUserInfoNew){
    const dbUserInfo = app.globalData.dbUserInfo || wx.getStorageInfoSync('dbUserInfo')
    if (dbUserInfo._openid) {
      if (dbUserInfo._openid === dbUserInfoNew._openid){
        this.setData({
          isMe: true
        })
        console.log('isMe')
        app.setDBUserInfo(dbUserInfoNew)
      }else{
        this.setData({
          isMe: false
        })
      }
    }
  },
  // 获取宝贝总数
  getShopPubCount(_openid) {
    const shopPubCount = this.data.shopPubCount
    db.collection('wa_pub').where({
      _openid,
    }).count().then(res => {
      // console.log(res)
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
      // console.log(res)
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
    const limit = this.data.shop.limit || 100
    db.collection('wa_pub').where({
      _openid,
    }).limit(limit).get().then(res => {
      // console.log('shopPubList=>',res)
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
    const shopPubList = this.data.shopPubList
    const limit = this.data.shop.limit
    if (shopPubList && shopPubList.length > limit){
      wx.showModal({
        title: '',
        content: '宝贝数量已达上限',
        showCancel: false,
      })
      return
    }
    wx.navigateTo({
      url: '../../../pub/addOrEdit/index',
    })
  },
  // 去宝贝编辑/详情页面
  goPubDetailPage(e){
    // console.log(e)
    const pid = e.currentTarget.id || ''
    if (pid){
      wx.navigateTo({
        url: `../../../pub/detail/index?pid=${pid}`,
      })
    }
  },
  // 去编辑店铺信息页面
  goEditShopPage(){
    const isMe = this.data.isMe || false
    if (!isMe) {
      return
    }
    wx.navigateTo({
      url: `../open/index`,
    })
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
              // console.log(res.data)
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