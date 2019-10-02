<template>
  <div class="dashboard-container">
    <div class="app-container">

      <h1>Reviewer Matcher</h1>
      <p>The service allows to match an article with the best reviewers</p>
      <div>
      <h2>Load the article</h2>
      <p>Insert your publication informations (title, abstract or keywords)</p>
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

        <!-- Ajout authors -->
        <el-form-item label="Authors">
          <el-tag
            :key="aut"
            v-for="aut in formPost.authors"
            closable
            :disable-transitions="false"
            @close="handleCloseAut(aut)">
            {{aut}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisibleAut"
            v-model="inputValueAut"
            ref="saveAutInput"
            size="mini"
            @keyup.enter.native="handleInputConfirmAut"
            @blur="handleInputConfirmAut"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInputAut">+ New Author</el-button>
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

        <el-form-item class="flex_items">
          <el-button type="info" @click="onSubmit">Search</el-button>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="progress_status" class="progress_bar"></el-progress>
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
        <el-progress :text-inside="true" :stroke-width="20" :percentage="progress_status_pdf" style="width:360px;margin-top:10px;"></el-progress>
        </el-col>
      </el-row>
      </div>
      <div id="scroll_anchor">
      <el-row v-if='isData' style='margin-top:80px; margin-bottom: 100px;'>
        <h2>Suggestion of Reviewers</h2>
        <el-table
          ref="refTable"
          row-key="id"
          :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%">

          <el-table-column type="expand">
             <template slot-scope="props">
               <article v-if="state_click[props.$index] == 1">
                 <strong>Most pertinents works :</strong>
                 <ul>
                   <li v-for="article in props.row.article">
                     {{ article.title }}
                     <ul>
                       <li>Year : {{ article.year }}</li>
                       <li>Score : {{ article.score }}</li>
                       <li>{{ article.co_auth }}</li>
                       <li v-if='article.doi' >Doi : {{ article.doi }}</li>
                       <li v-else > Doi : Unknown</li>
                     </ul>
                   </li>
                 </ul>
               </article>
               <article v-if="state_click[props.$index] == 2">
                 <strong>Contacts :</strong>
                 <ul>
                   <li v-if="props.row.contact.length == 0">Unknown</li>
                   <li v-else v-for="contact in props.row.contact">
                     <span v-for="(v,i,count) in contact">{{i}} : {{v}}
                       <span v-show="count<(Object.keys(contact).length-1)">, </span>
                     </span>
                   </li>
                 </ul>
               </article>
             </template>
          </el-table-column>

          <el-table-column
            label="Author"
            prop="author"
            width="200">
            <template slot-scope="props">
                <div v-if="props.row.verification == 2" class="circle c_green"></div>
                <div v-if="props.row.verification == 1" class="circle c_orange"></div>
                <div v-if="props.row.verification == 0" class="circle c_red"></div>
                <p class="align">{{ props.row.name}}</p>
                <p v-if="props.row.id.length > 10">({{ props.row.id }})</p>
                <p v-else>(ID SemSco : {{ props.row.id }})</p>
            </template>
          </el-table-column>

          <el-table-column
            label="Affiliation"
            prop="affiliation">
          </el-table-column>

          <el-table-column
            label="Score"
            prop="score">
            <template slot-scope="props">
              <p>Score : {{ props.row.score }}</p>
              <!-- <p>Score (year) : {{ props.row.scorePond }}</p> -->
            </template>
          </el-table-column>

          <el-table-column
            label="Conflict of interest"
            prop="conflit">
          </el-table-column>

          <el-table-column
            label="Works"
            prop="works">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="displayInfosA(scope.$index, scope.row)" style='margin:auto;display:block;text-align:center'>Watch his works</el-button>
            </template>
          </el-table-column>

          <el-table-column
            label="Contacts"
            prop="contacts">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="displayInfosB(scope.$index, scope.row)" style='margin:auto;display:block;text-align:center'>Watch his contacts</el-button>
            </template>
          </el-table-column>

          <el-table-column
            label="Actions">
            <template slot-scope="scope">
              <el-button class="button_cross"
                @click.native.prevent="deleteRow(scope.$index, tableData)">
              </el-button>
            </template>
          </el-table-column>


          <!-- <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="Type to search"/>
            </template>
            <template slot-scope="scope" >
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)" style='margin:0 auto;display:block;margin-bottom:10px;text-align:center'>Send an email</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)" style='margin:0 auto;display:block;text-align:center'>Remove from the list</el-button>
            </template>
          </el-table-column> -->


        </el-table>
      </el-row>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
    state_click: [],
    isExpanded: [],
    progress_status: 0,
    progress_status_pdf: 0,
    formPost: {abstract: '' , title: '', keywords: [], authors: []},
    rules: {
          abstract: [
            { required: true, message: 'Please input enter abstract of the article', trigger: 'blur' }
          ]
        },
    tableData: [{}],
    isData: false,
    search: '',
    inputVisible: false,
    inputVisibleAut: false,
    inputValue: '',
    inputValueAut: ''
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

    //Ajout authors
    handleCloseAut(aut) {
      this.formPost.authors.splice(this.formPost.authors.indexOf(aut), 1);
    },
    showInputAut() {
      this.inputVisibleAut = true;
      this.$nextTick(_ => {
        this.$refs.saveAutInput.$refs.input.focus();
      });
    },
    handleInputConfirmAut() {
      let inputValueAut = this.inputValueAut;
      if (inputValueAut) {
        this.formPost.authors.push(inputValueAut);
      }
      this.inputVisibleAut = false;
      this.inputValueAut = '';
    },

    uploadSectionFile(param){
      this.progress_status_pdf = 0
      window.setInterval(()=>{
        if (this.progress_status_pdf<100)
          this.progress_status_pdf = this.progress_status_pdf +1
      }, 250);
      let fileObject = param.file;
      let formData = new FormData();
      formData.append("pdf_file", fileObject);
      axios.post('https://service.publifactory.co/api/extract_infos_pdf', formData, { headers: { 'Content-Type': 'multipart/form-data',"Accept": 'application/json', } })
      .then((res)=>{
        console.log(res.data[0])
        this.formPost.abstract = res.data[0].abstract
        this.formPost.title = res.data[0].title
        this.formPost.keywords = res.data[0].keywords
        this.formPost.authors = res.data[0].authors
        this.progress_status_pdf = 100
      })
      //axios.get('http://35.241.170.253:5000/api/extract_infos_pdf?pdf_file='+fileObj.buffer).then((res)=>console.log("uploadSectionFile :: " , res))
    },

    onSubmit () {
      this.isData = false
      this.progress_status = 0
      window.setInterval(()=>{
        if (this.progress_status<100)
          this.progress_status = this.progress_status +1
      }, 250);
      this.formPost.abstract = this.formPost.abstract.replace('&',' ');
      axios.get('https://service.publifactory.co/api/request_reviewer?abstract=' + this.formPost.abstract + '&authors=' + this.formPost.authors)//+ '&keywords=' + this.formPost.keywords + '&title=' + this.formPost.title)
      .then((res)=>{
        console.log("onSubmit :: " , res)
        this.progress_status = 100
        this.tableData = res.data
        this.isData = true
        var anchor = document.querySelector("#scroll_anchor");
        //var anchor = this.$refs.refTable;
        const sleep = (milliseconds) => {
          return new Promise(resolve => setTimeout(resolve, milliseconds))
        };
        sleep(100).then(() => {
          anchor.scrollIntoView({ behavior: 'smooth', block: 'start'});
        });
      })
    },

    displayInfosA(index, row) {
      this.$refs.refTable.toggleRowExpansion(row);
      if(this.isExpanded[index] === false || this.isExpanded[index] == null){
        this.isExpanded[index] = true;
        this.state_click[index] = 1;
      }
      else if (this.isExpanded[index] === true && this.state_click[index] == 1) {
        this.isExpanded[index] = false;
        this.state_click[index] = 0;
      }
      else if (this.isExpanded[index] === true && this.state_click[index] == 2) {
        this.isExpanded[index] = true;
        this.state_click[index] = 1;
        this.$refs.refTable.toggleRowExpansion(row);
      }
    },
    displayInfosB(index, row) {
      this.$refs.refTable.toggleRowExpansion(row);
      if(this.isExpanded[index] === false || this.isExpanded[index] == null){
        this.isExpanded[index] = true;
        this.state_click[index] = 2;
      }
      else if (this.isExpanded[index] === true && this.state_click[index] == 2) {
        this.isExpanded[index] = false;
        this.state_click[index] = 0;
      }
      else if (this.isExpanded[index] === true && this.state_click[index] == 1) {
        this.isExpanded[index] = true;
        this.state_click[index] = 2;
        this.$refs.refTable.toggleRowExpansion(row);
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
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

.el-icon-arrow-right:before {
  content:"";
  display: none;
}

.el-table__expand-icon {
  display: none;
}

.align {
  display: inline-block;
}

.circle {
  display: inline-block;
  vertical-align: middle;
  border-radius: 100%;
  margin-right: 5px;
  width: 20px;
  height: 20px;
}

.c_green {
  background-color: #30B08F;
}

.c_orange {
  background-color: orange;
}

.c_red {
  background-color: #C03639;
}

.button_cross {
  display: block;
  position: relative;
  margin: 0 auto;
  width: 35px;
  height: 35px;
  padding: 0;
  border-radius: 100%;
  border: 0px;
  background-color: #C03639;
}
.button_cross:after {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  content: "\d7";
  color: white;
  text-align: center;
  font-size: 30px;
  line-height: 30px;
}
.button_cross:hover {
  color: white;
  border: none;
  background-color: #C03639;
}

.flex_items > .el-form-item__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress_bar {
  width: 100%;
  margin: 0 20px;
}

.el-progress-bar__inner {
  background-color: #909399;
}

</style>
