<template>
  <div class="ui-data-table flex flex-1 flex-column">
    <div v-if="$slots.toolbar" class="toolbar">
      <slot name="toolbar"></slot>
    </div>
    <div class="data-table flex flex-1" ref="wrapper" :style="{margin:full?'1rem -1rem':'0'}">
      <slot></slot>
      <transition name="fade">
        <content-loading :show="pending"></content-loading>
      </transition>
    </div>
    <pagination v-if="showPagination" :current="page.current"
      :total="page.total||0" @page-change="onPageChange"
      :style="{margin:full?'2rem -1rem 1rem':'.5rem 0'}"></pagination>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { merge } from 'lodash'
import ContentLoading from 'components/ContentLoading'
import Pagination from 'components/Pagination'

export default {
  props: {
    rowKey: String,
    showPagination: {
      type: Boolean,
      default: true
    },
    // fully fill the page?(By add -1rem margin)
    full: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      pending: false,
      page: {
        current: 1,
        limit: 0,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['globalConfig'])
  },
  watch: {
    'globalConfig.pageLimit' (val) {
      this.page.current = 1
      this.page.limit = val
      this.$emit('page-change', 1)
    }
  },
  components: {
    ContentLoading,
    Pagination
  },
  methods: {
    query (resource, current, ...rest) {
      return this.customQuery(resource, 'query', current, ...rest)
    },
    customQuery (resource, method, current, ...rest) {
      current = current || this.page.current
      this.pending = true
      const condition = merge(this.showPagination ? { page: { current, limit: this.globalConfig.pageLimit }} : {}, ...rest)
      return resource[method](condition)
      .then(res => res.json()).then(data => {
        this.pending = false
        this.page.current = current || this.page.current
        this.page.total = data.page ? data.page.total : data.results.length
        return data.results || data
      })
    },
    onPageChange (targetPage) {
      this.$emit('page-change', targetPage)
    }
  },
  created () {
    this.page.limit = this.globalConfig.pageLimit
  }
}
</script>
