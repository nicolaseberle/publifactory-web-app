<template>
  <div>
    <el-row>
      <el-col :span='12'>
        <div style='text-align:center;display:inline-block'>
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="uploadSectionFile"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            >
            <img :src="imageUrl" />
            <el-image
              v-if="imageUrl!==''"
              style="width: 400px; height: 400px"
              :src="imageUrl"
              fit="contain">
            </el-image>


            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

          </el-upload>


          <!--<input type="file" id="file" name="pciture" ref="file" v-on:change="handleFileUpload()"/>->

          <button v-on:click="submitFile()">Submit</button>-->

        </div>
      </el-col>
      <el-col :span='12'>
        <div class="legend" style='text-align:left'>
          <el-form ref="postForm" label-position="top" :model="postForm">
            <el-form-item label="ID" placeholder="">
              <el-input v-model="postForm.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="Name of the picture" placeholder="Enter the name of the picture">
              <el-input v-model="postForm.name" ></el-input>
            </el-form-item>
            <el-form-item label="Legend" placeholder="Enter the legend of the picture">
              <el-input type="textarea"  :rows="3" v-model="postForm.legend" placeholder="Enter the legend of the picture"
                        v-on:change="handleFormUpdate"></el-input>
            </el-form-item>
            <el-form-item label="Source" placeholder="Enter the graph DOI">
              <el-input v-model="postForm.source" v-on:change="handleFormUpdate"></el-input>
            </el-form-item>
            <el-form-item label="License" placeholder="Choose your licence">
              <el-input v-model="postForm.license" v-on:change="handleFormUpdate"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      file: '',
      imageUrl: '',
      binary: '',
      postForm: {name:'',legend:'',source:'',id:'',license: ''},


    };
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  created () {

  },
  mounted () {
    this.postForm =  {name:'',legend:'',source:'',id:'',license: ''}
    this.imageUrl = ''
  },
  methods: {
    handleFormUpdate () {

    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024  < 5;

      if (!isJPG) {
        this.$message.error('Avatar picture must be JPG format!');
      }
      if (!isLt2M) {
        this.$message.error('Avatar picture size can not exceed 2MB!');
      }
      return isJPG && isLt2M;
    },
    uploadSectionFile (data) {
      let formData = new FormData();

      console.log(data)
      formData.append('picture', data.file);
      formData.append('name', data.file.name);

       axios.post('/api/pictures/',formData,{headers: {
         'Authorization': `Bearer ${this.accessToken}`}
       }).then(res=>{

         this.imageUrl = "http://localhost:9001/" + res.data.picture.path;
         this.postForm.name = res.data.picture.name
         this.postForm.id = res.data.picture._id
         this.postForm.legend = res.data.picture.legend
         this.postForm.license = res.data.picture.license
         console.log(this.imageUrl)
       }).catch(err=>{console.error(err)})

      },
      submitFile(){
        let formData = new FormData();

        console.log(this.file)
        formData.append('picture', this.file);
        formData.append('name', this.file.name);

        axios.post( '/api/pictures',
            formData,
            {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          }
          ).then(res=>{
            this.imageUrl = "http://localhost:9001/" + res.data.picture.path;
            this.postForm.name = res.data.picture.name
            this.postForm.legend = res.data.picture.legend
            this.postForm.id = res.data.picture._id
            this.postForm.license = res.data.picture.license
            console.log('SUCCESS!!');
        })
        .catch(err=>{
          console.error(err)
          console.log('FAILURE!!');
        });
      },

      /*
        Handles a change on the file upload
      */
      handleFileUpload(){
        this.file = this.$refs.file.files[0];

      },
      handlePictureCardPreview(file) {
       this.dialogImageUrl = file.url;
     },
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
