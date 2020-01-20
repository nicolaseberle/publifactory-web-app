<template>
  <el-card
    id="card-form-report"
    :style="[anonymous ? {'background-color': 'purple'} : {'background-color': 'transparent'}]"
  >
    <el-row v-show="anonymous" type="flex" style="margin: 0px 0 5px 0;align-items: center;">
      <div class="partial-review-edit-anonymous-show">Anonymous peer review</div>
    </el-row>
    <el-row type="flex" class="partial-review-edit-container">
      <el-checkbox v-model="anonymous">
        <div class="partial-review-edit-anonymous-svg">
          <svg-icon icon-class="private" />
        </div>
      </el-checkbox>
      <el-select v-model="currentType" justify="left" placeholder="No revision">
        <el-option
          v-for="item in optionsReview"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-button
        type="primary"
        class="button-submit"
        style="margin-left: 5%; justify:end"
        @click="createReport()"
        icon="el-icon-upload2"
      >Send your report</el-button>
    </el-row>
    <el-row type="flex" class="partial-review-edit-container-input" justify="center">
      <div v-bind:id="idEditor"></div>
      <div v-bind:id="idToolBar" style="z-index=1000;">
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-blockquote"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-list" value="bullet"></button>
          <button class="ql-indent" value="-1"></button>
          <button class="ql-indent" value="+1"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-link"></button>
        </span>
      </div>

      <!-- <el-input type="textarea" :rows="7" placeholder="Please input" v-model="editReport"></el-input> -->
    </el-row>
  </el-card>
</template>

<script>
import 'quill/dist/quill.snow.css';
import { mapGetters } from 'vuex';
import axios from 'axios';

const Quill = require('quill');

export default {
  name: 'partialReviewEdit',
  props: {
    articleId: String
  },
  data() {
    return {
      editor: {},
      idEditor: this.setIdEditor(),
      idToolBar: this.setIdToolBar(),
      anonymous: false,
      currentType: 'comment',
      optionsReview: [
        {
          value: 'no-revision',
          label: 'No revision'
        },
        {
          value: 'minor-revision',
          label: 'Minor revision'
        },
        {
          value: 'major-revision',
          label: 'Major revision'
        },
        {
          value: 'rejection',
          label: 'Rejection'
        },
        {
          value: 'comment',
          label: 'Simple comment'
        },
        {
          value: 'resolve',
          label: 'Resolve'
        }
      ],
      editReport: ''
    };
  },
  computed: {
    ...mapGetters(['userId', 'roles', 'accessToken'])
  },
  mounted() {
    const quill = new Quill('#' + this.idEditor, {
      modules: {
        toolbar: '#' + this.idToolBar
      },
      theme: 'snow'
    });
    this.editor = quill;
  },
  methods: {
    async createReport() {
      if (this.isQuillEmpty()) return;
      const newComment = {
        date: new Date().getTime(),
        userId: this.userId,
        content: this.editor.root.innerHTML,
        type: this.currentType,
        anonymous: this.anonymous
      };
      console.log(this.currentType)
      // this.$emit('newReport', newComment);
      try {
        const response = await axios.post(
          `/api/comments/${this.articleId}`,
          newComment,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` }
          }
        );
        console.log('new comment', response.data);
        console.log('=====>', this);
        this.$emit('newReport', response.data);
      } catch (error) {
        console.warn('failed to add partial review', error);
      }
    },
    isQuillEmpty() {
      if ((this.editor.getContents()['ops'] || []).length !== 1) {
        return false;
      }
      return this.editor.getText().trim().length === 0;
    },
    setIdEditor() {
      return 'editor-container';
    },
    setIdToolBar() {
      return 'toolbar-container';
    }
  }
};
</script>

<style scoped>
.partial-review-edit-anonymous-show {
  font-family: Calibri-bold;
  color: black;
}
.partial-review-edit-anonymous-svg {
  padding: 10px 10px 10px 0px;
}

.partial-review-edit-container {
  margin: 5px 0px 20px 0px;
  align-items: center;
}

.partial-review-edit-container-input {
  display: flex;
  flex-direction: column;
  border-bottom: none;
  border: 1px solid #ccc;
}

.ql-toolbar.ql-snow {
  border-left: none;
  border-right: none;
  border-bottom: none;
}
</style>
