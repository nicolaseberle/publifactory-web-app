<template>
  <div class="app-container">
    <el-row :gutter="10">
      <div  v-for="item in items">
      <el-col :span="6">
        <el-card class="box-card" :style="{ margin: '0 0 20px 0' }">
          <div slot="header" class="clearfix">
            <span> {{ item.title }}</span>
          </div>
          <div  v-for="subitem in item.children">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
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
            {title: 'Histogram', id: 'classname_3',type: 'dev',src: '/static/img/hist-simple.png' },
            {title: 'Waterfall',id: 'classname_2',type: 'dev',src: '/static/img/box-simple.png' }
          ]
        },
        { title: 'Correlation',id: 'classname_1',type: 'basicline' },
        { title: 'Ranking',id: 'classname_5',type: 'scatter' },
        { title: 'Distribution',
        children:[
          {title: 'Histogram', id: 'classname_0',type: 'hist',src: '/static/img/hist-simple.png' },
          {title: 'Box Plot',id: 'classname_1',type: 'hist',src: '/static/img/box-simple.png' }
          ]
        },
        { title: 'Evolution',id: 'classname_3',type: 'basicline' },
        { title: 'Part-to-whole',id: 'classname_4',type: 'partofwhole' },
        { title: 'Magnitude',id: 'classname_5',type: 'magnitude_1' },
        { title: 'Magnitude',id: 'classname_7',type: 'magnitude_2' }
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
