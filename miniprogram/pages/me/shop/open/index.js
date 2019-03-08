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
      point: null,
    },
    defaultInfo: {
      logo: '../../../../images/common/shop-default-logo.png'
    }
  },
  onLoad(options) {
    const dbUserInfo = app.globalData.dbUserInfo || wx.getStorageInfoSync('dbUserInfo')
    if(dbUserInfo&&dbUserInfo.shop){
      this.setData({
        'shopInfo.logo': dbUserInfo.shop.logo || '',
        'shopInfo.name': dbUserInfo.shop.name || '',
        'shopInfo.desc': dbUserInfo.shop.desc || '',
        'shopInfo.point': dbUserInfo.shop.point || null,
      })
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
  // 上传图片
  doUploadImage(){
    app.doUploadImage(1, res=>{
      // console.log(res)
      if(res.errMsg==="cloud.uploadFile:ok"){
        // console.log(res.fileID)
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
  // 验证位置权限
  wxCheckLocation(){
    wx.getSetting({
      success:(res)=> {
        // console.log(res)
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this.wxChooseLocation()
            },
            fail: (err) => {
              console.error(err)
              wx.showToast({ title: JSON.stringify(err), icon: 'none' })
            }
          })
        }else{
          this.wxChooseLocation()
        }
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },
  // 选择位置
  wxChooseLocation() {
    // console.log('wxChooseLocation()')
    wx.chooseLocation({
      type: 'wgs84',
      success: (res) => {
        // console.log(res)
        if (res.errMsg === "chooseLocation:ok") {
          const point = {
            name: res.name,
            address: res.address,
            ssx: util.extractSSX(res.address),
            longitude: res.longitude,
            latitude: res.latitude,
          }
          // console.log(point)
          this.setData({
            'shopInfo.point': point
          })
        }
      },
      fail: (err) => {
        // console.log(err)
        if (err.errMsg != 'chooseLocation:fail cancel') {
          wx.showModal({
            title: '您已设置【不允许使用我的地理位置】',
            content: '如果需要开启，可以在小程序设置界面（「右上角」-「关于」-「右上角」-「设置」）中控制对该小程序的授权状态',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    // console.log(res.authSetting)
                  }
                })
              }
            }
          })
        }
      }
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
    if (!(shopInfo.point&&shopInfo.point.name)) {
      wx.showModal({
        title: '',
        content: '请选择店铺位置',
        showCancel: false,
      })
      return
    }

    db.collection('wa_user').doc(dbUserInfo._id).update({
      data: {
        shop: {
          updated_at: util.formatTime(new Date(), '-:'),
          ...shopInfo
        }
      }
    }).then(res => {
      // console.log(res)
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