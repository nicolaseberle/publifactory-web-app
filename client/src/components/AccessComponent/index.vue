
<template>
  <div style='font-family: Roboto'>
    <div style='text-align:left'>
    <h2 style='text-align:left;font-family: Roboto'>Global access rules</h2>
    <el-row>
    <el-col :offset='2'>
      <el-radio v-model="radio" label="1"><svg-icon icon-class='unlock' style='margin:0 10px 0 10px'/><strong>Public</strong> : visible to anyone with the link</el-radio>
      <el-col :span='16' :offset='3'>
        <div v-if="radio=='1'">
          <svg-icon icon-class='unlink' style='margin:0 10px 0 10px'/>Link : <a>http://</a>
        </div>
      </el-col>
    </el-col>
    </el-row>
    <el-row>
      <el-col :offset='2'>
        <el-radio v-model="radio" label="2"><svg-icon icon-class='lock' style='margin:0 10px 0 10px'/><strong>Private</strong> : only visible to the co-authors</el-radio>
      </el-col>
    </el-row>
    </div>
    <h2 style='margin-top:40px;text-align:left;font-family: Roboto'>Authors</h2>
    <div style='margin: 0px 0px 20px 0px'>
    <el-alert
      title="A email will be sent to invite authors to access to the article"
      type="info">
    </el-alert>
    </div>
    <el-form :model="dynamicValidateForm" :rules="rules" ref="dynamicValidateForm" label-width="120px" >
      <el-row :gutter="5">
        <el-col :span="6">
          <el-form-item label="Firstname" prop="firstname">
            <el-input v-model="dynamicValidateForm.firstname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Lastname" prop="lastname">
            <el-input v-model="dynamicValidateForm.lastname"></el-input>
          </el-form-item>
        </el-col>
      <el-col :span="8">
        <el-form-item
          prop="email"
          label="Email"
          :rules="[
            { required: true, message: 'Please input email address', trigger: 'blur' },
            { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
          ]"
        >
        <el-input v-model="dynamicValidateForm.email">
        </el-input>
        </el-form-item>
        </el-col>
        <el-col :span='4'>
          <el-button type="primary" @click="addAuthor" >Add</el-button>
        </el-col>
      </el-row>

        </el-form>

        <div style='margin-top:20px;margin-bottom:40px'>
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" align="left" :default-sort = "{prop: 'rank', order: 'ascending'}">

          <el-table-column prop='rank' align="left" label="Rank" width="65" >
          </el-table-column>

          <el-table-column align="left" min-width="140px" label="Firstname">
            <template slot-scope="scope">
              <span>{{ scope.row.author.firstname }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" min-width="140px" label="Lastname">
            <template slot-scope="scope">
              <span>{{ scope.row.author.lastname }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Role" width="140">
            <template slot-scope="scope">
            <el-select v-model="scope.row.role">
              <el-option
                v-for="item in optionsEditRole"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          </el-table-column>
          <el-table-column align="center" label="Drag" width="80">
            <template slot-scope="scope">
              <svg-icon class="drag-handler" icon-class="drag"/>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style='text-align:left'>
      <h2 style='text-align:left;font-family: Roboto'>Synchronisation</h2>

      <el-row>
        <el-col :offset='2'>
        <el-switch
          v-model="ArvivSync"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="100"
          inactive-value="0"
          active-text="Arxiv">
        </el-switch>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset='2'>
        <el-switch
          v-model="HALSync"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="100"
          inactive-value="0"
          active-text="HAL">
        </el-switch>
        </el-col>
      </el-row>
    </div>

    <div style='text-align:right'>
      <span slot="footer" class="dialog-footer">
        <el-button type=""  @click="$emit('close')" >Cancel</el-button>
        <el-button type="primary"  @click="$emit('close')" >OK</el-button>
      </span>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Sortable from 'sortablejs'
import { mapGetters } from 'vuex'

export default {
  name: 'accessComponent',
  components: {},
  props: {
    idArticle: String
  },
  data() {
    return {
      radio: '2',
      ArvivSync : '100',
      HALSync: '0',
      list: null,
      total: null,
      sortable: null,
      listLoading: false,
      oldList: [],
      newList: [],
      dynamicValidateForm: {
          email: '',
          firstname: '',
          lastname: ''
      },
      optionsEditRole: [{
        value: 'FirstAuthor',
        label: 'First Author'
      },
      {
        value: 'Author',
        label: 'Author'
      },
      {
        value: 'SeniorAuthor',
        label: 'Senior Author'
      }],
      defaultEditRole: 'Co-Author',
      optionsPermissions: [{
            value: 'edit',
            label: 'Edit'
          }, {
            value: 'view',
            label: 'View'
          }, {
            value: 'admin',
            label: 'Admin'
          }],
      defaultPermission: 'edit',
      rules: {
        email: [
          { required: true, message: 'Please input email address', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
        ],
        firstname: [
          { required: true, message: 'Please input firstname', trigger: 'blur' }
        ],
        lastname: [
          { required: true, message: 'Please input lastname', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  mounted() {
    // this.idArticle = this.$route.params && this.$route.params.id
    // this.total = 2
    this.getList(this.idArticle).then((listAuthors)=>{
      this.list = listAuthors.map((item,key)=>{
        const container = item;
        container.rank = Number(container.rank);
        return container;
      })

      // this.list = [{rank:1, firstname: "Michael",lastname: "Rera"},{rank:2,firstname: "Nicolas",lastname: 'Eberle'}]
      this.oldList = this.list.map(v => Number(v.rank))
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    })
  },
  methods: {
    getList (id) {
      return axios.get('/api/articles/' + id, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
        // console.log(response.data.authors)
        return response.data.authors
      }).catch(err => {
        console.log(err)
      })
    },
    setSort() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)

          this.newList.forEach((id_rank,key)=>{
            this.list[key].rank = Number(id_rank)
          })
        }
      })
    },
    addAuthor () {
      var nbAuthors = this.list.length+1;
      var newAuthor = {
                          rank: nbAuthors,
                          role: 'Author',
                          author:{
                            email: this.dynamicValidateForm.email,
                            firstname: this.dynamicValidateForm.firstname,
                            lastname: this.dynamicValidateForm.lastname
                          }
                        }
      // warning. it's temporarly.
      this.list.push(newAuthor)
      this.newList = this.list.map(v => Number(v.rank))

      this.$forceUpdate()
      this.cleanForm()
    },
    cleanForm () {
      this.dynamicValidateForm.email = ''
      this.dynamicValidateForm.firstname = ''
      this.dynamicValidateForm.lastname = ''
    }
  }
}
</script>
<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
