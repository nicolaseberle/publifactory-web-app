<template id="accordion">
  <ul>
    <li v-for="(item,key) in items" @click="openItem(item)">
      <div class="arrow_box" :class="{'arrow_box--open' : item.display}"></div>
      {{item.title}}
      <transition v-on:enter="enter" v-on:leave="leave">
        <div v-show="item.display" class="item">
           {{item.content}}
        </div>
      </transition>
    </li>
  </ul>
</template>

<script>
  import velocity from 'velocity-animate'

  export default {
  name: 'accordion',
  template: '#accordion',
  props: ['items'],
  methods: {
    openItem: function (item) {
      item.display = !item.display
    },
    setClass: function (item) {
      if (item.display === true) {
        return 'open'
      }
      return 'close'
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
@import 'https://fonts.googleapis.com/css?family=Cantata+One|Noto+Sans:400,400i,700,700i&subset=latin-ext';

li {
  list-style:none;
  cursor:pointer;
  font: 22px/48px 'Cantata One', serif;
}
li>div {
  font: 14px/22px 'Noto Sans', serif;
  padding-bottom:20px;
}

.item {
  overflow:hidden;
  width:600px;
}

.arrow_box {
  width:10px;
  height:10px;
  transition: all .3s;
  padding-bottom:0px;
  position:absolute;
  margin:20px 0px 0px -15px;

}


.arrow_box:after, .arrow_box:before {
	border: solid transparent;
	content: " ";
	position: absolute;
}

.arrow_box:after {
	border-width: 5px;
}
.arrow_box:before {
	border-left-color: #000;
	border-width: 5px;
}

.arrow_box--open{
   transform: rotateZ(90deg);
   transform-origin: 50% 50%;
}
</style>
