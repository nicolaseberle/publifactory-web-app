<template>
  
</template>
<script>
import locales from 'locales/article'
import { mapGetters } from 'vuex'
import axios from 'axios'

export default{
  locales,
  name: 'sendRequestToEditor',
  computed: {
    ...mapGetters([
      'userId',
      'accessToken'
    ])
  },
  mounted () {

  },
  methods:{
    closeDialog () {
      this.emit('close')
    }
  }


}
</script>
<style>

</style>
