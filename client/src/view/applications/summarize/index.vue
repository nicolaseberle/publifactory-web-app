<template>
  <div class="dashboard-container">
    <div class="app-container">
      <hgroup>
        <h1>Sums Up</h1>
        <p>This service allows you to summarize any english text.</p>
        <el-tag type="warning">Warning : If you request too long summary, you have a great chance to see the input text. </el-tag>
      </hgroup>

      <el-form  label-width="100px" :model="formPost" :rules="rules" ref="formPost" style='padding-bottom:20px;'>
        <el-form-item label="Text" prop="text">
          <el-input
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 30}"
            placeholder="You have to input enter only english abstract"
            v-model="formPost.text">
          </el-input>
        </el-form-item>

        <el-form-item label="Sentences" prop="lines">
          <el-input-number
            v-model="formPost.lines"
            controls-position="right"
            :min="1"
            :max="30">
          </el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type="info" @click="onSubmit('formPost')" :loading="load_var" class="button_tab">Sums up</el-button>
        </el-form-item>

      </el-form>

      <div id="v-for-object" class="demo">
        <p v-for="line in text_sum">
          {{ line }}
        </p>
      </div>
    </div>
  </div>
</template>









<script>
import axios from 'axios'
export default {
  data () {
    return {
      formPost: {text: '', lines: ''},
      rules: {
        text: [
          {required: true, message: 'Please input enter a text', trigger: 'blur'}
        ],
        lines: [
          {required: true, message: 'Please select the number of line', trigger: 'blur'}
        ]
      },
      load_var: false,
      text_sum: []
    }
  },
  methods: {
    onSubmit(formName) {
      this.load_var = true
      axios.get('https://service.publifactory.co/api/summary_generator?text=' + this.formPost.text + '&nb_sent=' + this.formPost.lines)
      .then(response => (
        this.text_sum = response.data
      ))
      this.load_var = false
    }
  }
}
</script>








<style>

.app-container {
  max-width: 1140px;
  padding: 0px 20px;
  margin: 0 auto;
}

h1 {
  font-family: 'DNLTPro-bold';
  text-align: center;
}

h2 {
  font-family: 'DNLTPro-bold';
}

p {
  font-family: 'DNLTPro-regular';
}

strong {
  display: block;
  margin-top: 5px;
}

hgroup {
  text-align: center;
  margin-bottom: 40px;
}
  hgroup > p {
    margin: 0;
  }

</style>
