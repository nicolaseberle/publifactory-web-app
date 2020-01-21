<template>
  <div>
    <div class="col-vote">
      <div class="vote-icon">
        <div class="arrow-up" v-on:click="upvote()"></div>
      </div>
      <div class="vote-counter">{{score}}</div>
      <div class="vote-icon">
        <div class="arrow-down" v-on:click="downvote()"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'partialReviewVote',
  props: {
    score: Number
  },
  methods: {
    upvote() {
      this.$emit('upvote');
    },
    downvote() {
      this.$emit('downvote');
    }
  }
};
</script>

<style>
.col-vote {
  margin-left: 10px;
  margin-right: 20px;
  text-align: center;
  align-items: center;
}
.vote-icon {
  text-align: center;
  display: block;
  margin-left: 0px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}
.vote-counter {
  display: block;
  text-align: center;
  color: #8e9fbb;
  font-size: 1.2rem;
  font-family: 'DNLTPro-regular';
  margin-left: 0px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}
.arrow-up {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-bottom: 15px solid rgba(0, 150, 0, 1);
}
.arrow-up:hover {
  border-bottom: 15px solid rgba(0, 150, 0, 0.8);
}
.arrow-down {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-top: 15px solid rgba(150, 0, 0, 1);
}
.arrow-down:hover {
  border-top: 15px solid rgba(150, 0, 0, 0.8);
}
</style>