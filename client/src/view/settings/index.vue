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

    <el-form  ref="form" :model="form" :rules="rules">
      <h2>
        {{$t('settings.title')}}
      </h2>

      <el-row>
        <el-col :span="4">
          <pan-thumb :image="image"/>
          <el-button class="primary" plain icon="el-icon-edit "  @click="imagecropperShow=true" circle></el-button>

          <image-cropper
            v-show="imagecropperShow"
            :width="300"
            :height="300"
            :key="imagecropperKey"
            url="https://httpbin.org/post"
            lang-type="en"
            @close="close"
            @crop-upload-success="cropSuccess"/>
          </el-col>
          <el-col :span="20">

          <el-form-item prop="firstname">
            <el-row>
              <el-col :span="6">
                <h3>{{$t('settings.firstname')}}</h3>
              </el-col>
              <el-col :span="12">
                <el-input v-model="form.firstname" :placeholder="$t('settings.firstname')"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="lastname">
            <el-row>
              <el-col :span="6">
                <h3>{{$t('settings.lastname')}}</h3>
              </el-col>
              <el-col :span="12">
                <el-input v-model="form.lastname" :placeholder="$t('settings.lastname')"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="email">
            <el-row>
              <el-col :span="6">
                <h3>{{$t('settings.email')}}</h3>
              </el-col>
              <el-col :span="12">
                <el-input v-model="form.email" :placeholder="$t('settings.email')" disabled></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
          <el-row>
              <el-col :span="6">
              <h3>{{$t('settings.numORCID')}}</h3>
            </el-col>
            <el-col :span="12">
              XXXXX-XXXXXXX-XXXXXXX
            </el-col>
          </el-row>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="6">
                <h3>{{$t('settings.field')}}</h3>
              </el-col>
              <el-col :span="12">
                <el-select v-model="form.field" placeholder="Select">
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
                <h3>{{$t('settings.language')}}</h3>
              </el-col>
              <el-col :span="12">
              <el-select :value="globalConfig.lang" @input="changeLang(arguments[0])">
                <el-option v-for="lang in globalConfig.langs" :key="lang.value"
                  :label="lang.label" :value="lang.value"></el-option>
              </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
          <el-row>
            <el-col :span="12" :offset="6">
              <div style="text-align:right">
                <el-button type="primary" style='background-color: rgb(48, 65, 86);border: none;' round v-on:click="onSave()" :loading="loadingOnSave">Save</el-button>
              </div>
            </el-col>
          </el-row>
          </el-form-item>
        </el-col>
      </el-row>

          </el-form>

          <el-form  ref="formPassword" :model="formPassword" :rules="rulesPassword">
            <el-row>
              <el-col :offset="4" :span="20">
                <el-form-item prop="password">
                  <el-row>
                    <el-col :span="6">
                      <h3>{{$t('settings.oldPassword')}}</h3>
                    </el-col>
                    <el-col :span="12">
                      <el-input v-model="formPassword.oldPassword" type="password" :placeholder="$t('settings.messageOldPassword')"></el-input>
                    </el-col>
                  </el-row>

                </el-form-item>
                <el-form-item>
                <el-row>
                  <el-col :span="6">
                    <h3>{{$t('settings.newPassword')}}</h3>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="formPassword.newPassword" type="password" :placeholder="$t('settings.messageNewPassword')"></el-input>
                  </el-col>
                </el-row>
                </el-form-item>
                <el-row>
                  <el-col :span="12" :offset="6">
                    <div style="text-align:right">
                      <el-button type="warning" style='background-color: rgb(48, 65, 86);border: none;' round v-on:click="onChangePassword()" :loading="loadingOnChangePassword">Change Password</el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>


        <el-row style='margin-top:20px'>
          <el-form >
            <el-row>
              <el-col :offset="4" :span="20">
                <el-form-item prop="password">
                  <el-row>
                  <el-col :span="6">
                    <h3>{{$t('settings.deleteAccount')}}</h3>
                  </el-col>
                  <el-col :span="6" :offset="6">
                    <div style="text-align:right">
                      <el-button type="danger"  icon="el-icon-delete" round v-on:click="deleteAccount()" :loading="loadingOnDelete">Delete</el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>

<!--
      <el-row style='margin-top:20px'>
        <el-form >
          <el-row>
            <el-col  :offset="4" :span="20">
              <el-form-item prop="plan">
                <el-row>
                  <el-col :span="6">
                    <h3>{{$t('settings.currentPlan')}}</h3>
                  </el-col>
                  <el-col :span="6">
                    <p>Free Plan</p>
                  </el-col>
                  <el-col :span="6">
                    <div style="text-align:right">
                      <el-button type="primary" style='background-color: rgb(48, 65, 86);border: none;' icon="el-icon-magic-stick" round v-on:click="updatePlan()" :loading="loadingOnDelete">Upgrade</el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>-->
      </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import locales from 'locales/settings'
  import axios from 'axios'
  import ImageCropper from '../../components/ImageCropper'
  import PanThumb from '../../components/PanThumb'

  export default {
  locales,
  components: { "image-cropper": ImageCropper, "pan-thumb": PanThumb },
  data () {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      image: '',
      formPassword: {
        oldPassword: '',
        newPassword: ''
      },
      form: {
        email: '',
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
          required: false, message: this.$t('settings.lastname'), trigger: 'blur'
        }],
        field: [{
          required: false, message: this.$t('settings.field'), trigger: 'blur'
        }]
      },
      rulesPassword: {
        oldPassword: [{
          required: true, message: this.$t('settings.messagePassword'), trigger: 'blur'
        }],
        newPassword: [{
          required: true, message: this.$t('settings.messagePassword'), trigger: 'blur'
        }]
      },
      loadingOnSave: false,
      loadingOnChangePassword: false,
      loadingOnDelete: false,
      loginError: false,
      loadingOnSaveAvatar: false,
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
    ...mapGetters(['userId','loggedIn', 'globalConfig', 'accessToken'])
  },
  mounted () {
    axios.get('/api/users/me',{headers: {
      'Authorization': `Bearer ${this.accessToken}`}
    }).then(response => {
      this.form.email = response.data.email
      this.form.firstname = response.data.firstname
      this.form.lastname = response.data.lastname
      this.form.field = response.data.field
      this.image = response.data.avatar
      this.tags = response.data.tags})
  },
  methods: {
    ...mapActions(['updateUser','changePassword','changeLang']),
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
      this.changeAvatar(this.image)
    },
    close() {
      this.imagecropperShow = false
    },
    changeAvatar(image) {
      this.loadingOnSaveAvatar = true
      console.log(image)
      axios.post(`/api/users/avatars/`,{"avatar":String(image)},{headers: {
        'Authorization': `Bearer ${this.accessToken}`},
      }).then((data) => {
         console.log("settings saved")
         const h = this.$createElement;
         this.$message({
           title: this.$t('message.save.ok'),
           message: this.$t('settings.successSaving'),
           type: 'success'
         })
       }).catch(err => {
         console.log(err)
       }).finally(() => {
         this.loadingOnSaveAvatar = false
       })
    },
    onSave () {
      this.loadingOnSave = true;
      this.updateUser({
                  firstname: this.form.firstname,
                  lastname: this.form.lastname,
                  field: this.form.field,
                  token: this.accessToken
                 }).then((data) => {
                    console.log("settings saved")
                    const h = this.$createElement;
                    this.$message({
                      title: this.$t('message.save.ok'),
                      message: this.$t('settings.successSaving'),
                      type: 'success'
                    })
                  }).catch(err => {
                    console.log(err)
                  }).finally(() => {
                    this.loadingOnSave = false
                  })
    },
    onChangePassword () {
      this.$refs.formPassword.validate(valid => {
        if (valid) {
          this.loadingOnChangePassword = true;
          this.changePassword({
            oldPassword:this.formPassword.oldPassword,
            newPassword:this.formPassword.newPassword,
            token:this.accessToken
          }).then((data) => {
              this.formPassword.oldPassword = ''
              this.formPassword.newPassword = ''
               console.log("settings saved")
               const h = this.$createElement;
               this.$message({
                 title: this.$t('message.save.ok'),
                 message: this.$t('settings.successChangingPassword'),
                 type: 'success'
               })
             }).catch(err => {
               const h = this.$createElement;
               this.$message({
                 title: this.$t('message.error'),
                 message: this.$t('settings.badOldPassword'),
                 type: 'error'})
             }).finally(() => {
               this.loadingOnChangePassword = false
             })

        }
      })
    }
  }
}
</script>
<style>
.header-tag{
  padding:10px 0 20px 0;
}
h2{
  font-family:'Calibri-bold';
  font-size: 1.8rem;
}
h3{
  font-family:'Calibri-bold';
  font-size: 1.2rem;
  margin: 0;
}
.avatar{
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

</style>
