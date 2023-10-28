import { ref } from "vue";
import axios from "axios";
import md5 from "md5";
import config from "@/config/index";
import axiosTauriApiAdapter from "axios-tauri-api-adapter";
const client = axios.create({ adapter: axiosTauriApiAdapter });
client.defaults.withCredentials = true;
client.defaults.crossDomain = true;

// 每秒最多请求次数
const concurrentLimit = 10;

// 每段请求之间的延迟
const delayBetweenBatches = 1000;

// 延迟
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 获取百度翻译结果
const getBaiduTransResult = async (options) => {
  try {
    let salt = new Date().getTime();
    let signStr = `${options?.appid}${options?.text}${salt}${options?.appkey}`;
    let sign = md5(signStr);
    let requestParams = {
      q: options?.text,
      appid: options?.appid,
      from: "auto",
      to: "zh",
      salt,
      sign,
    };
    const result = await client.get(config.baiduBaseUrl, {
      params: requestParams,
    });
    let transArr = result?.data?.trans_result;
    if (transArr?.length > 0) {
      console.log("请求翻译参数以及结果", requestParams, transArr);
      return transArr[0].dst;
    }
  } catch (error) {
    console.log("getBaiduTransResult ~ error:", error);
  }
};

export const useTranslate = () => {
  let currentConfig = ref({});

  // 获取翻译结果
  const translateFile = async (file) => {
    let result;
    // 百度翻译服务
    if (currentConfig.value?.serviceInfo == "baidu") {
      let options = {
        text: file?.fileName,
        ...currentConfig.value?.accountInfo,
      };
      result = await getBaiduTransResult(options);
    }

    return {
      transResult: result,
      ...file,
    };
  };

  // 批量限制请求
  const batchRequest = async (files) => {
    for (let i = 0; i < files.length; i += concurrentLimit) {
      const fileBatch = files.slice(i, i + concurrentLimit);
      const translatePromises = fileBatch.map((item) => translateFile(item));
      const result = await Promise.all(translatePromises);
      if (i + concurrentLimit < files.length) {
        await delay(delayBetweenBatches);
      }
      return result;
    }
  };

  // 翻译
  const translate = async (config, files) => {
    currentConfig.value = config;
    const result = await batchRequest(files);
    return result;
  };

  return {
    translate,
    batchRequest,
  };
};
