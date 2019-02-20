
<template>
  <div>
    <el-form :model="dynamicValidateForm" :rules="rules" ref="dynamicValidateForm" label-width="120px" class="demo-dynamic">
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
          <el-button type="primary" @click="$emit('close')" >Add</el-button>
        </el-col>
      </el-row>

        </el-form>
        <div style='margin-top:60px;margin-bottom:40px'>
        <el-table v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%" align="left">

          <el-table-column align="left" label="ID" width="65">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>

          <el-table-column align="left" min-width="140px" label="Firstname">
            <template slot-scope="scope">
              <span>{{ scope.row.firstname }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" min-width="140px" label="Lastname">
            <template slot-scope="scope">
              <span>{{ scope.row.lastname }}</span>
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


export default {
  name: 'addCollaborator',
  components: {},
  data() {
    return {
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
        value: 'MainAuthor',
        label: 'Main Author'
      },
      {
        value: 'coAuthor',
        label: 'Co-Author'
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
      idArticle : '',
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
  created() {
    this.idArticle = this.$route.params && this.$route.params.id
    this.total = 2
    this.getList(this.idArticle).then((listAuthors)=>{
      this.list = listAuthors.map((item,key)=>{
        const container = item;
        container.id = key+1;
        return container;
      })

      // this.list = [{id:1, firstname: "Michael",lastname: "Rera"},{id:2,firstname: "Nicolas",lastname: 'Eberle'}]
      this.oldList = this.list.map(v => v.id)
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    })


  },
  methods: {
    getList (id) {
      return axios.get('/api/articles/' + id ).then(response => {
        console.log(response.data.authors)
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
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)

        }
      })
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
