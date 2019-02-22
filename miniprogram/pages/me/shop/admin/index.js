const util = require('../../../../utils/util')

const app = getApp()
const db = app.globalData.db
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Page({
  data: {
    tabs:['待审核','已通过'],
    selectIndex: 0,
    shopList:null,
    paging: {
      page:1,
      size:10
    }
  },
  onLoad(options) {
    this.getAdminShopList()
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
  // 获取管理的店铺列表
  getAdminShopList(){
    const sIdx = this.data.selectIndex || 0
    const page = this.data.paging.page || 1
    const limit = this.data.paging.zise || 10
    const skip = (page - 1) * limit

    const shopList = this.data.shopList || []
    const status = this.data.selectIndex || 0

    db.collection('wa_user').where({
      shop_verify: {
        status,
      }
    }).skip(skip).limit(limit).get().then(res => {
      console.log(res)
      if (res.errMsg ==='collection.get:ok'){
        const newList = shopList.concat(res.data || [])
        this.setData({
          shopList: newList
        })
      }
    }).catch(err => {
      console.error(err)
    })

  },
  // 切换筛选条件
  selectOneTab(e){
    // console.log(e)
    this.setData({
      selectIndex: e.currentTarget.dataset.idx || 0
    })
    this.setData({
      shopList: null,
    })
    this.getAdminShopList()
  },
  // 去店铺审核详情页 
  goAdminShopDetailPage(e){
    const auid = e.currentTarget.dataset.auid
    console.log(auid)
    if(auid){
      wx.navigateTo({
        url: './detail/index?auid='+auid
      })
    }
  }
})