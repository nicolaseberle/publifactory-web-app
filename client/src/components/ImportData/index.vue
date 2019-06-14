<template>
  <div>
    <h2 style="text-align:left;">Import</h2>

    <el-tabs stretch type="border-card" style='vertical-align:middle'>
      <el-tab-pane label="Upload"><uploadData/></el-tab-pane>
      <el-tab-pane label="by URL">(not yet)</el-tab-pane>
      <!--<el-tab-pane>
        <span slot="label">by Drive<img src='/static/icons/drive.svg' style='width:20px'></img></span>
        (not yet)
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">by Dropbox<img src='/static/icons/dropbox.svg' style='width:20px'></img></span>
        (not yet)
      </el-tab-pane>-->
      <el-tab-pane label="SQL">(not yet)</el-tab-pane>
      <el-tab-pane label="Example">
        <el-row>
          <el-col :span="2">
            <el-checkbox v-model="checkedExData1">Exemple 1</el-checkbox>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <el-checkbox v-model="checkedExData2">Exemple 2</el-checkbox>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <el-checkbox v-model="checkedExData3">Exemple 3</el-checkbox>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import uploadData from '../../view/article/edit/LightEditor/uploadData'

export default {
  name: 'ImportData',
  components: {
    uploadData
  }
}
</script>

<style scoped>

</style>
