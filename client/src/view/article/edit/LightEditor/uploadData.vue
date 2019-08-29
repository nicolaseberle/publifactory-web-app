<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="10">
        <el-tabs stretch type="border-card" style='vertical-align:middle'>
          <el-tab-pane label="Upload">
            <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
          </el-tab-pane>
          <el-tab-pane label="URL">
            <el-form ref="urlForm" :model="urlForm"  :rules="urlRules">
              <el-form-item prop="Link">
                <el-input v-model="urlForm.link"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="loadUrl()" round>Load</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="SQL">
            <component v-bind:is="SqlEditor"
                       v-on:queryresult="importQuery"
                       v-on:connectdatabase="onSqlChange"
                       v-on:disconnect="disconnectDatabase"
                       :sqlForm="sqlForm"
                       :sqlRules="sqlRules" />
          </el-tab-pane>
        </el-tabs>
        <el-upload
                class="upload-demo"
                action="/api/figure"
                :headers="headerUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :limit="10"
                multiple
                :on-exceed="handleExceed"
                :file-list="tableFiles">
          <div slot="tip" class="el-upload__tip">xls/xls/csv files with a size less than 5000 Kb</div>
        </el-upload>
      </el-col>
      <el-col :span="14">
        <el-table :data="tableData" max-height="400" border highlight-current-row style="width: 100%;margin-top:20px;">
            <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import UploadExcelComponent from '../../../../components/UploadExcel/index.vue'
  import SqlConnection from '../../../../components/SQL/Connection.vue'
  import SqlQuery from '../../../../components/SQL/Query.vue'
  import axios from 'axios'
  import { mapGetters } from 'vuex'

  export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent, SqlConnection, SqlQuery },
  props: ['socket'],
  data() {
    return {
      urlForm: {
        link: ''
      },
      urlRules: {
        link: [{
          required: true
        }]
      },
      sqlForm: {
        host: '',
        port: '',
        user: '',
        password: '',
        database: '',
        type: "1"
      },
      sqlRules: {
        host: [{required: true, message: "Enter URL of the database"}],
        port: [{required: true}],
        user: [{}],
        password: [{message: "Not required."}],
        database: [{message: "Database to select"}],
        type: [{message: "Type of the database"}]
      },
      headerUpload: {
        Authorization: `Bearer ${this.accessToken}`
      },
      SqlEditor: 'SqlConnection',
      tableData: [],
      tableHeader: [],
      tableFiles:[],
      name : '',
      size: '',
      keyCurrentTableData: 0
    }
  },
    computed: {
      ...mapGetters(['accessToken'])
    },
  async created() {
    const id = this.$route.params && this.$route.params.id
    this.id = id
    await this.loadData(id)
  },
  mounted() {
    this.socket.on('ADD_DATA', () => this.loadData(this.id));
    this.socket.on('DELETE_DATA', () => this.loadData(this.id));
  },
  methods: {
    handleDelete(index, row) {
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({name, results, header, size }) {
      this.tableData = results
      this.tableHeader = header
      this.name = prompt('Which name would you like for this data file?');
      const regexp = /^.*?\.csv$/;
      if (!regexp.test(this.name))
        this.name = this.name + '.csv';
      this.size = size
      this.tableFiles.push({name: JSON.stringify(this.name), file: JSON.stringify(this.name),size: JSON.stringify(size)})
      this.save(this.name, header, results, size)
      this.socket.emit('NEW_DATA', {
        name: this.name,
        results: results,
        header: header,
        size: size
      });
    },
    save(name, header, results,size) {
      // console.log(JSON.stringify(this.id))
      axios.post('/api/data/', { "id": this.id, "name": name,"header": header,"content": results, "size": size },
              {
                headers: {'Authorization': `Bearer ${this.accessToken}`}
              })
      .then(response => {
        this.$message.success("Your data has been saved!")
      })
      .catch(e => {
        this.$message.error("An error occurred during the save of your data.")
      })
    },
    async loadData(id) {
      try {
        const response = await axios.get(`/api/data/${this.id}`, {
          headers: {'Authorization': `Bearer ${this.accessToken}`}
        });
        if (response.data.length !== 0) {
          console.log(response.data);
          this.keyCurrentTableData = 0;
          // on n'affiche que le premier fichier
          this.tableData = response.data[0].content;
          this.tableHeader = response.data[0].header;
          // en revanche on charge tous les noms et tailles de fichiers de données
          for (let i = 0, len = response.data.length; i < len; ++i)
            this.tableFiles.push({
              position: i,
              name: response.data[i].name,
              file: response.data[i].name,
              size: response.data[i].size,
              content: response.data[i].content,
              header: response.data[i].header
            })
        }
      } catch (e) {
        console.error(e);
      }
    },
    handleRemove(file, fileList) {
      this.socket.emit('REMOVE_DATA', {
        file: file,
        fileList: fileList
      })
    },
    handlePreview(file) {
      this.$nextTick(() => {
        this.keyCurrentTableData = file.position;
        this.tableHeader = file.header;
        this.tableData = file.content;
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Delete ${ file.name }？`);
    },
    async loadUrl() {
      const response = await axios.get(this.urlForm.link);
      const data = response.data;
      let separator = ',';
      if (/;/.test(data))
        separator = ';';
      const columns = data.split('\n');
      const object = {
        name: null,
        header: columns[0].split(separator),
        results: [],
        size: 0
      };
      for (let i = 1, len = columns.length; i < len; ++i) {
        const tmp = columns[i].split(separator);
        const objectTmp = {};
        for (let j = 0, len2 = tmp.length; j < len2; ++j)
          objectTmp[object.header[j]] = tmp[j];
        object.results.push(objectTmp);
      }
      this.handleSuccess({name: null, results: object.results, header: object.header, size: object.size})
    },
    onSqlChange (instance) {
      if (instance === true) {
        this.SqlEditor = 'SqlQuery';
        this.$message.success("You're connected to the database!")
      } else {
        this.sqlForm.type = "1";
        this.SqlEditor = 'SqlConnection';
        this.$message.error("Connection to database failed.")
      }
    },
    disconnectDatabase () {
      this.sqlForm.type = "1";
      this.SqlEditor = 'SqlConnection';
    },
    importQuery (instance) {
      const object = {
        name: null,
        header: Object.keys(instance[0]),
        results: [],
        size: 0
      };
      for (let i = 0, len = instance.length; i < len; ++i)
        object.results.push(instance[i]);
      this.handleSuccess({name: null, results: object.results, header: object.header, size: object.size})
    }
  }
}
</script>
<style>
.upload-demo {
  text-align: left;
}
</style>
