import _ from 'lodash/lodash'
import Fingerprint2 from 'fingerprintjs2'

const md5 = require('js-md5');

//将秒转为 分钟:秒
export function seconds2MinutesSeconds(duration) {
  //toFixed 会导致 四舍五入，不使用，  正则匹配 还需要注意整数的情况，比较麻烦，也不使用
  let minutes = (duration / 60) - (duration / 60) % 1
  let seconds = (duration % 60) - (duration % 60) % 1;
  let result = '';
  if (minutes < 10) {
    result += '0' + minutes + ':'
  } else {
    result += minutes + ':'
  }
  if (seconds < 10) {
    result += '0' + seconds + ':'
  } else {
    result += seconds
  }
  return result;
}

export function minutesSeconds2seconds(time) {
  //去掉 中括号
  time = time.substring(1, time.length - 1);
  let minutesSeconds = time.split(':');
  return minutesSeconds[0] * 60 + minutesSeconds[1] * 1;
}

// 若找到目标值，则返回 下标的值减去1，若找不到则返回 数组中小于目标值的元素中的 最大值 对应的下标
export function binarySearch(target, arr) {
  let begin = 0
  let end = arr.length - 1
  while (begin <= end) {
    let middle = (end + begin) / 2
    //向下取整
    middle = middle - middle % 1
    if (target === arr[middle]) {
      return middle - 1
    } else if (target > arr[middle]) {
      begin = middle + 1
    } else {
      end = middle - 1
    }
  }
  return end
}

//不断检测条件，当满足条件时时，清除Interval函数,执行回调函数
//times 最大的试错次数
export function until(conditon, callback, interval = 50) {
  let timer = undefined;
  new Promise((resolve, reject) => {
    if (conditon()) callback();
    else timer = setInterval(() => {
      if (conditon()) resolve();
    }, interval)
  }).then(() => {
    clearInterval(timer);
    callback();
  })
}

//防抖函数
export function debounce(func, delay = 300) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
      // function padLeftZero (str) {
      //   return ('00' + str).substr(str.length);
      // }
    }
  }
  return fmt;
}

/**
 * 得到平均却又随机的 length个 rgba
 * @param length  rbag颜色个数,
 * @param min  rgba 前三个参数的最低值
 * @param max  rgba 前三个参数的最高值
 * @returns {any[]} rbag 数组
 */
export function getRainbowRgba(length, min, max) {

  if (length === 0) return []

  let rgbaArr = new Array(length).fill('rgba(')
  let colors = [];
  for (let i = 0; i < length; i++) {
    //得到均分的 颜色的范围数组
    colors.push((max - min) * i / (length - 1) + min)
  }
  for (let i = 0; i < 3; i++) {
    let tempArr = _.shuffle(colors)
    for (let j = 0; j < length; j++) {
      rgbaArr[j] += tempArr[j] + ','
      if (i === 2) {
        //最后加上透明度
        rgbaArr[j] += 0.8 + ')'
      }
    }
  }
  return rgbaArr
}


export function getFingerPrintId() {
  //这是个异步的方法
  return new Promise((resolve, reject) => {
    Fingerprint2.get((components) => {
      const values = components.map((component, index) => {
        if (index === 0) {
          //将微信浏览器里的 UA 的 wifi 和 4g 等网络置空，否则切换网络时，会导致得出的结果不一样
          return component.value.replace(/\bNetType\/\w+\b/, '')
        }
        return component.value
      })
      const murmur = Fingerprint2.x64hash128(values.join(''), 31)
      //保证murmur已经有值
      resolve(murmur)
    })
  })
}

/**
 *
 * @param params 这是一个参数对象
 * @returns {string}
 */
export function getParamsMd5Str(params, times = 3) {

  let str = ''
  let paramsArr = []

  for (const key in params) {
    if (key) {
      paramsArr.push(key)
    }
  }
  //默认排序从低到高
  paramsArr.sort();

  for (const key of paramsArr) {
    let value = ''
    if (params[key] instanceof Array) {
      let arrVal = ''
      for (const element of params[key]) {
        arrVal += element
      }
      value = arrVal
    } else {
      value = params[key]
    }

    if (str === '') {
      str += `${key}=${value}`
    } else {
      str += `&${key}=${value}`
    }
  }

  for (let i = 0; i < times; i++) {
    str = md5(str).toUpperCase();
  }
  return str;
}
