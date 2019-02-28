<template>
  <div>
    <b>#{{item.id}}</b>
    <span>{{item.name}}</span>
    <abbr>{{item.description}}</abbr>
  </div>
</template>

<script>
import 'v-autocomplete/dist/v-autocomplete.css'
export default {
  props: {
    item: { required: true },
    searchText: { required: true }
  }
}
</script>
