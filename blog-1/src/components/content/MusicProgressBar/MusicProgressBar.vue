<template>
  <div class="music-progress-bar">
    <span class="time">{{ currentMusicTime }}</span>
    <audio ref="musicPlayer" @canplay="audioCanPlay" @ended="audioEnd"  >
      <source :src="musicUrl" type="audio/mpeg">
    </audio>
    <div class="music-progress-bar-body">
      <div class="music-play-icon" @click="playIconClick">
        <svg class="icon" v-show="!isPlaying">
          <use xlink:href="#iconbofang"></use>
        </svg>
        <svg class="icon" v-show="isPlaying" >
          <use xlink:href="#iconzanting1"></use>
        </svg>
      </div>
      <div class="music-progress-bar-content">
        <level-progress-bar
          :min="0" :max="musicTotalTime" :side-length="15" back-ground-color="#F0F8FF"
          @btnXChange="btnXChange"
          @btnDragStart="setDragStartPlaying"
          @btnDragEnd="setDragEndPlaying"
          :props-bar-value="currentTime"
          ref="progressBar"
        />
      </div>
      <div class="music-progress-bar-volume-icon" >
        <svg class="icon" v-show="musicVolume" @click="volumeIconClick">
          <use xlink:href="#iconyinliang"></use>
        </svg>
        <svg class="icon" v-show="!musicVolume" @click="volumeIconClick">
          <use xlink:href="#iconyinliangjingyin"></use>
        </svg>
        <div class="music-progress-bar-volume-wrap">
          <vertical-progress-bar
            :min="0" :max="1" :side-length="10" back-ground-color="pink"
            @btnXChange="setVolume" ref="volumeBar"/>
        </div>
      </div>
      <div class="favour">
        <svg class="icon" >
          <use xlink:href="#iconxin"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>

  //公共js
  import {seconds2MinutesSeconds,until} from "../../../common/utils";
  //公共组件
  import LevelProgressBar from "@/components/common/LevelProgressBar/LevelProgressBar";
  import VerticalProgressBar from "@/components/common/VerticalProgressBar/VerticalProgressBar";

  export default {
    name: "MusicProgressBar",
    props: {
      musicUrl: {
        type: String,
        default: ''
      },
    },
    components: {
      LevelProgressBar,
      VerticalProgressBar
    },
    data() {
      return {
        musicTotalTime: 0,
        formatMusicTotalTime: "00:00",
        currentTime: 0,
        beforeDragIsPlaying:false,
        isPlaying:false,
        musicVolume:.8,
        beforeMuteVolume:0,
        timer:undefined
      }
    },
    methods: {
      btnXChange(barValue) {
        if(this.$refs.musicPlayer.readyState>=1){
          this.currentTime = barValue;
          this.$refs.musicPlayer.currentTime = barValue;
        }
      },
      playMusic(){
        //防止出现DomException时
        if(this.$refs.musicPlayer.readyState >= 1|| this.$refs.musicPlayer.ended){
          try{
            this.$refs.musicPlayer.play()
            this.isPlaying = true
          }catch (e) {
            console.log(e)
          }
        }
      },
      pauseMusic(){
        if(this.$refs.musicPlayer.readyState >= 1|| this.$refs.musicPlayer.ended){
          try{
            this.$refs.musicPlayer.pause()
            this.isPlaying = false
          } catch (e) {
            console.log(e)
          }
        }
      },
      getMusicIsPlaying(){
        return !this.$refs.musicPlayer.paused
      },
      setVolume(barValue) {
        this.musicVolume = barValue
        this.$refs.musicPlayer.volume = barValue;
      },
      setDragEndPlaying(){
        if(this.beforeDragIsPlaying){
          this.isPlaying = true
          this.playMusic()
          this.$emit('musicPlayStateChange',true)
        }
      },
      // 用于记录 滑动条拉动前的播放状态,供拉动结束时判断
      setDragStartPlaying(){
        if(this.$refs.musicPlayer.paused){
          this.beforeDragIsPlaying = false
        }else {
          this.beforeDragIsPlaying = true
        }
        this.pauseMusic();
        this.$emit('musicPlayStateChange',false)
        this.isPlaying = false
      },
      playIconClick(){
        if(this.$refs.musicPlayer.readyState>2){
          if (this.getMusicIsPlaying()){
            this.pauseMusic()
            this.$emit('musicPlayStateChange',false)
          }else {
            this.playMusic()
            this.$emit('musicPlayStateChange',true)
          }
        }
      },
      volumeIconClick(){
        if(this.musicVolume){
          this.beforeMuteVolume = this.musicVolume
          this.setVolume(0)
          this.$refs.volumeBar.setPercent(0)
        }else {
          this.setVolume(this.beforeMuteVolume)
          this.$refs.volumeBar.setPercent(this.beforeMuteVolume)
          this.beforeMuteVolume = 0
        }
      },
      setAutoPlay(){
        this.$refs.musicPlayer.autoplay = true
      },
      //实时更新 ProgressBar 进度
      asyncCheckCurrentTime(){
        this.timer = setInterval(()=>{
          //即使是nextTick也无法保证dom初始化完毕，只能保证显示的数据更新完毕
          //因而使用前要判空  && this.isPlaying
          if( !this.isPlaying && !this.$refs.musicPlayer.paused ) {
            this.pauseMusic()
          }
          if( this.$refs.musicPlayer && this.isPlaying ){
            this.currentTime = this.$refs.musicPlayer.currentTime;
          }
          //700 而不是 1000 ，这样能修正延时误差,让动画和时间显示接近同步,又不至于损失太多的性能
        },700);
      },
      audioEnd(){
        this.$emit('musicPlayStateChange',false)
        this.$emit('audioToEnd')
        this.isPlaying = false
      },
      //audio 的load 会触发 canplay事件
      audioCanPlay(event) {
        //记录音乐长度
        this.musicTotalTime = this.$refs.musicPlayer.duration;
        //格式化时间
        this.formatMusicTotalTime = seconds2MinutesSeconds(this.musicTotalTime);
      },
      canPlay(){
        return this.$refs.musicPlayer.readyState>=2 || this.$refs.musicPlayer.ended;
      },
      removeTimer() {
        clearInterval(this.timer)
        this.timer = undefined
      }
    },
    mounted() {
      if( ! this.timer ) {
        this.asyncCheckCurrentTime()
      }
      until(()=>this.$refs.musicPlayer,()=>{
        //设置默认音量
        this.setVolume(.6)
        this.$refs.volumeBar.setPercent(.6)
      });
    },
    computed: {
      currentMusicTime() {
        return seconds2MinutesSeconds(this.currentTime) + '/' +
          seconds2MinutesSeconds(this.musicTotalTime);
      }
    },
    watch:{
      currentTime(newVal){
        this.$emit('musicTimeChange',newVal)
        if(!this.isPlaying){
          this.pauseMusic()
        }
      },
      musicUrl(){
        this.$refs.musicPlayer.load()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .music-progress-bar {
    position: relative;
    z-index: 999;
    .time {

    }
    user-select: none;
    width: 100%;
    .music-progress-bar-body {
      display: flex;
      height: 1.5rem;
      align-items: center;
      align-content: center;
      .music-play-icon {
        flex: 0 1 auto;
      }
      .music-progress-bar-content {
        flex: 1 1 auto;
      }
    }
    .music-progress-bar-volume-icon {
      position: relative;
      margin: 0 3px;
      display: flex;
      justify-content: center;
      transition-property: opacity;
      transition-duration: .3s;
      > .icon {
        opacity: .7;
      }
      &:hover {
        .music-progress-bar-volume-wrap {
          opacity: 1;
          bottom: 100%;
        }
        > .icon {
          opacity: 1;
        }
      }
      .music-progress-bar-volume-wrap {
        position: absolute;
        overflow: hidden;
        height: 60px;
        transition: all .3s;
        opacity: 0;
        bottom: 0;
      }
    }
    .favour {
      display: flex;
      margin-right: 3px;
      justify-content: center;
      align-items: center;
    }
    .icon {
      font-size: 20px;
    }
  }

</style>
