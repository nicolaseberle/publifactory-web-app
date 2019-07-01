<template>
  <div>
      <el-card class="box-card" style='margin-top:1rem'>
        <div slot="header" class="clearfix" style='text-align:left'>
          <span>General</span>
        </div>
        <el-form  ref="form" :model="chartOption" :rules="rules"
          @submit.native.prevent="onSubmit">
          <el-form-item prop="title">
            <el-row style='padding-top:2rem'>
              <el-col :span="6">
                {{$t('charts.title')}}
              </el-col>
              <el-col :span="12">
                <input :placeholder="$t('charts.title')" v-bind:value="value" @input="$emit('input', $event.target.value)"></input>
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
  props: ['value'],
  data () {
    return {
      chartOption: {title: 'Figure_01'},
      rules: {
        title: [{
          required: true, message: this.$t('charts.warningName'), trigger: 'blur'
        }]
      }
    }
  },
  methods: {
  }
}
</script>
