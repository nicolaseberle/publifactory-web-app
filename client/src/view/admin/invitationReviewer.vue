<template>
  <div>
    <el-row style='padding: 20px; margin-bottom: 20px; font-family:DNLTPro-regular;'>
      <h2 style="font-family:DNLTPro-regular;">Listing mail request</h2>
      <el-table
      ref="listAllMail"
      highlight-current-row
      :data="listAllMail">

        <el-table-column type="expand" width="20">
          <template slot-scope="props">
            <el-form ref="formList" :model="formList" label-width="120px">
              <el-form-item v-bind:key="item" v-for="item in props.row.list" label="temp">
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

    </el-row>
{{metricsFinal}}

    <el-row v-if="isData" style='padding: 20px; margin-bottom: 20px; font-family:DNLTPro-regular;'>
      <h2 style="font-family:DNLTPro-regular;">List of requests</h2>
      <el-table
      ref="dataReq"
      highlight-current-row
      :data="dataFinal"
      style="width: 100%"
      height="500">

      <el-table-column type="expand" width="20">
        <template slot-scope="props">
          <el-steps>
            <el-step v-bind:key="req" v-for="req in props.row.history" v-if="req.status != 'accept' && req.status != 'decline'" :title="req.status" status="success" :description="req.date"></el-step>
            <el-step v-else-if="req.status == 'accept'" title="status" status="success" :description="req.status"></el-step>
            <el-step v-else-if="req.status == 'decline'" title="status" status="error" :description="req.status"></el-step>
            <el-step v-if="Object.values(props.row.history[props.row.history.length -1]).indexOf('decline') && Object.values(props.row.history[props.row.history.length -1]).indexOf('accept')" title="status" status="wait" description="pending"></el-step>
          </el-steps>
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
          width="180">
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
            width="190">
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
              <el-input
                size="mini"
                placeholder=""
                v-model="props.row.reviewer.mail"
                v-on:change.native="changeMail(props.row.reviewer.semanticScholarId, props.row.reviewer.mail)">
              </el-input>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column
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
        </el-table-column>
        <el-table-column
          label="Actions"
          prop="actions"
          width="120">
          <template slot-scope="props">
            <el-dropdown trigger="click" class="international" @command="actionHandleCommand" style="margin:0 auto; display:block; text-align:center;">
              <div>
                <el-button class="el-button-action" icon="el-icon-more" circle>
                </el-button>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  command="remove">Remove</el-dropdown-item>
                <el-dropdown-item  command="accept">Accept</el-dropdown-item>
                <el-dropdown-item  command="decline">Decline</el-dropdown-item>
                <el-dropdown-item  command="relaunch">Relaunch</el-dropdown-item>
                <el-dropdown-item  command="unsubscribe">Unsubscribe</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

      </el-table>
    </el-row>
  </div>
</template>
<script>
import locales from 'locales/article'
import axios from 'axios'
export default{
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
      relance: [],
      dataFinal: [],
      isData: false,
      metricsFinal: [],
      isMetrics: false,
      dataTest: [
        {
          "title": "Lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
          "abstract": "abstract1",
          "deadline": "12-12-2019",
          "objet": "test",
          "content": "blablablalbal",
          "remind": "1x2month",
          "reviewer": {
            "rev_id": "46485613",
            "rev_name": "Vincent Schuck",
            "rev_mail": ""
          },
          "editor": {
            "edi_name": "Nicolas Eberle",
            "edi_mail": "nico@example.com",
            "edi_journal": "Nature"
          },
          "requests": [
            {
              "status": "En attente",
              "date": "05-12-2019",
            },
            {
              "status": "Envoyé",
              "date": "07-12-2019",
            }
          ]
        },
        {
          "title": "titre1",
          "abstract": "abstract1",
          "requests": [
            {
              "status": "En attente",
              "date": "05-12-2019",
            },
            {
              "status": "Envoyé",
              "date": "07-12-2019",
            }
          ],
          "deadline": "12-12-2019",
          "reviewer": {
            "rev_id": "46485614",
            "rev_name": "Pierre Schuck",
            "rev_mail": ""
          },
          "editor": {
            "edi_name": "Nicolas Eberle",
            "edi_mail": "nico@example.com",
            "edi_journal": "Nature"
          }
        },
        {
          "title": "titre2",
          "abstract": "abstract2",
          "deadline": "12-12-2019",
          "requests": [
            {
              "status": "En attente",
              "date": "05-12-2019",
            },
            {
              "status": "Envoyé",
              "date": "05-12-2019",
            },
            {
              "status": "Read",
              "date": "06-12-2019",
            },
            {
              "status": "Decline",
              "date": "08-12-2019",
            }
          ],
          "reviewer": {
            "rev_id": "46485615",
            "rev_name": "Jean Michel",
            "rev_mail": "jm@example.com"
          },
          "editor": {
            "edi_name": "Nicolas Eberle",
            "edi_mail": "nico@example.com",
            "edi_journal": "Nature"
          }
        }
      ],
      listAllMail: [
        {
          "title": "titre1",
          "mail_publisher": "publi@mail.com",
          "list": [
            {
              "id": "123456",
              "name": "blabla1",
              "mail": "mail@mail.com"
            },
            {
              "id": "123457",
              "name": "blabla2",
              "mail": ""
            },
            {
              "id": "123458",
              "name": "blabla3",
              "mail": ""
            },
            {
              "id": "123459",
              "name": "blabla4",
              "mail": ""
            },
            {
              "id": "123451",
              "name": "blabla5",
              "mail": "mail@mail.com"
            },
            {
              "id": "123452",
              "name": "blabla6",
              "mail": ""
            },
            {
              "id": "123453",
              "name": "blabla7",
              "mail": "mail@mail.com"
            },
            {
              "id": "123454",
              "name": "blabla8",
              "mail": "mail@mail.com"
            },
            {
              "id": "123455",
              "name": "blabla9",
              "mail": "mail@mail.com"
            },
            {
              "id": "123450",
              "name": "blabla0",
              "mail": ""
            }
          ]
        }
      ]
    }
  },
  methods: {
    changeMail(id, mail){
      console.log(id);
      console.log(mail);
      new Promise ((resolve,reject) => {
        axios.get('https://service.publifactory.co/api/update_mail?id=' + id + '&mail=' + mail)//+ '&keywords=' + this.formPost.keywords + '&title=' + this.formPost.title)
        .then( async (res) => {
          console.log(res.data);
        })
      })
    },
    getRequests(){
      new Promise ((resolve,reject) => {
        axios.get('/api/requests?page=1&count=10')
        .then( async (res) => {
          this.dataFinal = res.data.data;
          console.log(this.dataFinal);
          this.isData = true;
        })
      })
    },
    getMetrics(){
      axios.get('/api/activity?page=1&count=10')
      .then( async (res) => {
        this.metricsFinal = res.data.data;
        console.log(this.metricsFinal);
        this.isMetrics = true;
      })
    },
    actionHandleCommand(command) {
      if (command == "remove") {
        console.log(command);
      }
      else if (command == "accept") {
        console.log(command);
      }
      else if (command == "decline") {
        console.log(command);
      }
      else if (command == "relaunch") {
        console.log(command);
      }
      else if (command == "unsubscribe") {
        console.log(command);
      }
    }
  },
  async mounted() {
    await this.getMetrics()
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

</style>
