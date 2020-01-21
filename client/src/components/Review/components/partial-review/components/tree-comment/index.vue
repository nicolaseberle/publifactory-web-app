<template>
  <div>
    <div :style="indent">
      <transition v-on:enter="enter" v-on:leave="leave">
        <article v-if="label && (flagShowingComment || depth<2)">
          <partial-review-header
            :reviewType="reviewType"
            :creationDate="creationDate"
            :user="user"
            :anonymous="anonymous"
          ></partial-review-header>
          <section>
            <div class="card-review">
              <partial-review-vote
                :score="scores.upvote"
                @upvote="upvoteComment"
                @downvote="downvoteComment"
              ></partial-review-vote>
              <div class="col-content">
                <div v-on:click="focusOnCommentedText()">
                  <quill-review-edit
                    v-on:saveComment="saveComment"
                    v-on:cancelComment="cancelComment"
                    :content="comment"
                    v-if="flagEditComment"
                  ></quill-review-edit>
                  <p v-if="!flagEditComment" v-html="comment"></p>
                </div>
              </div>
            </div>
          </section>
          <partial-review-menu
            :isUserOwner="isUserOwner"
            @open="openBoxToReply"
            @edit="editComment"
            @remove="deleteComment"
            :isEditing="flagEditComment"
            :reviewType="reviewType"
          ></partial-review-menu>

          <footer v-if="nodes && nodes.length>0" :class="['reply-footer', reviewType]">
            <a v-if="!flagShowingComment__" @click="changeStateReply()">
              Show replies ({{nodes.length}})
              <i class="el-icon-arrow-down"></i>
            </a>
            <a v-if="flagShowingComment__" @click="changeStateReply()">
              Hide replies ({{nodes.length}})
              <i class="el-icon-arrow-up"></i>
            </a>
          </footer>
          <partial-review-reply
            v-if="flagToAnswer"
            v-on:cancel="closeBoxToReply"
            v-on:reply="createAnswer"
          ></partial-review-reply>
        </article>
      </transition>
    </div>

    <tree-comment
      v-for="(node,key) in nodes"
      :key="key"
      :reviewId="node._id"
      :nodes="node.child"
      :label="node.content"
      :scores="node.scores"
      :creationDate="node.createdAt"
      :reviewType="node.type"
      :anonymous="node.anonymous"
      :user="node.userId"
      :flagShowingComment="flagShowingComment__"
      :depth="depth + 1"
      v-on:post="reload"
    ></tree-comment>
  </div>
</template>
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';
import { mapGetters } from 'vuex';
import velocity from 'velocity-animate';
import quillReviewEdit from './components/quill-review-edit';
import partialReviewReply from './components/partial-review-reply';
import partialReviewHeader from './components/partial-review-header';
import partialReviewVote from './components/partial-review-vote';
import partialReviewMenu from './components/partial-review-menu';

const debug = require('debug')('frontend');
var uuidv4 = require('uuid/v4');

export default {
  props: {
    socket: {},
    reviewId: { type: String },
    label: { type: String },
    nodes: {
      type: Array,
      validator: function(value) {
        if (value && value.length > 0) {
          return value;
        } else {
          return [];
        }
      }
    },
    flagShowingComment: { type: Boolean },
    depth: { type: Number },
    creationDate: String,
    anonymous: { type: Boolean },
    reviewType: { type: String },
    scores: {
      type: Object,
      validator: function(value) {
        if (value) {
          return value;
        } else {
          return '';
        }
      }
    },
    user: {
      type: Object,
      validator: function(value) {
        if (value) {
          return value;
        } else {
          return '';
        }
      }
    }
  },
  name: 'tree-comment',
  components: {
    quillReviewEdit,
    partialReviewReply,
    partialReviewHeader,
    partialReviewVote,
    partialReviewMenu
  },
  data() {
    return {
      isUserOwner: false,
      id: '',
      flagEditComment: false,
      flagToAnswer: false,
      checkedAnonymous: false,
      errors: { message: '' },
      comment: this.label,
      flagShowingComment__: false
    };
  },
  created() {
    this.id = this.$route.params && this.$route.params.id;
    this.isUserOwner = this.userId === this.user._id;
  },
  computed: {
    ...mapGetters(['userId', 'roles', 'accessToken']),
    indent() {
      if (this.depth > 1)
        return {
          'padding-left': `${this.depth * 30 - 30}px`,
          transform: 'translateY(-15px)',
          'margin-bottom': '-15px'
        };
      else return { 'padding-left': `${this.depth * 30 - 30}px` };
    }
  },
  watch: {
    checkedAnonymous(val) {
      if (val == true) {
        $('#card-form-report').css('background-color', 'purple');
      } else {
        $('#card-form-report').css('background-color', 'transparent');
      }
    }
  },
  methods: {
    openBoxToReply() {
      this.flagToAnswer = true;
    },
    closeBoxToReply() {
      this.flagToAnswer = false;
    },
    editComment() {
      this.flagEditComment = true;
      this.$emit('post');
    },
    cancelComment() {
      this.flagEditComment = false;
      this.$emit('post');
    },
    async createAnswer({ content, anonymous }) {
      const newComment = {
        userId: this.userId,
        content,
        reviewType: 'reply',
        anonymous
      };
      this.checkedAnonymous = false;
      try {
        const response = await axios.post(
          '/api/comments/' + this.id + '/' + this.reviewId,
          newComment,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` }
          }
        );
        this.$emit('post');
        this.closeBoxToReply();
      } catch (error) {
        console.warn('add review child failed', error);
      }
    },
    async saveComment(content) {
      try {
        this.comment = content;
        const response = await axios.put(
          '/api/comments/' + this.reviewId,
          { content: this.comment },
          {
            headers: { Authorization: `Bearer ${this.accessToken}` }
          }
        );
        this.flagEditComment = false;
      } catch (error) {
        console.warn('failed to update review', error);
      }
    },
    deleteComment() {
      const self = this;
      this.$confirm(
        `This action will remove the selected comment forever, still going on?`,
        this.$t('confirm.title'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          axios
            .delete('/api/comments/' + this.id + '/' + this.reviewId, {
              headers: { Authorization: `Bearer ${this.accessToken}` }
            })
            .then(() => {
              this.$message({
                type: 'success',
                message: this.$t('message.removed')
              });
              this.$emit('post');
            });
        })
        .catch(() => {});
    },
    upvoteComment() {
      console.log('====================================');
      debug('upvoteComment');
      this.scores.upvote = ++this.scores.upvote;
      axios
        .put(
          '/api/comments/' + this.reviewId,
          { upvote: 1, downvote: 0, userId: [this.userId] },
          {
            headers: { Authorization: `Bearer ${this.accessToken}` }
          }
        )
        .then(response => {})
        .catch(err => {
          console.log(err);
        });
    },
    downvoteComment() {
      console.log('====================================');

      debug('downvoteComment');
      this.scores.upvote = --this.scores.upvote;
      axios
        .put(
          '/api/comments/' + this.reviewId,
          { upvote: -1, downvote: 0, userId: [this.userId] },
          {
            headers: { Authorization: `Bearer ${this.accessToken}` }
          }
        )
        .then(response => {})
        .catch(err => {
          console.log(err);
        });
    },
    focusOnCommentedText() {
      debug('focusOnCommentedText');
      const markup = this.reviewId;
      const articleText = $("span[datareview='" + markup + "']");
      if (articleText.length > 0) {
        debug(articleText);
        var offset = 200;
        var delay = 1000;
        $('html, body').animate(
          {
            scrollTop: $(articleText).offset().top - offset
          },
          delay,
          'swing'
        );
      }
    },
    reload() {
      this.$emit('post');
    },
    changeStateReply() {
      //this.flagShowingComment = !this.flagShowingComment
      this.flagShowingComment__ = !this.flagShowingComment__;
    },
    enter: function(el, done) {
      velocity(
        el,
        'slideDown',
        { duration: 400, easing: 'easeInBack' },
        { complete: done }
      );
    },
    leave: function(el, done) {
      velocity(
        el,
        'slideUp',
        { duration: 400, easing: 'easeInBack' },
        { complete: done }
      );
    }
  }
};
</script>
<style>
.el-textarea.is-disabled .el-textarea__inner {
  background-color: white;
  border-color: white;
  color: #333;
  cursor: auto;
  font-family: 'Calibri-regular';
  font-size: 1.1rem;
  font-weight: normal;
  padding: 0px 9px;
}
.card-review {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: auto;
}

.col-content {
  width: 100%;
}
</style>
