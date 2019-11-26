<template>
  <el-dropdown trigger="click" class="international" @command="actionHandleCommand">
    <div>
      <el-button class="el-button-action" icon="el-icon-more" circle></el-button>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(action, index) in actions"
        :key="index"
        :command="action.command"
      >{{action.name}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'actionButton',
  props: {
    actions: Array
  },
  methods: {
    actionHandleCommand(command) {
      command();
    }
  }
};
</script>
