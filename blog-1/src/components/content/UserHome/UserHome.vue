<template>
  <div class="user-home">
    <common-frame :width="40" v-show="isShow" @frameClose="frameClose">
      <div slot="content" class="user-home-container">
        <ul class="sidebar">
          <li v-for="(item,index) in sideBarItems"
              :style="index===currentIndex ? activeContentItemStyle : {}"
              @click="itemClick(index)">
            {{ item }}
          </li>
        </ul>
        <div class="content">
          <div class="content-item" v-show="0 === currentIndex">
            <div class="user-info">
              <div class="head">
                <span>头像:</span>
                <img :src="headImgUrl"/>
              </div>
              <div class="user-name">
                <span>用户名:</span>
                <p v-cloak>{{ user.userName }}</p>
              </div>
              <div class="user-email">
                <span>邮箱:</span>
                <p v-cloak>{{ user.email }}</p>
              </div>
              <div class="url-input">
                <span>头像接口:</span>
                <input v-model="headImgUrl" maxlength="1000"/>
                <span class="submit-btn" @click="submitHeadImgUrl">提交</span>
              </div>
            </div>
          </div>
          <div class="content-item" v-show="1 === currentIndex">
            <div class="announcement-input-panel">
              <p>可使用html ,并内联css样式~~~~</p>
              <textarea v-model="announcement" rows="5" cols="25" style="resize: none" maxlength="2000"/>
              <div ><span class="submit-btn" @click="submitAnnouncement">提交</span></div>
            </div>
          </div>
          <div class="content-item " v-show="2 === currentIndex">
            <div class="other">
              <span >github地址:</span>
              <div class="gburl-input">
                <input v-model="githubUrl" maxlength="1000" />
              </div>
              <span >bilibili主页:</span>
              <div class="gburl-input">
                <input v-model="bilibiliUrl" maxlength="1000"/>
              </div>
              <span class="submit-btn" @click="submitGithubBilibiliUrl">提交</span>
            </div>
          </div>
        </div>
      </div>
    </common-frame>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import {submitAnnouncement,submitHeadImgUrl,submitGithubBilibiliUrl} from "../../../network/blogpage";
  import * as types from  '@/store/mutations-type'
  import CommonFrame from "../../common/CommonFrame/CommonFrame";

  export default {
    name: "UserHome",
    components: {
      CommonFrame
    },
    data(){
      return{
        isShow:false,
        sideBarItems:['个人信息','公告','其它'],
        currentIndex:0,
        headImgUrl:'../../../assets/img/blog_page/user_head_img.jpg',
        announcement:'',
        githubUrl:'',
        bilibiliUrl:''
      }
    },
    methods:{
      frameClose(){
        this.isShow = false
        this.currentIndex=0
      },
      showFrame(){
        this.isShow = true
        this.headImgUrl = this.user.headImgUrl
        this.announcement = this.user.announcement
        this.githubUrl = this.user.githubUrl
        this.bilibiliUrl = this.user.bilibiliUrl
      },
      itemClick(index){
        this.currentIndex = index
      },
      submitHeadImgUrl(){
        submitHeadImgUrl(this.fingerPrintId,this.headImgUrl,this.user.userId).then(res=>{
          if(res.data){
            alert(res.data.message)
            if(res.data.code === 200 && res.data.data) {
              this.$store.commit(types.SET_HEAD_IMG_URL,this.headImgUrl)
            }
          }
        })
      },
      submitAnnouncement() {
        submitAnnouncement(this.fingerPrintId,this.announcement,this.user.userId).then(res=>{
          if(res.data){
            alert(res.data.message)
            if(res.data.code === 200 && res.data.data) {
              this.$store.commit(types.SET_ANNOUNCEMENT,this.announcement)
              // if(Number.parseInt(this.$route.params.uid) === Number.parseInt(this.user.userId) ) {
              //   this.$store.commit(types.SET_PAGE_USER_ANNON,this.announcement)
              // }
            }
          }
        })
      },
      submitGithubBilibiliUrl() {
        submitGithubBilibiliUrl(this.user.userId,this.githubUrl,this.bilibiliUrl,this.fingerPrintId).then(res=>{
          if(res.data){
            alert(res.data.message)
            if(res.data.code === 200 && res.data.data ) {
              this.$store.commit({
                type:types.SET_GITHUBBILIBILI_URL,
                data:{
                    githubUrl:this.githubUrl,
                    bilibiliUrl:this.bilibiliUrl
                  }
              })
            }
          }
        })
      }
    },
    computed:{
      ...mapGetters([
        'user',
        'fingerPrintId',
        'pageUser'
      ]),
      activeContentItemStyle(){
        return {'font-weight':'bolder'}
      },
      //$watch 主动调用  $bus 事件总线
    },
    watch:{
      //监视属性
      'user':{
        handler(newVal){
          this.headImgUrl = newVal.headImgUrl
          this.announcement = newVal.announcement
          this.bilibiliUrl = newVal.bilibiliUrl
          this.githubUrl = newVal.githubUrl
        },
        deep:true
      }
    }
  }
</script>

<style lang="scss" scoped>
.user-home {
  .user-home-container {
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    margin: 13px 5px;
    height: 300px;
    .sidebar {
      list-style-type:none;
      flex: 0 1 auto;
      display: flex;
      flex-direction: column;
      white-space: nowrap;
      border-right: 1px solid black;
      > li {
        text-align: center;
        color: #897a69;
        position: relative;
        padding: 6px 20px;
        z-index: 30;
        user-select: none;
        cursor: pointer;
        border-bottom: 3px solid rgba(0, 0, 0, 0.2);
        &:hover {
          background-color: rgba(0, 0, 0, .4);
        }
        &:nth-last-child(1){
          border: none;
        }
      }
    }
    .content {
      text-align: center;
      flex: 1 1 auto;
      @keyframes fadeEnter {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .submit-btn {
        user-select: none;
        cursor: pointer;
        padding: 4px 2px;
        border: 2px solid #6a4d2f;
        border-radius: 5px;
      }
      .content-item {
        height: 100%;
        animation: fadeEnter .4s;
        padding: 20px 10%;
        .user-info {
          display: flex;
          flex-direction: column;
          .head {
            overflow: auto;
            >span {
              font-size: 1.2rem;
              line-height: 100px;
            }
            >img {
              user-select: none;
              height: 100px;
              width: 100px;
            }
          }
          .user-name,.user-email{
            > span {
              font-size: 1.2rem;
            }
            p {
            }
          }
          .url-input {
            >input {
              width: 50%;
              height: 30px;
              border: 1px solid #90aae8;
              border-radius: 5px;
              font-size: 0.8rem;
              user-select: text;
            }
          }
          > * {
            display: flex;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            &:hover {
              background-color: rgba(192, 192, 192, 0.1);
            }
          }
        }
        .announcement-input-panel {
          > * {
            padding: 10px ;
          }
        }
        .other {
          .gburl-input {
            margin: 15px 0;
            > input {
              width: 80%;
              height: 30px;
              border: 1px solid #90aae8;
              border-radius: 5px;
              font-size: 0.8rem;
              user-select: text;
            }
          }
        }
      }
    }
  }
}
</style>
