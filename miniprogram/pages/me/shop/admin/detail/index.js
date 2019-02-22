const util = require('../../../../../utils/util')

const app = getApp()
const db = app.globalData.db
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Page({
  data: {
    auditUserInfo: null,
    auditForm: {
      remark: '',
      uid: '',
    }
  },
  onLoad (options) {
    console.log(options)
    const auid = options.auid
    if(auid){
      this.getAdminShopDetail(auid)
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
  getAdminShopDetail(auid){
    db.collection('wa_user').doc(auid).get().then(res => {
      console.log(res)
      if (res.errMsg ==='document.get:ok'){
        this.setData({
          auditUserInfo: res.data
        })
      }
    })
  },
  // 备注改变
  auditRemarkChange(e) {
    this.setData({
      'auditForm.remark': e.detail.value
    })
  },
  // 审核通过 
  auditPass(){
    const dbUserInfo = app.globalData.dbUserInfo || wx.getStorageInfoSync('dbUserInfo')
    if (!dbUserInfo._id) {
      wx.showModal({
        title: '',
        content: '请先返回登录',
        showCancel: false,
      })
      return
    }
    const auditForm = this.data.auditForm
    auditForm.uid = dbUserInfo._id

    if (!auditForm.remark){
      wx.showModal({
        title: '',
        content: '请填写审核备注',
        showCancel: false,
      })
      return
    }

    db.collection('wa_user').doc(dbUserInfo._id).update({
      data: {
        shop_verify: {
          updated_at: util.formatTime(new Date(), '-:'),
          status: 1,
          audit: auditForm
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

  },
})