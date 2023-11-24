const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// 将 fs 中的异步方法转换成 Promise 形式
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

// 指定原始目录和目标目录
const sourceDir = path.join(__dirname, '../client/dist')
const targetDir = path.join(__dirname, '/app/view')

// 递归复制文件夹中的所有文件
async function copyFiles(source, target) {
  try {
    // 检查目标目录是否存在，如果不存在则创建
    await mkdir(target, { recursive: true });

    // 读取源目录中的所有文件和子目录
    const files = await readdir(source);

    // 遍历文件和子目录
    for (const file of files) {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);

      // 获取文件或目录的状态
      const stats = await stat(sourcePath);

      if (stats.isFile()) {
        // 如果是文件，则直接复制到目标目录
        await copyFile(sourcePath, targetPath);
        console.log(`Copied file: ${sourcePath} to ${targetPath}`);
      } else if (stats.isDirectory()) {
        // 如果是目录，则递归执行复制操作
        await copyFiles(sourcePath, targetPath);
      }
    }

    console.log('All files copied successfully.');
  } catch (error) {
    console.error('Error occurred while copying files:', error);
  }
}

copyFiles(sourceDir, targetDir)
