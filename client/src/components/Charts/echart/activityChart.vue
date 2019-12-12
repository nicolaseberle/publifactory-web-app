<template>
  <div>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import resize from '../mixins/resize'
  import axios from 'axios'
  import moment from 'moment'
  import _ from 'underscore'

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
      chart: null,
      metricsFinal: [],
      isMetrics: false,
      data: '',
      enumerateDaysBetweenDates: [],
      array_date: [],
      array_occurence: []
    }
  },
  async mounted() {
    await this.getMetrics()
    await this.getOccurenceByDate()


  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getOccurenceByDate() {
    axios.get('/api/activity/occurenceByDate??page=1&count=10').then(async(res)=>{
        let array = res.data.data
        this.array_date = []
        this.array_occurence = []

        console.log("getOccurenceByDate")
        console.log(res.data.data)
        array.forEach(element => {
            this.array_occurence.push(element.click)
            this.array_date.push(moment(element.date).format("DD/MM/YYYY"))
          })
        this.initChart()
      })
    },
    getMetrics(){
      axios.get('/api/activity?page=1&count=10')
      .then( async (res) => {
        this.metricsFinal = res.data.data;
        console.log(this.metricsFinal);
        this.isMetrics = true;
      })
    },
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
        data:['Total']
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
            data : this.array_date
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        /*{
            name:'Articles',
            type:'line',
            stack: 'Total amount',
            areaStyle: {},
            data:[220, 300, 191, 234, 290]
        },
        {
            name:'Associate Editor',
            type:'line',
            stack: 'Total amount',
            areaStyle: {},
            data:[150, 232, 201, 154, 190]
        },
        {
            name:'Reviewer',
            type:'line',
            stack: 'Total amount',
            areaStyle: {normal: {}},
            data:[320, 332, 301, 334, 390, 330, 320]
        },*/
        {
            name:'Total',
            type:'line',
            stack: 'Total amount',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {normal: {}},
            data: this.array_occurence
        }
    ]
}
      )
    }
  }
}
</script>
