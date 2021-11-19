<template>
  <div class="blog-box" >
    <div class="blog-item"
         @click="blogItemClick(blog)" v-for="( blog,index ) in blogsInfo" :key="blog.createDate">
      <div class="content" >
        <div class="mask" :style="{'background-image':`url(${blog.coverUrl})`}"></div>
        <div class="bgcolor-mask" ></div>
        <div class="content-wrapper">
          <div class="title">
            <div class="title-wrap">
              <span>{{ blog.title }}</span>
            </div>
            <div class="supplement">
              <p>{{ blog.summary }}</p>
            </div>
          </div>
          <div class="blog-info">
            <div class="info-wrap">
              {{ formatDate(blog.createDate) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import {formatDate} from "../../../common/utils";

  export default {
    name: "BlogBox",
    methods:{
      blogItemClick(blog){
        let time = 300
        this.$bus.$emit('blogItemClick',time)
        setTimeout(()=>{
          //等待滚动条滚动完毕！！!
          this.$router.push(`${this.$route.fullPath}/content/${blog.articleId}`)
        },time+40)
      },
      formatDate(date) {
        return formatDate(new Date(date),'yyyy-MM-dd hh-mm-ss'  )
      }
    },
    computed:{
      ...mapGetters([
        'blogsInfo',
        'fingerPrintId'
      ]),

    }
  }
</script>

<style lang="scss" scoped>
.blog-box {
  user-select: none;
  @keyframes blogItemEnter {
    from { padding-right: 10% }
    to { padding-right: 0 }
  }
  .blog-item {
    animation: blogItemEnter .2s;
    position: relative;
    .content {
      position: relative;
      overflow: hidden;
      width: 100%;
      margin-top: 25px;
      padding-bottom: 45%;
      border-radius: 20px;
      background-color: rgba(191, 181, 212,var(--global-opacity,1));
      transition: all .3s;
      .mask {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        transition: all .3s;
        background: {
          /*image:url('../../../assets/img/blog_page/blog_box_cover2.jpg');*/
          /*image:url('https://i0.hdslb.com/bfs/article/55eadac7f5bcc03ed31f568a4aaa0227500b715b.jpg@1320w_934h.jpg');*/
          position: center center ;
          size: 101% auto;
        }
        opacity: var(--global-opacity,1);
      }
      .bgcolor-mask {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        transition: all .3s;
      }
      .content-wrapper {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
      }
      .title {
        position: relative;
        flex: 1 1 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        .title-wrap {
          transition: all .25s;
          color: rgba(255,255,255,var(--global-opacity,1));
          font-size: 3rem;
        }
        .supplement {
          padding: 0 40px;
          text-align: center;
          color: transparent;
          position: absolute;
          transition: all .4s;
          transform: translateY(50%);
          font-size: 1.6rem;
        }
      }
      .blog-info {
        transition: all .2s;
        font-size: 1.3rem;
        padding: 0 5%;
        .info-wrap {
          transition: all .2s;
          color: rgba(255,255,255,.4);
          transform: translateY(100%);
          border-top: 3px solid rgba(255,255,255,.4);
        }
      }
      &:hover {
        .bgcolor-mask {
          background-color: rgba(119,136,153,.2);
        }
        .mask {
          filter: blur(2px) ;
          /*filter: alpha(var(--pic-opacity));*/
          background-size: 120% auto;
        }
        .title-wrap {
          color: white;
          font-size: 3.8rem;
          transform: translateY(-50%);
          > span {
            text-shadow: -1px -1px 5px rgba(255,250,205,1);
          }
        }
        .supplement {
          color: white;
          transform: translateY(80%);
          text-shadow: -1px -1px 3px rgba(255,250,205,.6);
        }
        .blog-info {
          transform: translateY(0);
          .info-wrap {
            transform: translateY(0);
            color: rgba(255,255,255,1);
            border-top: 3px solid rgba(255,255,255,1);
            text-shadow: -1px -1px 5px rgba(255,250,205,.3);
          }
        }
      }

    }
  }
}
</style>
