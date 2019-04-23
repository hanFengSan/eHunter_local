<template>
  <div id="app">
    <transition name="slide-fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ehunter_local"
};
</script>

<style lang="scss" scoped>
$animation_time: 0.5s;

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all $animation_time ease;
}
.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateX(100px);
  opacity: 0;
}
</style>
