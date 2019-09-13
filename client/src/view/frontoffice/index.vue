<template>
  <div>
      <el-header style="text-align:right; margin-top:10px;font-size: 1rem;height:30px;">
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="20">
            <a><span>Login</span></a>
          </el-col>
        </el-row>
      </el-header>
  <el-container style="height: 100vh; border: 1px solid #eee">
      <el-header style="text-align: left; font-size: 1rem; height:40px;">
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="20">
            <div class='list-journals'>
              <div class='list-journals-el'><a><span>Home</span></a></div>
              <div class='list-journals-el'><a><span>Publiscience</span></a></div>
                <div class='list-journals-el'><a><span>BioRxiv</span></a></div>
          </div>
          </el-col>
        </el-row>
      </el-header>
        <el-main>
            <el-row type="flex" class="row-bg" justify="center">
              <el-col :span="14">
                <article class="extremePostPreview" >
                  <div class="extremePostPreview-post">
                    <h2 class="">Deep learning for specific information extraction from unstructured texts</h2>
                    <div class='post-summary'>
                      This is the first one of the series of technical posts related to our work on iki project, covering some applied cases of Machine Learning…
                    </div>

                  </div>
                  <div class="extremePostPreview-image">
                  </div>
                </article>
              </el-col>
              <el-col :span="6">

              </el-col>
            </el-row>
        </el-main>
  </el-container>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import axios from 'axios'
  import locales from '../../locales/register'

  export default {
  locales,
  name: 'FrontOffice',
  data() {
    const item = {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      };
      return {
        tableData: Array(20).fill(item)
      }
  },
  computed: {
    ...mapGetters([
      'roles',
      'userId',
      'accessToken',
      'sidebar'
    ])
  },
  created() {

  },
  async mounted () {
    await axios.get('/api/users/me',{headers: {
      'Authorization': `Bearer ${this.accessToken}`}
    }).then(response => { })
  },
  methods: {
    ...mapActions(['logout','toggleSideBar']),
    doLogout () {
      this.logout().then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>
<style>
.list-journals{
  display: flex!important;
}
.list-journals-el{
  margin: 10px 15px;
  text-transform: uppercase;
  font-family: 'DNLTPro-bold';
}
.extremePostPreview {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: stretch;
    -webkit-align-items: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    -webkit-box-flex: 1;
    -webkit-flex: 1 1 auto;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    /*max-width: 680px;*/
    width: 100%;
    margin-bottom: 48px!important;
}
.extremePostPreview-post {

}
.extremePostPreview-post h2{

  font-family: 'DNLTPro-bold';
  font-size: 24px!important;

}
.extremePostPreview-image{
  background-color: green;
}
.post-summary{
  overflow: hidden!important;
    text-overflow: ellipsis!important;
    display: -webkit-box!important;
    -webkit-line-clamp: 2!important;
    -webkit-box-orient: vertical;
}

</style>
