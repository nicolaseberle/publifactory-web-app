<template>
  <div>
  <div style='margin: 10px 5px 10px 0px; text-align:right'>
    <el-button type='primary' icon="el-icon-plus">Add Trace</el-button>
  </div>
  <el-card class="box-card" style='margin-top:1rem'>
  <div slot="header" class="clearfix" style='text-align:left'>
    <span>Trace 1</span>
    <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-delete"></i></el-button>
  </div>
    <el-form  ref="form" :model="chartOption" :rules="rules"
      @submit.native.prevent="onSubmit">
      <el-form-item prop="type">
        <el-row style='padding-top:2rem'>
          <el-col :span="8">
            {{$t('charts.type')}}
          </el-col>
          <el-col :span="16">
            <el-select v-model="chartOption.type" placeholder="Select" v-on:change="updatechartOption_">
              <el-option
                v-for="item in optionsChartType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select >
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
            <el-select v-model="chartOption.xAxis" placeholder="Select">
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
            <el-select v-model="chartOption.yAxis" placeholder="Select">
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
  props: ['values'],
  data () {
    return {
      chartOption_: '',
      chartOption: {
        type: 'bar',
        direction: 'horizontal',
        xAxis: 'row_1',
        yAxis: 'row_2'
      },
      optionsChartType: [{
       value: 'bar',
       label: 'Bar'
     }, {
       value: 'box',
       label: 'Box'
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
          value: 'col A',
          label: 'COL_A'
        },
        {
          value: 'col_B',
          label: 'COL_B'
        },
        {
          value: 'row 1',
          label: 'ROW_1'
        },
        {
          value: 'row 2',
          label: 'ROW_2'
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
  },
  methods: {
    updatechartOption_ () {
      console.log(this.chartOption.type)
      this.$emit('input', this.chartOption.type)
    }
  },
  computed: {
    chartOption_: {
      set(val){
        console.log(val)
      }
    }
  }
}
</script>
