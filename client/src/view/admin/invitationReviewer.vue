<template>
  <div>
    <el-row style='padding: 20px; margin-bottom: 20px;'>
      <!-- <h3>{{data.title}}</h3> -->
      <el-table
      ref="dataReq"
      highlight-current-row
      :data="dataTest"
      style="width: 100%"
      height="500">

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-steps :active="1">
            <el-step title="Pending" description="Une description"></el-step>
            <el-step title="Étape 2" description="Une description"></el-step>
            <el-step title="Étape 3" description="Une description"></el-step>
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
          prop="edi_name">
          <template slot-scope="props">
            <!-- <p>{{ props.row.editor.edi_name }}</p> -->
            <p>{{ props.row.editor.edi_mail }}</p>
            <p>{{ props.row.editor.edi_journal }}</p>
          </template>
        </el-table-column>

        <el-table-column label="Reviewer">
          <el-table-column
            label="Name"
            prop="rev_id">
            <template slot-scope="props">
              <!-- <p style="text-align:center;">{{ props.row.reviewer.rev_id }}</p> -->
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">{{props.row.reviewer.rev_id}}</div>
                <p style="text-align:center; font-weight:bold;"><a v-bind:href="'https://www.semanticscholar.org/author/'+props.row.reviewer.rev_id">{{ props.row.reviewer.rev_name }}</a></p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="Mail"
            prop="rev_mail">
            <template slot-scope="props">
              <el-input
                placeholder=""
                v-model="props.row.reviewer.rev_mail"
                v-on:change.native="changeMail(props.row.reviewer.rev_id, props.row.reviewer.rev_mail)">
              </el-input>
            </template>
          </el-table-column>
        </el-table-column>

        <!-- <el-table-column
          label="Status"
          prop="status"
          width="110">
          <template slot-scope="props">
            <p style="text-align:center;">{{ props.row.status }}</p>
          </template>
        </el-table-column> -->
        <el-table-column
          label="Deadline"
          prop="date">
          <template slot-scope="props">
            <!-- <p>Date : {{ props.row.date }}</p> -->
            <p>Deadline : {{ props.row.deadline }}</p>
            <el-select v-model="relance" placeholder="Relance">
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
          prop="actions">
          <template slot-scope="props">
            <el-button type="primary" @click="">Delete</el-button>
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
      relance: '2x1month',
      dataTest: [
        {
          "title": "titre1",
          "abstract": "abstract1",
          "deadline": "12-12-2019",
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
          "reviewer": {
            "rev_id": "46485613",
            "rev_name": "Vincent Schuck",
            "rev_mail": ""
          },
          "editor": {
            "edi_name": "Nicolas Eberle",
            "edi_mail": "nico@example.com",
            "edi_journal": "Nature"
          }
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
    fetchRequests() {
      // this.dataTest = []
    }
  }
  // ,
  // mounted() {
  //   this.fetchRequests()
  // }
}
</script>
<style>
.el-table th {
  border-bottom: 1px solid #EBEEF5;
}
</style>
