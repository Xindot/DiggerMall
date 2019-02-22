const util = require('../../../../utils/util')

const app = getApp()
const db = app.globalData.db
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Page({
  data: {
    config: null,
    ckb_items: [
      { name: '我已阅读并了解以上内容', value: 'pass' },
    ],
    checkPass: false,
    shop_verify: null,
  },
  onLoad (options) {
    this.getConfigInfo('shopFee')

    const dbUserInfo = app.globalData.dbUserInfo || wx.getStorageInfoSync('dbUserInfo')
    if(dbUserInfo.shop_verify){
      this.setData({
        shop_verify: dbUserInfo.shop_verify
      })
    }
  },
  onReady () {

  },
  onShow () {

  },
  onHide () {

  },
  onUnload () {

  },
  onPullDownRefresh () {

  },
  onReachBottom () {

  },
  onShareAppMessage () {

  },
  getConfigInfo(category) {
    app.getGlobalConfig(category,res=>{
      console.log(res)
      if (res.errMsg ==='collection.get:ok'){
        const config = res.data[0]
        this.setData({
          config,
        })
      }
    })
  },
  checkboxChange(e) {
    const checkPass = (e.detail.value[0] === 'pass')?true:false
    // console.log(checkPass)
    this.setData({
      checkPass,
    })
  },
  // 复制微信号
  wxSetClipboardData(e) {
    const wxh = e.currentTarget.dataset.wxh || ''
    if (wxh) {
      wx.setClipboardData({
        data: wxh,
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
  verifySubmit(){

    const dbUserInfo = app.globalData.dbUserInfo || wx.getStorageInfoSync('dbUserInfo')
    if (!dbUserInfo._id) {
      wx.showModal({
        title: '',
        content: '请先返回登录',
        showCancel: false,
      })
      return
    }

    db.collection('wa_user').doc(dbUserInfo._id).update({
      data: {
        shop_verify: {
          created_at: util.formatTime(new Date(), '-:'),
          updated_at: util.formatTime(new Date(), '-:'),
          status: 0
        }
      }
    }).then(res => {
      // console.log(res)
      if (res.errMsg === 'document.update:ok') {
        wx.showModal({
          title: '',
          content: '提交成功',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              app.globalData.showRefresh = true
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    }).catch(err => {
      console.error(err)
    })
  }
})