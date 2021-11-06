const path = require('path');
const { mkdir, rm, readdir, copyFile } = require('fs/promises');

const delDir = async (folder) => {
  await rm(folder, { force: true, recursive: true });
  await mkdir(folder, { recursive: true });
};

const copyDir = async (src, dest) => {
  await delDir(dest);
  const currentDir = await readdir(src, { withFileTypes: true });

  for (let file of currentDir) {
    if (file.isDirectory()) {
      await copyDir(path.join(src, file.name), path.join(dest, file.name));
    } else {
      await copyFile(path.join(src, file.name), path.join(dest, file.name));
    }
  }
};
copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
