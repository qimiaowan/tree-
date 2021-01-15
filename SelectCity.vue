<template>
  <div class="select_city">
    <div class="city" @click="showMenuFun">
      {{selectName}}
    </div>
    <transition name="draw">
      <div class="select" v-show="showMenu" @click="showMenuFun">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'SelectCity',
  data () {
    return {
      showMenu: false
    }
  },
  props: {
    selectName: {
      type: String,
      default: () => '分行'
    }
  },
  methods: {
    showMenuFun () {
      this.showMenu = !this.showMenu
    }
  }
}
</script>

<style scoped>
  .select_city {
    position: relative;
  }
  .city {
    width: 0.76171875rem;
    height: 0.203125rem;
    text-align: center;
    background: #02335F;
    color: #9DC9FF;
    font-size: 0.07421875rem;
    line-height: 0.203125rem;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .select {
    position: absolute;
    z-index: 3;
    left: -0.4rem;
  }
  .draw-enter-active, .draw-leave-active {
    transition: opacity .4s ease-out;
  }
  .draw-enter, .draw-leave-to {
    opacity: 0;
  }

</style>
