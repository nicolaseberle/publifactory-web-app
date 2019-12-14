<template>
      <div class="main-container">
      <el-row>
          <div class="header">
              <h1>Guidelines</h1>
            </div>
        </el-row>
        <el-row>
            <div class="content">
              <el-collapse v-model="activeNames">
                <el-collapse-item name="1">
                  <template slot="title">
                    <h2>rule 1</h2>
                  </template>
                  <div class='version'>Last Modified: 12th November 2019</div>
                  <div class='subcontent'>

                  </div>
                </el-collapse-item>
              </el-collapse>
              <h2></h2>
            </div>
        </el-row>
      </div>
  </template>
  <script>

  export default{
    data () {
      return {
        activeNames: ['1']
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
