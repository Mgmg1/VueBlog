<template>
  <div class="common-frame" :style="{'background-color':marginColor}">
    <div class="body" :style="bodyStyle">
      <div class="navbar">
        <div class="left">
          <div class="title">
            <slot name="title"></slot>
          </div>
        </div>
        <span class="right" @click="closeIconClick">
          <svg class="icon">
            <use xlink:href="#iconcha"></use>
          </svg>
        </span>
      </div>
      <div class="frame-content" ref="content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CommonFrame",
    props:{
      width:{
        type:Number,
        default:80
      },
      marginColor:{
        type:String,
        default: 'rgba(0,0,0,0.4)'
      },
      bgColor:{
        type:String,
        default:'rgb(255,255,255)'
      }
    },
    methods:{
      closeIconClick(){
        this.$emit('frameClose')
      }
    },
    computed:{
      bodyStyle(){
        return {'width':`${this.width}%`,'background-color':this.bgColor}
      }
    }
  }
</script>

<style lang="scss" scoped>
.common-frame {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 3000;
  .body {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 20px;
    .navbar {
      .left {
        width: 100%;
        line-height: 34px;
        text-align: center;
      }
      .right {
        position: absolute;
        right: 0;
        top: 0;
        padding: 5px 2px 5px;
        margin: 2px 10px;
        cursor: pointer;
        &:hover {
          background-color: rgba(200, 200, 200, 0.4);
        }
      }
    }
    .frame-content {
      flex: 1 1 auto;
    }
  }

}
</style>
