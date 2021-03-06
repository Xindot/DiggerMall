
// 时间格式化
// 数字补0
const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatTime = (date, returnType) => {
  const DATE = date || new Date()

  const year = DATE.getFullYear()
  const month = DATE.getMonth() + 1
  const day = DATE.getDate()
  const hour = DATE.getHours()
  const minute = DATE.getMinutes()
  const second = DATE.getSeconds()
  const ms = DATE.getMilliseconds()
  const week = DATE.getDay()

  // yyyy/MM/dd hh:mm:ss
  if (returnType == '/:') {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  // yyyy-MM-dd hh:mm:ss
  if (returnType == '-:') {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  // yyyy-MM-dd hh:mm
  if (returnType == '-:4') {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  }
  // yyyy-MM-dd
  if (returnType == '-') {
    return [year, month, day].map(formatNumber).join('-')
  }
  // hh:mm
  if (returnType == ':4') {
    return [hour, minute].map(formatNumber).join(':')
  }
  // yyyyMMdd
  if (returnType == '8') {
    return [year, month, day].map(formatNumber).join('')
  }
  // yyyy.MM.dd 星期w
  if (returnType == 'CN') {
    const weeksCN = ['日', '一', '二', '三', '四', '五', '六'];
    return year + '.' + month + '.' + day + ' 星期' + weeksCN[week];
  }
  // yyyyMMddhhmmssSSS
  if (returnType == '19') {
    return [year, month, day, hour, minute, second, ms].map(formatNumber).join('')
  }
  // yyyyMMdd
  return [year, month, day].map(formatNumber).join('')
}


// 在JavaScript数组中找到最小元素的位置
const indexOfArrSmallest = (arr, key) => {
  let lowest = 0;
  for (let i = 1; i < arr.length; i++) {
    if (key) {
      if (arr[i][key] < arr[lowest][key]) {
        lowest = i
      }
    } else {
      if (arr[i] < arr[lowest]) {
        lowest = i
      }
    }
  }
  return lowest;
}


// base64 js解码与转码
const CusBase64 = require('base64.js');
const base64 = {
  encodeUnicode: (str) => {
    return CusBase64.CusBASE64.encoder(str)
  },
  decodeUnicode: (str) => {
    return CusBase64.CusBASE64.decoder(str)
  }
}

/**
 * 获取两个经纬度之间的距离
 * @param lng1 第一点的经度
 * @param lat1 第一点的纬度
 * @param lng2 第二点的经度
 * @param lat2 第二点的纬度
 * @returns {Number}
 */
const distanceByLnglat = (lng1, lat1, lng2, lat2) => {
  if (lng1 === lng2 && lat1 === lat1) {
    return 0
  }
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378137.0; // 取WGS84标准参考椭球中的地球长半径(单位:m)
  s = Math.round(s * 10000) / 10000;
  return s
  // //下面为两点间空间距离（非球面体）
  // var value= Math.pow(Math.pow(lng1-lng2,2)+Math.pow(lat1-lat2,2),1/2);
  // alert(value);
}
const Rad = (d) => {
  return d * Math.PI / 180.0;
}


// JS 正则表达式从地址中提取省市县 https://www.jb51.net/article/149398.htm
// const reg = /.+?(省|市|自治区|自治州|盟|县|区)/g;
const extractStrS = (str) => {
  return (str.match(/.+?(省|市|自治区|自治州|盟|县)/g) || []).reverse()[0] || ''
}
const extractSSX = (address) => {
  if (address) {
    address = address.replace(/（|）/g, '')
    let str0 = ((address.match(/\((.+?)\)/g) || []).reverse()[0] || '').replace(/(\(|\))/g, '') || ''
    let str1 = address.replace(/\((.+?)\)/g, '') || ''
    return (extractStrS(str0) || extractStrS(str1) || '').replace(/(省|市|自治区|自治州|盟|县)/g, '') || ''
  } else {
    return ''
  }
}

// 距离格式化
const distanceFormat = (distance) => {
  let distanceShow = {
    num: Number(Number(distance).toFixed(1)),
    unit: 'm'
  }
  if (Number(distance) > 1000) {
    distanceShow.num = Number((Number(distance) / 1000).toFixed(1))
    distanceShow.unit = 'km'
  }
  return distanceShow.num + distanceShow.unit
}

// 计算两个时间差并格式化
const timeDifferenceFormat = (t1Str, t2Str) => {
  t1Str = t1Str.replace(/-/g, '/')
  t2Str = t2Str.replace(/-/g, '/')
  let hours = Number(Math.abs((new Date(t1Str).getTime() - new Date(t2Str).getTime()) / (1000 * 3600))).toFixed(0)
  if (Number(hours) < 24) {
    if(Number(hours)===0){
      hours = 1
    }
    return hours + '小时'
  } else {
    let days = (Number(hours) / 24).toFixed(0) || 1
    if (Number(days) < 365){
      if (Number(days) === 0) {
        days = 1
      }
      return days + '天'
    }else{
      return (Number(days)/365).toFixed(0) + '年'
    }
  }
}


module.exports = {
  formatTime,
  indexOfArrSmallest,
  base64,
  distanceByLnglat,
  extractSSX,
  distanceFormat,
  timeDifferenceFormat,
}
