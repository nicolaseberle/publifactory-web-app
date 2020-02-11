<template>
  <div class='app-container'>
    <!--<el-row style='padding: 20px; margin-bottom: 20px; font-family:DNLTPro-regular;'>
      <h2 style="font-family:DNLTPro-regular;">Listing mail request</h2>
      <el-table
      ref="listAllMail"
      highlight-current-row
      :data="listAllMail">

        <el-table-column type="expand" width="20">
          <template slot-scope="props">
            <el-form ref="formList" :model="formList" label-width="120px">
              <el-form-item v-bind:key="item._id" v-for="item in props.row.list" label="temp">
                <p slot="label"><a target="new" v-bind:href="'https://www.semanticscholar.org/author/'+item.id">{{item.name}} ({{item.id}})</a></p>
                <el-input v-model="item.mail" size="mini"></el-input>
              </el-form-item>
              <el-form-item size="mini">
                <el-button type="primary" @click="">Send List</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column
          label="Title"
          prop="title"
          width="200">
          <template slot-scope="props">
            <p style="text-align:center;">{{ props.row.title }}</p>
          </template>
        </el-table-column>

        <el-table-column
          label="Mail"
          prop="mail"
          width="200">
          <template slot-scope="props">
            <p style="text-align:center;">{{ props.row.mail_publisher }}</p>
          </template>
        </el-table-column>

      </el-table>

    </el-row>-->


    <el-row v-if="isData" style='padding: 20px; margin-bottom: 20px; font-family:DNLTPro-regular;'>
      <h2 style="font-family:DNLTPro-regular;">List of requests</h2>
      <content-module name="dataFinal">
        <data-table ref="dataFinal" :page="page" @page-change="nextPage">

          <el-table
          ref="dataReq"
          highlight-current-row
          :data="dataFinal"
          style="width: 100%"
          @row-click="setSelectedRow">

          <el-table-column type="expand" width="20">
            <template slot-scope="props">
              <el-steps>
                <el-step v-bind:key="req" v-for="req in props.row.history" v-if="req.status != 'accept' && req.status != 'decline'" :title="req.status" status="success" :description="req.date | moment('DD/MM/YYYY, h:mm a')"></el-step>
                <el-step v-else-if="req.status == 'accept'" title="status" status="success" :description="req.status"></el-step>
                <el-step v-else-if="req.status == 'decline'" title="status" status="error" :description="req.status"></el-step>
                <el-step v-if="Object.values(props.row.history[props.row.history.length -1]).indexOf('decline') && Object.values(props.row.history[props.row.history.length -1]).indexOf('accept')" title="status" status="wait" description="pending"></el-step>
              </el-steps>
            </template>
          </el-table-column>
          <el-table-column class-name="date-col" width="180px" label="Date">
            <template slot-scope="props">
              <span>{{ props.row.history[0].date | moment("DD/MM/YYYY, h:mm a") }}</span>
            </template>
          </el-table-column>
            <el-table-column
              label="Title"
              prop="title"
              width="200">
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

            <el-table-column label="Reviewer">
              <el-table-column
                label="Name"
                prop="rev_id"
                width="160">
                <template slot-scope="props">
                  <!-- <p style="text-align:center;">{{ props.row.reviewer.rev_id }}</p> -->
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">{{props.row.reviewer.semanticScholarId}}</div>
                    <p style="text-align:center; font-weight:bold;"><a target="new" v-bind:href="'https://www.semanticscholar.org/author/'+props.row.reviewer.semanticScholarId">{{ props.row.reviewer.name }}</a></p>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
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
              </el-table-column>
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
              <template slot-scope="props"><!-- :type="props.row.history.status | requestStatusFilter" -->
                <!--<el-tag class-name="el-tag-status">{{ props.row.history[props.row.history.length - 1].status }}</el-tag>-->
                <el-tag v-if='props.row.history[props.row.history.length - 1].status=="done"' class-name="el-tag-status"  :type="statusInvitationFilter(props.row.history[props.row.history.length - 2].status)" >{{ props.row.history[props.row.history.length - 2].status }}</el-tag>
                <el-tag v-else class-name="el-tag-status"  :type="statusInvitationFilter(props.row.history[props.row.history.length - 1].status)" >{{ props.row.history[props.row.history.length - 1].status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
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
                    <el-dropdown-item  command="remind">Remind</el-dropdown-item>
                    <el-dropdown-item  command="accept">Accept</el-dropdown-item>
                    <el-dropdown-item  command="decline">Decline</el-dropdown-item>
                    <el-dropdown-item  command="unsubscribe"  style='color:red'>Unsubscribe</el-dropdown-item>
                    <el-dropdown-item  command="remove" style='color:red'>Remove</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

          </el-table>
        </data-table>
      </content-module>
    </el-row>
  </div>
</template>
<script>
import locales from 'locales/article'
import DataTable from '../../components/DataTable'
import axios from 'axios'
import { mapGetters } from 'vuex'


export function requestStatusFilter (status) {
  const statusMap = {
    pending: 'pending',
  	bademail : 'bademail',
  	sent :'sent',
  	remind: 'remind',
  	read : 'read',
  	accepted: 'accepted',
  	rejected: 'rejected',
  	outfield : 'outfield',
  	unsubscribed: 'unsubscribed',
  	done: 'done'
  }
  return statusMap[status]
}

export default{
  name: 'invitationReviewerView',
  components: {DataTable},
  data () {
    return {
      formList: [],
      options: [{
          value: '1x1week',
          label: 'Once a week'
        }, {
          value: '2x1month',
          label: '2 times each month'
        }, {
          value: '1x1month',
          label: 'Once a month'
        }, {
          value: '1x2month',
          label: 'Once every 2 month'
        }
      ],
      selectedRow: '',
      relance: [],
      dataFinal: [],
      isData: false,
      metricsFinal: [],
      isMetrics: false,
      dataTest: [],
      listAllMail: [],
      page:{current: 1,total:0}
    }
  },
  computed: {
    ...mapGetters([
      'accessToken'
    ])
  },
  methods: {
    nextPage(val){
      this.page.current = val
      this.getRequests(this.page.current)
    },
    statusInvitationFilter (status) {
      const statusMap = {
        done: 'success',
        accepted: 'success',
        pending: 'primary',
        read:  'primary',
        sent: 'primary',
        bademail: 'warning',
        unsubscribed: 'warning',
        outfield: 'info',
        rejected: 'danger',
        removed: 'danger'
      }
      return statusMap[status]
    },
    setSelectedRow (row, event, column) {
        this.selectedRow = row
    },
    changeMail(id, mail){
      new Promise ((resolve,reject) => {
        const requestId = this.selectedRow._id
        const body = {
          "reviewer":{"email": mail},
        };
        //axios.get('https://service.publifactory.co/api/update_mail?id=' + id + '&mail=' + mail)//+ '&keywords=' + this.formPost.keywords + '&title=' + this.formPost.title)
        axios.patch('/api/requests/' + requestId, body )
        .then( async (res) => {
          console.log(res.data);
        })
      })
    },
    getRequests(page = 1){
      new Promise ((resolve,reject) => {
        axios.get('/api/requests/?page='+page+'&count=10',{
          headers: {'Authorization': `Bearer ${this.accessToken}`}
         })
        .then( async (res) => {
          this.dataFinal = res.data.data;
          this.isData = true;
        })
      })
    },
    removeRequest(id){
      new Promise ((resolve,reject) => {
        axios.delete('/api/requests/' + id)
        .then( async (res) => {
          await this.getRequests()
        })
      })
    },
    getTotalRequest () {
      axios.get('/api/activity/totalRequest')
      .then( async (res) => {
        this.page.total = res.data.data;
      }).catch((e)=>{console.log(e)})
    },
    sendRequest(id){
      new Promise ((resolve,reject) => {
        axios.post('/api/requests/send/' + id)
        .then( async (res) => {
          await this.getRequests()
        })
      })
    },
    remindRequest(id){
      new Promise ((resolve,reject) => {
        axios.post('/api/requests/remind/' + id)
        .then( async (res) => {
          await this.getRequests()
        })
      })
    },
    actionHandleCommand(command) {
      if (command == "send") {
        this.sendRequest(this.selectedRow._id)
      }
      else if (command == "remind") {
        this.remindRequest(this.selectedRow._id)
      }
      else if (command == "remove") {
        console.log(command);
        this.removeRequest(this.selectedRow._id)
      }
      else if (command == "accept") {
        console.log(command);
        console.log("no action");
      }
      else if (command == "decline") {
        console.log(command);
        console.log("no action");
      }
      else if (command == "unsubscribe") {
        console.log(command);
        console.log("no action");
      }
    }
  },
  async mounted() {
    this.getTotalRequest()
    await this.getRequests()
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
