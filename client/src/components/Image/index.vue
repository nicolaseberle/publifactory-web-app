
<template>
  <div class="hello">
    <!--<picture-input
      ref="pictureInput"
      @change="onChange"

      removable="true"
      crop="false"
      margin="16"
      accept="image/jpeg,image/png"
      size="10"
      buttonClass="btn"
      :customStrings="{
        upload: '<h2>Bummer!</h2>',
        drag: '<div style=\'font-size:1rem\'>Drag a picture jpeg/png</div>'
      }">
    </picture-input>-->
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
