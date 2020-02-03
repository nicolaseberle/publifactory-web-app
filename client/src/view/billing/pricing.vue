<template>
  <div class='app-container'>
    <div class='title-pricing'>
      <h1>Pricing</h1>
    </div>
  <div class='wrapper'>
  <div class='package'>
    <div class='name'>Freemium</div>
    <div class='price'>€0</div>
    <div class='trial'>Free trial</div>
    <hr>
    <div class='list-item-content'>
    <ul>
      <li><i class="el-icon-check"></i>
        <b>Unlimited</b> research
      </li>
      <li><i class="el-icon-check"></i>
        <b>5 invitations</b>
      </li>
      <li><i class="el-icon-check"></i>
        <b>Unlimited</b> access to your board
      </li>
    </ul>
    </div>
    <div class='footer-pricing'>
      <el-button class='blue-button' round>Free Trial</el-button>
    </div>
  </div>
  <div class='package brilliant'>
    <div class='name'>Associate</div>
    <div class='price'>€1</div>
    <div class='trial'>Pay per use</div>
    <hr>
    <div class='list-item-content'>
    <ul>
      <li><i class="el-icon-check"></i>
        <b>Unlimited</b> research
      </li>
      <li><i class="el-icon-check"></i>
        <b>Unlimited</b> invitation
      </li>
      <li><i class="el-icon-check"></i>
        <b>Unlimited</b> access to your board
      </li>
    </ul>
    </div>
    <div class='footer-pricing'>
      <el-button class='blue-button' round>Update</el-button>
    </div>
  </div>
  <div class='package'>
    <div class='name'>Publisher</div>
    <div class='price'>€0.3-1</div>
    <div class='trial'>Pay per use</div>
    <hr>
    <div class='list-item-content'>
    <ul>
      <li><i class="el-icon-check"></i>
        <b>Negociable</b> by volume
      </li>
      <li><i class="el-icon-check"></i>
        <b>Unlimited</b> research
      </li>
      <li><i class="el-icon-check"></i>
        <b>Unlimited</b> invitation
      </li>
      <li><i class="el-icon-check"></i>
        <b>Unlimited</b> collaborator
      </li>
    </ul>
    </div>
    <div class='footer-pricing'>
      <el-button class='blue-button' round>Send a request to your editor</el-button>
    </div>
  </div>
</div>
</div>
</template>
<script>
export default{

}
</script>
<style>
/*
 * Developer: Alireza Eskandarpour Shoferi
 * Designer: Wouter de Bres (dribbble.com/wdeb)
 *
 * Distributed under the terms of the MIT license
 * https://opensource.org/licenses/MIT
 */

.wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -220px 0 0 -468px;
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
    color: #333;
    font-size: 15px;
}
.package {
    box-sizing: border-box;
    width: 300px;
    height: 500px;
    border: 3px solid #e8e8e8;
    border-radius: 7px;
    display: inline-block;
    padding: 24px;
    text-align: center;
    float: left;
    transition: margin-top .5s linear;
    position: relative;
    margin-right: 11px;
}
.package:hover {
    margin-top: -30px;
    transition: margin-top .3s linear;
}
.name {
    color: #565656;
    font-weight: 700;
    font-size: 1.5rem;
    margin-top: -5px;
    margin-bottom: 10px;
}
.price {

    margin-top: 30px;
    margin-bottom: 30px;
    font-weight: bold;
    font-size: 3rem;
}
.price::after {
    content: " / request";
    font-weight: normal;
    font-size: 1rem;
}
hr {
    background-color: #dedede;
    border: none;
    height: 1px;
}
.trial {
    font-size: .8rem;
    font-weight: 600;
    padding: 2px 21px 2px 21px;
    color: rgb(48, 65, 86);
    border: 1px solid #e4e4e4;
    display: inline-block;
    border-radius: 15px;
    background-color: white;
    position: relative;
    bottom: -25px;
}

.list-item-content ul {
    list-style: none;
    padding: 0 0 0 0;
    text-align: left;
    margin-top: 40px;
    margin-bottom: 30px;
}

.list-item-content li {
    margin-bottom: 20px;
}

.list-item-content li::before {
    font-size: 1.3rem;
    color: rgb(48, 65, 86);
    margin-right: 3px;
}

.brilliant {
    border-color: rgb(48, 65, 86);
}

.footer-pricing{
  margin: 0 auto;
  text-align: center;
}
/* Triangle */
/*
.brilliant::before {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 64px 64px 0 0;
    border-color: #3bc6b8 transparent transparent transparent;
    position: absolute;
    left: 0;
    top: 0;
    content: "";
}
.brilliant::after {

    content: "\f00c";
    color: white;
    position: absolute;
    left: 9px;
    top: 6px;
    text-shadow: 0 0 2px #37c5b6;
    font-size: 1.4rem;
}*/
 .blue-button {
   background-color: rgb(48, 65, 86);
   color : #F4F4F4;
 }
 .title-pricing h1{
   margin-left: 20px;
   font-family: "DNLTPro-regular";
   text-align: center;
   line-height: 1.5;
   font-size: 2.5rem;
 }
</style>
