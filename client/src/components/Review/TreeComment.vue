<template>
  <div>

      <div :style="indent">
        <transition v-on:enter="enter" v-on:leave="leave">
        <article v-if='label && (flagShowingComment || depth<2)'>
          <header>
            <a v-if='anonymousFlag==false' href="#" title="OSPR's profile">{{ user.firstname}} {{ user.lastname}}</a>
            <a v-if='anonymousFlag' href="#" title="OSPR's profile">Reviewer 1</a>
            <p class="font-dnltp-regular font-style-normal"><time datetime="2017-02-23">{{ creationDate  | moment("DD/MM/YYYY - LT") }}</time></p>
            <p class="font-dnltp-regular font-style-normal"><time datetime="2017-02-23"></time></p>
            <div v-show="reviewRequest !='None' ">
              <el-tag class="no-revision" v-if="reviewRequest == 'No revision'" type="success">{{ reviewRequest }}</el-tag>
              <el-tag class="minor-revision" v-if="reviewRequest == 'Minor revision'" type="warning">{{ reviewRequest }}</el-tag>
              <el-tag class="major-revision" v-if="reviewRequest == 'Major revision'" type="danger">{{ reviewRequest }}</el-tag>
              <el-tag class="rejection" v-if="reviewRequest == 'Rejection'" type="danger">{{ reviewRequest }}</el-tag>
              <el-tag class="simple-comment" v-if="reviewRequest == 'Simple comment'" type="danger">{{ reviewRequest }}</el-tag>
            </div>
        </header>
          <section>
            <div class='card-review'>
              <div class='col-vote'>
                <div class='vote-icon'>
                  <!--<el-button plain type="" icon="el-icon-caret-top" circle></el-button>-->
                  <!--<i class='el-icon-caret-top'></i>-->
                  <div class="arrow-up"  v-on:click="upvoteComment()"></div>
                </div>
                <div class='vote-counter'>
                  {{scores.upvote}}
                </div>
                <div class='vote-icon'>
                  <!--<i class='el-icon-caret-bottom'></i>-->
                  <!--<el-button plain type="" icon="el-icon-caret-bottom" circle></el-button>-->
                  <div class="arrow-down" v-on:click="downvoteComment()"></div>
                </div>
              </div>
              <div class='col-content'>
                <div data-review="report.uuidComment" v-on:click="focusOnCommentedText()">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 10}"
                    placeholder="Please input"
                    v-model="comment" :disabled='flagEditComment == false'>
                  </el-input>
                  <!--<div v-if='selectedComment==true'></div>-->
                </div>
              </div>
            </div>
          </section>
          <footer class='menu-icon-footer'>
            <!--<footer class="grid-header">
            </footer>-->
            <!--<el-button plain type="success" icon="el-icon-arrow-up" circle></el-button>
            <el-button plain type="warning" icon="el-icon-arrow-down" circle></el-button>-->
            <el-button v-show="flagEditComment == false & reviewRequest !='None'" icon="el-icon-share" circle></el-button>
            <el-button v-show='flagEditComment == false' v-on:click='openBoxToReply()' circle><font-awesome-icon icon="reply" /></el-button>
            <el-button v-show='flagEditComment == true' icon="el-icon-close" type="primary" v-on:click='cancelComment()' circle ></el-button>
            <el-button v-show='flagEditComment == true' icon="el-icon-check" type="success" v-on:click='saveComment()' circle ></el-button>
            <el-button v-show='flagEditComment == false' icon="el-icon-edit" v-on:click='editComment()' circle ></el-button>
            <el-button type='warning' plain icon="el-icon-delete" style='float:right;' v-on:click='deleteComment()' circle></el-button>

          </footer>

            <footer v-if="reviewRequest == 'Simple comment' && nodes.length>0" class='reply-footer simple-comment'>
                <a v-if='!flagShowingComment__' @click='changeStateReply()'>Show replies({{nodes.length}})  <i class="el-icon-arrow-down"></i></a>
                <a v-if='flagShowingComment__' @click='changeStateReply()'>Hide replies({{nodes.length}})  <i class="el-icon-arrow-up"></i></a>
            </footer>
            <footer  v-if="reviewRequest == 'Minor revision' && nodes.length>0" class='reply-footer minor-revision'>
                <a v-if='!flagShowingComment__' @click='changeStateReply()'>Show replies({{nodes.length}})  <i class="el-icon-arrow-down"></i></a>
                <a v-if='flagShowingComment__' @click='changeStateReply()'>Hide replies({{nodes.length}})  <i class="el-icon-arrow-up"></i></a>
            </footer>
            <footer v-if="reviewRequest == 'Major revision' && nodes.length>0" class='reply-footer major-revision'>
                <a v-if='!flagShowingComment__' @click='changeStateReply()'>Show replies({{nodes.length}})  <i class="el-icon-arrow-down"></i></a>
                <a v-if='flagShowingComment__' @click='changeStateReply()'>Hide replies({{nodes.length}})  <i class="el-icon-arrow-up"></i></a>
            </footer>
            <footer v-if="reviewRequest == 'Rejection' && nodes.length>0" class='reply-footer rejection'>
                <a v-if='!flagShowingComment__' @click='changeStateReply()'>Show replies({{nodes.length}})  <i class="el-icon-arrow-down"></i></a>
                <a v-if='flagShowingComment__' @click='changeStateReply()'>Hide replies({{nodes.length}})  <i class="el-icon-arrow-up"></i></a>
            </footer>
            <footer v-if="reviewRequest == 'No revision' && nodes.length>0" class='reply-footer no-revision'>
                <a v-if='!flagShowingComment__' @click='changeStateReply()'>Show replies ({{nodes.length}})  <i class="el-icon-arrow-down"></i></a>
                <a v-if='flagShowingComment__' @click='changeStateReply()'>Hide replies({{nodes.length}})  <i class="el-icon-arrow-up"></i></a>
            </footer>

          <el-card v-show='flagToAnswer == true' style='margin-top:10px'>

            <el-row v-show='checkedAnonymous' type="flex" class="row-bg" style="margin: 0px 0 5px 0;align-items: center;">
              <div style='font-family:"Calibri-bold";color:#f3f3f3;'>Anonymous peer review</div>
            </el-row>
            <el-row class="row-bg" style="margin: 5px 0 20px 0;align-items: center;">
              <el-checkbox v-model="checkedAnonymous"><svg-icon icon-class='private'/></el-checkbox>
              <div style='float:right'>
                <el-button type="" class='button-submit' v-on:click="closeBoxToReply()" icon="el-icon-close">Cancel</el-button>
                <el-button type="primary"class='button-submit' v-on:click="createAnswer()" icon="el-icon-upload2">Reply</el-button>
              </div>
            </el-row>
            <el-row type="flex" class="row-bg" justify="center">

                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="Please input"
                  v-model="editAnswer">
                </el-input>

            </el-row>

          </el-card>
        </article>

      </transition>
      </div>

      <tree-comment
        v-for="(node,key) in nodes"
        :key="key"
        :uuidComment="node.uuidComment"
        :nodes="node.childComment"
        :label="node.content"
        :scores="node.scores"
        :creationDate="node.creationDate"
        :reviewRequest="node.reviewRequest"
        :anonymousFlag="node.anonymousFlag"
        :user="node.userId"
        :flagShowingComment="flagShowingComment__"
        :depth="depth + 1"
        v-on:post='reload'
      >
      </tree-comment>

  </div>
</template>
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import axios from 'axios'
import { mapGetters } from 'vuex'
import velocity from 'velocity-animate'
var uuidv4 = require('uuid/v4');

export default {
  props: {
  uuidComment: {type: String},
  label: {type: String},
  nodes: {type: Array,
          validator: function (value) {
            if(typeof value == "") {
              return []
            }
            else {
              return value
            }

    }},
  flagShowingComment: {type: Boolean},
  depth: {type: Number},
  creationDate: String,
  anonymousFlag: {type: Boolean},
  reviewRequest: {type: String},
  scores:{
    type:Object,
    validator: function (value) {
      if(value) {
        return value
      }
      else {
        return ""
      }
    }
  },
  user: {
    type:Object,
    validator: function (value) {
      if(value) {
        return value
      }
      else {
        return ""
      }
    }
  }
  },
  name: 'tree-comment',
  components:{'font-awesome-icon': FontAwesomeIcon},
  data() {
    return {
      id: '',
      flagEditComment: false,
      flagToAnswer: false,
      editAnswer: '',
      _originalComment: Object,
      checkedAnonymous: false,
      errors: {message: ''},
      comment : this.label,
      flagShowingComment__ : false
    }
  },
  created (){
    this.id = this.$route.params && this.$route.params.id

  },
  computed: {
    ...mapGetters([
      'userId',
      'roles',
      'accessToken'
    ]),
    indent() {
      if(this.depth>1)
        return { "padding-left": `${this.depth * 30-30}px` , "transform" : "translateY(-15px)","margin-bottom":"-15px" }
      else
        return { "padding-left": `${this.depth * 30-30}px` }
    }
  },
  watch: {
    checkedAnonymous (val) {
      if(val==true){
        $("#card-form-report").css('background-color','purple');
      }else{
        $("#card-form-report").css('background-color','transparent');
      }

    }

  },
  methods: {
    openBoxToReply () {
      this.flagToAnswer = true
    },
    closeBoxToReply () {
      this.flagToAnswer = false
    },
    editComment () {
      this._originalComment = Object.assign({}, this.nodes)
      this.flagEditComment = true
      this.$emit('post')
    },
    cancelComment () {
      Object.assign(this.nodes, this._originalComment)
      this.flagEditComment = false
      this.$emit('post')
    },
    createAnswer ( ) {
      const uuid = String(uuidv4())

      const now = new Date().getTime()
      const newComment = {
        date: now,
        userId : this.userId,
        content : String(this.editAnswer),
        uuidComment: String(uuid),
        reviewRequest : 'None',
        commentFlag : false, //it's a review,
        anonymousFlag: this.checkedAnonymous,
        uuidParentComment: this.uuidComment
      };
      this.checkedAnonymous = false

      axios.post('/api/comments/'  + this.id + '/comment/' + this.uuidComment + '/answer', newComment, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      })
      .then(response => {
        const response__ = response.data;
        this.errors.message = 'createReport success ';
        this.$emit('post')
        this.closeBoxToReply()
      })
      .catch(err => {
        this.errors.message = 'createReport fails';
      });
    },
    saveComment () {
      axios.put('/api/comments/'  + this.id + '/comments/' + this.uuidComment + '/content',{'content':this.comment}, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      })
        .then(response => {
      }).catch(err => {
        console.log(err)
      })
      this.flagEditComment = false
      this.editAnswer = ''
      //this.selectedComment = -1
    },
    deleteComment () {
      const self = this
      this.$confirm(`This action will remove the selected comment forever, still going on?`, this.$t('confirm.title'), {
        type: 'warning'
      }).then(() => {
        axios.delete('/api/comments/'+this.id+'/comments/'+ this.uuidComment, {
          headers: {'Authorization': `Bearer ${this.accessToken}`}
        }).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('message.removed')
          })
          this.$emit('post')
        })
      }).catch(() => {})
    },
    upvoteComment (ev) {
      console.log('upvoteComment')
      this.scores.upvote = ++this.scores.upvote
      axios.put('/api/comments/'  + this.id + '/comments/' + this.uuidComment,{"upvote": 1, "downvote": 0 , "userId":[this.userId]}, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      })
        .then(response => {
      }).catch(err => {
        console.log(err)
      })
    },
    downvoteComment (ev,idComment,key) {
      console.log('downvoteComment')
      this.scores.upvote = --this.scores.upvote
      axios.put('/api/comments/'  + this.id + '/comments/' + this.uuidComment,{"upvote": -1, "downvote": 0 , "userId":[this.userId]}, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      })
        .then(response => {
      }).catch(err => {
        console.log(err)
      })
    },
    focusOnCommentedText () {
      console.log('focusOnCommentedText')
      const markup = this.uuidComment
      const articleText = $("span[datareview='" + markup + "']")
      if (articleText.length > 0){
        console.log(articleText)
        var offset = 200
        var delay = 1000
        $('html, body').animate({
          scrollTop: $(articleText).offset().top - offset
        }, delay, 'swing')
      }

    },
    reload () {
      this.$emit('post')
    },
    changeStateReply()
    {
      //this.flagShowingComment = !this.flagShowingComment
      this.flagShowingComment__ = !this.flagShowingComment__
    },
    enter: function (el, done) {
      velocity(el, 'slideDown', { duration: 400, easing: 'easeInBack' },
        { complete: done })
    },
    leave: function (el, done) {
      velocity(el, 'slideUp', { duration: 400, easing: 'easeInBack' },
        { complete: done })
    }
  }
}
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
.card-review{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: auto;

}
.col-vote{
  margin-left: 10px;
  margin-right: 20px;
  text-align: center;
  align-items: center;
}
.vote-icon{
  text-align: center;
  display: block;
  margin-left: 0px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}
.vote-counter{
  display: block;
  text-align: center;
  color: #8E9FBB;
  font-size: 1.2rem;
  font-family: 'DNLTPro-regular';
  margin-left: 0px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.col-content{
  width:100%;
}

.arrow-up {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-bottom: 15px solid rgba(0,150,0,1);
}
.arrow-up:hover {
  border-bottom: 15px solid rgba(0,150,0,0.8);
}
.arrow-down {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-top: 15px solid rgba(150,0,0,1);
}
.arrow-down:hover {
  border-top: 15px solid rgba(150,0,0,0.8);
}



</style>
