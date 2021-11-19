<template>
  <div>
    <transition >
      <div class="toast" v-show="isShow">
        <span>{{ msg }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "Toast",
    data() {
      return {
        msg:'处理中...',
        isShow:false
      }
    },
    methods:{
      setShow( isShow ) {
        this.isShow = isShow
      },
      setMsg( msg ) {
        this.msg = msg
      }
    }
  }
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 4000;
  > span {
    user-select: none;
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 5px 20px;
    border-radius: 10px;
    transform: translate(-50%,-50%);
    font-size: 1.2rem;
    background-color: #797171;
    color: #efecf3;
  }
}
.v-leave,.v-enter-to {
  opacity: 1;
}
.v-leave-to ,.v-enter {
  opacity: 0;
}
.v-leave-active,.v-enter-active{
  transition: opacity 1s;
}
</style>
