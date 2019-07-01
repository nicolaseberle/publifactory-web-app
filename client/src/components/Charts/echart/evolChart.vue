<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'
  import resize from './mixins/resize'

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
      chart: null
    }
  },
  mounted() {
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
      this.chart.setOption(
          {
              xAxis: {
                  type: 'category',
              },
              yAxis: {
                  type: 'value',
                  show : false
              },
              series: [{
                  data: [0, 1, 3, 2, 5],
                  type: 'line'
              },
              {
                  data: [0, 0.5, 2, 3, 4],
                  type: 'line'
              },
              {
                  data: [0, -0.3, -1, -0.8, -2],
                  type: 'line'
              }]
          }
      )
    }
  }
}
</script>
