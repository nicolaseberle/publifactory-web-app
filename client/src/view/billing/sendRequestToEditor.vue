<template>
  <div class='formEditor'>
  <el-form :model="form" ref="form" :rules="formRules" label-width="200px">
  <el-form-item label="Journal" prop="journal">
      <el-select
        v-model="form.journal"
        filterable
        remote
        placeholder="Enter your revue"
        :remote-method="remoteMethod"
        :loading="loading">
        <el-option
          v-for="item in listJournals"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Editor in Chief to contact" >  </el-form-item>
      <el-form-item label="Name" prop="nameEditorInChief">
        <el-input v-model="form.nameEditorInChief" ></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="emailEditorInChief">
        <el-input v-model="form.emailEditorInChief" ></el-input>
      </el-form-item>

    </el-form-item>
    <el-form-item>
      <el-button type="primary" width='100%' @click='submit()'>Send</el-button>
    </el-form-item>
  </el-form>
  </div>
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
  data () {
    return {
      listJournals: [],
      journal: ["Nature","Publiscience","the BMJ"],
      loading: false,
      form: {
        journal: '',
        emailEditorInChief: '',
        nameEditorInChief: ''
      },
      formRules: {
        journal: [
          {
            required: false,
            message: "You need to enter your journal",
            trigger: "blur"
          }
        ],
        nameEditorInChief: [
          {
            required: false,
            message: "You need to enter the name of the editor in chief",
            trigger: "blur"
          }
        ],
        emailEditorInChief: [
          {
            required: false,
            type: "email",
            message: "You need to enter the email of the editor in chief",
            trigger: "blur"
          }
        ],
      },
    }
  },
  mounted () {

  },
  methods:{
    closeDialog () {
      this.emit('close')
    },
    remoteMethod(query) {
			if (query !== '') {
				this.loading = true;
				setTimeout(() => {
					this.loading = false;
					this.listJournals = this.list.filter(item => {
						return item.label.toLowerCase()
							.indexOf(query.toLowerCase()) > -1;
					});
				}, 200);
			} else {
				this.listJournals = [];
			}
		},
    submit () {
      this.$refs[form].validate(async (valid) => {
				if (valid) {
						await axios.get()
							.then( res => {
							});
					}});
    }
  }


}
</script>
<style>

</style>
