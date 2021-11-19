<template>
  <div class="vertical-progress-bar" >
      <div class="progress-bar-body"
           @click="btnSkipTo"
           :style="{'width':(sideLength/2)+'px'}"
           ref="barBody" >
        <div class="finish-bar-body"
             :style="{'height':percent+'%','background-color':backGroundColor}"></div>
       <transition>
        <div class="precess-bar-btn"
             :style="{'bottom':percent+'%','background-color':backGroundColor,
             'height':sideLength+'px','width':sideLength+'px',}"
             @mousedown.prevent="mouseDown"
             @mousemove.prevent="mouseMove"
             @mouseup.prevent="mouseUp"
             @touchstart.prevent="mouseDown"
             @touchmove.prevent="mouseMove"
             @touchend.prevent="mouseUp"
             ref="barBtn" >
        </div>
        </transition>
      </div>
  </div>
</template>

<script>

  import {until} from "../../../common/utils";

  export default {
    name: "VerticalProgressBar",
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
        //垂直bar中，percent 和
        percent: 0,
        isMouseDown: false,
        currentY: 0,
        barLength: 0,
        barValue:0,
      }
    },
    methods: {
      //事件方法
      mouseDown(event) {
        //offsetHeight clientY

        if( !this.isMouseDown ) {
          this.isMouseDown = true;
          this.barLength = this.$refs.barBody.offsetHeight;
          //防止由于 this.isMobile() 方法匹配不准确 导致 currentX event事件匹配错误
          //兼容两种事件的处理来获取clientX
          this.currentY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
          //告诉父组件开始拖动
          this.$emit('btnDragStart')
        } else {
          //修正mouseup 和 touchend 都被不触发时this.isMouseDown的值
          this.isMouseDown = false
        }
      },
      mouseMove() {
        if (this.isMouseDown) {
          if( !this.isMobile() ) {
            window.onmousemove = (event)=>{
              this.percent += -(event.clientY - this.currentY) * 100 / this.barLength ;
              this.currentY = event.clientY;
              this.calcBarValue();
              this.$emit('btnXChange',this.barValue);
              this.isMouseDown = false;
            }
            window.onmouseup = window.onmouseleave = ()=>{
              window.onmouseup = window.onmouseleave = window.onmousemove = null;
              if (this.percent > 100){
                this.percent = 100;
                //可以使用 clientX 代替
                this.currentY = this.$refs.barBody.getBoundingClientRect().top
              } else if (this.percent < 0) {
                this.percent = 0;
                //可以使用 clientX 代替+ offsetWidth
                this.currentY = this.$refs.barBody.getBoundingClientRect().bottom
              }
              this.calcBarValue();
              this.$emit('btnXChange',this.barValue);
              //告诉父组件拖动结束
              this.$emit('btnDragEnd')
            }
          }else {
            window.ontouchmove = (event)=>{
              this.percent += -(event.touches[0].clientY - this.currentY) * 100 / this.barLength ;
              this.currentY = event.touches[0].clientY;
              this.calcBarValue();
              this.$emit('btnXChange',this.barValue);
              this.isMouseDown = false;
            }
            window.ontouchend =  ()=>{
              window.ontouchend  = window.ontouchmove = null;
              if (this.percent > 100){
                this.percent = 100;
                //可以使用 clientX 代替
                this.currentY = this.$refs.barBody.getBoundingClientRect().top
              } else if (this.percent < 0) {
                this.percent = 0;
                //可以使用 clientX 代替+ offsetWidth
                this.currentY = this.$refs.barBody.getBoundingClientRect().bottom
              }
              this.calcBarValue();
              this.$emit('btnXChange',this.barValue);
              //告诉父组件拖动结束
              this.$emit('btnDragEnd')
            }
          }
        }
      },
      mouseUp() {
        this.isMouseDown = false;
        // window.onmouseup = window.onmouseleave = window.onmousemove = null
        // window.ontouchend = window.ontouchmove = window.ontouchcancel = null
      },
      btnSkipTo(event){
        this.barLength = this.$refs.barBody.offsetHeight;
        this.currentY = this.$refs.barBtn.getBoundingClientRect().top + this.$refs.barBtn.offsetHeight/2;
        this.percent += -(event.clientY - this.currentY) * 100 / this.barLength ;
        this.currentY = event.clientY;
        this.calcBarValue();
        this.$emit('btnXChange',this.barValue);
        //通知父组件滑动条按钮 进行了一次 条跳跃
        this.$emit('btnSkip')
      },
      //根据percent计算出barValue
      calcBarValue(){
        if(this.percent>=100) this.barValue = this.max;
        else if(this.percent<=0) this.barValue = this.min;
        else this.barValue = this.min + this.percent/100 * (this.max-this.min);
      },
      setPercent(newBarValue){
        this.percent = (newBarValue - this.min) /(this.max - this.min) * 100;
        this.calcBarValue()
      },
      isMobile(){
        return  navigator.userAgent.match(
          '/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|'+
          'MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i')
      },
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
    }
  }
</script>

<style lang="scss" scoped>
  .vertical-progress-bar {
    position: relative;
    height: 100%;
    padding: {
      left: 5px;
      right: 5px;
    }
    overflow: hidden;
    .progress-bar-body {
      height: 100%;
      position: relative;
      z-index: 0;
      background-color: #a9a9a9;
      .finish-bar-body{
        position: absolute;
        bottom: 0;
        width: 100%;
        /*由于overflow-x 和 -y 引起奇怪的bug，改用 maxwidth替代*/
        max-height: 100%;
      }
      &:hover {
        .precess-bar-btn {
          opacity: 1;
        }
      }
    }
    .precess-bar-btn {
      transition: opacity .3s;
      position: absolute;
      z-index: 20;
      border-radius: 50%;
      right: 50%;
      opacity: 0;
      transform: translate(50%, 50%);
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
