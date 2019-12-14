<template>
      <div class="main-container">
      <el-row>
        <el-select v-model="value" placeholder="Select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <el-row>
        <component :is="currentCGU"/>
      </el-row>
      </div>
</template>
<script>
import currentCGU_fr from './cgu_fr'
import currentCGU_en from './cgu_en'
export default{
  components:{currentCGU_fr,currentCGU_en},
  data () {
    return {
      options: [{
     value: 'French',
     label: 'Français'
     }, {
       value: 'English',
       label: 'English'
     }],
     value: 'Français',
     currentCGU: 'currentCGU_fr'
    }
  },
  watch:{
    value(new_lang){
      if(new_lang==='French')
       this.currentCGU = currentCGU_fr
      else{
        this.currentCGU = currentCGU_en
      }
    }
  }

}
</script>
<style>
.main-container{
  max-width: 1140px;
}
.header{
  text-align: center;
  margin-bottom: 50px;
}
.header p{text-align:left;font-size:1rem;}
.header h1{font-family: 'DNLTPro-bold';}
.header h2{font-family: 'DNLTPro-medium-italic';text-align:left;}

.content{
  text-align: left;

}
.content h2{font-family: 'DNLTPro-bold';font-size:1.2rem;}
.content p{text-align:left;}

.version {
  font-family: 'DNLTPro-light-italic';
  font-size: 1rem;
  text-align:left;
}
.subcontent{
  font-size: 1rem;
}
</style>
