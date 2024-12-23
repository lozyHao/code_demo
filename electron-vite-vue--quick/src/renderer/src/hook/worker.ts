// worker
self.onmessage = (event) => {
  const { allList, chooseList, callbackId } = event.data;
  console.log("worker接受的数据222", allList, chooseList);
  const result = processFiles(chooseList, allList);
  postMessage({ result, callbackId });
};

const processFiles = (list: File[], files: File[]) => {
  let str = "加载完成";
  const arrList: File[] = [];

  if (arrList.length >= 20) {
    str = "文件数量超出限制[最大20张]，请删除后重新上传";
    return {
      list: arrList,
      str,
    };
  }

  for (const file of list) {
    // 校验文件是否重复
    const index = files.findIndex(
      (item) => item.name === file.name && item.size === file.size,
    );
    if (arrList.length + files.length >= 20) {
      str = "文件数量超出限制[最大20张]，请删除后重新上传";
      break;
    }

    if (index > -1) {
      str = "文件重复，请修改后重新上传";
      continue;
    }

    // 正则校验文件是否是 "image/jpeg,image/png,image/jpg"
    const reg = new RegExp(`image\/(jpeg|png|jpg)`);
    if (!reg.test(file.type)) {
      str = "文件格式不正确，请上传jpeg/png/jpg图片文件";
      continue;
    }

    if (file.size > 30 * 1024 * 1024) {
      str = "文件大小不能超过 30MB";
      continue;
    }

    arrList.push(file);
  }

  return {
    list: arrList,
    str,
  };
};
