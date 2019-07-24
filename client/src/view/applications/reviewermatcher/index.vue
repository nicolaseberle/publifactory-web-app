<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>Reviewer matcher</h2>
      <p>Enter Title, Abstract or keywords and launch the request</p>
      <el-row :gutter='30' style='margin-top=80px'>
      <el-col :span='12'>
      <el-form  label-width="100px" :model="formPost">
        <el-form-item label="Keywords">
          <el-input v-model="formPost.keywords"></el-input>
        </el-form-item>
        <el-form-item label="Title">
          <el-input v-model="formPost.title"></el-input>
        </el-form-item>
        <el-form-item label="Abstract">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 30}"
            placeholder="Please input"
            v-model="formPost.abstract">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Search reviewer</el-button>
          <el-button>Cancel</el-button>
        </el-form-item>
        </el-form>
        </el-col>
        <el-col :span='12'>
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
        <el-table
          :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%;margin-top:80px">
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
                @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
    formPost: {abstract: '' , title: '', keywords: ''},
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
    }
  },
  methods: {
    uploadSectionFile(param){
      let fileObject = param.file;
      let formData = new FormData();
      formData.append("pdf_file", fileObject);
      axios.post('http://35.241.170.253:5000/api/extract_infos_pdf', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res)=>{
        console.log("uploadSectionFile :: " , res.data )
        console.log("uploadSectionFile :: " , res.data.abstract)
        console.log("uploadSectionFile :: " , res.data.title)
        this.formPost.abstract = res.data.abstract
        this.formPost.title = res.data
      })
      //axios.get('http://35.241.170.253:5000/api/extract_infos_pdf?pdf_file='+fileObj.buffer).then((res)=>console.log("uploadSectionFile :: " , res))
    },
    onSubmit () {
      axios.get('http://35.241.170.253:5000/api/request_reviewer?abstract=' + this.formPost.abstract + '&keywords=' + this.formPost.keywords + '&title=' + this.formPost.title)
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
h2{
  font-family: 'DNLTPro-bold';
}
p{
  font-family: 'DNLTPro-regular';
}
</style>
