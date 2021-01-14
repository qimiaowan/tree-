<template>
  <div class="select-menu">
    <div v-for="(item, index) in selectMenuData" :key="index">
        <div class="select-item" @click="checkedFun(item.textObj)" ref="selectItem">
          <span class="select-img" @click.prevent.stop="selectClickFun(item, $refs.selectItem[index].nextElementSibling)">
            <img v-if="item.offShow" width="100%"  src="@/assets/img/jia.png" alt="">
            <img v-else width="100%" src="@/assets/img/jian.png" alt="">
          </span>
          <span>{{item.textObj | cityNameFilter}}</span>
        </div>
        <template v-if="item.children">
          <div v-if="item.children.length" class="select-child">
              <select-menu @checkSelectEmit="selectClickFun" @checkEmit="checkedFun" :selectMenuData="item.children"></select-menu>
          </div>
          <div v-else class="select-child-empty"  @click.prevent.stop="()=>false">
            -- 暂无数据 --
          </div>
        </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectMenu',
  props: {
    selectMenuData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    checkedFun (val) {
      this.$emit('checkEmit', val)
    },
    selectClickFun (val, e) {
      this.$emit('checkSelectEmit', val, e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .select-menu{
    position: absolute;
    max-height: 3.5rem;
    text-align: left;
    z-index: 3;
    top: 0;
    left: 0;
    background: url("../assets/img/bj.png");
    background-size: cover;
    overflow: scroll;
    .select-item{
      display: block;
      width: 1.05rem;
      padding:  .05rem 0 0;
      font-size: 0.08203rem;
      font-family: DINPro;
      font-weight: 500;
      color: #9bd1ff;
      cursor: pointer;
      line-height: 1.2;
      overflow: hidden;
      .select-img {
        width: 0.2rem;
        float: left;
        margin-top: 0;
      }
      span {
        float: left;
        margin-top: .05rem;
        width: 0.85rem;
      }
    }
  }
  .select-child {
    padding-left: .1rem;
    .select-menu {
      position: static;
      width: 100%;
      height: auto;
      max-height: none;
      text-align: left;
      background:none;
      background-size: cover;
      overflow: visible;
    }
  }
  .select-menu-close {
    height: 0;
    overflow: hidden;
  }
  .select-child-empty {
    font-size: 0.08203rem;
    font-family: DINPro;
    font-weight: 500;
    color: #9bd1ff;
    text-align: center;
    line-height: 2;
  }
</style>
