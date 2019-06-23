<template>
  <div class="app-container">
    <el-row :gutter="10">
       <el-col :lg="8" :md="6" :sm="6" :xs='24'>
         <el-card class="box-card" shadow="never" :style="{ margin: '0 0 10px 0' }">
           <header>
              <span>Parameters</span>
           </header>
         <el-row :gutter="10">
         <span>X axis</span>
         <el-select v-model="valueX" placeholder="Select" @change="initChart">
          <el-option
            v-for="item in inputX"
            :key="item.value"
            :label="item.label"
            :value="item.data">
          </el-option>
        </el-select>
        <el-checkbox v-model="checkedDisplayXLabel">Display X labels</el-checkbox>
      </el-row>
      <el-row :gutter="10">
        <span>Y axis</span>
        <el-select v-model="valueY" placeholder="Select" @change="initChart">
         <el-option
           v-for="item in inputY"
           :key="item.value"
           :label="item.label"
           :value="item.data">
         </el-option>
       </el-select>
       <el-checkbox v-model="checkedDisplayXLabel">Display X labels</el-checkbox>
     </el-row>
   </el-card>
  </el-col>
        <el-col :lg="16" :md="18" :sm="18" :xs='24'>
          <el-card class="box-card" shadow="never" :style="{ margin: '0 0 10px 0' }">
            <div class="chart-container">
              <div :class="className" :id="id" :style="{height:height,width:width}"/>
            </div>
        </el-card>
        </el-col>
    </el-row>
</div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
var debug = require('debug')('frontend');

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      chart: null,
      checkedDisplayXLabel: true,
      inputX: [{
          value: 'Option1',
          label: 'Option1',
          data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        }, {
          value: 'Option2',
          label: 'Option2',
          data : ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon'],
        }, {
          value: 'Option3',
          label: 'Option3',
          data : ['Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue'],
        }],
        inputY: [{
            value: 'header_A',
            label: 'header_A',
            data : [10, 52, 200, 334, 390, 330, 220],
          }, {
            value: 'header_B',
            label: 'header_B',
            data : [52, 200, 334, 390, 330,10],
          }, {
            value: 'header_C',
            label: 'header_C',
            data : [200, 334, 390, 330,10,52],
          }],
        valueX: '',
        valueY: ''
    }
  },
  mounted() {
    this.valueX = this.inputX[0].data
    this.valueY = this.inputY[0].data
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.on('click', () => { debug('initChart::click');});
      this.chart.setOption({
            color: ['#1E4363'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : this.valueX,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    type:'bar',
                    barWidth: '80%',
                    data: this.valueY
                }
            ]




          }
      )
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
