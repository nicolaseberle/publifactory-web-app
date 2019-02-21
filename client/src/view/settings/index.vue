<template>
  <div class="app-container"  v-show="loggedIn">
    <div style='margin:20px'>
      <el-alert
      title="All the information comes from your ORCID account and google scholar profil. Why do you need it ? Read the FAQ"
      type="info"
      show-icon
      center>
      </el-alert>
    </div>
    <el-tabs type="card">
    <el-tab-pane label="Profil">
      <div style='margin:20px'>
    <el-row>
    <el-form  ref="form" :model="form" :rules="rules"
      @submit.native.prevent="onSubmit">
      <h2>{{$t('settings.title')}}</h2>
      <el-form-item prop="firstname">
        <el-row>
          <el-col :span="6">
            {{$t('settings.firstname')}}
          </el-col>
          <el-col :span="12">
            <el-input v-model="form.firstname" :placeholder="$t('settings.firstname')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="lastname">
        <el-row>
          <el-col :span="6">
            {{$t('settings.lastname')}}
          </el-col>
          <el-col :span="12">
            <el-input v-model="form.lastname" :placeholder="$t('settings.lastname')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="email">
        <el-row>
          <el-col :span="6">
            {{$t('settings.email')}}
          </el-col>
          <el-col :span="12">
            <el-input v-model="form.email" :placeholder="$t('settings.email')" disabled></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
      <el-row>
          <el-col :span="6">
          {{$t('settings.numORCID')}}
        </el-col>
        <el-col :span="12">
          13344-2239203-2023023
        </el-col>
      </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="6">
            {{$t('settings.field')}}
          </el-col>
          <el-col :span="12">
            <el-select :value="form.field" :v-model="form.field" placeholder="Select">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="6">
            {{$t('settings.language')}}
          </el-col>
          <el-col :span="12">
          <el-select :value="globalConfig.lang" @input="changeLang(arguments[0])">
            <el-option v-for="lang in globalConfig.langs" :key="lang.value"
              :label="lang.label" :value="lang.value"></el-option>
          </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="password">
        <el-row>
          <el-col :span="6">
            {{$t('settings.oldPassword')}}
          </el-col>
          <el-col :span="12">
            <el-input v-model="form.oldPassword" type="password" :placeholder="$t('settings.password')"></el-input>
          </el-col>
        </el-row>

      </el-form-item>
      <el-form-item>
      <el-row>
        <el-col :span="6">
          {{$t('settings.newPassword')}}
        </el-col>
        <el-col :span="12">
          <el-input v-model="form.newPassword" type="password" :placeholder="$t('settings.password')"></el-input>
        </el-col>
      </el-row>
      </el-form-item>
      <el-row>
        <el-col :span="12" :offset="6">
          <div style="text-align:right">
            <el-button type="primary" round v-on:click="save()">Save</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-row>
  </div>
  </el-tab-pane>
  <el-tab-pane label="Biblio">
    <div style='margin:20px'>
    <h2>Bibliography</h2>
      <el-row>
        <el-col :span='12'>
        <div class="article-tag header-tag">
          <a v-for="item in tags" href="#" title="Search more articles with this tag" ><h4>{{item}}</h4></a>
            <!--<a v-for="item in postForm.tags" href="#" title="Search more articles with this tag" ><h4>{{item}}</h4></a>-->
        </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='24'>
          <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName">
          <el-table-column
            prop="date"
            label="Date"
            width="60"
            >
            </el-table-column>
            <el-table-column
              prop="title"
              label="Title"
              >
            </el-table-column>
            <el-table-column
              prop="journal"
              label="Journal"
              >
            </el-table-column>
            <el-table-column
              prop="cited"
              label="Cited"
              width="80"
              >
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      </div>
     </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import locales from 'locales/settings'
import axios from 'axios'
export default {
  locales,
  data () {
    return {
      form: {
        email: '',
        password: '',
        firstname: '',
        lastname:  '',
        field: ''
      },
      tags: '',
      numORCID: '',
      rules: {
        email: [{
          required: true, message: this.$t('settings.email'), trigger: 'blur'
        }],
        firstname: [{
          required: false, message: this.$t('settings.firstname'), trigger: 'blur'
        }],
        lastname: [{
          required: false, message: this.$t('settings.firstname'), trigger: 'blur'
        }],
        field: [{
          required: false, message: this.$t('settings.firstname'), trigger: 'blur'
        }],
        password: [{
          required: true, message: this.$t('settings.password'), trigger: 'blur'
        }]
      },
      loading: false,
      loginError: false,
      options: [{
          value: 'Biology',
          label: 'Biology'
        }, {
          value: 'Physics',
          label: 'Physics'
        }, {
          value: 'Chemistry',
          label: 'Chemistry'
        }, {
          value: 'Medecine',
          label: 'Medecine'
        }, {
          value: 'Mathematics',
          label: 'Mathematics'
        }],
        tableData: [{
            date: '2011',
            title: 'Modulation of longevity and tissue homeostasis by the Drosophila PGC-1 homolog',
            journal: ' Cell metabolism',
            cited: '100'
          }, {
            date: '2012',
            title: 'Intestinal barrier dysfunction links metabolic and inflammatory markers of aging to death in Drosophila',
            journal: 'Proceedings of the National Academy of Sciences',
            cited: '130'
          }, {
            date: '2015',
            title: 'Parkin overexpression during aging reduces proteotoxicity, alters mitochondrial dynamics, and extends lifespan',
            journal: 'Proceedings of the National Academy of Sciences ',
            cited: '90'
          }, {
            date: '2015',
            title: 'Distinct shifts in microbiota composition during Drosophila aging impair intestinal function and drive mortality',
            journal: 'Cell reports',
            cited: '110'

          },
          {
            date: '2012',
            title: 'AMPK modulates tissue and organismal aging in a non-cell-autonomous manner',
            journal: 'Cell reports',
            cited: '180'
          }]
    }
  },
  computed: {
    ...mapGetters(['loggedIn', 'globalConfig', 'accessToken'])
  },
  mounted () {
    axios.get('/api/users/me',{headers: {
      'Authorization': `Bearer ${this.accessToken}`}
    }).then(response => {
      this.form.email = response.data.email
      this.form.firstname = response.data.firstname
      this.form.lastname = response.data.lastname
      this.form.field = response.data.field
      this.tags = response.data.tags})
  },
  methods: {
    ...mapActions(['changeLang']),
    save () {
      axios.get('/api/users/me',{headers: {
        'Authorization': `Bearer ${this.accessToken}`}
      }).then(data => {
          console.log(data)})
      /*
      this.getUserInfo(this.accessToken).then(user => {
          console.log(user.email)
        })
        */
      /* this.$refs.form.validate(valid => {
        if (valid) {
            axios.put('/api/users/',{ "email": this.form.email,"password":this.form.password})
            .then(response => {
              console.log("welcome new user")
              this.$router.push(this.$route.query.redirect || '/')
          }).catch((err) => {})
        }
      }) */
    }
  }
}
</script>
<style>
.header-tag{
  padding:10px 0 20px 0;
}
</style>
