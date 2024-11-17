export const fileUpload = async () =>
  await new Promise<File>((resolve, reject) => {
    // 创建一个 input 元素
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none"; // 隐藏 input 元素

    // 将 input 元素添加到文档中
    document.body.appendChild(fileInput);

    // 添加 change 事件监听器，以便在用户选择文件时获取文件
    fileInput.addEventListener("change", (event) => {
      /** @ts-expect-error 忽略错误 */
      const files = event.target.files;
      if (files.length > 0) {
        resolve(files[0]); // 返回选择的第一个文件
      } else {
        reject(new Error("No file selected"));
      }
      // 移除 input 元素
      document.body.removeChild(fileInput);
    });

    // 模拟点击 input，打开文件选择对话框
    fileInput.click();
  });
