
<template>
  <div>
    <img v-if="image" :src="image" class="avatar">
  </div>
</template>
<script>
// import PictureInput from 'vue-picture-input'

const debug = require('debug')('frontend');

export default {
  name: 'app',
  props:{
    idPicture: String
  },
  data () {
    return {
      image: ''

    }
  },
  created () {
    this.fetchPicture(this.idPicture)
  },
  methods: {
    fetchPicture (idPicture) {
      axios.get('/api/picture',{headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'multipart/form-data'}
      }).then(res=>{
        console.log(res)
        this.image = res
      })

    }
  }
}
</script>
