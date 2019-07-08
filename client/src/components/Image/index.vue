
<template>
  <div >

    <figure>
        <figcaption>Fig.1 : {{infos.name}}</figcaption>
        <div style='text-align:center'>
          <el-image
            v-if="infos.path!==''"
            style="width: 400px; height: 400px;"
            :src="'/' + infos.path"
            fit="contain">
          </el-image>
        </div>
        <div class='action-button'>
            <el-button icon="el-icon-edit" type="primary" plain @click="$emit('edit',true)" title="Edit chart" circle v-on:click=""></el-button>
            <el-button icon="el-icon-delete"  type="warning" plain @click="$emit('delete',true)" title="delete chart" circle v-on:click=""></el-button>
        </div>
      <div class="font-dnltp-medium">
        <p><b style="font-family: DNLTPro-bold;">Legends</b>: {{infos.legend}}</p>
        <p><b style="font-family: DNLTPro-bold;">Source</b>: "{{infos.name}}" from figure n°{{infos.id}}</p>
        <p><b style="font-family: DNLTPro-bold;">DOI</b>: {{infos.source}}</p>
      </div>
    </figure>

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
    idpicture: String
  },
  data () {
    return {
      infos: {name:'',legend:'',source:'',id:'',license: '',path:''}
    }
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  mounted () {
    this.fetchPicture(this.idpicture)
  },
  methods: {
    async fetchPicture (idPicture) {
      await axios.get('/api/pictures/' + this.idpicture, {headers: {
        'Authorization': `Bearer ${this.accessToken}`}
      }).then(res=>{
        this.infos = res.data.picture
      })
    }
  }
}
</script>
