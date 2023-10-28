<template>
  <div class="addModal">
    <n-modal
      v-model:show="showAddModal"
      style="
        width: 400px;
        position: fixed;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
      "
      to=".addModal"
      preset="dialog"
      title="Dialog"
    >
      <template #header>
        <div>添加账户</div>
      </template>
      <div class="config-content">
        <div class="config-item flex-start">
          <div class="config-title">账户名称</div>
          <n-input
            v-model:value="account.name"
            type="text"
            placeholder="请输入账户名称"
          />
        </div>
        <div class="config-item flex-start">
          <div class="config-title">appid</div>
          <n-input
            v-model:value="account.appid"
            type="text"
            placeholder="请输入appid"
          />
        </div>
        <div class="config-item flex-start">
          <div class="config-title">appkey</div>
          <n-input
            v-model:value="account.appkey"
            type="text"
            placeholder="请输入appkey"
          />
        </div>
        <n-space justify="center">
          <n-button type="success" @click="confirmAdd"> 确定添加 </n-button>
        </n-space>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import { NModal, NInput, NButton, NSpace, useMessage } from "naive-ui";
import { useStorage } from "@/hooks/useStorage";
const { addAccount } = useStorage();
const message = useMessage();
let showAddModal = ref(false);
let account = ref({
  name: "",
  appid: "",
  appkey: "",
});
const open = () => {
  showAddModal.value = true;
};
const confirmAdd = () => {
  console.log("account", account.value);
  let item = {
    name: account.value?.name,
    value: account.value?.name,
    secretInfo: {
      appid: account.value?.appid,
      appkey: account.value?.appkey,
    },
  };
  addAccount(item);
  message.success("添加成功");
};
defineExpose({
  open,
});
</script>

<style lang="scss" scoped>
.config-content {
  margin-top: 20px;
  .config-item {
    margin-bottom: 12px;
    .config-title {
      white-space: nowrap;
      font-weight: 600;
      min-width: 80px;
    }
  }
}
</style>
