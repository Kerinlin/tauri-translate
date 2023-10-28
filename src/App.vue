<template>
  <n-message-provider>
    <div class="base-container">
      <img src="@/assets/bg.webp" class="bg" />
      <BaseHead></BaseHead>
      <router-view />
    </div>
  </n-message-provider>
</template>

<script setup>
import { NMessageProvider } from "naive-ui";
import BaseHead from "@/components/BaseHead.vue";
</script>

<style lang="scss" scoped>
.base-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
</style>
