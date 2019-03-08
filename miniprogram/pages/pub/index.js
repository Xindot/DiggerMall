const util = require('../../utils/util')

const app = getApp()
const db = app.globalData.db
const _ = db.command
const Timeout = app.globalData.Timeout
const Tips = app.globalData.Tips
const Version = app.globalData.Version

Page({
  data: {
    shopPubCount: 0,
    shopPubList: null,
    icon: {
      filter: '../../images/common/filter'
    },
    visible:{
      filter: false
    },
    filter:{
      keyWord: '',
      type: 0,
      sort: 0, 
    },
    sortTypes: ['宝贝','店铺'],
    sortOpts: [[{
      key: 'time0',
      name: '最新'
    },{
      key: 'price0',
      name: '价格↑'
    },{
      key: 'price1',
      name: '价格↓'
    }],[{
      key: 'time0',
      name: '新店'
    },{
      key: 'time1',
      name: '老店'
    }]],
  },
  onLoad(options) {
    this.getShopPubCount()
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
    this.getShopPubCount()
  },
  onReachBottom() {
    
  },
  onShareAppMessage() {
    
  },
  // 搜索关键词聚焦
  filterKeyWordFocus(){
    this.setData({
      'visible.filter': true
    })
  },
  // 搜索关键词改变
  filterKeyWordChange(e){
    this.setData({
      'filter.keyWord': e.detail.value
    })
  },
  // 切换筛选
  switchFilterVisible(){
    const vf = this.data.visible.filter
    // console.log(vf)
    this.setData({
      'visible.filter':!vf
    })
    if(vf){
      // console.log('重新获取列表')
      this.getShopPubCount()
    }
  },
  // 切换筛选类型
  filterTypeChange(e){
    // console.log(e)
    const val = Number(e.detail.value || '0')
    // console.log(val)
    if(val>=0){
      this.setData({
        'filter.type':val,
        'filter.sort': 0,
      })
    }
  },
  // 切换排序方式
  filterSortChange(e){
    // console.log(e)
    const val = Number(e.detail.value || 0)
    // console.log(val)
    if (val >= 0) {
      this.setData({
        'filter.sort': val,
      })
    }
  },
  // 确定筛选
  getListByFilter(){
    this.setData({
      'visible.filter': false
    })
    this.getShopPubCount()
  },
  // 获取宝贝/店铺总数
  getShopPubCount(){

    this.setData({
      shopPubCount: 0,
      shopPubList: null,
    })

    const type = Number(this.data.filter.type || 0)
    const keyWord = this.data.filter.keyWord || ''
    const kwRegExp = db.RegExp({
      regexp: keyWord,
      options: 'i',
    })
    let ff = {}
    if(type===1){ // 店铺
      if (keyWord){
        ff = _.or([
          {
            shop:{
              name: kwRegExp
            }
          },
          {
            shop:{
              desc: kwRegExp
            }
          },
          {
            shop:{
              point: {
                address: kwRegExp
              }
            }
          },
          {
            shop:{
              point: {
                name: kwRegExp
              }
            }
          }
        ])
      }
      console.log('ff=>',ff)
      db.collection('wa_user').where({
        shop_verify: {
          status: 1,
        },
      }).where(ff).count().then(res => {
        console.log(res)
        if (res.errMsg === 'collection.count:ok') {
          this.setData({
            shopPubCount: res.total || 0
          })
        }
        this.getShopPubList(ff)
      })
    }else{
      if (keyWord) {
        ff = _.or([
          {
            title: kwRegExp
          },
          {
            desc: kwRegExp
          }
        ])
      }
      console.log('ff=>', ff)
      db.collection('wa_pub').where({
        status: 1,
      }).where(ff).count().then(res => {
        console.log(res)
        if (res.errMsg === 'collection.count:ok') {
          this.setData({
            shopPubCount: res.total || 0
          })
        }
        this.getShopPubList(ff)
      })
    }
  },
  // 获取宝贝/店铺列表
  getShopPubList(ff) {

    wx.showLoading({
      title: Tips.wx.showLoading,
    })
    setTimeout(function () {
      wx.hideLoading()
    }, Timeout.wx.hideLoading)

    const sortOpts = this.data.sortOpts
    const sort = Number(this.data.filter.sort || 0)
    const type = Number(this.data.filter.type || 0)

    const sortKey = sortOpts[type][sort].key
    console.log('sortKey=>', sortKey)
    if(type===1){ // 店铺
      let oBK = 'shop.created_at'
      let oBV = 'asc'
      if (sortKey === 'time0') {
        oBK = 'shop.created_at'
        oBV = 'desc'
      }
      if (sortKey === 'time1') {
        oBK = 'shop.created_at'
        oBV = 'asc'
      }
      db.collection('wa_user').where({
        shop_verify: {
          status: 1
        }
      }).where(ff).orderBy(oBK,oBV).get().then(res => {
        console.log('shopPubList=>', res)
        if (res.errMsg === 'collection.get:ok') {
          const list = res.data || []
          const time1 = util.formatTime(new Date(), '-:')
          list.forEach(el=>{
            el.shop.created_at = util.timeDifferenceFormat(el.shop.created_at,time1)
          })
          this.setData({
            shopPubList: res.data || []
          })
        }
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }).catch(err => {
        console.error(err)
      })
    }else{
      let oBK = 'created_at'
      let oBV = 'desc'
      if (sortKey === 'time0') {
        oBK = 'created_at'
        oBV = 'desc'
      }
      if (sortKey === 'price0') {
        oBK = 'price'
        oBV = 'asc'
      }
      if (sortKey === 'price1') {
        oBK = 'price'
        oBV = 'desc'
      }
      db.collection('wa_pub').where({
        status: 1
      }).where(ff).orderBy(oBK, oBV).get().then(res => {
        console.log('shopPubList=>', res)
        if (res.errMsg === 'collection.get:ok') {
          this.setData({
            shopPubList: res.data || []
          })
        }
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }).catch(err => {
        console.error(err)
      })
    }
  },
  // 去详情页面
  goPubEditOrDetailPage(e) {
    // console.log(e)
    const pid = e.currentTarget.id || ''
    if (pid) {
      wx.navigateTo({
        url: `./detail/index?pid=${pid}`,
      })
    }
  },
  // 去店铺详情页
  goShopDetailPage(e){
    const uid = e.currentTarget.id || ''
    if (uid) {
      wx.navigateTo({
        url: `../me/shop/detail/index?uid=${uid}`,
      })
    }
  },
})