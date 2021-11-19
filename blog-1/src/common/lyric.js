import {binarySearch,minutesSeconds2seconds} from "./utils";

/**
 *
 * @param lyric 网易云音乐歌词
 * @returns {[][]}  时间数组 下标对应的歌词数组
 */
export function parseLyrics(lyric) {

  if(lyric===undefined){
    return undefined
  }
  let lyricArr = []
  let lyricTimeArr = []
  // [00:00.00]\n歌词歌词...    网易云音乐歌词每一句长这样的格式
  let timeReg = /\[\d*:\d*\.\d*\]/
  const splitLyrics = lyric.split('\n')
  for (const index in splitLyrics) {
    let timeMatchRes = splitLyrics[index].match(timeReg)
    //存在部分展示语没有时间戳...直接跳过....
    //一般歌词都不会是上来就唱，也就说第一句歌词应该不会有  [00:00.00]
    //那么可以选择在获取歌词后，再获取作者名称之类的补充信息，unshift作为第一个元素
    if(!timeMatchRes) {
      lyricTimeArr.unshift('[00:00.00]')
      lyricArr.unshift(splitLyrics[index])
      continue
    }

    let lyricMatchRes = splitLyrics[index].replace(timeReg,'')
    //让每一个时间戳对应一句歌词
    //match返回数组
    if(lyricMatchRes.trim()!==''){
      lyricTimeArr.push(timeMatchRes[0])
      lyricArr.push(lyricMatchRes)
    }
  }
  return [lyricTimeArr,lyricArr]
}


