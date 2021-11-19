<template>
  <span>
    <span @click.stop="btnClick" v-if="!isCountdown">
      {{ value }}
    </span>
    <span v-else >
      {{ `倒计时:${countTime}s` }}
    </span>
  </span>

</template>

<script>

  export default {
    name: "CountDownBtn",
    props:{
      value:{
        type:String,
        default:'点击'
      },
      seconds:{
        type:Number,
        default:60
      }
    },
    data(){
      return {
        isCountdown:false,
        countTime:0,
        noMoreClick:false
      }
    },
    methods:{
      btnClick(){
        if(!this.noMoreClick){
          this.$emit('doClick')
        }
      },
      doCountdown() {
        if (window.localStorage) {
          let futureTime = (new Date()).getTime() + this.seconds * 1000
          localStorage.setItem('futureTime', futureTime.toString())
          this.checkCountdown()
        }
      },
      checkCountdown(){
        if (window.localStorage) {
          let futureTime = localStorage.getItem('futureTime')
          if (!futureTime) {
            this.isCountdown = false
          } else {
            let currentTime = (new Date()).getTime()
            if((futureTime - currentTime) <= 0 ){
              this.isCountdown = false
            }else {
              this.isCountdown = true
              this.countTime = (futureTime - currentTime) / 1000 - ((futureTime - currentTime)/1000) % 1
              let timer = setInterval(()=>{
                currentTime = (new Date()).getTime()
                //防止网页多开时，用户搞事乱发邮件
                futureTime = localStorage.getItem('futureTime')
                if((futureTime - currentTime) > 0){
                  this.countTime = (futureTime - currentTime) / 1000 - ((futureTime - currentTime)/1000) % 1
                }else {
                  this.isCountdown = false
                  this.countTime = 0
                  clearInterval(timer)
                }
              },800)
              //800能修正计算时出现的一些偏差，1000则不能，使用1000可能会导致显示倒计时一口气跳了两秒
            }
          }
        }
      }
    },
    created(){
      this.checkCountdown()
    }
  }
</script>

<style scoped>

</style>
