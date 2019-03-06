const util = require('../../../utils/util')

const app = getApp()
const db = app.globalData.db
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Array.prototype.remove = function (val) {
  let index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

Page({
  data: {
    pubForm:{
      title:'',
      desc:'',
      price:'',
      remark:'',
      imgs: []
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
  // 标题改变
  titleChange(e){
    const val = e.detail.value || ''
    this.setData({
      'pubForm.title':val
    })
  },
  // 描述改变
  descChange(e) {
    const val = e.detail.value || ''
    this.setData({
      'pubForm.desc': val
    })
  },
  // 价格改变
  priceChange(e) {
    // console.log(e)
    const val = e.detail.value || ''
    this.setData({
      'pubForm.price': val
    })
  },
  // 备注改变
  remarkChange(e) {
    // console.log(e)
    const val = e.detail.value || ''
    this.setData({
      'pubForm.remark': val
    })
  },
  // 上传图片
  doUploadImage() {
    const imgs = this.data.pubForm.imgs
    const imgNum = 1
    // console.log('imgNum=>', imgNum)
    app.doUploadImage(imgNum, res => {
      console.log(res)
      if (res.errMsg === "cloud.uploadFile:ok") {
        console.log(res.fileID)

        imgs.push(res.fileID)
        this.setData({
          'pubForm.imgs': imgs
        })
      }
    })
  },
  // 预览图片
  wxPreviewImage(e) {
    console.log(e)
    const img = e.currentTarget.dataset.img
    if (img) {
      const current = img
      const urls = [img]
      wx.previewImage({
        current, // 当前显示图片的http链接
        urls // 需要预览的图片http链接列表
      })
    }
  },
  // 删除图片
  deleteImg(e) {
    console.log(e)
    wx.showModal({
      title: '',
      content: '删除图片？',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          const img = e.currentTarget.dataset.img
          let imgs = this.data.pubForm.imgs
          if (img && imgs instanceof Array) {
            imgs.remove(img)
            this.setData({
              'pubForm.imgs': imgs
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 提交
  submit(){

    const dbUserInfo = app.globalData.dbUserInfo || wx.getStorageInfoSync('dbUserInfo')
    if (!dbUserInfo._id) {
      wx.showModal({
        title: '',
        content: '请先返回登录',
        showCancel: false,
      })
      return
    }

    const pubForm = this.data.pubForm
    // console.log(pubForm)
    if(pubForm.imgs.length===0){
      wx.showModal({
        title: '',
        content: '请先上传图片',
        showCancel: false,
      })
      return
    }
    if (!pubForm.title) {
      wx.showModal({
        title: '',
        content: '请填写标题',
        showCancel: false,
      })
      return
    }
    if (pubForm.imgs.length === 0) {
      wx.showModal({
        title: '',
        content: '请填写描述',
        showCancel: false,
      })
      return
    }
    if (pubForm.imgs.length === 0) {
      wx.showModal({
        title: '',
        content: '请填写价格',
        showCancel: false,
      })
      return
    }
    // console.log(pubForm)

    db.collection('wa_pub').add({
      data: {
        created_at: util.formatTime(new Date(), '-:'),
        updated_at: util.formatTime(new Date(), '-:'),
        ...pubForm
      }
    }).then(res => {
      console.log(res)
      if (res.errMsg ==='collection.add:ok'){

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