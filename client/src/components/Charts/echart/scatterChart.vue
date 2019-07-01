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
      default: 'scatter'
    },
    id: {
      type: String,
      default: 'scatter'
    },
    width: {
      type: String,
      default: '100px'
    },
    height: {
      type: String,
      default: '100px'
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
      var dataAll = [
        [
            [10.0, 8.04],
            [8.0, 6.95],
            [13.0, 7.58],
            [9.0, 8.81],
            [11.0, 8.33],
            [14.0, 9.96],
            [6.0, 7.24],
            [4.0, 4.26],
            [12.0, 10.84],
            [7.0, 4.82],
            [5.0, 5.68]
        ]
      ];

      var markLineOpt = {
          animation: false,
          label: {
              normal: {
                  formatter: 'y = 0.5 * x + 3',
                  textStyle: {
                      align: 'right'
                  }
              }
          },
          lineStyle: {
              normal: {
                  type: 'solid'
              }
          },
          tooltip: {
              formatter: 'y = 0.5 * x + 3'
          },
          data: [[{
              coord: [0, 3],
              symbol: 'none'
          }, {
              coord: [20, 13],
              symbol: 'none'
          }]]
      };

      var  option = {
            grid: [
                  {width : '120px'}
            ],
            tooltip: {
                formatter: 'Group {a}: ({c})'
            },
            xAxis: [
                {
                  axisLabel: {
                    show: false,
                  },
                  gridIndex: 0,
                  min: 0,
                  max: 20
                }

            ],
            yAxis: [
                {axisLabel: {
                  show: false,
                },
                gridIndex: 0,
                min: 0,
                max: 15}
            ],
            series: [
                {
                    name: 'I',
                    type: 'scatter',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: dataAll[0],
                    markLine: markLineOpt
                }
            ]
        };
        this.chart.setOption(option)


    }
  }
}
</script>
