import {request} from "./request";
import {musicHost,musicHostUrlSupplement} from "./host";

// export function searchSong(keywords) {
//   const url = `${songSearchHost}?keywords=${keywords}`
//   return axios.get(url)
// }

/*
  根据关键词搜索歌曲信息
 */
export function searchSong(keywords,page=0) {
  return request({baseURL:musicHost},{
    url:'/search',
    params:{
      keywords,
      offset:page
    }
  })
}


/*
  获取歌曲id的接口
 */
export function getSongUrl(songId) {
  return request({baseURL:musicHostUrlSupplement},{
    url:`/song/media/outer/url?id=${songId}.mp3`,
  })
}

/*
  获取歌词
 */
export function getLyric(songId) {
  return request({baseURL:musicHost},{
    url:'/lyric',
    params:{
      id:songId
    }
  })
}

/*
  获取封面url的接口
  参数为相册id
 */
export function getAlbum(albumId) {
  return request({baseURL:musicHost},{
    url:'/album',
    params:{
      id:albumId
    }
  })
}

/*
  获取歌曲id的接口
  过期
  2021/11/19
export function getSongUrl(songId) {
  return request({baseURL:musicHost},{
    url:'/song/url',
    params:{
      id:songId
    }
  })
}
 */

/*
  获取封面url的接口
  过期
  2021/11/19
export function getAlbum(songId) {
  return request({baseURL:musicHost},{
    url:'/song/detail',
    params:{
      ids:songId
    }
  })
}
*/




