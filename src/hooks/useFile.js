import { ref, onMounted } from "vue";
import { listen } from "@tauri-apps/api/event";
import { readDir } from "@tauri-apps/api/fs";
import { extname, basename, dirname } from "@tauri-apps/api/path";
import { removeSpecialCharacters } from "@/utils/index";
import { invoke } from "@tauri-apps/api/tauri";
export const useFile = () => {
  let dropedFilePath = ref("");
  let fileList = ref([]);
  let firstLevelDirList = ref([]);
  const getFilesFromDir = async (dir) => {
    let config = JSON.parse(localStorage.getItem("config"));
    const files = await readDir(dir);
    if (files?.length > 0) {
      const truelyFiles = files.filter((item) => item.name != ".DS_Store");
      if (config?.type == "dir") {
        truelyFiles.map(async (item) => {
          let isDirPath = await isDir(item.path);
          if (isDirPath) {
            let parentDir = await dirname(item.path);
            let fileItem = {
              fileName: item.name,
              dir: parentDir,
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
    isDir,
  };
};
