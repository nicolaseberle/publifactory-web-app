<template>
  <div @page-change='fetchRequests'>
    <el-row v-for="data in dataTest" style='padding-top:20px; margin-bottom: 20px;'>
      <h3>{{data.title}}</h3>
      <el-table
      :ref="data.title"
      highlight-current-row
      :data="data.requests"
      style="width: 100%"
      :key="data.title">

        <el-table-column
          label="Reviewer ID"
          prop="rev_id"
          width="100">
          <template slot-scope="props">
            <p style="text-align:center;">{{ props.row.reviewer.rev_id }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Reviewer Name"
          prop="rev_name">
          <template slot-scope="props">
            <p>{{ props.row.reviewer.rev_name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Reviewer mail"
          prop="rev_name">
          <template slot-scope="props">
            <el-input
              placeholder=""
              v-model="props.row.reviewer.rev_mail"
              v-on:change.native="changeMail(props.row.reviewer.rev_id, props.row.reviewer.rev_mail)">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="Publisher Name"
          prop="edi_name">
          <template slot-scope="props">
            <p>{{ props.row.editor.edi_name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Publisher Mail"
          prop="edi_mail">
          <template slot-scope="props">
            <p>{{ props.row.editor.edi_mail }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Publisher Journal"
          prop="edi_journal">
          <template slot-scope="props">
            <p>{{ props.row.editor.edi_journal }}</p>
          </template>
        </el-table-column>

        <el-table-column
          label="Status"
          prop="status"
          width="110">
          <template slot-scope="props">
            <p style="text-align:center;">{{ props.row.status }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Date"
          prop="date">
          <template slot-scope="props">
            <p>Date : {{ props.row.date }}</p>
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
          value: '1x1sem',
          label: '1 fois par semaine'
        }, {
          value: '2x1mois',
          label: '2 fois par mois'
        }, {
          value: '1x1mois',
          label: '1 fois par mois'
        }, {
          value: '1x2mois',
          label: '1 fois tous les 2 mois'
        }
      ],
      relance: '2x1mois',
      dataTest: []
    }
  },
  methods: {
    changeMail(id, mail){
      console.log(id);
      console.log(mail);
      new Promise ((resolve,reject) => {
        axios.get('https://service.publifactory.co/api/update_mail?id=' + id + '&mail=' + mail)//+ '&keywords=' + this.formPost.keywords + '&title=' + this.formPost.title)
        .then( async (res) => {
          console.log(res);
        })
      })
    },
    fetchRequests() {
      this.dataTest = [
        {
          "title": "titre1",
          "abstract": "abstract1",
          "requests": [
            {
              "status": "En attente",
              "date": "05-12-2019",
              "deadline": "12-12-2019",
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
              "status": "En attente",
              "date": "05-12-2019",
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
            }
          ]
        },
        {
          "title": "titre2",
          "abstract": "abstract2",
          "requests": [
            {
              "status": "Envoyé",
              "deadline": "12-12-2019",
              "date": "05-12-2019",
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
      ]
    }
  },
  mounted() {
    this.fetchRequests()
  }
}
</script>
