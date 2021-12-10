<template>
  <div class="music-box">
    <nav-bar class="music-box-navbar">
      <div slot="left" class="head"><span>音乐盒</span></div>
      <div slot="center" class="music-search-input"  >
        <input type="text" ref="search" v-model="keyword"/>
      </div>
      <div slot="right" class="music-search-icon">
        <svg class="icon" ><use xlink:href="#iconziyuan1"></use></svg>
      </div>
    </nav-bar>
    <div class="record">
      <div class="bg">
        <video autoplay muted loop ref="bg">
          <source src="@/assets/video/bgvideo480.mp4" type="video/mp4">
        </video>
      </div>
      <div class="left-part">
        <div class="cd" :style="cdStyle" >
          <img :src="albumUrl"/>
        </div>
        <div class="play-pause-icon" @click="clickPlayer" >
          <svg class="icon" v-show="!isMusicPlaying">
            <use xlink:href="#iconbofang1"></use>
          </svg>
          <svg class="icon" v-show="isMusicPlaying">
            <use xlink:href="#iconzanting"></use>
          </svg>
        </div>
      </div>
      <div class="right-part" ref="rightPart">
        <div class="mask"
             @mousedown.prevent="down"
             @touchstart.prevent="down"
             @mousemove.prevent="move"
             @touchmove.prevent="move"
        >
          <ul class="lyrics-container"
              ref="lyricsContainer"
              :style="maskStyle">
            <li v-for="(item,index) in lyrics" :style="{'height':`${lyricLineHeight}px`}">
              <span>{{ item }}</span></li>
          </ul>
        </div>
        <div class="music-progress-bar">
          <music-progress-bar
            :music-url="musicUrl"
            @musicPlayStateChange="setMusicPlaying"
            @musicTimeChange="musicTimeChange"
            @audioToEnd="audioToEnd"
            ref="musicBar"/>
        </div>
      </div>
    </div>
    <div class="songs-list">
      <div class="default-msg" v-if="!songList.songIds">
        音乐盒为空~
      </div>
      <div v-else
           class="song-item" v-for="(item,index) in songList.songIds"
           :key="index"
           @click="songClick(index)">
        <div>
          <div class="cd-icon" v-if="index === currentIndex"><svg class="icon" ><use xlink:href="#iconyinfu"></use></svg></div>
          <div class="left">{{ songList.names[index] }}</div>
          <div class="right">{{ `-${songList.authors[index]} ${songList.durations[index]}` }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //网络js
  import  {searchSong,getAlbum,getSongUrl,getLyric} from "../../../network/music";
  //公共js
  import {parseLyrics} from "../../../common/lyric";
  import {binarySearch,minutesSeconds2seconds,debounce,seconds2MinutesSeconds} from "../../../common/utils";
  import NavBar from "../../common/NavBar/NavBar";
  import MusicProgressBar from "../MusicProgressBar/MusicProgressBar";


  export default {
    name: "MusicBox",
    data(){
      return {
        isMusicPlaying:false,
        isFirstPlay:true,
        lyricMargin:25,
        beforeY:0,
        lyricLineHeight:20,
        isPaused:false,
        keyword:'',
        songList:{
          songIds:[],
          albumIds:[],
          names:[],
          authors:[],
          durations:[]
        },
        albumUrl:'',
        musicUrl:'',
        lyrics:[],
        lyricTimeStamp:[],
        searchDebounce:undefined,
        currentIndex:0,

      }
    },
    components: {
      MusicProgressBar,
      NavBar
    },
    methods:{
      //触发事件
      audioToEnd(){
        this.$refs.musicBar.pauseMusic()
        this.isMusicPlaying = false
      },
      clickPlayer(){
        if(this.$refs.musicBar.canPlay()){
          if (this.$refs.musicBar.getMusicIsPlaying()){
            this.$refs.musicBar.pauseMusic()
            this.isMusicPlaying = false
          }else {
            this.$refs.musicBar.playMusic()
            this.isMusicPlaying = true
          }
        }
      },
      musicTimeChange(musicTime){
        if(!this.isPaused){
          let index = Math.max(binarySearch(Number.parseFloat( musicTime ),this.lyricTimeStamp),0)
          //25是 使得歌词第一行大概在mask中间的margin的值
          this.lyricMargin = (25 -  index * this.lyricLineHeight)
        }
      },
      setMusicPlaying(isPlaying){
        this.isMusicPlaying = isPlaying
      },
      isMobile(){
        return  navigator.userAgent.match(
          '/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|'+
          'MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i')
      },
      down(event){
        this.isPaused = true
        this.beforeY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
      },
      move(event){
        if(this.isPaused){
          if( this.isMobile()){
            document.ontouchmove = event => {
              this.lyricMargin += event.touches[0].clientY - this.beforeY
              this.beforeY = event.touches[0].clientY
              if ( !document.ontouchend ) {
                document.ontouchcancel = document.ontouchend = () => {
                  this.isPaused = false
                  document.ontouchmove = document.ontouchcancel = document.ontouchend = null
                }
              }
            }
          }else {
            document.onmousemove = (event)=>{
              this.lyricMargin +=event.clientY - this.beforeY
              this.beforeY = event.clientY
              if( !document.onmouseup ) {
                document.onmouseleave =document.onmouseup = ()=>{
                  // setTimeout(()=>{
                  //   this.isPaused = false  不行，原因在于@mousemove
                  // },1000)
                  this.isPaused = false
                  document.onmouseleave = document.onmouseup = document.onmousemove = null
                }
              }
            }
          }
        }
      },
      songClick(index){
        if(index!==this.currentIndex){
          this.$refs.musicBar.pauseMusic()
          this.isMusicPlaying = false
          this.getSongUrl(this.songList.songIds[index])
          this.getAlbum(this.songList.albumIds[index])
          this.getLyric(this.songList.songIds[index])
          this.currentIndex = index
        }
      },

      //网络请求
      searchSong(keyword){
        searchSong(keyword).then(res=>{
          if(res.code===200){
            this.currentIndex = -1
            this.songList.songIds = []
            this.songList.names = []
            this.songList.authors = []
            this.songList.durations = []
            this.songList.albumIds = []
            let count = 0;
            for (let i = 0; count<6&&i<res.result.songs.length;i++) {
              let fee = res.result.songs[i].fee
              if( fee === 0 || fee === 8 ) {
                this.songList.songIds.push(res.result.songs[i].id)
                this.songList.names.push(res.result.songs[i].name)
                this.songList.authors.push(res.result.songs[i].artists[0].name)
                this.songList.durations.push(seconds2MinutesSeconds(res.result.songs[i].duration/1000))
                this.songList.albumIds.push( res.result.songs[i].album.id )
                count++
              }
            }
          }
        }).catch(e=>{
          console.log(e)
        })
      },
      getAlbum(albumId){
        getAlbum(albumId).then(res=>{
          if(res.code===200){
            this.albumUrl = res.songs[0].al.picUrl
          }
        }).catch(e=>{
          alert('找不到图片')
        })
      },
      getSongUrl(songId){
        /*
        接口变更，因此代码不能使用
        getSongUrl(songId).then(res=>{
          if(res.code===200){
            if (res.data[0].url) {
              if(this.isFirstPlay) {
                this.isFirstPlay = false
                this.$refs.musicBar.setAutoPlay()
              }else {
                this.$refs.musicBar.isPlaying = true
                this.isMusicPlaying = true
                this.$refs.musicBar.playMusic()
              }
              this.musicUrl = res.data[0].url
            } else {
              this.musicUrl = undefined
              alert('暂无版权哦～')
            }
          }
        }).catch(e=>{
          console.log(e)
        })
        */
        //新接口

        //无奈硬编码
        this.musicUrl = `https://music.163.com/song/media/outer/url?id=${songId}.mp3`

      },
      getLyric(songId){
        getLyric(songId).then(res=>{
          if(res.code===200){
            if(res.lrc){
              let parseRes = parseLyrics(res.lrc.lyric)
              this.lyricTimeStamp = parseRes[0].map(time => minutesSeconds2seconds(time))
              this.lyrics = parseRes[1]
            }else {
              this.lyricTimeStamp =[0]
              this.lyrics = ['纯音乐请欣赏']
            }
          }
        }).catch(e=>{
          console.log(e)
        })
      }
    },
    computed:{
      cdStyle(){
        return !this.isMusicPlaying? {'animation-play-state':'paused'} : {}
      },
      maskStyle(){
       return this.isPaused ? {'margin-top':this.lyricMargin+'px'} : {'margin-top':this.lyricMargin+'px',transition:'all 0.5s ease'};
      }
    },
    watch:{
      keyword(newValue){
          this.searchDebounce();
      }
    },
    created() {
      this.searchDebounce = debounce(()=>{
        if(this.keyword.trim()!==''){
          this.searchSong(this.keyword)
        }
      },1000)
      /*
        硬编码初始的歌单
       */
      this.searchSong('Flower of Life')
      this.getLyric(744722)
      this.getSongUrl(744722)
      this.getAlbum(73093)
    },
    deactivated() {
      this.$refs.musicBar.pauseMusic()
      this.isMusicPlaying = false
      this.$refs.musicBar.removeTimer()
    },
    activated() {
      this.$refs.bg.load();
      this.$refs.musicBar.pauseMusic()
      this.isMusicPlaying = false
      //防止Interval重复
      if( ! this.$refs.musicBar.timer ) {
        this.$refs.musicBar.asyncCheckCurrentTime()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .music-box {
    width: 100%;
    background-color: rgba(255,255,255,var(--global-opacity,1));
    height: 420px;
    border-radius: 15px;
    padding-bottom: 20px;
    .music-box-navbar {
      margin: 0 10px;
      height: 50px;
      border-bottom: 2px solid lightblue;
      text-align: center;
      .head {
        display: flex;
        align-items: center;
        height: 100%;
        font-weight: bold;
        font-size: 1.5rem;
        white-space:nowrap;
      }
      .music-search-input {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        > input {
          border: {
            radius: 5px;
            style: solid;
            color: lightskyblue;
            left-width: 4px;
            right-width: 4px;
            top-width: 2px;
            bottom-width: 2px;
          }
          outline:none;
          &:focus {
            box-shadow: 0 0 2px 1px gold;
          }
        }
      }
      .music-search-icon {
        display: flex;
        align-items: center;
        justify-content: center;

        height: 100%;
        text-align: center;
        svg {
          height: 30px;
          width: 30px;
        }
        &:hover{
          > svg {
            transform: scale(1.3) rotate(1turn);
          }
        }
        > svg {
          transition: all 0.3s;
          height: 100%;
        }
      }
    }

    .record {
      position: relative;
      .bg {
        position: absolute;
        left: -2px;
        right: 0px;
        top:-2px;
        bottom: -2px;
        border-radius: 17px;
        border: 1px solid transparent;
        overflow: hidden;
        > video {
          position: absolute;
          bottom: 0;
          width: 100%;
        }
        box-shadow: 0 0 10px rgba(20,20,20,.5);
      }
      display: flex;
      height: 120px;
      margin: 6px 7px 0;
      border: 2px solid transparent {
        radius: 20px;
      };
      .left-part {
        user-select: none;
        position: relative;
        flex: 0 1 auto;
        flex-basis: 120px;
        height: 100%;
        margin-right: 5px;
        @keyframes cdRoate {
           to {transform:  rotate(1turn)}
        }
        .cd {
          height: 100%;
          padding: 4px 3px 3px;
          overflow: hidden;
          display: flex;
          align-items: center;
          animation: cdRoate 15s linear infinite;
          user-select: none;
          > img {
            border-radius: 50%;
            height: 110px;
            width: 110px;
          }
        }
        &:hover {
          .play-pause-icon {
            transition: {
              delay: 0s;
            };
            opacity: 1;
          }
        }
        .play-pause-icon {
          position: absolute;
          z-index: 30;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%) ;
          font-size: 40px;
          transition: {
            property: opacity;
            duration: .3s;
            delay: 1s;
          };
          opacity: 0;
        }
      }
      .right-part {
        position: relative;
        overflow: hidden;
        flex: 1 1 auto;
        margin-right: 5px;
        .mask{
          position: relative;
          user-select: none;
          z-index: 1;
          width: 100%;
          height: calc( 100% - 40px - 9px);
          padding: 0 10px 5px;
          margin-top: 9px;
          color: transparent;
          -webkit-background-clip: text;
          background-image: linear-gradient(to top, rgba(121, 121, 121, 0.8) 20%, white 41%, white 60%, rgba(121, 121, 121, 0.8) 68%);
          text-align: center;
          overflow: hidden;
          .lyrics-container {
            list-style: none;
            > li {
              width: 100%;
              font-size: 13px;
              overflow: hidden;
              white-space: nowrap;
            }
          }
          /*> ul {*/
          /*  list-style: none;*/
          /*}*/
          /*li {*/
          /*  display: block;*/
          /*  height: 100%;*/
          /*}*/
        }
        .music-progress-bar {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 40px;
          /*已经是最小的了...*/
          font-size: 0.5rem;
        }
      }
    }
    .songs-list {
      display: flex;
      flex-wrap: wrap;
      border: 4px solid lightblue;
      border-radius: 10px;
      margin: 7px 7px 0;
      text-align: center;
      .default-msg {
        width: 100%;
        height: 210px;
        font-size: 2rem;
        justify-self: center;
        padding-top: 60px;
      }
       .song-item {
         position: relative;
         width: 100%;
         padding-left: 10%;
         padding-right: 10px;
         > div {
           width: 100%;
           height: 35px;
           padding: {
             top:5px;
             right: 5px;
             bottom: 3px;
           };
           border-bottom: 1px solid #87ceeb;
           overflow: auto;
           display: flex;
           justify-content: space-between;
           .cd-icon {
             position: absolute;
             top: 5px;
             left: 5px;
              font-size: 1.4rem;
           }
           .left {
             font-size:20px;
             overflow: hidden;
             white-space: nowrap;
             text-overflow: ellipsis;
           }
           .right {
             overflow: hidden;
             white-space: nowrap;
             text-overflow: ellipsis;
             font-size: 14px;
           }
         }
         transition: {
           property: background-color;
           duration: .3s;
         };
         background-color: rgba(187,255,255,0);
         &:hover {
           background-color: rgba(187,255,255,.3);
         }
      }
    }
  }
</style>
