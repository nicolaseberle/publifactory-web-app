<template>
  <div class="app-container">
    <el-row :gutter="10">

      <div  v-for="item in items">
        <el-col :lg="6" :md="6" :sm="12" :xs='24'>

        <el-card class="box-card grid-content" :style="{ margin: '0 0 20px 0' , height: '580px'}"  >
          <div slot="header" class="clearfix">
            <span> {{ item.title }}</span>
          </div>
          <div  v-for="subitem in item.children">
          <el-card class="box-card" shadow="never" :style="{ margin: '0 0 10px 0' }">

              <div class='header'>
                <span> {{ subitem.title }}</span>
              </div>
              <img v-bind:src="subitem.src" width="100%"  height="100%"></img>

          </el-card>

          </div>
        </el-card>

    </el-col>
  </div>
    </el-row>
</div>
</template>

<script>
import hist from '../../../components/Charts/histChart'
import basicbox from '../../../components/Charts/boxPlot'
import basicline from '../../../components/Charts/evolChart'
import waterfall from '../../../components/Charts/waterfallChart'
import scatter from '../../../components/Charts/scatterChart'

export default {
  name: 'LineChart',
  components: { hist, basicbox, scatter, waterfall, basicline },
  data() {
    return {
      items: [
        { title: 'Deviation',
          children:[
            {title: 'Chg from baseline', id: 'classname_3',type: 'dev',src: '/static/img/line-simple.png' },
            {title: 'Waterfall',id: 'classname_2',type: 'dev',src: '/static/img/waterfall-simple-3.png' }
          ]
        },
        { title: 'Correlation',
          children:[
            {title: 'Scatter Plot', id: 'classname_4',type: 'corr',src: '/static/img/scatter-simple.png' },
            {title: 'Heatmap',id: 'classname_5',type: 'corr',src: '/static/img/heatmap-simple.png' }
          ]
        },
        { title: 'Ranking',
          children:[
            {title: 'Horizontal bar',id: 'classname_7',type: 'rank',src: '/static/img/horizontal-bar-chart.png' },
            {title: 'Dot Plot', id: 'classname_6',type: 'rank',src: '/static/img/scatter-simple.png' }
          ]
         },
        { title: 'Distribution',
          children:[
            {title: 'Histogram', id: 'classname_0',type: 'hist',src: '/static/img/hist-simple.png' },
            {title: 'Box Plot',id: 'classname_1',type: 'hist',src: '/static/img/box-simple.png' }
            ]
        },
        { title: 'Evolution',
          children:[
            {title: 'Kaplan Meier', id: 'classname_8',type: 'evol',src: '/static/img/line-simple.png' },
            {title: 'Line Plot',id: 'classname_9',type: 'evol',src: '/static/img/line-simple.png' }
            ]
        },
        { title: 'Part-to-whole',
          children:[
            {title: 'Stacked bar', id: 'classname_10',type: 'ptw',src: '/static/img/hist-simple.png' },
            {title: 'Tree map',id: 'classname_11',type: 'ptw',src: '/static/img/tree-simple.png' }
            ]
        },
        { title: 'Magnitude',
          children:[
            {title: 'vertical bar', id: 'classname_10',type: 'magn',src: '/static/img/hist-simple.png' },
            {title: 'Forest plot',id: 'classname_11',type: 'magn',src: '/static/img/box-simple.png' }
            ]
          },
          { title: 'Custom',
            children:[
              {title: 'R script', id: 'classname_12',type: 'customR',src: '/static/img/R_logo.png'},
              {title: 'Python script', id: 'classname_13',type: 'customP',src: '/static/img/python-logo.png'  }
              ]
            }
        ]
      }
  },
  mounted() {

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
