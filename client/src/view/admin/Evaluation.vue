<template>
  <div class="app-container">

    <h2>Evaluation</h2>
   <el-table
     :data="evaluationResults"
     style="width: 100%">
     <el-table-column
       prop="_id"
       label="Fields">
     </el-table-column>
     <el-table-column
       prop="positive"
       label="Positif"
       width="100">
     </el-table-column>
     <el-table-column
       prop="negative"
       label="Negatif"
      width="100">
     </el-table-column>
     <el-table-column
       prop="unknown"
       label="Don't know"
      width="100">
     </el-table-column>
     <el-table-column
       label="total"
       width="100">
       <template slot-scope="scope">
           <span>{{ scope.row.positive + scope.row.negative + scope.row.unknown }}</span>
       </template>
     </el-table-column>
   </el-table>

  </div>
</template>
<script>
  import locales from 'locales/article'
  import axios from 'axios'

  import { mapGetters } from 'vuex'
  export default {
  locales,
  data () {
    return {
      evaluationResults : ''
    }
  },
  components: {

  },
  computed: {
    ...mapGetters([
      'userId',
      'accessToken',
      'loggedIn'
    ])
  },
  methods: {
  },
  async mounted () {
    await axios.get('/api/services/getEvaluation').then((res)=>{
      this.evaluationResults = res.data
    })
  }
}
</script>
<style>
</style>
