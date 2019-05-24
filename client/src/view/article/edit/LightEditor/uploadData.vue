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
          <div slot="tip" class="el-upload__tip">xls/xlsx/csv files with a size less than 5000kb</div>
        </el-upload>
<!--
        <div class='uploadData'>
          <el-table :data="tableFiles" border highlight-current-row style="width: 100%;margin-top:20px;">
            <el-table-column
              prop="file"
              label="Files">
            </el-table-column>
            <el-table-column
              prop="size"
              label="Size (Bytes)">
            </el-table-column>
            <el-table-column
              label="Operations">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="handleDelete(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>-->
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
  data() {
    return {
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
  created() {
    const id = this.$route.params && this.$route.params.id
    this.id = id
    this.loadData(id)
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
      this.name = name
      this.size = size
      this.tableFiles.push({name: JSON.stringify(name), file: JSON.stringify(name),size: JSON.stringify(size)})
      this.save(name, header, results, size)
    },
    save(name, header, results,size) {
      // console.log(JSON.stringify(this.id))
      axios.post('/api/data/', { "id": this.id, "name": name,"header": header,"content": results, "size": size })
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
      })
      .then(response => {
        if(response.data.length!=0)
        {
          this.keyCurrentTableData = 0
          // on n'affiche que le premier fichier
          this.tableData = JSON.parse(response.data[0].content)
          this.tableHeader = JSON.parse(response.data[0].header)
          let vm = this
          // en revanche on charge tous les noms et tailles de fichiers de données
          response.data.forEach(function(el){
            vm.tableFiles.push( {name: JSON.parse(el.name), file: JSON.parse(el.name), size:  JSON.parse(el.size)})
          })
        }
      })
      .catch(e => {
        console.log(e)
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Delete ${ file.name }？`);
    }
  }
}
</script>
<style>
.upload-demo {
  text-align: left;
}
</style>
