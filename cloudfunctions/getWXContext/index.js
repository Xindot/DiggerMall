const env = ['test-5ada43', 'release-5ada43'][1]
console.log('env=>', env)

const cloud = require('wx-server-sdk')
cloud.init({
  env,
})

exports.main = async (event, context) => {
  const {
    OPENID,
    APPID,
    UNIONID,
  } = cloud.getWXContext()

  return {
    OPENID,
    APPID,
    UNIONID,
  }
}