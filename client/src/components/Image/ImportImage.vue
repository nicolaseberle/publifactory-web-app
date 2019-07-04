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
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

          </el-upload>
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
      imageUrl: '',
      postForm: {name:'',legend:'',source:''},
      myHeaders: Object
    };
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  created () {

  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
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
    uploadSectionFile (param) {
       console.log(param)
       //axios.post('/api/journal',)
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
