<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-table :data="tableFiles" border highlight-current-row style="width: 100%;margin-top:20px;">
          <el-table-column
            prop="file"
            label="Files">
          </el-table-column>
        </el-table>
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
      </el-col>
      <el-col :span="16">
        <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
            <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import UploadExcelComponent from '../../../components/UploadExcel/index.vue'
import axios from 'axios'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      tableFiles:[]
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.id = id
    // get data of the articles
    console.log(id)
    this.loadData(id)
  },
  methods: {
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
      console.log(JSON.stringify(this.id))
      axios.post('http://localhost:4000/api/data/', { "id": this.id, "name": name,"header": header,"content": results })
      .then(response => {
        console.log("save successfully")
      })
      .catch(e => {
        console.log(e)
      })
    },
    loadData(id) {
      axios.get(`http://localhost:4000/api/data/${this.id}`)
      .then(response => {
        this.tableData = JSON.parse(response.data.content)
        this.tableHeader = JSON.parse(response.data.header)
        this.tableFiles.push( {file: JSON.parse(response.data.name)})
        console.log("save successfully")
      })
      .catch(e => {
        console.log(e)
      })
    }
  }
}
</script>
