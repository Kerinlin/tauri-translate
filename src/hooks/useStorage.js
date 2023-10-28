import { ref, computed } from "vue";
import settings from "@/config/index";

export const useStorage = () => {
  let currentConfig = ref(settings.defaultConfig);
  let accountList = ref(settings.accountList);
  const getStorageConfig = () => {
    currentConfig.value = JSON.parse(localStorage.getItem("config"));
    accountList.value = JSON.parse(localStorage.getItem("account"));
  };

  const setDefaultConfig = () => {
    let defaultConfig = JSON.stringify(settings.defaultConfig);
    let defaultAccount = JSON.stringify(settings.accountList);
    localStorage.setItem("config", defaultConfig);
    localStorage.setItem("account", defaultAccount);
  };

  const setCurrentConfig = (item) => {
    currentConfig.value = item;
    localStorage.setItem("config", JSON.stringify(item));
  };

  // 添加账户
  const addAccount = (item) => {
    accountList.value.push(item);
    localStorage.setItem("account", JSON.stringify(accountList.value));
  };

  // 删除账户
  const removeAccount = (name) => {
    let currentItemIndex = accountList.value.findIndex(
      (item) => item.name == name
    );
    accountList.value.splice(currentItemIndex, 1);
    localStorage.setItem("account", JSON.stringify(accountList.value));
  };

  // 当前设置的信息
  const currentServiceInfo = computed(() => {
    let accountName = currentConfig.value?.account;
    let [accountInfo] = accountList.value.filter(
      (item) => item.value == accountName
    );
    let info = {
      name: currentConfig.value?.account,
      serviceInfo: currentConfig.value?.service,
      typeInfo: currentConfig.value?.type,
      accountInfo: accountInfo?.secretInfo,
    };
    return info;
  });

  return {
    currentConfig,
    accountList,
    getStorageConfig,
    addAccount,
    removeAccount,
    setDefaultConfig,
    currentServiceInfo,
    setCurrentConfig,
  };
};
