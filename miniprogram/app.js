const util = require('utils/util')
// 提交发布审核时要注意环境
const env = ['test-5ada43', 'release-5ada43'][0]
console.log('env=>', env)

const Version = 'v1.0.1'
console.log('Version=>', Version)

// console.log('wx.cloud=>',wx.cloud)
if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
} else {
  wx.cloud.init({
    env,
    traceUser: true,
  })
}

const db = wx.cloud.database()

//app.js
App({
  onLaunch: function () {
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
    if (dbUserInfo && dbUserInfo._openid && dbUserInfo.wx && dbUserInfo.wx.nickName) {
      this.globalData.dbUserInfo = dbUserInfo
      try {
        wx.setStorageSync('dbUserInfo', dbUserInfo)
      } catch (e) {
        console.error(e)
      }
    } else {
      this.globalData.dbUserInfo = null
      try {
        wx.removeStorageSync('dbUserInfo')
      } catch (e) {
        console.error(e)
      }
    }
  },

  // 上传图片
  doUploadImage(count,callback) {

    const WXContext = wx.getStorageSync('WXContext')
    const OPENID = WXContext.OPENID;
    if (!(Version && OPENID)) {
      callback({ code: -1, msg: 'Version或OPENID错误' })
      return
    }

    // 选择图片
    wx.chooseImage({
      count: count || 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]

        // 唯一key
        const time19 = util.formatTime(new Date(), '19')
        const rStr4 = Math.random().toString(36).substr(2).substring(0, 4);
        const uukey = `${Version}/${OPENID}/${time19}/${rStr4}`;

        // 上传图片
        const cloudPath = uukey + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            // console.log('[上传文件] 成功：', res)
            callback(res)
          },
          fail: e => {
            // console.error('[上传文件] 失败：', e)
            callback(e)
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  // 获取小程序配置项
  getGlobalConfig(category, callback) {
    db.collection('wa_config').where({
      category,
    }).get().then(res => {
      // console.log(res)
      callback(res)
    })
  },

  globalData: {
    Version,
    env,
    db,
    WXContext: null,
    dbUserInfo: null,
    showRefresh: false,
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
