<template>
  <div>
  <div style='margin: 10px 5px 10px 0px; text-align:right'>
    <el-button type='primary'>Add Trace</el-button>
  </div>
  <el-card class="box-card" style='margin-top:1rem'>
  <div slot="header" class="clearfix">
    <span>Trace 1</span>
    <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-delete"></i></el-button>
  </div>
    <el-form  ref="form" :model="chartOption" :rules="rules"
      @submit.native.prevent="onSubmit">
      <el-form-item prop="type">
        <el-row style='padding-top:2rem'>
          <el-col :span="6">
            {{$t('charts.type')}}
          </el-col>
          <el-col :span="18">
            <el-select v-model="chartOption.type" placeholder="Select">
              <el-option
                v-for="item in optionsChartType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="direction">
        <el-row>
          <el-col :span="8">
            {{$t('charts.direction')}}
          </el-col>
          <el-col :span="16">
            <el-select v-model="chartOption.direction" placeholder="Select">
              <el-option
                v-for="item in optionsChartDirection"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="xCol">
        <el-row>
          <el-col :span="8">
            {{$t('charts.xCol')}}
          </el-col>
          <el-col :span="16">
            <el-select v-model="chartOption.x_col" placeholder="Select">
              <el-option
                v-for="item in optionsChartDataCol"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="yCol">
        <el-row>
          <el-col :span="8">
            {{$t('charts.yCol')}}
          </el-col>
          <el-col :span="16">
            <el-select v-model="chartOption.y_col" placeholder="Select">
              <el-option
                v-for="item in optionsChartDataCol"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
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
  name: 'tracesMenu',
  locales,
  components: {},
  data () {
    return {
      chartOption: {
        type: 'bar',
        direction: 'horizontal',
        xCol: 'col_A',
        yCol: 'col_B'
      },
      optionsChartType: [{
       value: 'bar',
       label: 'Bar'
     }, {
       value: 'scatter',
       label: 'Scatter',
       disabled: true
     }, {
       value: 'pie',
       label: 'Pie',
       disabled: true
     }, {
       value: 'heatmap',
       label: 'Heatmap',
       disabled: true
     }],
     optionsChartDirection: [{
        value: 'horizontal',
        label: 'Horizontal'
        },
        {
        value: 'vertical',
        label: 'Vertical'
      }],
      optionsChartDataCol: [{
        value: 'col 1',
        label: 'COL_A'
        },
        {
        value: 'col_B',
        label: 'COL_B'
      }],
      rules: {
        name: [{
          required: true, message: this.$t('charts.warningName'), trigger: 'blur'
        }],
        xCol: [{
          required: true, message: this.$t('charts.warningName'), trigger: 'blur'
        }],
        yCol: [{
          required: true, message: this.$t('charts.warningName'), trigger: 'blur'
        }],
        direction: [{
          required: true, message: this.$t('charts.warningName'), trigger: 'blur'
        }]
      }
    }
  }
}
</script>
