<template>
  <div class="dashboard-container">

    <el-header>
      <h3>Publisciences</h3>
      <div class="justify-right">
        <div class="collections">
          <i class="el-icon-reading"></i>
          <p>Collections</p>
        </div>
        <p>Login</p>
        <div class="circle_log">
          <i class="el-icon-user-solid"></i>
        </div>
      </div>
    </el-header>

    <el-main>
      <el-row :gutter='30' style='margin-top=80px;'>

        <el-col id="colresize1" ref="colresize1" :span='8' class="col-left">
          <img src="https://loremflickr.com/cache/resized/65535_40784877513_ab48f540c1_z_500_400_nofilter.jpg" alt="fake image">
          <article class="main_art">
            <h3>Bee species more resistant to climate change are the most agressive</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium arcu neque, et congue ipsum pharetra eu. Sed viverra semper rutrum.</p>
            <p class="references">M. Eberlé in Publisciences - Bio Evolution</p>
            <p class="references">December 2019</p>
          </article>
        </el-col>

        <el-col id="colresize2" ref="colresize2" :span='16' class="col-right">
          <article class="side_art right_green">
            <img src="https://placekitten.com/500/400" alt="fake image">
            <div class="text_art">
              <h3>Bee species more resistant to climate change are the most agress...</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium arcu neque, et congue ipsum. Maecenas pretium arcu neque, et congue ipsum pharetra eu.</p>
              <p class="references">M. Eberlé in Publisciences - Bio Evolution</p>
              <p class="references">December 2019</p>
            </div>
          </article>
          <article class="side_art right_green">
            <img src="https://placekitten.com/1000/800" alt="fake image">
            <div class="text_art">
              <h3>Bee species more resistant to climate change are the most agress...</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium arcu neque, et congue ipsum. Maecenas pretium arcu neque, et congue ipsum pharetra eu.</p>
              <p class="references">M. Eberlé in Publisciences - Bio Evolution</p>
              <p class="references">December 2019</p>
            </div>
          </article>
          <article class="side_art right_orange">
            <img src="https://placekitten.com/750/600" alt="fake image">
            <div class="text_art">
              <h3>Bee species more resistant to climate change are the most agress...</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium arcu neque, et congue ipsum. Maecenas pretium arcu neque, et congue ipsum pharetra eu.</p>
              <p class="references">M. Eberlé in Publisciences - Bio Evolution</p>
              <p class="references">December 2019</p>
            </div>
          </article>
        </el-col>

      </el-row>
      <el-row :gutter='30' class="second-row">
        <el-col :span='18' id="colresize3" ref="colresize3">
          <article class="side_art2 right_orange" style="background: inherit;">
            <img src="https://placekitten.com/1500/1200" alt="fake image">
            <div class="text_art">
              <h3>Bee species more resistant to climate change are the most agress...</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium arcu neque, et congue ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium arcu neque, et congue ipsum.</p>
              <p class="references">M. Eberlé in Publisciences - Bio Evolution</p>
              <p class="references">December 2019</p>
            </div>
            <div class="icons">
              <i class="el-icon-check" v-on:click="validateart"></i>
              <i class="el-icon-s-flag"></i>
              <i class="el-icon-close" v-on:click="maskgrey"></i>
              <i class="el-icon-star-off hidden" v-on:click="switchfav"></i>
              <i class="el-icon-delete-solid hidden" style="z-index:1000" v-on:click="deleteart"></i>
            </div>
          </article>
          <article class="side_art2 right_green">
            <img src="https://placekitten.com/250/200" alt="fake image">
            <div class="text_art">
              <h3>Bee species more resistant to climate change are the most agress...</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium arcu neque, et congue ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium arcu neque, et congue ipsum.</p>
              <p class="references">M. Eberlé in Publisciences - Bio Evolution</p>
              <p class="references">December 2019</p>
            </div>
            <div class="icons">
              <i class="el-icon-star-off" v-on:click="switchfav"></i>
            </div>
          </article>
          <article class="side_art2 right_green">
            <img src="https://placekitten.com/2500/2000" alt="fake image">
            <div class="text_art">
              <h3>Bee species more resistant to climate change are the most agress...</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium arcu neque, et congue ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pretium arcu neque, et congue ipsum.</p>
              <p class="references">M. Eberlé in Publisciences - Bio Evolution</p>
              <p class="references">December 2019</p>
            </div>
            <div class="icons">
              <i class="el-icon-star-on" v-on:click="switchfav"></i>
            </div>
          </article>
        </el-col>

        <el-col :span='6'  id="colresize4" ref="colresize4" class="col-work">
          <h2>Top 10 Most exciting work</h2>
          <ul>
            <li><span>01</span> Lorem ipsum dolor sit amet</li>
            <li><span>02</span> Lorem ipsum dolor sit amet amet amet</li>
            <li><span>03</span> Lorem ipsum dolor sit amet</li>
            <li><span>04</span> Lorem ipsum dolor sit amet</li>
            <li><span>05</span> Lorem ipsum dolor sit amet</li>
            <li><span>06</span> Lorem ipsum dolor sit amet</li>
            <li><span>07</span> Lorem ipsum dolor sit amet</li>
            <li><span>08</span> Lorem ipsum dolor sit amet</li>
            <li><span>09</span> Lorem ipsum dolor sit amet</li>
            <li><span>10</span> Lorem ipsum dolor sit amet</li>
          </ul>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      temp: true
    }
  },
  methods: {
    switchfav(event){
    	if (event.target.className == "el-icon-star-off") {
      	event.target.className = "el-icon-star-on";
      }
      else {
      	event.target.className = "el-icon-star-off";
      }
    },
    validateart(event){
      event.target.parentNode.parentNode.className = "side_art2 right_green"
      event.target.className = "el-icon-check hidden"
      event.target.nextElementSibling.className = "el-icon-s-flag hidden"
      event.target.nextElementSibling.nextElementSibling.className = "el-icon-close hidden"
      event.target.nextElementSibling.nextElementSibling.nextElementSibling.className = "el-icon-star-off"
    },
    maskgrey(event){
      event.target.className = "el-icon-close hidden"
      event.target.previousElementSibling.previousElementSibling.className = "el-icon-check hidden"
      event.target.previousElementSibling.className = "el-icon-s-flag hidden"
      event.target.nextElementSibling.className = "el-icon-star-off hidden"
      event.target.nextElementSibling.nextElementSibling.className = "el-icon-delete-solid"
      event.target.parentNode.parentNode.className = "side_art2 right_red mask"
    },
    deleteart(event){
      event.target.parentNode.parentNode.className = "side_art2 hidden"
    },
    onResize() {
      console.log(window.innerWidth);
      if (window.innerWidth <= 425) {
        // console.log(this.$refs.colresize1.$el.className);
        this.$refs.colresize1.$el.className = "col-left el-col el-col-30"
        this.$refs.colresize2.$el.className = "col-left el-col el-col-30"
        this.$refs.colresize3.$el.className = "col-left el-col el-col-30"
        this.$refs.colresize4.$el.className = "col-left el-col el-col-30"
      } else if (window.innerWidth <= 840) {
        this.$refs.colresize1.$el.className = "col-left el-col el-col-14"
        this.$refs.colresize2.$el.className = "col-left el-col el-col-10"
        this.$refs.colresize3.$el.className = "col-left el-col el-col-30"
        this.$refs.colresize4.$el.className = "col-left el-col el-col-30"
      } else {
        this.$refs.colresize1.$el.className = "col-left el-col el-col-8"
        this.$refs.colresize2.$el.className = "col-left el-col el-col-16"
        this.$refs.colresize3.$el.className = "col-left el-col el-col-18"
        this.$refs.colresize4.$el.className = "col-left el-col el-col-6"
      }
    }
  },
  created() {
    window.addEventListener('resize', this.onResize)
    this.onResize();
  },
  mounted() {
    this.onResize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style>

* {
  font-family: 'DNLTPro-regular';
  box-sizing: border-box;
}

ul {
  list-style: none;
  padding-left: 0;
}

.mask {
  background: inherit;
}

.mask:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: inset 0 0 2000px rgba(241, 241, 241, 0.8);
    filter: blur(5px);
  background: inherit;
}

.hidden {
  display: none!important;
  visibility: hidden;
}

.app-wrapper > .el-row {
  display: none!important;
}

.el-header {
  height: 100px;
  border-bottom: 1px solid #C3CFD9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 40px;
}
.el-header h3, .el-header p {
  font-family: 'DNLTPro-bold'!important;
}

.justify-right, .collections {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.justify-right > * {
  margin-right: 20px;
}

.collections > i {
  margin-right: 5px;
  font-size: 20px;
}

.circle_log {
  width: 40px;
  height: 40px;
  background-color: #DFE7ED;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle_log > i {
  font-size: 22px;
  color: #9EADBA;
}

.el-main {
  max-width: 1140px;
  padding: 0px 20px;
  margin: 40px auto 0;
}

.el-col {
  padding: 0 10px!important;
}

.col-left img, .col-middle img, .col-right img {
  width: 100%;
}

article > p {
  line-height: 20px;
}

article > h3 {
  margin: 5px 0;
  font-size: 18px;
  line-height: 25px;
}

.references {
  color: #788896;
  font-size: 12px!important;
  line-height: 13px!important;
  margin: 0!important;
}

.side_art {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 20px;
}

.side_art> img {
  width: 25%;
  height: 100%;
}

.side_art> div, .side_art2> div {
  padding-left: 10px;
}

.side_art p, .side_art2 p {
  margin: 19px 0;
  line-height: 20px;
  font-size: 15px;
}

.side_art h3, .side_art2 h3 {
  margin: 0 0 5px;
  font-size: 15px;
  line-height: 20px;
}

.right_green {border-right: 8px solid #A2DED8;}
.right_orange {border-right: 8px solid #F8DBB4;}
.right_red {border-right: 8px solid lightgray;}

.second-row {
  margin-top: 20px;
}

.second-row p {
  margin: 14px 0;
}

.side_art2 {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 20px;
  position: relative;
}

.side_art2> img {
  width: 20%;
  height: 100%;
}

.icons {
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 10px;
}

.icons > * {
  font-size: 20px;
  cursor: pointer;
  color: #788896;
}

.col-work h2 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid black;
}

ul span {
  font-size: 20px;
  color: #788896;
  margin-right: 20px;
}

ul * {
  font-family: 'DNLTPro-bold';
}

.text_art {
  padding-right: 10px;
}

@media (max-width: 1100px) {
  .side_art h3, .side_art2 h3 {
    margin: 0 0 5px;
    font-size: 12px;
    line-height: 20px;
  }

  .side_art p, .side_art2 p {
    margin: 8px 0;
    line-height: 17px;
    font-size: 12px;
  }

  .references {
    color: #788896;
    font-size: 9px!important;
    line-height: 13px!important;
    margin: 0!important;
  }

  .col-work h2 {
    font-size: 16px;
    line-height: 24px;
  }

  ul span {
    font-size: 16px;
    margin-right: 5px;
  }

  ul li {
    font-size: 13px;
    line-height: 23px;
  }
}

@media (max-width: 840px) {
  .side_art {
    align-items: end;
    flex-direction: column;
  }

  .side_art {
      padding-right: 10px;
  }

  .side_art> img {
    display: none;
  }

  .text_art {
    padding: 0!important;
  }

  .icons {
    position: absolute;
    top: 60px;
    left: -10px;
    display: flex;
    flex-direction: column;
  }

  .icons > * {
    padding-top: 5px;
  }

  .side_art2 {
    padding-right: 10px;
  }

  .side_art2> img {
    margin-right: 10px;
  }
  
  #colresize4 {
    text-align: center;
    display: block;
    margin: 0 auto;
    width: 100%;
  }
}

@media (max-width: 425px) {
    #colresize2 {
      margin-top: 20px;
    }

}

</style>
