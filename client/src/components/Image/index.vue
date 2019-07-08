
<template>
  <div style='text-align: center'>
    <el-image
      v-if="imageUrl!==''"
      style="width: 400px; height: 400px"
      :src="imageUrl"
      fit="contain">
    </el-image>

  </div>
</template>
<script>
// import PictureInput from 'vue-picture-input'
import { mapGetters } from 'vuex'
import axios from 'axios'

const debug = require('debug')('frontend');

export default {
  name: 'app',
  props:{
    idfigure: String
  },
  data () {
    return {
      imageUrl: ''
    }
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  mounted () {
    this.fetchPicture(this.idfigure)
  },
  methods: {
    async fetchPicture (idPicture) {
      await axios.get('/api/pictures/' + this.idfigure, {headers: {
        'Authorization': `Bearer ${this.accessToken}`}
      }).then(res=>{
        this.imageUrl = "/" + res.data.picture.path;
        this.legend = res.data.picture.legend
      })

    }
  }
}
</script>
