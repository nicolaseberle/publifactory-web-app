<template>
  <div>
  
      <el-card style='margin-top:2rem'>
        <el-form  ref="form" :model="chartOption" :rules="rules"
          @submit.native.prevent="onSubmit">
          <el-form-item prop="name">
            <el-row style='padding-top:2rem'>
              <el-col :span="6">
                {{$t('charts.name')}}
              </el-col>
              <el-col :span="12">
                <el-input v-model="chartOption.name" :placeholder="$t('charts.name')"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-card>
  </div>
</template>
<script>
import locales from 'locales/charts'

export default {
  name: 'generalMenu',
  locales,
  components: {},
  data () {
    return {
      chartOption: {name: 'Figure_01'},
      rules: {
        name: [{
          required: true, message: this.$t('charts.warningName'), trigger: 'blur'
        }]
      }
    }
  }
}
</script>
