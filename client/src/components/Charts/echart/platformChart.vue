<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'
  import resize from '../mixins/resize'
  import axios from 'axios'

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
      default: '400px'
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
    title: {
        text: ''
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data:['Articles','Associate Editor','Reviewer','Users']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
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
            boundaryGap : false,
            data : ['01/01/2020','01/02/2020','01/03/2020','01/04/2020','01/05/2020','01/06/2020','01/07/2020']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'Articles',
            type:'line',
            stack: 'Total amount',
            areaStyle: {},
            data:[220, 300, 191, 234, 290, 330, 310]
        },
        {
            name:'Associate Editor',
            type:'line',
            stack: 'Total amount',
            areaStyle: {},
            data:[150, 232, 201, 154, 190, 330, 410]
        },
        {
            name:'Reviewer',
            type:'line',
            stack: 'Total amount',
            areaStyle: {normal: {}},
            data:[320, 332, 301, 334, 390, 330, 320]
        },
        {
            name:'Users',
            type:'line',
            stack: 'Total amount',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {normal: {}},
            data:[820, 932, 901, 934, 600, 1330, 1320]
        }
    ]
}
      )
    }
  }
}
</script>
