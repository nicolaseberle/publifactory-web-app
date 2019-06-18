<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
const debug = require('debug')('frontend');

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
      this.chart.on('click', () => { debug('initChart::click');});
      var option = {
      tooltip : {
      trigger: 'axis',
      axisPointer : {
          type : 'shadow'
      },
      formatter: function (params) {
          var tar;
          if (params[1].value != '-') {
              tar = params[1];
          }
          else {
              tar = params[0];
          }
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
      }
      },
      grid: {
      width: '120px',
      containLabel: true
      },
      xAxis : [
      {
        show: false
      }
      ],
      yAxis : [
      {
          type : 'value',
          show: false,
          max: 200
      }
      ],
      series : [
      {
          name:'Aid',
          type:'bar',
          stack: 'Total',
          itemStyle:{
              normal:{
                  barBorderColor:'rgba(0,0,0,0)',
                  color:'rgba(0,0,0,0)'
              },
              emphasis:{
                  barBorderColor:'rgba(0,0,0,0)',
                  color:'rgba(0,0,0,0)'
              }
          },
          data:[0, 0, 0, 0, 0]
      },
      {

          type:'bar',
          stack: 'Total',
          data:['-', '-', 15, 100, 200],
          color: 'rgba(0,255,0,1)'
      },
      {

          type:'bar',
          stack: 'Total',
          data:[-200, -100, '-', '-', '-'],
          color: 'rgba(255,0,0,1)'
      }
      ]
      };

      // Use just the specified configurations and data charts.
      this.chart.setOption(option);
    }
  }
}
</script>
