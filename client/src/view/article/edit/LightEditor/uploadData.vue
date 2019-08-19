<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
    <el-row :gutter="10">
      <el-col :span="10">
        <el-upload
          class="upload-demo"
          action="/api/figure"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="10"
          multiple
          :on-exceed="handleExceed"
          :file-list="tableFiles">
          <div slot="tip" class="el-upload__tip">xls/xlsx/csv files with a size less than 5000 Kb</div>
        </el-upload>
      </el-col>
      <el-col>
        <el-form ref="urlForm" :model="urlForm"  :rules="urlRules">
          <el-form-item prop="link">
            <el-input v-model="urlForm.link"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadUrl()" round>Load</el-button>
          </el-form-item>
        </el-form>
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
  import axios from 'axios'
  import { mapGetters } from 'vuex'

  export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
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
      tableData: [],
      tableHeader: [],
      tableFiles:[{}],
      name : '',
      size: '',
      keyCurrentTableData: 0
    }
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.id = id
    this.loadData(id)
  },
  mounted() {
    this.socket.on('ADD_DATA', () => this.loadData(this.id));
    this.socket.on('DELETE_DATA', () => this.loadData(this.id));
  },
  methods: {
    handleDelete(index, row) {
        console.log(index, row);
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      console.log(file.name)
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
      this.size = size
      this.tableFiles.push({name: JSON.stringify(this.name), file: JSON.stringify(this.name),size: JSON.stringify(size)})
      console.log(this.tableFiles)
      this.save(this.name, header, results, size)
      this.socket.emit('NEW_DATA', {
        name: this.name,
        results: results,
        header: header,
        size: size
      })
    },
    save(name, header, results,size) {
      // console.log(JSON.stringify(this.id))
      axios.post('/api/data/', { "id": this.id, "name": name,"header": header,"content": results, "size": size },
              {
                headers: {'Authorization': `Bearer ${this.accessToken}`}
              })
      .then(response => {
        console.log("save successfully")
      })
      .catch(e => {
        console.log(e)
      })
    },
    loadData(id) {
      axios.get(`/api/data/${this.id}`, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
        if(response.data.length !== 0)
        {
          this.keyCurrentTableData = 0;
          // on n'affiche que le premier fichier
          this.tableData = JSON.parse(response.data[0].content)
          this.tableHeader = JSON.parse(response.data[0].header)
          // en revanche on charge tous les noms et tailles de fichiers de données
          for (let i = 0, len = response.data.length; i < len;++i)
            this.tableFiles.push({
              name: JSON.stringify(response.data[i].name),
              file: JSON.stringify(response.data[i].name),
              size: JSON.stringify(response.data[i].size)
            })
        }
      }).catch(e => {
        console.log(e)
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.socket.emit('REMOVE_DATA', {
        file: file,
        fileList: fileList
      })
    },
    handlePreview(file) {
      console.log(file);
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
    }
  }
}
</script>
<style>
.upload-demo {
  text-align: left;
}
</style>
