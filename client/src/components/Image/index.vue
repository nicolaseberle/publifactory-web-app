
<template>
  <div class="hello">

  </div>
</template>
<script>
// import PictureInput from 'vue-picture-input'

const debug = require('debug')('frontend');

export default {
  name: 'app',
  data () {
    return {
    }
  },
  components: {
    // PictureInput
  },
  methods: {
    onChange (image) {
      debug('New picture selected!')
      if (image) {
        debug('Picture loaded.',image)
        this.image = image
      } else {
        debug('FileReader API not supported: use the <form>, Luke!')
      }
    }
  }
}
</script>
