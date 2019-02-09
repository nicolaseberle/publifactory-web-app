<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
    <el-row :gutter="10">
      <el-col :span="10">
        <div class='uploadData'>
          <el-table :data="tableFiles" border highlight-current-row style="width: 100%;margin-top:20px;">
            <el-table-column
              prop="file"
              label="Files">
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
        </div>
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

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      tableFiles:[],
      keyCurrentTableData: 0
    }
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
    handleSuccess({name, results, header }) {
      this.tableData = results
      this.tableHeader = header
      this.name = name
      this.tableFiles.push({file: JSON.stringify(name)})
      this.save(name, header, results)
    },
    save(name, header, results) {
      // console.log(JSON.stringify(this.id))
      axios.post('/api/data/', { "id": this.id, "name": name,"header": header,"content": results })
      .then(response => {
        console.log("save successfully")
      })
      .catch(e => {
        console.log(e)
      })
    },
    loadData(id) {
      axios.get(`/api/data/${this.id}`)
      .then(response => {
        if(response.data.length!=0)
        {
          this.keyCurrentTableData = 0
          this.tableData = JSON.parse(response.data[0].content)
          this.tableHeader = JSON.parse(response.data[0].header)
          let vm = this
          response.data.forEach(function(el){
            vm.tableFiles.push( {file: JSON.parse(el.name)})
          })
        }
      })
      .catch(e => {
        console.log(e)
      })
    }
  }
}
</script>
<style>
.uploadData .el-table .cell {
    cursor: pointer;
    text-align: center;
}
</style>
