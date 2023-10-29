import { ref, onMounted } from "vue";
import { listen } from "@tauri-apps/api/event";
import { readDir } from "@tauri-apps/api/fs";
import { extname, basename, dirname } from "@tauri-apps/api/path";
import { removeSpecialCharacters } from "@/utils/index";
import { invoke } from "@tauri-apps/api/tauri";
import { useMessage } from "naive-ui";
import { join } from "@tauri-apps/api/path";

export const useFile = () => {
  const message = useMessage();
  let dropedFilePath = ref("");
  let fileList = ref([]);
  let firstLevelDirList = ref([]);
  const getFilesFromDir = async (dir) => {
    let config = JSON.parse(localStorage.getItem("config"));
    const files = await readDir(dir);
    if (files?.length > 0) {
      const truelyFiles = files.filter((item) => item.name != ".DS_Store");
      if (config?.type == "dir") {
        const isNonDir = truelyFiles.every((item) => !item.children);
        if (isNonDir) {
          message.warning("当前目录下没有文件夹");
          return false;
        }
        console.log("getFilesFromDir ~ isNonDir:", isNonDir);
        truelyFiles.map(async (item) => {
          let isDirPath = await isDir(item.path);
          if (isDirPath) {
            let parentDir = await dirname(item.path);
            const fileName = item.name && removeSpecialCharacters(item.name);
            let fileItem = {
              fileName: fileName,
              dir: parentDir,
              originName: item.name,
            };
            firstLevelDirList.value.push(fileItem);
          }
        });
      } else {
        truelyFiles.map(async (item) => {
          let isDirPath = await isDir(item.path);
          // console.log(`路径${item.path}是文件夹吗,${isDirPath}`);
          if (isDirPath) {
            getFilesFromDir(item.path);
          } else {
            const fileItem = await normalizePath(item.path);
            fileList.value.push(fileItem);
          }
        });
      }
    }
  };

  const normalizePath = async (path) => {
    let file = await basename(path);
    let parentDir = await dirname(path);
    let ext = await extname(path);
    let name = file.split(`.${ext}`)[0];
    const fileName = name && removeSpecialCharacters(name);
    return {
      dir: parentDir,
      fileName: fileName || "",
      ext: ext ? `.${ext}` : "",
      originName: name,
    };
  };

  const isDir = async (path) => {
    let isDirPath = await invoke("is_directory", { path: path });
    if (isDirPath) {
      return true;
    } else {
      return false;
    }
  };

  const handleNewFileName = async (item) => {
    let newName = "";
    const transResult = extractChineseCharacters(item.transResult);
    const prefix = transResult ? `${transResult}-` : "";
    const suffix = item.type !== "dir" ? `【】${item.ext}` : "";
    newName = `${prefix}${item.originName}${suffix}`;
    let newPath = await join(item.dir, newName);
    return newPath;
  };

  const extractChineseCharacters = (str) => {
    const pattern = /[\u4e00-\u9fa5]+/g;
    const matches = str.match(pattern);
    return matches ? matches.join("") : "";
  };

  const handleDropFiles = async (files) => {
    files.map(async (item) => {
      const fileItem = await normalizePath(item);
      fileList.value.push(fileItem);
    });
  };

  onMounted(() => {
    listen("tauri://file-drop", (event) => {
      console.log("拖入文件", event.payload);
      const files = event.payload;
      if (files?.length > 1) {
        console.log("拖入了多个文件");
        handleDropFiles(files);
        dropedFilePath.value = `拖入了文件${event.payload[0]}等${files.length}个文件`;
      } else {
        console.log("拖入文件夹");
        dropedFilePath.value = `拖入文件夹${event.payload[0]}`;
        getFilesFromDir(dropedFilePath.value);
      }
    });
  });
  return {
    dropedFilePath,
    getFilesFromDir,
    fileList,
    firstLevelDirList,
    isDir,
    handleNewFileName,
  };
};
