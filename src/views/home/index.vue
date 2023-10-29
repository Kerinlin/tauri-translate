<template>
  <div class="home-wrapper">
    <div class="info-wrapper center-item">
      <div class="info-item">
        <n-ellipsis class="item">
          {{ dropedFilePath }}
        </n-ellipsis>
      </div>
    </div>
    <div v-if="loading" class="loader"></div>
    <div class="btn-wrapper" @click="startTrans">开始翻译</div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { NEllipsis, useMessage } from "naive-ui";
import { useStorage } from "@/hooks/useStorage";
import { useFile } from "@/hooks/useFile";
import { useTranslate } from "@/hooks/useTranslate";
import { join } from "@tauri-apps/api/path";
import { renameFile } from "@tauri-apps/api/fs";
const message = useMessage();
const { dropedFilePath, fileList, firstLevelDirList, handleNewFileName } =
  useFile();
const { translate } = useTranslate();
const {
  setDefaultConfig,
  getStorageConfig,
  currentServiceInfo,
  currentConfig,
} = useStorage();
let loading = ref(false);
const startTrans = async () => {
  if (!dropedFilePath.value) {
    message.error("请先拖入文件夹");
    return false;
  }
  try {
    getStorageConfig();
    loading.value = true;
    if (currentConfig.value?.type == "dir") {
      console.log("翻译文件夹", firstLevelDirList.value);
      const transResult = await translate(
        currentServiceInfo.value,
        firstLevelDirList.value
      );
      transResult.map(async (item) => {
        if (item.transResult) {
          let transItem = {
            type: "dir",
            ...item,
          };
          let oldFilePath = await join(item.dir, `${item.originName}`);
          const newFilePath = await handleNewFileName(transItem);
          await renameFile(oldFilePath, newFilePath);
        }
      });
    } else {
      console.log("翻译文件", fileList.value);
      const transResult = await translate(
        currentServiceInfo.value,
        fileList.value
      );
      transResult.map(async (item) => {
        if (item.transResult) {
          let transItem = {
            type: "file",
            ...item,
          };
          let oldFilePath = await join(
            item.dir,
            `${item.originName}${item.ext}`
          );
          const newFilePath = await handleNewFileName(transItem);
          await renameFile(oldFilePath, newFilePath);
        }
      });
    }
  } catch (error) {
    console.log("startTrans ~ error:", error);
    message.error("翻译出错", error);
  } finally {
    setTimeout(() => {
      dropedFilePath.value = "";
      loading.value = false;
    }, 1000);
  }
};

// 首次加载没有设置，读取默认设置
const getConfig = () => {
  const config = localStorage.getItem("config");
  if (!config) {
    setDefaultConfig();
  }
  getStorageConfig();
};

const addFile = (e) => {
  console.log("e", e);
  const file = [...e.dataTransfer.files];
  console.log("addFile ~ file:", file);
};

onBeforeMount(() => {
  getConfig();
});
</script>

<style lang="scss" scoped>
.home-wrapper {
  width: 100%;
  height: calc(100vh - 50px);
  .info-wrapper {
    width: 100%;
    .info-item {
      margin-top: 20px;
      max-width: 320px;
      color: #fff;
    }
  }
  .btn-wrapper {
    width: 200px;
    height: 45px;
    text-align: center;
    line-height: 45px;
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    transition: all 0.2s ease-out;
    border: 1px dashed #fff;
    cursor: pointer;
    font-size: 16px;
    &:hover {
      border-color: rgb(91, 75, 95);
      color: rgb(91, 75, 95);
      border-radius: 16px 4px;
    }
  }
}

.loader {
  margin: 0 auto;
  width: 50px;
  --b: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 1px;
  background: conic-gradient(#0000 10%, #fff) content-box;
  -webkit-mask: repeating-conic-gradient(
      #0000 0deg,
      #000 1deg 20deg,
      #0000 21deg 36deg
    ),
    radial-gradient(
      farthest-side,
      #0000 calc(100% - var(--b) - 1px),
      #000 calc(100% - var(--b))
    );
  -webkit-mask-composite: destination-in;
  mask-composite: intersect;
  animation: l4 0.5s infinite steps(10);
}
@keyframes l4 {
  to {
    transform: rotate(1turn);
  }
}
</style>
