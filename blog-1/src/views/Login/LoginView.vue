<template>
  <div class="login" >
    <div class="home-btn" @click="goMainPage">主站</div>
    <transition name="login-background-on">
      <img class="login-background"
           v-show="isLoginBackgroundLoaded"
           src="http://r.photo.store.qq.com/psc?/V53RZdap02olQB1qJRDI0kxlEl0h2BPA/45NBuzDIW489QBoVep5mcRmJJ6swkxuDdj5W8*udZhOrZdj56OcM2z.Y7SzeMsAvin*GfbBCBTaToKhpue*u5huGsWa.5KVYyr9b5YUVRzQ!/r"
           @load="isLoginBackgroundLoaded = true" />
    </transition>
    <div class="container">
      <div class="select">
        <div class="login-view-btn" @click="toLoginView">
          登录
          <svg class="icon" v-show="isLoginView">
            <use xlink:href="#iconmao"></use>
          </svg>
        </div>
        <div class="register-view-btn" @click="toRegisterView">
          注册
          <svg class="icon" v-show="!isLoginView">
            <use xlink:href="#iconmao"></use>
          </svg>
        </div>
      </div>
      <div class="input-container" >
        <div :style="inputContainerStyle" class="login-input-group">
          <div v-if="!isLogIn">
            <div class="account">
              <input type="text" v-model="logIn.username" autocomplete="off"
                     placeholder="用户名/邮箱" size="26" maxlength="20"/>
            </div>
            <div class="password">
              <input type="password" v-model="logIn.password" autoComplete="new-password"
                     placeholder="密码" size="26" maxlength="20"/>
            </div>
            <div class="login-option">
          <span class="autologin-btn" @click="autoLoginBtnClick">自动登录
            <svg class="icon" v-show="!isAutoLogin">
              <use xlink:href="#iconxuanzekuang"></use>
            </svg>
            <svg class="icon" v-show="isAutoLogin">
              <use xlink:href="#iconxuanzekuang1"></use>
            </svg>
          </span>
              <span class="login-btn" @click="doLogin">确认</span>
            </div>
          </div>
          <div v-else class="has-login">
            <h3>
              您已经登录了啦~~
            </h3>
          </div>
        </div>
        <div  v-show="!isLoginView" class="register-input-group">
            <div class="account">
              <input type="text" v-model="register.username" autocomplete="off"
                     placeholder="用户名:长度3~10" size="26" maxlength="20"/>
            </div>
            <div class="password">
              <input :type="isShowPassword"
                     v-model="register.password"
                     autoComplete="new-password"
                     placeholder="密码:长度8~20数字字母" size="22" maxlength="20"/>
              <div class="password-visibility-icon" @click="prdVisiIconClick">
                <svg class="icon" v-show="!isPasswordVisible">
                  <use xlink:href="#iconyanjing"></use>
                </svg>
                <svg class="icon" v-show="isPasswordVisible">
                  <use xlink:href="#iconyanjing1"></use>
                </svg>
              </div>
            </div>
            <div class="email">
              <input type="text" v-model="register.email" autocomplete="off"
                     placeholder="邮箱" size="26" maxlength="30"/>
            </div>
            <div class="verification-code">
              <input type="text" v-model="register.vericode" autocomplete="off"
                     placeholder="验证码" maxlength="6" size="10" />
              <span v-if="hasSentEmail">已发送,倒计时:{{ countdown }}</span>
              <span v-else class="sendemain-btn" >
                <count-down-btn class="countdonw-btn"
                                value="发送"
                                @doClick="sendEmail" ref="countdown"/>
              </span>
            </div>
            <div class="register-option">
              <span class="register-btn" @click="doRegister">提交</span>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex'
  import * as types from "@/store/mutations-type";
  import CountDownBtn from "../../components/common/CountDownBtn/CountDownBtn";
  import {getAutoLogin, setAutoLogin, setToken} from "../../common/cache";
  import {login, register, sendEmail} from "../../network/blogpage";


  export default {
    name: "LoginView",
    components: {CountDownBtn},
    data (){
      return {
        isLoginView:true,
        hasSentEmail:false,
        isAutoLogin:false,
        isPasswordVisible:false,
        isLoginBackgroundLoaded:false,
        logIn:{
          username:'',
          password:'',
        },
        register:{
          username:'',
          password:'',
          email:'',
          vericode:''
        },
        countdown:0,
      }
    },
    methods:{
      /*
        触发事件
       */
      toLoginView(){
        if(!this.isLoginView){
          this.isLoginView = true
        }
      },
      toRegisterView(){
        if(this.isLoginView){
          this.isLoginView = false
        }
      },
      autoLoginBtnClick(){
        this.isAutoLogin = !this.isAutoLogin
      },
      prdVisiIconClick(){
        this.isPasswordVisible = !this.isPasswordVisible
      },
      doLogin(){
        login(this.logIn,this.isAutoLogin).then(res => {
          alert(res.data.message)
          if (res.data.code === 200 && res.data.data) {
            setToken(res.data.data.token)
            setAutoLogin(this.isAutoLogin)
            this.$store.commit(types.SET_LOGIN,this.isAutoLogin)
            this.$store.commit(types.SET_USER,res.data.data.user)
            // window.location.href = '/' 这个相当于刷新页面，如果没有记住功能，会导致登录状态被清掉
            this.$router.push(`/${res.data.data.user.userId}`)
          }
        })
      },
      doRegister(){
        if( !this.register.email.trim()) {
          alert('邮箱不得为空')
        }
        if( !this.register.username.trim()) {
          alert('用户名不得为空')
        }
        if( !this.register.password.trim()) {
          alert('密码不得为空')
        }
        register(this.register).then(res=>{
          alert(res.data.message)
        })
      },
      goMainPage(){
        this.$store.commit(types.SET_CURRENT_BLOG_TYPE,{type:'all',info:'all'})
        this.$store.commit( types.SET_BLOGS_INFO,[] )
        if (this.isLogIn) {
          this.$router.push(`/${this.user.userId}`)
        }else {
          this.$router.push(`/${this.defaultUserId}`)
        }
      },
      sendEmail(){
        if(this.register.email&&this.register.email.trim()){
          this.$refs.countdown.noMoreClick = true
          sendEmail(this.register.email).then(res=>{
            if( res.data) {
              alert(res.data.message)
            }
            this.$refs.countdown.noMoreClick = false
            if(res.data.data) {
              this.$refs.countdown.doCountdown()
            }
          }).catch(err=>{
            this.$refs.countdown.noMoreClick = false
          })
        }else {
          alert('请输入邮箱')
        }

      }
    },
    computed:{
      inputContainerStyle(){
        return this.isLoginView ? {} : {'margin-left': '-100%'}
      },
      isShowPassword(){
        return this.isPasswordVisible ?  'text' : 'password'
      },
      ...mapGetters([
        'isLogIn',
        'defaultUserId',
        'user'
      ])
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
.login {
  .home-btn {
    position: absolute;
    z-index: 10;
    top: 0;
    right: 15px;
    color: rgba(246, 185, 167, 0.45);
    font-size: 1.4rem;
    font-weight: bold;
    padding: 7px 15px;
    user-select: none;
    cursor: pointer;
  }
  position: relative;
  height: 100vh;
  .login-background-on-enter-active,.login-background-on-leave-active {
    transition: opacity 2s ease-out ;
  }
  .login-background-on-enter,.login-background-on-leave-to {
    opacity: 0;
  }
  .login-background {
    position: absolute;
    width: 100%;
    height: 100%;
    user-select: none;
    cursor: inherit;
    pointer-events: none; //禁止与鼠标 等相关事件，如  不可拖拉图片
  }
  /*background: {*/
  /*  image: url("http://r.photo.store.qq.com/psc?/V53RZdap02olQB1qJRDI0kxlEl0h2BPA/45NBuzDIW489QBoVep5mcRmJJ6swkxuDdj5W8*udZhOrZdj56OcM2z.Y7SzeMsAvin*GfbBCBTaToKhpue*u5huGsWa.5KVYyr9b5YUVRzQ!/r");*/
  /*  size: cover;*/
  /*  position: center;*/
  /*};*/
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    border : 2px solid rgba(80,80,80,.4);
    box-shadow: 0 0 2px 1px rgba(80,80,80,.4) inset;
    background-color: rgba( 240,255,255,0.7);
    border-radius: 15px;
    transform: translate(-50%,-70%);
    .select {
      display: flex;
      justify-content: space-between;
      padding: 5px;
      margin: 0 10px;
      font-size: 1.4rem;
      border-bottom: 2px solid #70b198;
      .login-view-btn,.register-view-btn{
        flex: 1 1 auto ;
        width: 49%;
        text-align: center;
        user-select: none;
        cursor: pointer;
        transition: background-color .3s;
        &:hover {
          background-color: rgba( 240,255,255,.5);
        }
      }
      .login-view-btn {
        border-right: 2px solid #89bba1;
      }
    }

    .input-container {
      display: flex;overflow: hidden;
      .has-login {
        color: #0ccce5;
        text-align: center;
        padding: 50px 0 70px;
      }
    }

    .login-input-group,.register-input-group{
      flex: 1 0 auto;
      transition: all .3s;
      display: flex;
      flex-direction: column;
      text-align: center;
      width: 100%;
      > div {
        flex: 1 1 auto;
      }
      .account {
        > input {
          width: 261px;
        }
        margin-top: 10px;
      }
      .password {
        > input {
          width: 261px;
        }
        margin-top: 10px;
        margin-bottom: 10px;
      }
      input {
        border-radius: 7px;
        outline: none;
        padding-left: 15px;
        height: 35px;
        border: none;
        font-size: 1.1rem;
        letter-spacing:2px
      }
    }
    .login-input-group {
      .login-option {
        margin-bottom: 10px;
        text-align: center;
        user-select: none;
        cursor: pointer;
        display: flex;
        justify-content: space-evenly;
        padding: 5px 0;
        .autologin-btn {
          > svg {
            font-size: 1.3rem;
            margin-bottom: -2px;
          }
        }
        .login-btn {
          transition: color .3s;
          &:hover {
            color: #03b4fa;
          }
        }
      }
    }
    .register-input-group {
      .password{
        position: relative;
        margin-left: auto;
        margin-right: auto;
        background-color: #ffe4c4;
        padding-right: 34px;
        border-radius: 10px;
        border: 1px solid rgba(187, 184, 203, 0.5);
        > input {
          width: 225px;
          border: none;
          background: #ffe4c4;
        }
        .password-visibility-icon {
          position: absolute;
          user-select: none;
          width: 20px;
          top:50%;
          transform: translateY(-50%) scale(2);
          right: 10px;
        }
      }
      .email {
        > input {
          width: 261px;
        }
      }
      .verification-code {
        margin: 10px 0;
        .sendemain-btn {
          padding-left: 20px;
          user-select: none;
          cursor: pointer;
        }
        .countdonw-btn {
          font-weight: bold;
        }
      }
      .register-option {
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        padding: 5px 0;
        .register-btn {
          user-select: none;
          cursor: pointer;
          padding: 0 10px;
          font-size: 1.1rem;
          transition: color .3s;
          &:hover {
            color: #03b4fa;
          }
        }
      }
    }
  }
}
</style>
