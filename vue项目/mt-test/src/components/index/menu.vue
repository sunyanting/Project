<template>
  <div class="m-menu">
    <dl class="nav" @mouseleave="menuLeave">
      <dt>全部分类</dt>
      <dd v-for="(item,index) in menuList" @mouseenter="menuEnter(item)">
        <i :class="item.icon"></i>
        {{ item.title }}
        <span class="arrow"></span>
      </dd>
    </dl>
    <div v-if="curDetail" class="detail" @mouseenter="detailEnter" @mouseleave="detailLeave">
      <template v-for="(item,index) in curDetail.children">
        <h4 :key="index">{{ item.title }}</h4>
        <span v-for="(item,index) in item.children" :key="item+'_'+index">{{ item }}</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      curDetail: null,
      menuList: [{
        title: '美食',
        icon: 'food',
        children: [{
          title: '美食',
          children: ['代金券','甜点饮品','火锅','自助餐','小吃快餐',
          '日韩料理','西餐','聚餐宴请','烧烤烤肉','东北菜','川湘菜','江浙菜']
        }]
      },
      {
        title: '外卖',
        icon: 'takeout',
        children: [{
          title: '外卖',
          children: ['美团外卖']
        }]
      },
      {
        title: '酒店',
        icon: 'hotel',
        children: [{
          title: '酒店星级',
          children: ['经济型','舒适/三星','高档/四星','豪华/五星']
        }]
      },
      {
        title: '民宿',
        icon: 'homestay',
        children: [{
          title: '热门城市',
          children: ['上海','成都','北京','河南','驻马店','西安','济南','呼和浩特']
        },
        {
          title: '热门房源',
          children: ['复式loft','别墅']
        }]
      },
      {
        title: '猫眼电影',
        icon: 'movie',
        children: [{
          title: '热门影院',
          children: ['万达影城','耀莱成龙国际影城','大地影院','保利国际影城','博纳国际影城','CGV影城','金逸影城','中影国际影城','新华国际影城','橙天嘉禾影城']
        }]
      },

      ]
    }
  },
  methods: {
    menuEnter(item){
      this.curDetail = item ;
    },
    menuLeave(){
      this.timer = setTimeout(() => {
        this.curDetail = null;
      },200);
    },
    detailEnter(){
      clearTimeout(this.timer);
    },
    detailLeave(){
      this.curDetail = null;
    }
  }

}
</script>
