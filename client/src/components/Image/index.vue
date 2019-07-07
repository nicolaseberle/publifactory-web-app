
<template>
  <div>
    imageUrl : {{imageUrl}}
    idfigure : {{idfigure}}
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
    idfigure: String,
    imageUrl: ''
  },
  data () {
    return {
      image: ''

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
      await axios.get('/api/pictures/' + this.idfigure,{headers: {
        'Authorization': `Bearer ${this.accessToken}`}
      }).then(res=>{
        console.log(res)
        this.imageUrl = "http://localhost:9001/" + res.data.picture.path;
        // this.imageUrl = res.data.path
      })

    }
  }
}
</script>
