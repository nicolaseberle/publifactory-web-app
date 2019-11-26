<template>
  <div>
  <el-form label-width="200px" :model="formMail" :rules="mailRules" ref="formMail" style='text-align :left; padding-bottom:20px;'>
    <el-form-item label="Your email" prop="mailDest">
      <el-input v-model="formMail.mailDest"></el-input>
    </el-form-item>
    <el-form-item label="Your name" prop="name">
      <el-input v-model="formMail.name"></el-input>
    </el-form-item>
    <el-form-item label="Journal requesting the reviewing" prop="journal">
      <el-input v-model="formMail.journal"></el-input>
    </el-form-item>
    <!-- <el-form-item label="Journal issn" prop="issn">
      <el-input v-model="formMail.issn"></el-input>
    </el-form-item> -->
    <el-form-item label="Object" prop="object">
      <el-input v-model="formMail.object"></el-input>
    </el-form-item>
    <el-form-item label="Message" prop="message">
      <el-input
        type="textarea"
        :autosize="{ minRows: 10, maxRows: 30}"
        v-model="formMail.message">
      </el-input>
    </el-form-item>
    <el-form-item label="Review due by" prop="deadline">
        <el-date-picker type="date" placeholder="Deadline" v-model="formMail.deadline"></el-date-picker>
    </el-form-item>
    <el-form-item label="Relaunch" prop="relaunch">
      <el-select v-model="formMail.relaunch">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Option">
      <el-checkbox v-model="receiveCopy">I would like to receive a copy of the present email</el-checkbox>
    </el-form-item>
    <el-form-item label="CGU / RGPD" prop="cgu">
      <el-checkbox v-model="formMail.cgu">
        I accept the
        <el-tooltip class="item" effect="dark" content="Lorem ipsum dolor sit amet" placement="top">
          <span>CGU</span>
        </el-tooltip>
      </el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button v-on:click="$emit('close')">Cancel</el-button>
      <el-button type="primary" @click="sendRequestRev('formMail')">Send</el-button>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
import axios from 'axios'
export default {
  props: ['formPost','formMail','rowInfos'],
  data() {
    return {
      requestInfos: {},
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
      mailRules: {
        message: [
          {required: true, message: 'Please input enter a message for your email', trigger: 'blur'}
        ],
        object: [
          {required: true, message: 'A email needs an object', trigger: 'blur'}
        ],
        deadline: [
          {required: true, message: 'You need to pick a deadline', trigger: 'blur'}
        ],
        mailDest: [
          {required: true, message: 'You need to enter your email', trigger: 'blur'}
        ],
        journal: [
          {required: true, message: 'You need to enter your journal', trigger: 'blur'}
        ],
        name: [
          {required: true, message: 'You need to enter your name', trigger: 'blur'}
        ],
        cgu: [
          {required: true, message: 'You need to accept the CGU', trigger: 'blur'}
        ]
        // ,issn: [
        //   {required: true, message: 'You need to enter the issn of your journal', trigger: 'blur'}
        // ]
      },
      receiveCopy: false,
    }
  },
  methods: {
    sendRequestRev(formMail){
      this.$refs[formMail].validate((valid) => {
        if (valid) {
          this.requestInfos["title"] = this.formPost["title"]
          this.requestInfos["abstract"] = this.formPost["abstract"]
          this.requestInfos["rev_id"] = this.rowInfos["id"]
          this.requestInfos["rev_name"] = this.rowInfos["name"]
          this.requestInfos["deadline"] = this.formMail["deadline"]
          this.requestInfos["object"] = this.formMail["object"]
          this.requestInfos["remind"] = this.formMail["relaunch"]
          this.requestInfos["content"] = this.formMail["message"]
          this.requestInfos["pub_mail"] = this.formMail["mailDest"]
          this.requestInfos["pub_journal"] = this.formMail["journal"]
          this.requestInfos["pub_name"] = this.formMail["name"]
          console.log(this.requestInfos);

          new Promise ((resolve,reject) => {
            axios.get('https://service.publifactory.co/api/get_mail_id?id=' + this.requestInfos.rev_id)
            .then( async (res) => {
              if (res) {
                this.requestInfos["rev_mail"] = res['data'][0]["_source"]["mail"]
              }
              else {
                this.requestInfos["rev_mail"] = ""
              }
              this.$emit('close');
              console.log(this.requestInfos);
            })
          })

          async function addRequest(dataJson){
            const response = await axios({
              method: 'post',
              url: 'http://localhost:4000/api/requests',
              validateStatus: undefined,
              headers: {
                'Content-Type': 'application/json'
              },
              data: dataJson
            });
            if (response.status !== 200) {
              console.log("Failed")
            } else {
              console.log(response)
            }
          }

          let dataJson = {
            "title": this.requestInfos["title"],
            "abstract": this.requestInfos["abstract"],
            "deadline": this.requestInfos["deadline"].toUTCString(),
            "object": this.requestInfos["object"],
            "content": this.requestInfos["content"],
            "remind": this.requestInfos["remind"],
            "reviewer":  {
              "semanticScholarId": this.requestInfos["rev_id"],
              // "email": this.requestInfos["rev_mail"],
              "email": "quentin.collin@example.com",
              "name": this.requestInfos["rev_name"]
            },
            "editor": {
              "name": this.requestInfos["pub_name"],
              "email": this.requestInfos["pub_mail"],
              "journal": this.requestInfos["pub_journal"]
            }
          }

          addRequest(dataJson)
        }
      })
    }
  }
}
</script>
