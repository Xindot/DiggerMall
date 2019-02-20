const util = require('utils/util')
// 提交发布审核时要注意环境
const env = ['test-5ada43', 'release-5ada43'][0]
console.log('env=>', env)

const Version = 'v1.0.1'
console.log('Version=>', Version)

// console.log('wx.cloud=>',wx.cloud)
wx.cloud.init({
  env,
  traceUser: true,
})
const db = wx.cloud.database()

//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    // this.globalData = {}

    // 获取用户OPENID
    this.getWXOPENID()

  },
  // 获取用户OPENID by缓存
  getWXOPENID() {
    try {
      const WXContext = wx.getStorageSync('WXContext')
      if (WXContext && WXContext.OPENID) {
        console.log('OPENID缓存中存在')
        this.globalData.WXContext = WXContext
        const OPENID = WXContext.OPENID
        this.checkDBUser(OPENID)
      } else {
        console.log('OPENID缓存中不存在')
        this.getWXContext()
      }
    } catch (e) {
      console.error(e)
    }
  },
  // 获取用户OPENID by云函数
  getWXContext() {
    wx.cloud.callFunction({
      name: 'getWXContext',
      data: {}
    }).then(res => {
      const WXContext = res.result
      if (WXContext && WXContext.OPENID) {
        this.globalData.WXContext = WXContext
        const OPENID = WXContext.OPENID
        this.checkDBUser(OPENID)
        try {
          wx.setStorageSync('WXContext', WXContext)
        } catch (e) {
          console.error(e)
        }
      }
    }).catch(err => {
      console.error(err)
    })
  },
  // 判断当前用户是否在库中
  checkDBUser(OPENID) {
    if (OPENID) {
      db.collection('wa_user').where({
        _openid: OPENID
      }).get({
        success: (res) => {
          if (res.errMsg == 'collection.get:ok') {
            if (res.data && res.data instanceof Array && res.data.length > 0) {
              console.log('判断当前用户：在库中')
              const dbUserInfo = res.data[0]
              this.setDBUserInfo(dbUserInfo)
            } else {
              console.log('判断当前用户：不在库中')
              this.setDBUserInfo(null)
            }
          } else {
            console.error(res.errMsg)
          }
        }
      })
    }
  },
  // 设置用户信息
  setDBUserInfo(dbUserInfo) {
    if (dbUserInfo && dbUserInfo._openid && dbUserInfo.nickName) {
      const insertUserInfo = {
        openId: dbUserInfo._openid,
        nickName: dbUserInfo.nickName,
        avatarUrl: dbUserInfo.avatarUrl,
        gender: dbUserInfo.gender,
      }
      this.globalData.dbUserInfo = dbUserInfo
      this.globalData.insertUserInfo = insertUserInfo
      try {
        wx.setStorageSync('dbUserInfo', dbUserInfo)
        wx.setStorageSync('insertUserInfo', insertUserInfo)
      } catch (e) {
        console.error(e)
      }
    } else {
      this.globalData.dbUserInfo = null
      this.globalData.insertUserInfo = null
      try {
        wx.removeStorageSync('dbUserInfo')
        wx.removeStorageSync('insertUserInfo')
      } catch (e) {
        console.error(e)
      }
    }
  },

  globalData: {
    Version,
    env,
    db,
    WXContext: null,
    // dbUserInfo: null,
    // insertUserInfo: null,
    // myPubOneDetail: null,
    // pubMatchTwo: null,
    // showRefresh: false,
    // QNConfig: {
    //   upHost: 'https://up.qbox.me',
    // },
    Timeout: {
      wx: {
        hideLoading: 5000,
        stopPullDownRefresh: 3000,
      }
    },
    Tips: {
      wx: {
        showLoading: '加载中...',
        showSubmiting: '正在提交...',
        showUploading: '上传中...',
        showSaving: '正在保存...',
      }
    }
  }
})
