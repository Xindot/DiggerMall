const util = require('../../../../utils/util')

const app = getApp()
const db = app.globalData.db
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Page({
  data: {
    shopInfo: {
      logo: '',
      name: '',
      desc: '',
      remark: '',
    },
    defaultInfo: {
      logo: '../../../../images/common/shop-default-logo.png'
    }
  },
  onLoad(options) {
    
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
  doUploadImage(){
    app.doUploadImage(1, res=>{
      console.log(res)
      if(res.errMsg==="cloud.uploadFile:ok"){
        console.log(res.fileID)

        this.setData({
          'shopInfo.logo': res.fileID || ''
        })
      }
    })
  },
  // 店铺名称改变
  shopNameChange(e){
    this.setData({
      'shopInfo.name': e.detail.value
    })
  },
  // 店铺描述改变
  shopDescChange(e) {
    this.setData({
      'shopInfo.desc': e.detail.value
    })
  },
  // 备注改变
  shopRemarkChange(e){
    this.setData({
      'shopInfo.remark': e.detail.value
    })
  },
  // 保存店铺信息
  shopInfoSave(){

    const dbUserInfo = app.globalData.dbUserInfo || wx.getStorageInfoSync('dbUserInfo')
    if (!dbUserInfo._id){
      wx.showModal({
        title: '',
        content: '请先返回登录',
        showCancel: false,
      })
      return
    }
    // console.log(dbUserInfo)

    const shopInfo = this.data.shopInfo
    if (!shopInfo.logo) {
      wx.showModal({
        title: '',
        content: '请上传店铺LOGO',
        showCancel: false,
      })
      return
    }
    if(!shopInfo.name){
      wx.showModal({
        title: '',
        content: '请填写店铺名称',
        showCancel: false,
      })
      return
    }
    if (!shopInfo.desc) {
      wx.showModal({
        title: '',
        content: '请填写店铺描述',
        showCancel: false,
      })
      return
    }

    db.collection('wa_user').doc(dbUserInfo._id).update({
      data: {
        shop: {
          created_at: util.formatTime(new Date(), '-:'),
          updated_at: util.formatTime(new Date(), '-:'),
          ...shopInfo
        }
      }
    }).then(res => {
      console.log(res)
      if (res.errMsg ==='document.update:ok'){
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