<template>
  <div class="level-progress-bar" >
      <div class="progress-bar-body"
           @mouseenter="isBarBtnShow=true"
           @mouseleave="isBarBtnShow=false"
           @click="btnSkipTo"
           :style="{'height':(sideLength/2)+'px'}"
           ref="barBody" >
        <div class="finish-bar-body"
             :style="{'width':percent+'%','background-color':backGroundColor}"></div>
       <transition>
        <div class="precess-bar-btn"
             v-show="isBarBtnShow"
             :style="{'left':percent+'%','background-color':backGroundColor,
             'width':sideLength+'px','height':sideLength+'px',}"
             @mousedown="mouseDown"
             @mousemove="mouseMove"
             @mouseup="mouseUp"
             @touchstart="mouseDown"
             @touchmove="mouseMove"
             @touchend="mouseUp"
             ref="barBtn" >
        </div>
        </transition>
      </div>
  </div>
</template>

<script>

  import {until} from "../../../common/utils";

  export default {
    name: "LevelProgressBar",
    props: {
      min:{
        type:Number,
        default(){
          return 0
        }
      },
      max:{
        type:Number,
        default(){
          return 100
        }
      },
      sideLength:{
        type:Number,
        default:15
      },
      backGroundColor:{
        type:String,
        default:'#00bfff'
      },
      //通过 props 来改变 barValue
      propsBarValue:{
        type:Number,
        default:this.min
      }
    },
    data() {
      return {
        percent: 0,
        isMouseDown: false,
        currentX: 0,
        barLength: 0,
        //这个数据不是必须的
        isBarBtnShow:false,
        barValue:0
      }
    },
    methods: {
      //事件方法
      mouseDown(event) {
        //由于触摸屏需点击一次才能触发mouseenter，会触发mouseEvent(click)事件！！
        // 同时监听 touch移动 和 mouse移动 事件时，原地点击会导致click和两者都响应,先响应touch，后响应mouse和click！！
        // if( !this.isMouseDown ) {  //防止touch触发后导致mousedown也触发

        ///// 移动端需点击一次才能触发mouseenter让btn显示，导致mouseDown需要做处理兼容,
        ///// 原地click会导致触发三类事件，应当只筛出一种，即使isMobile()判断错误也要控制不出bug,
        ////  添加!this.isMouseDown条件,并做this.isMouseDown = false 修正 由于isMobile()判断错误导致的bug
        if( !this.isMouseDown ) {
          this.isMouseDown = true;
          this.barLength = this.$refs.barBody.offsetWidth;
          //防止由于 this.isMobile() 方法匹配不准确 导致 currentX event事件匹配错误
          //兼容两种事件的处理来获取clientX
          this.currentX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
          //告诉父组件开始拖动
          this.$emit('btnDragStart')
        } else {
          //修正mouseup 和 touchend 都被不触发时this.isMouseDown的值
          this.isMouseDown = false
        }
      },
      mouseMove() {
        if (this.isMouseDown) {
          //即使isMobile()判断失误，也不至于报bug
          if( !this.isMobile() ) {
            document.onmousemove = (event)=>{
              this.percent += (event.clientX - this.currentX) * 100 / this.barLength ;
              this.currentX = event.clientX;
              this.calcBarValue()
              this.$emit('btnXChange',this.barValue);
              document.onmouseup = document.onmouseleave = ()=>{
                this.isMouseDown = false;
                document.onmouseup = document.onmouseleave = document.onmousemove = null;
                if (this.percent > 100){
                  this.percent = 100;
                  //可以使用 clientX 代替
                  this.currentX = this.$refs.barBody.getBoundingClientRect().right
                } else if (this.percent < 0) {
                  this.percent = 0;
                  //可以使用 clientX + offsetWidth代替
                  this.currentX = this.$refs.barBody.getBoundingClientRect().left
                }
                this.calcBarValue()
                this.$emit('btnXChange',this.barValue);
                //告诉父组件拖动结束
                this.$emit('btnDragEnd')
              }
            }
          }else {
            document.ontouchmove = (event)=>{
              this.percent += (event.touches[0].clientX - this.currentX) * 100 / this.barLength ;
              this.currentX = event.touches[0].clientX;
              this.calcBarValue()
              this.$emit('btnXChange',this.barValue);
              if( !document.ontouchend ) {
                  document.ontouchend = () =>{
                  this.isMouseDown = false;
                  document.ontouchend = document.ontouchmove = null;
                  if (this.percent > 100){
                    this.percent = 100;
                    //可以使用 clientX 代替
                    this.currentX = this.$refs.barBody.getBoundingClientRect().right
                  } else if (this.percent < 0) {
                    this.percent = 0;
                    //可以使用 clientX + offsetWidth代替
                    this.currentX = this.$refs.barBody.getBoundingClientRect().left
                  }
                  this.calcBarValue()
                  this.$emit('btnXChange',this.barValue);
                  //告诉父组件拖动结束
                  this.$emit('btnDragEnd')
                }
              }
            }
          }
        }
      },
      mouseUp() {
        this.isMouseDown = false;
        // document.onmouseup = document.onmouseleave = document.onmousemove = null
        // document.ontouchend = document.ontouchmove = document.ontouchcancel = null
      },
      isMobile(){
        return  navigator.userAgent.match(
          '/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|'+
          'MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i')
      },
      btnSkipTo(event){
        this.barLength = this.$refs.barBody.offsetWidth;
        this.currentX = this.$refs.barBtn.getBoundingClientRect().left + this.$refs.barBtn.offsetWidth/2;
        //兼容
        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
        this.percent += (clientX - this.currentX) * 100 / this.barLength ;
        this.currentX = clientX;
        this.calcBarValue()
        this.$emit('btnXChange',this.barValue);
        //通知父组件滑动条按钮 进行了一次 条跳跃
        this.$emit('btnSkip')
      },
      calcBarValue(){
        if(this.percent>=100) this.barValue = this.max;
        else if(this.percent<=0) this.barValue = this.min;
        else this.barValue = this.min + this.percent/100 * (this.max-this.min);
      },
      setPercent(newBarValue){
        this.percent = (newBarValue - this.min) /(this.max - this.min) * 100;
        this.calcBarValue()
      }
    },
    computed: {

    },
    mounted() {
      this.barValue = this.min;
      until(()=>this.$refs.barBody,()=>{
        this.barLength = this.$refs.barBody.offsetWidth;
        this.currentX =  this.$refs.barBody.getBoundingClientRect().left;
      })
    },
    watch:{
      //percent 变化频率特别高
      // 经试验发现监视器性能差,且有循环响应，引起卡顿，故不使用
      // percent(newPercent){
      //   //根据percent变化,计算出barValue
      //   if(this.percent>=100) this.barValue = this.max;
      //   else if(this.percent<=0) this.barValue = this.min;
      //   else this.barValue = this.min + this.percent/100 * (this.max-this.min);
      // },
      propsBarValue(newBarValue){
        this.setPercent(newBarValue)
        // 在这里发送事件会引起循环响应，mp3有卡顿,并且此处虽然barValue改变了，但是没有必要发送事件
        // this.$emit('btnXChange',this.barValue);
      }
    },
  }
</script>

<style lang="scss" scoped>
  .level-progress-bar {
    position: relative;
    width: 100%;
    padding: {
      top: 5px;
      bottom: 5px;
    }
    overflow: hidden;
    .progress-bar-body {
      width: 100%;
      position: relative;
      z-index: 0;
      background-color: #a9a9a9;
      .finish-bar-body{
        position: absolute;
        height: 100%;
        /*由于overflow-x 和 -y 引起奇怪的bug，改用 maxwidth替代*/
        max-width: 100%;
      }
    }
    .precess-bar-btn {
      position: absolute;
      z-index: 20;
      border-radius: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      user-select: none;
    }
  }
  .v-enter-active, .v-leave-active {
    transition: opacity .3s
  }
  .v-enter, .v-leave-to {
    opacity: 0
  }
  .v-move{
    transition: all 0.6s ease;
  }
</style>
