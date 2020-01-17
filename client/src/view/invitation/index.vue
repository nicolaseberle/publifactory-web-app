<template>
  <div class='app-container'>
    <el-row v-if="isData" style='padding: 20px; margin-bottom: 20px; font-family:DNLTPro-regular;'>
      <h2 style="font-family:DNLTPro-regular;">My request</h2>
      <el-table
      ref="dataReq"
      highlight-current-row
      :data="mylistrequest"
      style="width: 100%"
      height="500"
      @row-click="setSelectedRow">
      <el-table-column class-name="date-col" width="180px" label="Date">
        <template slot-scope="props">
          <span>{{ props.row.history[0].date | moment("DD/MM/YYYY, h:mm a") }}</span>
        </template>
      </el-table-column>
        <el-table-column
          label="Title"
          prop="title"
          >
          <template slot-scope="props">
            <p style="text-align:center;">{{ props.row.title }}</p>
          </template>
        </el-table-column>

        <el-table-column
          label="Publisher"
          prop="edi_name"
          width="120">
          <template slot-scope="props">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">{{props.row.editor.email}}<br>{{ props.row.editor.name }}</div>
              <p style="text-align:center">{{ props.row.editor.journal }}</p>
            </el-tooltip>
          </template>
        </el-table-column>

          <el-table-column
            label="Reviewer Name"
            prop="rev_id"
            width="160">
            <template slot-scope="props">
              <!-- <p style="text-align:center;">{{ props.row.reviewer.rev_id }}</p> -->
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">{{props.row.reviewer.semanticScholarId}}</div>
                <p style="text-align:center; font-weight:bold;"><a target="new" v-bind:href="'https://www.semanticscholar.org/author/'+props.row.reviewer.semanticScholarId">{{ props.row.reviewer.name }}</a></p>
              </el-tooltip>
            </template>
          <!--<el-table-column
            label="Mail"
            prop="rev_mail">
            <template slot-scope="props">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                  <el-input v-model="props.row.reviewer.email" size="mini"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="changeMail(props.row.reviewer.semanticScholarId, props.row.reviewer.email)">Save</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>-->
        </el-table-column>

        <!--<el-table-column
          label="Deadline"
          prop="date">
          <template slot-scope="props">
            <p>Deadline : {{ props.row.deadline }}</p>
            <el-select v-model="relance[props.$index]" placeholder="Relaunch" size="mini">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>-->
        <el-table-column class-name="status-col" label="Status" width="120">
          <template slot-scope="props">
            <el-tag class-name="el-tag-status">{{ props.row.history[props.row.history.length - 1].status }}</el-tag>
          </template>
        </el-table-column>
        <!--<el-table-column
          label="Actions"
          prop="actions"
          width="100">
          <template slot-scope="props">
            <el-dropdown trigger="click" class="international" @command="actionHandleCommand" style="margin:0 auto; display:block; text-align:center;">
              <div>
                <el-button class="el-button-action" icon="el-icon-more" circle>
                </el-button>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  command="send">Send</el-dropdown-item>
                <el-dropdown-item  command="accept">Accept</el-dropdown-item>
                <el-dropdown-item  command="decline">Decline</el-dropdown-item>
                <el-dropdown-item  command="relaunch">Relaunch</el-dropdown-item>
                <el-dropdown-item  command="unsubscribe"  style='color:red'>Unsubscribe</el-dropdown-item>
                <el-dropdown-item  command="remove" style='color:red'>Remove</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>-->

      </el-table>
    </el-row>
  </div>
</template>
<script>
import locales from 'locales/article'
import { mapGetters } from 'vuex'
import axios from 'axios'

export default{
  name: 'invitation',
  locales,
  component: {},
  computed: {
    ...mapGetters([
      'userId',
      'accessToken'
    ])
  },
  data () {
    return {
      isData: false,
      mylistrequest: []
    }
  },
  mounted() {
    this.mylistrequest = this.getMyRequest()
  },
  methods: {
    setSelectedRow (row, event, column) {
        this.selectedRow = row
    },
    getMyRequest(){
      axios.get('/api/requests/myRequest/'+this.userId+'?page=1&count=10',{
        headers: {'Authorization': `Bearer ${this.accessToken}`}
       })
      .then( async (res) => {
        this.mylistrequest = res.data.data;
        this.isData = true;
      })
    }
  }
}
</script>
<style>
.el-table th {
  border-bottom: 1px solid #EBEEF5;
}

.el-table__header-wrapper {
  font-size: 1.1rem;
}

tbody {
  font-size: 0.8rem;
}

.el-table p {
  margin: 5px 0!important;
}

.el-form-item__label {
  text-align: left;
}
.clearfix:before,
  .clearfix:after {
    background-color: white;
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .clearfix, .el-card .el-card__header{
    background-color: white;
    font-size: 1.2rem;
  }
</style>
