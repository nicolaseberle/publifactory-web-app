<template>
  <div class="ui-pagination">
    <span class="current">{{$t('pagination.current')}}&nbsp;{{current}}&nbsp;{{$t('pagination.currentAppend')}}&nbsp;&nbsp;{{$t('pagination.pages')}}&nbsp;{{pages}}&nbsp;{{$t('pagination.pagesAppend')}}</span>
    <div class="navs">
      <a :disabled="current<=1" @click="change(1, current<=1)">
        <span class="iconfont icon-home-page"></span>
      </a>
      <a :disabled="current<=1" @click="change(current-1, current<=1)">
        <span class="el-icon-arrow-left"></span>
      </a>
      <a :disabled="current>=pages" @click="change(current+1, current>=pages)">
        <span class="el-icon-arrow-right"></span>
      </a>
      <a :disabled="current>=pages" @click="change(pages, current>=pages)">
        <span class="iconfont icon-last-page"></span>
      </a>
      <a @click="$emit('page-change', current)"><span class="iconfont icon-refresh"></span></a>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import locales from 'locales/pagination'
export default {
  locales,
  props: {
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1,
      required: true
    }
  },
  computed: {
    ...mapGetters(['globalConfig']),
    pages () {
      return Math.round(this.total / this.globalConfig.pageLimit + 0.5)
    }
  },
  methods: {
    change (targetPage, disabled) {
      if (!disabled) {
        this.$emit('page-change', targetPage)
      }
    },
    reset () {
      this.$emit('page-change', 1)
    }
  }
}
</script>
