<template>
  <div class="dashboard-container">
    <div class="app-container">

      <h1>Reviewer Matcher</h1>
      <p>The service allows to match an article with the best reviewers</p>
      <div>
      <h2>Load the article</h2>
      <p>Enter Title, Abstract or keywords & launch the request</p>

      <p>You can also upload the pdf to extract the different fields </p>
      <el-row :gutter='30' style='margin-top=80px'>
      <el-col :span='12'>
      <el-form  label-width="100px" :model="formPost">
        <el-form-item label="Title">
          <el-input v-model="formPost.title"></el-input>
        </el-form-item>
        <el-form-item label="Keywords">
          <el-tag
            :key="tag"
            v-for="tag in formPost.keywords"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Keyword</el-button>
        </el-form-item>
        <!--
        <el-form-item label="Keywords">
          <el-input v-model="formPost.keywords"></el-input>
        </el-form-item>
        -->
        <el-form-item label="Abstract">
          <el-input
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 30}"
            placeholder="Please input"
            v-model="formPost.abstract">
          </el-input>
        </el-form-item>
        <el-form-item style='text-align:right'>
          <el-button type="primary" @click="onSubmit">Search reviewer</el-button>
          <el-button>Cancel</el-button>
        </el-form-item>
        </el-form>
        </el-col>
        <el-col :span='1'>
          <div style='text-align:center;vertical-align: middle;height:100px'><p>or</p></div>
        </el-col>
        <el-col :span='11'>
          <el-upload
          class="upload-demo"
          drag
          action=""
          :http-request="uploadSectionFile">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">Drop your pdf file here or <em>click to upload</em></div>
        </el-upload>
        </el-col>
      </el-row>
      </div>
      <el-row style='margin-top:80px; margin-bottom: 100px;'>
        <h2>Suggestion of Reviewers</h2>
        <el-table
          :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%">
          <el-table-column
            label="Name"
            prop="name">
          </el-table-column>
          <el-table-column
            label="Affiliation"
            prop="affiliation">
          </el-table-column>
          <el-table-column
            label="Email"
            prop="email">
          </el-table-column>
          <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="Type to search"/>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">Send an email</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">Remove from the list</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
    formPost: {abstract: '' , title: '', keywords: []},
    rules: {
          abstract: [
            { required: true, message: 'Please input enter abstract of the article', trigger: 'blur' }
          ]
        },
    tableData: [{
      name: 'Tom Martins',
      affiliation: 'University of Cambridge',
      email: "tom.martins@gmail.com",
      orcid : 'yes',
    }, {
      name: 'Pierre Dupont',
      affiliation: 'UPMC',
      email: "pierre.dupont@gmail.com",
      orcid : 'yes',
    }, {
      name: 'Jack Smith',
      affiliation: 'MIT',
      email: "jack.smith@gmail.com",
      orcid : 'yes',
    }, {
      name: 'Emily Jones',
      affiliation: 'University of Oxford',
      email: "e.jones@gmail.com",
      orcid : 'yes',
    }],
    search: '',
    inputVisible: false,
    inputValue: ''
    }
  },
  methods: {
    handleClose(tag) {
      this.formPost.keywords.splice(this.formPost.keywords.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.formPost.keywords.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    uploadSectionFile(param){
      let fileObject = param.file;
      let formData = new FormData();
      formData.append("pdf_file", fileObject);
      axios.post('http://35.187.84.23:5000/api/extract_infos_pdf', formData, { headers: { 'Content-Type': 'multipart/form-data',"Accept": 'application/json', } })
      .then((res)=>{
        console.log(res.data[0])
        this.formPost.abstract = res.data[0].abstract
        this.formPost.title = res.data[0].title
        this.formPost.keywords = res.data[0].keywords
      })
      //axios.get('http://35.241.170.253:5000/api/extract_infos_pdf?pdf_file='+fileObj.buffer).then((res)=>console.log("uploadSectionFile :: " , res))
    },
    onSubmit () {
      axios.get('http://35.187.84.23:5000/api/request_reviewer?abstract=' + this.formPost.abstract + '&keywords=' + this.formPost.keywords + '&title=' + this.formPost.title)
      .then((res)=>{
        console.log("onSubmit :: " , res)
        this.tableData = res.data
      })
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
}
</script>
<style>
h1{
  font-family: 'DNLTPro-bold';
}
h2{
  font-family: 'DNLTPro-bold';
}
p{
  font-family: 'DNLTPro-regular';
}
.el-tag  {
    margin-right: 10px
  }
.el-tag + .el-tag {
    margin-right: 10px
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
