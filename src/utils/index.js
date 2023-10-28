// 去除所有特殊字符
export const removeSpecialCharacters = (text) => {
  let regex = /[^a-zA-Z0-9\u4e00-\u9fa5\s]/g;
  return text.replace(regex, " ");
};
