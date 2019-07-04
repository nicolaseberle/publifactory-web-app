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
            :on-preview="handlePictureCardPreview">
            <img v-if="binary!==''" :src="binary" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

          </el-upload>

          <label>File
  <input type="file" id="file" name="pciture" ref="file" v-on:change="handleFileUpload()"/>
</label>
<button v-on:click="submitFile()">Submit</button>
        <!--<el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
          <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 2Mo</div>
        </el-upload>-->
        </div>
      </el-col>
      <el-col :span='12'>
        <div class="legend" style='text-align:left'>
          <el-form ref="postForm" label-position="top" :model="postForm">
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
      postForm: {name:'',legend:'',source:''}
    };
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  created () {

  },
  methods: {
    handleAvatarSuccess(res, file) {


    },
    handleFormUpdate () {

    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024  < 2;

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

      /*
          Add the form data we need to submit
      */
      console.log(data)
      formData.append('picture', data.file);
      formData.append('name', data.file.name);

       axios.post('/api/pictures/',formData,{headers: {
         'Authorization': `Bearer ${this.accessToken}`}
       }).then(res=>{
         this.arrayBufferToBase64(res.content)
       })
       this.postForm.name = data.file.name
       //this.imageUrl = data.file.url;
      },
      arrayBufferToBase64(buffer) {
          this.binary = 'data:image/jpeg;base64,';
          var bytes = [].slice.call(new Uint8Array(buffer));
          bytes.forEach((b) => this.binary += String.fromCharCode(b));

      },
      submitFile(){
        /*
                Initialize the form data
            */
            let formData = new FormData();

            /*
                Add the form data we need to submit
            */
            console.log(this.file)
            formData.append('picture', this.file);
            formData.append('name', this.file.name);

        /*
          Make the request to the POST /single-file URL
        */
            axios.post( '/api/pictures',
                formData,
                {
                headers: {
                  'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
              }
            ).then(function(){
          console.log('SUCCESS!!');
        })
        .catch(function(){
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
     }
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
