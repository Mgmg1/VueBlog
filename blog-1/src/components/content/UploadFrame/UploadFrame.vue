<template>
  <div class="upload-frame">
    <common-frame ref="frame" :width="60" v-if="isShow" @frameClose="frameClose">
      <div slot="title" class="frame-title">
        <div> 上传 </div>
      </div>
      <div slot="content" class="content">
        <div class="content-left">
          <div class="upload-detail-content">
            <div class="upload-container">
              <div class="bg-mask">
                <div class="upload-content"
                     @dragover="dragOver"
                     @drop="drop">
                  <div>
                    <div v-show="file">
                      <svg class="icon" >
                        <use xlink:href="#iconshangchuan1"></use>
                      </svg>
                      <h3>已放入文件:{{  file&&file.name }}</h3>
                    </div>
                    <div v-show="!file">
                      <svg class="icon" >
                        <use xlink:href="#iconshangchuan1-copy"></use>
                      </svg>
                      <h3>将.md后缀文件拖入</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bloginfo-input-group">
              <div class="note-type">
              <span  @click="setNoteType(1)" >
                日常:
                <svg class="icon" v-if="noteType===1">
                 <use xlink:href="#iconxuanzekuang1"></use>
                </svg>
                <svg class="icon" v-else>
                 <use xlink:href="#iconxuanzekuang"></use>
                </svg>
              </span>
                <span @click="setNoteType(2)" >
                笔记:
                <svg class="icon" v-if="noteType===2">
                  <use xlink:href="#iconxuanzekuang1"></use>
               </svg>
                <svg class="icon" v-else>
                 <use xlink:href="#iconxuanzekuang"></use>
                </svg>
              </span>
              </div>
              <h4>分类</h4>
              <input maxlength="10" v-model="categoryName" autocomplete="off"/>
              <h4>添加标签</h4>
              <div class="tag-input">
                <input maxlength="20" size="20" v-model="tag" autocomplete="off"/>
                <div class="tags-list">
                <span class="tag" v-for="(item,index) in tags">
                  {{ item }}
                  <svg class="icon" @click="removeTag(index)">
                    <use xlink:href="#iconcha1"></use>
                  </svg>
                </span>
                  <span class="tag-btn" @click="addTag">添加</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-right">
          <div class="upload-detail-content">
            <div class="bloginfo-input-group">
              <h4>标题</h4>
              <input maxlength="20" v-model="title" autocomplete="off"/>
              <h4>概要</h4>
              <input maxlength="40" v-model="summary" autocomplete="off"/>
              <h4>封面接口<small>(网络地址)</small></h4>
              <input maxlength="1000" v-model="coverUrl" autocomplete="off"/>
              <div class="btn"
                   @click="upload"
                   ref="btn"
                   @mousedown="btnMouseDown">提交</div>
            </div>
          </div>
        </div>
      </div>
    </common-frame>
  </div>
</template>

<script>

  import {getBlogInfos, getBlogTypeInfo, upload} from "../../../network/blogpage";
  import {mapGetters} from 'vuex'

  import CommonFrame from "../../common/CommonFrame/CommonFrame";
  import * as types from "../../../store/mutations-type";
  export default {
    name: "UploadFrame",
    components: {
      CommonFrame
    },
    data(){
      return {
        isShow:false,
        file:undefined,
        title:'',
        summary:'',
        coverUrl:'',
        tag:'',
        tags:[],
        noteType:1,
        categoryName:''
      }
    },
    methods:{
      showFrame(){
        this.isShow = true
      },
      dragOver(event){
        event.stopPropagation()
        event.preventDefault()
      },
      drop(event){
        event.stopPropagation()
        event.preventDefault()
        if(event.dataTransfer.files&&event.dataTransfer.files[0]){
          let file = event.dataTransfer.files[0]
          //找不到时  lastIndexOf 返回 -1
          let fileFormatIndex = file.name.lastIndexOf('.') + 1;
          if(fileFormatIndex && fileFormatIndex >= file.name.length ||
            file.name.substring(fileFormatIndex,file.name.length)!=='md'){
            alert("文件格式错误,请上传markdown格式的文件")
            return;
          }
          if(file.size > 3 * Math.pow(1024,2)){
            alert("文件过大，请上传大小小于3Mb的文件")
            return;
          }
          this.file = event.dataTransfer.files[0]
        }
      },
      frameClose(){
        this.isShow = false
        this.file = undefined
        this.tag = ''
        this.tags = []
        this.summary = []
        this.coverUrl = []
        this.categoryName = ''
      },
      btnMouseDown(){
        this.$refs.btn.style.backgroundColor = 'rgba(8, 172, 239, 1)'
        document.onmouseleave = document.onmouseup = ()=>{
          this.$refs.btn.style.backgroundColor = ''
          document.onmouseleave = document.onmouseup = null
        }
      },
      addTag(){
        if(this.tags.length >= 3){
          alert('最多添加三个哦')
          return
        }
        if(this.tags.find(item=>{
          return item === this.tag
        })) {
          alert('标签不能重复')
          return
        }
        if(this.tag.trim()){
          this.tags.push(this.tag)
          this.tag = ''
        }
      },
      removeTag(index){
        this.tags.splice(index,1)
      },
      setNoteType(type){
        this.noteType = type
      },
      //网络请求
      upload() {
        if(!this.title.trim()) {
          alert('标题不能为空')
          return
        }
        if(!this.categoryName.trim()) {
          alert('分类不能为空')
          return
        }
        if(!this.file){
          alert('请上传文件')
          return
        }
        if(!this.tags) {
          alert('至少需要一个标签')
        }

        let formData = new FormData();
        formData.append('blog',this.file)
        formData.append('title',this.title)
        formData.append('summary',this.summary)
        formData.append('coverUrl',this.coverUrl)
        formData.append('categoryName',this.categoryName)
        formData.append('userId',this.user.userId)
        formData.append('noteType',this.noteType)
        formData.append('tags',this.tags)
        let signData = {
          'title':this.title,
          'summary':this.summary,
          'coverUrl':this.coverUrl,
          'categoryName':this.categoryName,
          'userId':this.user.userId,
          'noteType':this.noteType,
          'tags':this.tags
        }
        this.$toast.setMsg('处理中...')
        this.$toast.setShow( true )
        upload(formData,signData).then(res=>{
          setTimeout( ( )=>{
            this.$toast.setShow( false )
          },2000)
          if(res.data && res.data.code === 200 ){
            this.$toast.setMsg(res.data.message)
            // window.location.reload()
            // window.location.href = '/'
            // this.$router.push(`/${this.$route.params.uid}`)
            if(res.data.data) {
              this.frameClose()
              getBlogTypeInfo(this.user.userId).then(res => {
                if (res.data.code === 200 && res.data.data) {
                  this.$store.commit(types.SET_BLOGS_COUNT_INFO, res.data.data)
                }
              })
              getBlogInfos('all',this.user.userId,'all').then(res=>{
                if(res.data.code === 200 && res.data.data) {
                  this.$store.commit(types.SET_BLOGS_INFO,res.data.data)
                }
              })
            }
          }
        }).catch(e=>{
          this.$toast.setMsg('上传失败')
          setTimeout( ( )=>{
            this.$toast.setShow( false )
          },2000)
        })
      },
    },
    computed:{
      ...mapGetters([
        'user',
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .upload-frame{
    .frame-title {
      margin: 0 20px ;
      padding-bottom: 4px;
      font-size: 1.3rem;
      border-bottom: 3px solid rgba(106, 69, 239, 0.5);
    }
    .content {
      display: flex;
      justify-content: space-around;
      .content-left,.content-right {
        width: 45%;
        .upload-detail-content {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          .upload-container {
            position: relative;
            margin: 0 20px ;
            padding-bottom: 46%;
            width: calc(100% - 40px);
            .bg-mask {
              user-select: none;
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              border-radius: 15px;
              overflow: hidden;
              background: {
                position: center;
                size: 101%;
                /*image: url("../../../assets/img/blog_page/container_bg.jpg");*/
                image: url("http://r.photo.store.qq.com/psc?/V53RZdap02olQB1qJRDI0kxlEl0h2BPA/45NBuzDIW489QBoVep5mcecQEaplkek0RkNvZADeO95RBG.8F*R3nwrvHFYjrU46DTdQyWLtmCa1lXPy4coADz0p7ZKIjBHT*pivI7ddy5A!/r");
              };
              .upload-content {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background-color: rgba(206, 212, 212, 0.5);
                display: flex;
                align-items: center;
                > div {
                  text-align: center;
                  svg {
                    width: 40%;
                    height: 40%;
                    margin-bottom: -10px;
                  }
                }
              }
            }
          }
          .bloginfo-input-group {
            margin-top: 10px;
            .note-type {
              text-align: center;
              svg {
                width: 20px;
                height: 20px;
              }
              > span {
                margin: 0 5px;
                user-select: none;
                cursor: pointer;
              }
            }
            h4 {
              margin-left: 5px;
            }
            input {
              display: block;
              margin: 10px 10px;
              padding: 0 10px;
              border: 1px solid grey;
              border-radius: 8px;
              height: 40px;
              width: calc(100% - 20px);
              font-size: 1.2rem;
              &:focus {
                box-shadow: 0 0 3px 1px #a4e3fd;
              }
            }
            .tag-input{
              padding: 10px 2px;
              width: 100%;
              .tags-list {
                padding: 0 20px;
                user-select: none;
                /*word-wrap: break-word;*/
                /*text-align: center;*/
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                .tag {
                  white-space: nowrap;
                  padding: 5px 6px;
                  background-color: bisque;
                  margin: 3px 5px;
                  border-radius: 4px;
                }
                >svg {
                  margin-left: 4px;
                  cursor: pointer;
                }
                .tag-btn {
                  border: 1px solid black;
                  padding: 5px 6px;
                  margin: 3px 5px;
                  border-radius: 6px;
                }
              }
            }
            .btn {
              background-color: rgba(8, 172, 239, 0.8);
              text-align: center;
              margin: 10px 10px 15px;
              line-height: 38px;
              font-size: 1.3rem;
              border-radius: 5px;
              cursor: pointer;
              user-select: none;
            }
          }
        }
      }
    }
  }

</style>
