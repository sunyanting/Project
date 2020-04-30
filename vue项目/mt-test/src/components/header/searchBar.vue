<template>
  <div class="search-panel">
     <el-row class="m-header-searchbar">
       <el-col :span="3" class="left">
          <img src="//s0.meituan.net/bs/fe-web-meituan/fa5f0f0/img/logo.png" alt="美团">
       </el-col>
       <el-col :span="15" class="center">
         <div class="wrapper">
           <el-input v-model="searchWord" placeholder="搜索商家或地点" @focus="focus" @blur="blur"></el-input>
           <el-button type="primary" icon="el-icon-search"></el-button>
            <dl class="hotPlace" v-if="isHotPlace">
              <dt>热门搜索</dt>
              <dd v-for ="(item,index) in hotPlaceList" :key="item +'_'+ index">
                <router-link :to="{name:'goods',params: {name: item}}"> {{ item }} </router-link>
              </dd>

            </dl>
            <dl class="searchList" v-if="isSearchList">
              <dd v-for = "(item,index) in searchList" :key="index">
                <router-link :to="{name:'goods',params: {name: item}}">{{ item }}</router-link>
              </dd>
            </dl>
         </div>
         <p class="suggest">
            <router-link v-for ="(item,index) in hotPlaceList" :key="item+'~'+index" :to="{name:'goods',params: {name: item}}">{{ item }}</router-link>

         </p>
       </el-col>
     </el-row>
  </div>
</template>

<script>
export default {
  data(){
    return {
      searchWord: '',
      hotPlaceList:['北京故宫博物院','北京欢乐谷','尚隐·泉都市生活馆','故宫珍宝馆','北京连升商务酒店'],
      searchList: ['火锅店','火锅丸子','火锅鸡','火锅底料','火锅自助'],
      isFocus:false,
    }
  },
  computed: {
    isHotPlace: function(){
      return this.isFocus && !this.searchWord;
    },
    isSearchList: function(){
      return this.isFocus && this.searchWord;
    }
  },
  methods:{
    focus(){
      this.isFocus = true;
    },
    blur(){
      setTimeout(()=>{
        this.isFocus = false;
      },200)

    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/public/header/index.scss';
  @import '@/assets/css/public/header/search.scss';
</style>
