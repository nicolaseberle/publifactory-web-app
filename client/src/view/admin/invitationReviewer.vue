<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-row v-for="data in this.dataTest" style='padding-top:20px; margin-bottom: 20px;'>
        <h3>{{data.title}}</h3>
        <el-table
          ref="refTable"
          row-key="id"
          highlight-current-row
          :data="data.requests"
          style="width: 100%">

          <el-table-column
            label="Reviewer ID"
            prop="rev_id">
            <template slot-scope="props">
              <p>{{ props.row.reviewer.rev_id }}</p>
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
              <p>{{ props.row.reviewer.rev_mail }}</p>
            </template>
          </el-table-column>

        </el-table>
      </el-row>
    </div>
  </div>
</template>
<script>
import locales from 'locales/article'
export default{
  data () {
    return {
      dataTest: [
        {
          "title": "titre1",
          "abstract": "abstract1",
          "deadline": "12-12-2019",
          "date": "05-12-2019",
          "requests": [
            {
              "reviewer": {
                "rev_id": "46485613",
                "rev_name": "Vincent Schuck",
                "rev_mail": ""
              },
              "editor": {
                "edi_mail": "nico@example.com",
                "edi_journal": "Nature"
              }
            },
            {
              "reviewer": {
                "rev_id": "46485614",
                "rev_name": "Pierre Schuck",
                "rev_mail": ""
              },
              "editor": {
                "edi_mail": "nico@example.com",
                "edi_journal": "Nature"
              }
            }
          ]
        },
        {
          "title": "titre2",
          "abstract": "abstract2",
          "deadline": "12-12-2019",
          "date": "05-12-2019",
          "requests": [
            {
              "reviewer": {
                "rev_id": "46485615",
                "rev_name": "Jean Michel",
                "rev_mail": "jm@example.com"
              },
              "editor": {
                "edi_mail": "nico@example.com",
                "edi_journal": "Nature"
              }
            }
          ]
        }
      ]
    }
  }
}
</script>
