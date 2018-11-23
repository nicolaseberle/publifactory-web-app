<template>
  <div class="app-container">
    <el-row :gutter="10">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
      <el-col :span="8">
        <el-table :data="tableFiles" border highlight-current-row style="width: 100%;margin-top:20px;">
          <el-table-column
            prop="file"
            label="Files">
          </el-table-column>
        </el-table>
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

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      tableFiles:[
        {file: 'Fichier_1'},
        {file: 'Fichier_2'},
        {file: 'Fichier_3'}]
    }
  },
  methods: {
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
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    }
  }
}
</script>
