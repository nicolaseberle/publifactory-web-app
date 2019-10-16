<template>
  <div class="dashboard-container">
    <div class="app-container">

      <hgroup>
        <h1>Reviewer Matcher</h1>
        <p>The service allows to match an article with the best reviewers</p>
      </hgroup>
      <div>
      <h2>Load the article</h2>
      <p>Insert your publication informations (title, abstract or keywords)</p>
      <p>You can also upload the pdf to extract the different fields </p>

      <el-row :gutter='30' style='margin-top=80px;'>
      <el-col :span='12'>
      <el-form  label-width="100px" :model="formPost" :rules="rules" ref="formPost" style='padding-bottom:20px;'>

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
        <el-form-item label="Authors" prop="authors">
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


        <el-form-item label="Abstract" prop="abstract">
          <el-input
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 30}"
            placeholder="You have to input enter only english abstract"
            v-model="formPost.abstract">
          </el-input>
        </el-form-item>

        <el-form-item class="flex_items">
          <el-button type="info" @click="onSubmit('formPost')" :loading="load_var" class="button_tab">Search</el-button>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="progress_status" class="progress_bar"></el-progress>
          <el-button @click="resetForm('formPost')" class="button_tab">Reset</el-button>
        </el-form-item>

      </el-form>
      </el-col>

        <el-col :span='1'>
          <div style='text-align:center; vertical-align:middle; height:100px;'><p>or</p></div>
        </el-col>
        <el-col :span='11'>
          <el-upload
          class="upload-demo"
          drag
          action=""
          :http-request="uploadSectionFile">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">Drop your pdf file here or <em>click to upload</em></div>
          <div class="el-upload__text"><strong>Powered by GROBID</strong></div>
        </el-upload>
        <el-progress :text-inside="true" :stroke-width="20" :percentage="progress_status_pdf" style="width:100%;margin-top:22px;"></el-progress>
        </el-col>
      </el-row>
      </div>
      <div id="scroll_anchor">
      <el-row v-if='isData' style='padding-top:20px; margin-bottom: 100px;'>
        <h2>Suggestion of Reviewers</h2>
        <div style="margin:20px 0; display:flex; justify-content: space-between; align-items: center;">
          <el-tag type="warning">Warning : You can have multiple authors with the same affiliation</el-tag>
          <div>
            <el-button @click="exportListJson()">Export list (json)</el-button>
            <el-button @click="exportListCsv()">Export list (csv)</el-button>
          </div>
        </div>
        <el-table
          ref="refTable"
          row-key="id"
          highlight-current-row
          :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
          @cell-click="displayInfos"
          style="width: 100%">
          <el-table-column type="expand" width="1">
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
                       <li v-if='article.doi' >Doi : <a :href="article.doi" target="new">{{ article.doi }}</a></li>
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
            label="Authors"
            :render-header="info_caption"
            width="280"
            fixed>
            <template slot-scope="props">
                <div v-if="props.row.verification == 2" class="line_verif c_green"></div>
                <div v-if="props.row.verification == 1" class="line_verif c_orange"></div>
                <div v-if="props.row.verification == 0" class="line_verif c_grey"></div>
                <p class="align">{{ props.row.name}}</p>
                <p v-if="props.row.id.length > 10">
                  <img src="../../../assets/images/logo-orcid.png" alt="logo orcid" class="little_icon">{{ props.row.id }}
                </p>
                <p v-else>
                  <img src="../../../assets/images/logo-semscho.png" alt="logo semantic scholar" class="little_icon">{{ props.row.id }}
                </p>
            </template>
          </el-table-column>

          <el-table-column
            label="Affiliation"
            prop="affiliation"
            width="220">
            <template slot-scope="props">
              <p v-if="props.row.affiliation.length == 0">Unknown</p>
              <p v-else>{{ props.row.affiliation }}</p>
            </template>
          </el-table-column>

          <el-table-column
            label="Score"
            prop="score"
            width="100">
            <template slot-scope="props">
              <p>{{ props.row.score }}</p>
              <!-- <p>Score (year) : {{ props.row.scorePond }}</p> -->
            </template>
          </el-table-column>

          <el-table-column
            label="Conflict of interest"
            prop="conflit">
            <template slot-scope="props">
                <p>{{ props.row.conflit }}</p>
            </template>
          </el-table-column>

          <el-table-column
            label="Actions"
            width="200">
            <template slot-scope="scope">
              <el-popover
                ref="popdoc"
                placement="top"
                trigger="hover"
                content="Watch his works">
              </el-popover>
              <el-button
                type="primary"
                icon="el-icon-document"
                circle
                @click="displayInfosA(scope.$index, scope.row)"
                v-popover:popdoc>
              </el-button>
              <el-popover
                ref="popcon"
                placement="top"
                trigger="hover"
                content="Watch his contacts">
              </el-popover>
              <el-button v-if="scope.row.contact.length > 0"
                type="success"
                icon="el-icon-message"
                circle
                @click="displayInfosB(scope.$index, scope.row)"
                v-popover:popcon>
              </el-button>
              <el-button v-else
                type="success"
                icon="el-icon-message"
                circle
                disabled>
              </el-button>
              <el-popover
                ref="popdel"
                placement="top"
                trigger="hover"
                content="The author does not match">
              </el-popover>
              <el-button
                type="info"
                plain
                icon="el-icon-close"
                circle
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                v-popover:popdel>
              </el-button>
            </template>
          </el-table-column>
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
          {required: true, message: 'Please input enter abstract of the article', trigger: 'blur'}
        ],
        authors: [
          {required: true, message: 'Please input enter at least the author of the article', trigger: 'blur'}
        ]
      },
      tableData: [{}],
      isData: false,
      search: '',
      inputVisible: false,
      inputVisibleAut: false,
      inputValue: '',
      inputValueAut: '',
      load_var: false,
      id: ''
    }
  },
  methods: {
    info_caption(h, { column, $index }) {
      return h("span", [
        column.label,
        " ",
        h(
          "el-popover",
          {
            props: {
              title: "Caption",
              // width: "200",
              trigger: "hover"
              }
          },
          [
              h("p", [
                h("span", {style: "color:#30B08F;"}, "Green"),
                " : The author is referenced in ORCID"
              ]),
              h("p", [
                h("span", {style: "color:orange;"}, "Orange"),
                " : The author is referenced in ORCID but can have namesake problem"
              ]),
              h("p", [
                h("span", {style: "color:#A5A9AD;"}, "Grey"),
                " : The author isn't referenced in ORCID"
              ]),
              h(
                  "i",
                  {
                    slot: "reference",
                    class: "el-icon-info"
                  },
                  ""
                )
          ]
        )
      ])
    },

    exportListJson() {
      let dataStr = JSON.stringify(this.tableData);
      let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      let exportFileDefaultName = 'list_reviewer.json';

      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },

    exportListCsv() {
      if(this.tableData.length == 0) {
        return '';
      }

      let keys = Object.keys(this.tableData[0]);

      let columnDelimiter = ',';
      let lineDelimiter = '\n';

      let csvColumnHeader = keys.join(columnDelimiter);
      let csvStr = csvColumnHeader + lineDelimiter;

      this.tableData.forEach(item => {
          keys.forEach((key, index) => {
              if( (index > 0) && (index < keys.length-1) ) {
                  csvStr += columnDelimiter;
              }
              csvStr += item[key];
          });
          csvStr += lineDelimiter;
      });

      csvStr = encodeURIComponent(csvStr);
      let dataUri = 'data:text/csv;charset=utf-8,'+ csvStr;

      let exportFileDefaultName = 'list_reviewer.csv';

      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },

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
      let res = ''
      new Promise ((resolve,reject) => {
        axios.post('https://service.publifactory.co/api/extract_infos_pdf', formData, { headers: { 'Content-Type': 'multipart/form-data',"Accept": 'application/json', } })
        .then( async (id) => {
            console.log(id);
            resolve(res = await axios.get('https://service.publifactory.co/api/results_pdf/' + id.data))
            console.log(res.data[0])
            this.formPost.abstract = res.data[0].abstract
            this.formPost.title = res.data[0].title
            this.formPost.keywords = res.data[0].keywords
            this.formPost.authors = res.data[0].authors
            this.progress_status_pdf = 100
        })
      //axios.get('http://35.241.170.253:5000/api/extract_infos_pdf?pdf_file='+fileObj.buffer).then((res)=>console.log("uploadSectionFile :: " , res))
      })
    },

    async onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("onSubmit :: start");
          this.load_var = true
          this.isData = false
          this.progress_status = 0
          window.setInterval(()=>{
            if (this.progress_status<100)
              this.progress_status = this.progress_status +1
          }, 250);
          this.formPost.abstract = this.formPost.abstract.replace('&',' ');
          let res = ''
          new Promise ((resolve,reject) => {
            axios.get('https://service.publifactory.co/api/request_reviewer?abstract=' + this.formPost.abstract + '&authors=' + this.formPost.authors)//+ '&keywords=' + this.formPost.keywords + '&title=' + this.formPost.title)
            .then( async (id) => {
                console.log(id);

                resolve(res = await axios.get('https://service.publifactory.co/api/results_rev/' + id.data))
                console.log("onSubmit :: " , res)
                this.progress_status = 100
                this.tableData = res.data
                this.isData = true
                this.state_click = []
                this.isExpanded = []
                var anchor = document.querySelector("#scroll_anchor");
                //var anchor = this.$refs.refTable;
                const sleep = (milliseconds) => {
                  return new Promise(resolve => setTimeout(resolve, milliseconds))
                };
                sleep(100).then(() => {
                  anchor.scrollIntoView({ behavior: 'smooth', block: 'start'});
                })
                this.load_var = false
              }
            )
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    displayInfos(row) {
      let index = parseInt(this.tableData.indexOf(row))
      // console.log("displayInfosB :: ", this.isExpanded[index], this.state_click[index])
      this.$refs.refTable.toggleRowExpansion(row)
      if(this.isExpanded[index] === true && this.state_click[index] == 0){
        this.isExpanded[index] = false;
        this.state_click[index] = 0;
      }
      else if(this.isExpanded[index] === false || this.isExpanded[index] == null){
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
      else if (this.isExpanded[index] === true && this.state_click[index] == 3) {
        this.isExpanded[index] = true;
        this.state_click[index] = 2;
        this.$refs.refTable.toggleRowExpansion(row);
      }
    },

    displayInfosA(index, row) {
      // console.log("index: ", this.isExpanded[index], this.state_click[index]);
    },

    displayInfosB(index, row) {
      // console.log("displayInfosB :: ", this.isExpanded[index], this.state_click[index])
      this.$refs.refTable.toggleRowExpansion(row);
      if(this.isExpanded[index] === false || this.isExpanded[index] == null){
        this.isExpanded[index] = true;
        this.state_click[index] = 3;
      }
      else if (this.isExpanded[index] === true && this.state_click[index] == 2) {
        this.$refs.refTable.toggleRowExpansion(row);
        this.isExpanded[index] = true;
        this.state_click[index] = 0;
      }
      else if (this.isExpanded[index] === true && this.state_click[index] == 1) {
        this.isExpanded[index] = true;
        this.state_click[index] = 3;
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

.app-container {
  max-width: 1140px;
  padding: 0px 20px;
  margin: 0 auto;
}

h1 {
  font-family: 'DNLTPro-bold';
  text-align: center;
}

h2 {
  font-family: 'DNLTPro-bold';
}

p {
  font-family: 'DNLTPro-regular';
}

strong {
  display: block;
  margin-top: 5px;
}

hgroup {
  text-align: center;
  margin-bottom: 40px;
}
  hgroup > p {
    margin: 0;
  }

#scroll_anchor {
  border-top: 1px solid lightgray;
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

.flex_items > .el-form-item__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress_bar {
  width: 100%;
  margin: 0 20px;
}

.little_icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}


.el-table__row td:nth-child(2) {
  padding: 0;
  text-align: center;
}
  .el-table__row td:nth-child(2) > .cell {
    position: relative;
    padding: 0 20px;
  }
    .line_verif {
      position: absolute;
      top: 5%;
      left: 0;
      width: 3px;
      height: 90%;
    }
    .c_green {
      background-color: #30B08F;
    }

    .c_orange {
      background-color: orange;
    }

    .c_grey {
      background-color: #A5A9AD;
    }

.el-table__row td:nth-child(3), .el-table__row td:nth-child(4), .el-table__row td:nth-child(5), .el-table__row td:nth-child(6) {
  text-align: center;
}

.el-upload {
  width: 100%;
}
  .el-upload-dragger {
    width: 100%;
    height: 160px;
  }

.el-form-item__label {
  text-align: left;
}

.input-new-tag {
  height: 100%;
  margin: 0;
}

.el-table__expanded-cell[class*=cell] {
  padding: 20px!important;
}
  .el-table__expanded-cell[class*=cell] > article {
    padding-left: 30px;
    border-left: 1px solid lightgrey;
  }

.el-progress-bar__outer, .el-progress-bar__inner {
  border-radius: 4px;
}

.el-table .cell {
  padding: 0 20px!important;
}

@media (max-width: 1280px) {
  .app-container {
    max-width: 1020px;
  }

  .el-col-1 {
    padding: 0!important;
  }
}

@media (max-width: 1024px) {
  .button_tab {
    padding: 5px 7px;
  }
}

</style>
