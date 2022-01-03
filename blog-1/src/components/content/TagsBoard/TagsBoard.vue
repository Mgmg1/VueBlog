<template>
  <div class="tag-board">
    <h4 class="tag-board-title"> 标签 </h4>
    <div class="content">
      <span class="tag"
            v-for="( item,index ) in blogsCountInfo.tagInfos"
            @click="tagClick(item)"
            :style="tagColorStyle(index)">
        {{ `${item.tagName} (${item.tagCount})` }}
      </span>
    </div>
    <div class="tag-board-footer">
      <svg class="icon" v-for="i in 13" >
        <use xlink:href="#icontaocanfengehuawen"></use>
      </svg>
    </div>
  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import * as types from  '@/store/mutations-type'
  import {getRainbowRgba} from "../../../common/utils";
  import {getBlogInfos} from "../../../network/blogpage";

  export default {
    name: "TagsBoard",
    data(){
      return {
        colors:[]
      }
    },
    methods:{
      tagClick(item){
        if(item){
          this.$store.commit(types.SET_CURRENT_BLOG_TYPE,{type:'tag',info:item.tagName})

          if(this.$route.fullPath.match(/\/content\//)) {
            this.$router.push(`/${this.$route.params.uid}`)
          }else {
            getBlogInfos(this.currentBlogType.type,this.pageUser.userId,item.tagName).then(res=>{
              // [] 放在 if 中 作条件 和  []==false 结果是不一样的！！！
              if (res.data.code === 200 && res.data.data ) {
                console.log(res.data)
                this.$store.commit(types.SET_BLOGS_INFO,res.data.data)
              }
            })
          }
        }
      },
      tagColorStyle(index){
        if(index < this.colors.length) {
          return {'background-color':this.colors[index]}
        }else {
          return {}
        }
      },
    },
    computed:{
      ...mapGetters([
        'blogsCountInfo',
        'pageUser',
        'currentBlogType'
      ]),
    },
    watch:{
      blogsCountInfo:{
        handler(newVal){
          if(newVal && newVal.tagInfos){
            this.colors = getRainbowRgba(newVal.tagInfos.length,100,240)
          }
        },
        deep:true
      }
    }
  }
</script>

<style lang="scss" scoped>
.tag-board {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 15px;
  padding:2px 5px;
  box-shadow: 0 0 10px 1px gainsboro inset;
  background-color: rgba(255,255,255,var(--global-opacity,1));
  .tag-board-title {
    font-size: 1.5rem;
    padding: 5px 0;
    text-align: center;
    color: #7a08fa;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    /*border-bottom: 4px solid #1df59e;*/
    border-bottom: 4px solid #708b7f;
    box-shadow: 0 0 1px 1px rgba(80,80,80,.1);
    opacity: var( --global-opacity ,1);
  }
  .content {
    flex: 1 1 auto;
    flex-basis: 280px;
    border-radius: 10px;
    border: 4px solid #554866;
    margin-top: 7px;
    padding: 7px 5px 50px;
    background : {
      /*image: url("../../../assets/img/blog_page/announcement_bg2.jpg");*/
      image: url("http://r.photo.store.qq.com/psc?/V53RZdap02olQB1qJRDI0kxlEl0h2BPA/45NBuzDIW489QBoVep5mcecQEaplkek0RkNvZADeO96U0yRlDT1A2CMpXII.UKsPUnMzJ1Xssdw0zpiHzT77.hD2gbGKBPiZ.XSRMN.5lV8!/r");
      size: cover;
    }
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    .tag {
      cursor: pointer;
      padding: 1px 1px;
      margin: 4px 3px;
      background-color: #1df59e;
      border-radius: 3px;
      user-select: none;
      opacity: var( --global-opacity ,1);

    }
  }
  .tag-board-footer {
    text-align: center;
    opacity: var( --global-opacity ,1);
  }
}
</style>
