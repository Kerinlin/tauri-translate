import { ref, onMounted } from "vue";
import { listen } from "@tauri-apps/api/event";
import { readDir } from "@tauri-apps/api/fs";
import { extname, basename, dirname } from "@tauri-apps/api/path";
import { removeSpecialCharacters } from "@/utils/index";

export const useFile = () => {
  let dropedFilePath = ref("");
  let fileList = ref([]);
  let firstLevelDirList = ref([]);
  const getFilesFromDir = async (dir) => {
    let config = JSON.parse(localStorage.getItem("config"));
    const files = await readDir(dir);
    const truelyFiles = files.filter((item) => item.name != ".DS_Store");
    if (config?.type == "dir") {
      truelyFiles.map(async (item) => {
        // console.log("是文件", item.path);
        let parentDir = await dirname(item.path);
        let fileItem = {
          fileName: item.name,
          dir: parentDir,
        };
        firstLevelDirList.value.push(fileItem);
      });
    } else {
      truelyFiles.map(async (item) => {
        // 是文件夹
        if (item.children) {
          // console.log("是文件夹", item.path);
          getFilesFromDir(item.path);
        } else {
          // console.log("是文件", item.path);
          const fileItem = await normalizePath(item.path);
          fileList.value.push(fileItem);
        }
      });
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
      fileName: fileName,
      ext: `.${ext}`,
    };
  };

  onMounted(() => {
    listen("tauri://file-drop", (event) => {
      dropedFilePath.value = event.payload[0];
      getFilesFromDir(dropedFilePath.value);
    });
  });
  return {
    dropedFilePath,
    getFilesFromDir,
    fileList,
    firstLevelDirList,
  };
};
