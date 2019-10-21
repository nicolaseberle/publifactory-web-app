<template>
  <div>
    <el-row>
      <el-col :span='12'>
        <div style='text-align:center;display:inline-block'>
          <el-upload
            class="avatar-uploader"
            action=""
            :limit="1"
            :http-request="uploadSectionFile"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            >
            <!--<img id="picture" v-if="pictureSource!==''" :src="pictureSource"/>-->

            <el-image
                v-if="pictureSource!==''"
                style="width: 400px; height: 400px"
                :src="pictureSource"
                fit="contain">
            </el-image>


            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

          </el-upload>

        </div>
      </el-col>
      <el-col :span='12'>
        <div class="legend" style='text-align:left'>
          <el-form ref="postForm" label-position="top" :model="postForm">
            <el-form-item label="ID" placeholder="">
              <el-input v-model="postForm.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="Name of the picture" placeholder="Enter the name of the picture">
              <el-input v-model="postForm.name"  v-on:change="handleFormUpdate"></el-input>
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
    import {mapGetters} from 'vuex'
    import axios from 'axios'

    export default {
  props: {

    idpicture: 0,
    numBlock: {},
    numSubBlock: {},
    numSubSubBlock: {},
  },
  data() {
    return {
      file: '',
      imageUrl: '',
      binary: '',
      postForm: {name:'',legend:'',source:'',id:'',license: '',content:{}},
			pictureSource: ''

    };
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  created () {

  },
  mounted () {
    this.imageUrl = ''
    if(this.idpicture !== 0 )
      this.fetchPicture(this.idpicture)
  },
  methods: {
    reset () {
      this.postForm = {name:'',legend:'',source:'',id:'',license: '', content: {}}
      this.imageUrl = ''
    },
    handleFormUpdate () {
      this.updatePicture()
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024  < 5;

      if (!isJPG) {
        this.$message.error('Picture must be JPG format!');
      }
      if (!isLt2M) {
        this.$message.error('Picture size can not exceed 5MB!');
      }
      return isJPG && isLt2M;
    },
    uploadSectionFile (data) {
      let formData = new FormData();
      formData.append('picture', data.file);
      formData.append('name', data.file.name);
       axios.post('/api/pictures/',formData,{headers: {
         'Authorization': `Bearer ${this.accessToken}`}
       }).then(res => {
           const base64Flag = 'data:image/jpeg;base64,';
           this.postForm.name = res.data.picture.name;
           this.postForm.id = res.data.picture._id;
           this.postForm.legend = res.data.picture.legend;
           this.postForm.license = res.data.picture.license;
           this.postForm.content = res.data.picture.content;
           this.pictureSource = base64Flag + this.refreshPicture(res.data.picture.content.data.data);
           this.$emit('update', this.numBlock, this.numSubBlock, this.numSubSubBlock, this.postForm.id)
       }).catch(err => console.error(err))
      },
      updatePicture () {
        axios.put('/api/pictures/' + this.idpicture, {name:this.postForm.name, legend:this.postForm.legend }, {headers: {
          'Authorization': `Bearer ${this.accessToken}`}
        }).then(res=>{console.log('updated')})
      },
      fetchPicture () {
        axios.get('/api/pictures/' + this.idpicture, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        }).then(res => {
            const base64Flag = 'data:image/jpeg;base64,';
            this.postForm.name = res.data.picture.name;
            this.postForm.id = res.data.picture._id;
            this.postForm.legend = res.data.picture.legend;
            this.postForm.license = res.data.picture.license;
						this.postForm.content = res.data.picture.content;
            this.pictureSource = base64Flag + this.refreshPicture(res.data.picture.content.data.data);
        })
      },
      refreshPicture (buffer) {
        let binary = '';
        const bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
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
