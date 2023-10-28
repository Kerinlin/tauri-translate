export default {
  serviceList: [
    {
      name: "百度翻译",
      value: "baidu",
    },
    {
      name: "必应翻译",
      value: "bing",
    },
  ],
  typeList: [
    {
      name: "音效",
      value: "sound",
    },
    {
      name: "文件夹",
      value: "dir",
    },
  ],
  accountList: [
    {
      name: "舟舟",
      value: "舟舟",
      secretInfo: {
        appid: "20210503000812126",
        appkey: "42MGCXLR1Z59THGw8c7T",
      },
    },
    {
      name: "欧猪",
      value: "欧猪",
      secretInfo: {
        appid: "20190618000308470",
        appkey: "3Naugqz0ydUXKUh7xXRw",
      },
    },
  ],
  defaultConfig: {
    service: "baidu",
    type: "sound",
    account: "",
  },
  baiduBaseUrl: "https://fanyi-api.baidu.com/api/trans/vip/translate",
};
