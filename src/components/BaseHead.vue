<template>
  <div class="head-operation" data-tauri-drag-region>
    <div class="operation-wrapper">
      <n-icon
        size="30"
        color="#fbf8f9"
        class="mr-12"
        @click="onMenuClick('settings')"
      >
        <svg
          t="1693040856433"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="8548"
        >
          <path
            d="M829.013333 553.6c1.706667-13.653333 2.986667-27.52 2.986667-41.6s-1.28-27.946667-2.986667-41.6l90.24-70.613333c8.106667-6.4 10.453333-17.92 5.12-27.306667l-85.333333-147.84c-5.333333-9.173333-16.426667-13.013333-26.026667-9.173333l-106.24 42.88c-21.973333-16.853333-46.08-31.146667-72.106666-42.026667L618.666667 103.253333c-1.92-10.026667-10.666667-17.92-21.333334-17.92h-170.666666c-10.666667 0-19.413333 7.893333-21.12 17.92l-16 113.066667a315.733333 315.733333 0 0 0-72.106667 42.026667L211.2 215.466667a21.333333 21.333333 0 0 0-26.026667 9.173333l-85.333333 147.84c-5.333333 9.173333-2.986667 20.693333 5.12 27.306667l90.026667 70.613333C193.28 484.053333 192 497.92 192 512s1.28 27.946667 2.986667 41.6l-90.026667 70.613333c-8.106667 6.4-10.453333 17.92-5.12 27.306667l85.333333 147.84c5.333333 9.173333 16.426667 13.013333 26.026667 9.173333l106.24-42.88c21.973333 16.853333 46.08 31.146667 72.106667 42.026667l16 113.066667c1.706667 10.026667 10.453333 17.92 21.12 17.92h170.666666c10.666667 0 19.413333-7.893333 21.12-17.92l16-113.066667a315.733333 315.733333 0 0 0 72.106667-42.026667l106.24 42.88a21.333333 21.333333 0 0 0 26.026667-9.173333l85.333333-147.84c5.333333-9.173333 2.986667-20.693333-5.12-27.306667l-90.026667-70.613333zM512 661.333333c-82.56 0-149.333333-66.773333-149.333333-149.333333s66.773333-149.333333 149.333333-149.333333 149.333333 66.773333 149.333333 149.333333-66.773333 149.333333-149.333333 149.333333z"
            p-id="8549"
          ></path>
        </svg>
      </n-icon>
      <n-icon
        size="30"
        color="#fbf8f9"
        class="mr-12"
        @click="onMenuClick('min')"
      >
        <svg
          t="1693042644216"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="10514"
        >
          <path
            d="M896 416H128c-35.34 0-64 28.66-64 64v64c0 35.34 28.66 64 64 64h768c35.34 0 64-28.66 64-64v-64c0-35.34-28.66-64-64-64z"
            p-id="10515"
          ></path>
        </svg>
      </n-icon>
      <n-icon size="30" color="#fbf8f9" @click="onMenuClick('close')">
        <svg
          t="1693040000719"
          class="icon-close"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4154"
        >
          <path
            d="M649.179 512l212.839-212.84c37.881-37.881 37.881-99.298 0-137.179s-99.298-37.881-137.179 0L512 374.821l-212.839-212.84c-37.881-37.881-99.298-37.881-137.179 0s-37.881 99.298 0 137.179L374.821 512 161.982 724.84c-37.881 37.881-37.881 99.297 0 137.179 18.94 18.94 43.765 28.41 68.589 28.41 24.825 0 49.649-9.47 68.589-28.41L512 649.179l212.839 212.84c18.94 18.94 43.765 28.41 68.589 28.41s49.649-9.47 68.59-28.41c37.881-37.882 37.881-99.298 0-137.179L649.179 512z"
            p-id="4155"
          ></path>
        </svg>
      </n-icon>
    </div>
    <configModal ref="configInstance"></configModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { NIcon } from "naive-ui";
import { appWindow } from "@tauri-apps/api/window";
import configModal from "@/views/config/index.vue";
let configInstance = ref(null);
const onMenuClick = (type) => {
  let mapActions = {
    close: () => {
      appWindow.close();
    },
    min: () => {
      appWindow.minimize();
    },
    settings: () => {
      configInstance.value.openModal();
    },
  };
  mapActions[type] && mapActions[type]();
};
</script>

<style lang="scss" scoped>
.head-operation {
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  .operation-wrapper {
    margin-right: 10px;
    svg {
      cursor: pointer;
    }
  }
}
</style>
