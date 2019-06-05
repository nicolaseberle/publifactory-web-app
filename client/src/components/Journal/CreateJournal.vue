<template>
  <div>
    <el-form ref="form" :model="form" label-width="auto">
      <el-form-item label="Title">
        <el-input></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'CreateJournal',
    data () {
      return {
        dynamicForm: {
          title: '',
          logo: '',
          abstract: '',
          published: false
        }
      }
    }
  }
</script>

<style scoped>

</style>
