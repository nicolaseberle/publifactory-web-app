<template>
  <div>
    <el-row :gutter="20" style='margin-top:3rem'>
      <el-col :span="3">
        <el-card shadow="hover">
          <img src="../../../static/img/plotly-logo.png" style="width: 90%;" alt="Chart Manager" v-on:click="addNewFigurePlotly($event)">
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card shadow="hover">
          <div slot="header" class="clearfix" style='text-align:left'>
            <span>Light Chart Editor</span>
          </div>
          <div style='text-align:left'>
            The easy way to create a simple chart. Intergate it in the text.
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style='margin-top:1rem'>
      <el-col :span="3">
        <el-card shadow="hover">
          <img src="../../../static/img/Python_logo.png" style="width: 90%;" alt="Python_script" v-on:click="addNewFigurePython($event)">
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card shadow="hover">
          <div slot="header" class="clearfix" style='text-align:left'>
            <span>Expert - Python script </span>
          </div>
          <div style='text-align:left'>
            Write your script in Python, generate your figure and integrate it in the text
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style='margin-top:1rem'>
      <el-col :span="3">
        <el-card shadow="hover">
          <img src="../../../static/img/R_logo.png" style="width: 90%;" alt="R_script" @click="addNewFigureR($event)">
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card shadow="hover">
          <div slot="header" class="clearfix" style='text-align:left'>
            <span>Expert - R script </span>
          </div>
          <div style='text-align:left'>
            Write your script in R, generate your figure and integrate it in the text
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'InsertFigure',
    data () {
      return {
        dialogVisible: false,
        diagInsertFigurePlotlyVisible: false,
        diagInsertFigurePythonVisible: false,
        diagInsertFigureRVisible: false
      }
    },
    methods: {
      addNewFigurePlotly (ev,key,subkey,subsubkey){
        this.dialogVisible = false;
        this.diagInsertFigurePlotlyVisible = true;
        this.$emit("changeStatusLightDiag", true)
        this.$emit("changeStatusMainDiag", false)
      },
      addNewFigurePython (ev,key,subkey,subsubkey){
        this.dialogVisible = false;
        this.diagInsertFigurePythonVisible = true;
        this.$emit("changeStatusPythonDiag", true)
        this.$emit("changeStatusMainDiag", false)
      },
      addNewFigureR (ev,key,subkey,subsubkey){
        this.dialogVisible = false;
        this.diagInsertFigureRVisible = true;
        this.$emit("changeStatusRDiag", true)
        this.$emit("changeStatusMainDiag", false)
      },
      // SETTER
      setDialogStatus (status) {
        this.dialogVisible = status
      },
      setDialogPythonStatus (status) {
        this.diagInsertFigurePythonVisible = status
      },
      setDialogRStatus (status) {
        this.diagInsertFigureRVisible = status
      },
      setDialogLightStatus (status) {
        this.diagInsertFigurePlotlyVisible = status
      }
    }
  }
</script>

<style scoped>

</style>
