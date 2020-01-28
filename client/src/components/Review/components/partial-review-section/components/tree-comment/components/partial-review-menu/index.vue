<template>
  <footer class="menu-icon-footer">
    <el-button v-show="isEditing == false & reviewType !='reply'" icon="el-icon-share" circle></el-button>
    <el-button v-show="isEditing == false" v-on:click="$emit('open')" circle>
      <font-awesome-icon icon="reply" />
    </el-button>
    <el-button
      v-if="isUserOwner"
      v-show="isEditing == false"
      icon="el-icon-edit"
      v-on:click="$emit('edit')"
      circle
    ></el-button>
    <el-button
      v-if="isUserOwner"
      v-show="!isEditing"
      type="warning"
      plain
      icon="el-icon-delete"
      style="float:right;"
      v-on:click="$emit('remove')"
      circle
    ></el-button>
  </footer>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  name: 'partialReviewMenu',
  props: {
    isEditing: Boolean,
    reviewType: String,
    isUserOwner: Boolean
  },
  components: {
    'font-awesome-icon': FontAwesomeIcon
  }
};
</script>

<style scoped>
</style>