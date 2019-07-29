
<template>
	<div >

		<figure>
				<figcaption>Fig.1 : {{infos.name}}</figcaption>{{pictureSource}}
				<div style='text-align:center'>
					<img
						id="picture"
						:src="pictureSource"
						style="width: 400px; height: 400px;"/>
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
			infos: {name:'',legend:'',source:'',id:'',license: '',content:{}},
			pictureSource: ''
		}
	},
	computed: {
		...mapGetters(['accessToken'])
	},
	mounted () {
		this.fetchPicture(this.idpicture)
	},
	methods: {
      fetchPicture(idPicture) {
          axios.get('/api/pictures/' + idPicture, {
              headers: {
                  'Authorization': `Bearer ${this.accessToken}`
              }
          }).then(res => {
              const base64Flag = 'data:image/jpeg;base64,';
              this.infos.name = res.data.picture.name;
              this.infos.id = res.data.picture._id;
              this.infos.legend = res.data.picture.legend;
              this.infos.license = res.data.picture.license;
							this.infos.content = res.data.picture.content;
              this.pictureSource = base64Flag + this.refreshPicture(res.data.picture.content.data.data);
          })
      },
      refreshPicture(buffer) {
          let binary = '';
          const bytes = [].slice.call(new Uint8Array(buffer));
          bytes.forEach((b) => binary += String.fromCharCode(b));
          return window.btoa(binary);
      }
  }
}
</script>
