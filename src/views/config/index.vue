<template>
  <div class="config-wrapper">
    <n-modal
      v-model:show="showModal"
      style="
        width: 400px;
        position: fixed;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
      "
      to=".config-wrapper"
      preset="dialog"
      title="Dialog"
      :on-after-leave="saveConfig"
    >
      <template #header>
        <div>设置</div>
      </template>
      <div class="config-content">
        <div class="config-item flex-start">
          <div class="config-title">翻译服务</div>
          <n-select
            v-model:value="settings.service"
            :options="config.serviceList"
            label-field="name"
          />
        </div>
        <div class="config-item flex-start">
          <div class="config-title">选择类型</div>
          <n-select
            v-model:value="settings.type"
            :options="config.typeList"
            label-field="name"
          />
        </div>
        <div class="config-item flex-start">
          <div class="config-title">选择账户</div>
          <n-select
            v-model:value="settings.account"
            :options="accountList"
            label-field="name"
            :on-focus="getRemoteAccountList"
          />
        </div>
        <n-space justify="space-between">
          <n-button type="success" @click="addAccount"> 添加账户 </n-button>

          <!-- <n-popconfirm
            negative-text="取消"
            positive-text="确定"
            @negative-click="() => {}"
            @positive-click="deleteAccount"
          >
            <template #trigger>
              <n-button type="error"> 删除此账户 </n-button>
            </template>
            是否删除此账户
          </n-popconfirm> -->
          <n-button type="error" @click="deleteAccount"> 删除此账户 </n-button>
          <n-button type="warning" @click="checkAccount">
            查看剩余字符
          </n-button>
        </n-space>
      </div>
    </n-modal>
    <addInstance ref="add"></addInstance>
  </div>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import { NModal, NSelect, NButton, NSpace, useMessage } from "naive-ui";
import { useStorage } from "@/hooks/useStorage";
import { open } from "@tauri-apps/api/shell";
const { accountList, removeAccount, setCurrentConfig } = useStorage();
const message = useMessage();
import config from "@/config/index";
import addInstance from "./add.vue";
let add = ref(null);
let showModal = ref(false);
let settings = ref({
  service: "baidu",
  type: "sound",
  account: "",
});

const addAccount = () => {
  add.value.open();
};

const deleteAccount = () => {
  if (accountList.value.length == 1) {
    message.warning("当前是最后一个账户");
    return false;
  }
  // console.log(settings.value);
  removeAccount(settings.value.account);
  accountList.value = JSON.parse(localStorage.getItem("account"));
  if (accountList.value?.length > 0) {
    settings.value.account = accountList.value[0]?.name;
    setCurrentConfig(settings.value);
  }
};

const checkAccount = async () => {
  await open("http://api.fanyi.baidu.com/api/trans/product/desktop");
};

const getRemoteAccountList = () => {
  accountList.value = JSON.parse(localStorage.getItem("account"));
  console.log("getRemoteAccountList ~ accountList.value:", accountList.value);
};

const getDefaultConfig = () => {
  settings.value = JSON.parse(localStorage.getItem("config"));
  accountList.value = JSON.parse(localStorage.getItem("account"));
  if (!settings.value?.account && accountList.value?.length > 0) {
    settings.value.account = accountList.value[0]?.name;
  }
  setCurrentConfig(settings.value);
};

const openModal = () => {
  getDefaultConfig();
  showModal.value = true;
};
const saveConfig = () => {
  console.log(settings.value);
  setCurrentConfig(settings.value);
};
defineExpose({
  openModal,
});
</script>

<style lang="scss" scoped>
.config-wrapper {
  .config-content {
    margin-top: 20px;
    .config-item {
      margin-bottom: 12px;
      .config-title {
        white-space: nowrap;
        margin-right: 20px;
        font-weight: 600;
      }
    }
  }
  &:deep(
      .n-popover:not(.n-popover--raw):not(.n-popover--scrollable):not(
          .n-popover--show-header-or-footer
        )
    ) {
    width: 250px;
  }
}
</style>
