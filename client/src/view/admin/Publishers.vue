<template>
  <div>
    {{listJournals}}
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      listJournals: [],
    }
  },
  async mounted() {
    await axios.get('/api/journals/activate=false').then((response)=>{
        this.listJournals = response.data
    })
  }
}
</script>
