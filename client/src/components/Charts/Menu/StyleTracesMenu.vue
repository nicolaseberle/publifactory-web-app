<template>
  <div>
  <el-card class="box-card" style='margin-top:1rem'>
  <div slot="header" class="clearfix" style='text-align:left'>
    <span>Trace 1</span>
  </div>
    <el-row style='padding-top:2rem'>
      <el-col :span="8">
        {{$t('charts.color')}}
      </el-col>
      <el-col :span="16">
        <el-color-picker
          v-model="color5"
          show-alpha
          :predefine="predefineColors">
        </el-color-picker>
      </el-col>
    </el-row>
  </el-card>
</div>
</template>
<script>
import locales from 'locales/charts'

export default {
  name: 'styleTracesMenu',
  locales,
  components: {},
  data () {
    return {
      color5: 'rgb(31, 119, 180)',
      predefineColors: [
        'rgb(31, 119, 180)',
        'rgb(255, 127, 14)',
        'rgb(44, 160, 44)',
        'rgb(214, 39, 40)',
        'rgb(148, 103, 189)',
        'rgb(140, 86, 75)',
        'rgb(227, 119, 194)',
        'rgb(127, 127, 127)',
        'rgb(188, 189, 34)',
        'rgb(23, 190, 207)'
      ]

    }
  }
}
</script>
