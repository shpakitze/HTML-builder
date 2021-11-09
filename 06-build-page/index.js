const path = require('path');
const fs = require('fs');
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

const style = async () => {
  const styleFolder = path.join(__dirname, 'styles');
  const boundleFolder = path.join(__dirname, 'project-dist');
  const boundleFile = path.join(boundleFolder, 'style.css');
  const writeStream = fs.createWriteStream(boundleFile, 'utf-8');
  const appendInfo = (file) => {
    const readableStream = fs.createReadStream(file, 'utf-8');
    readableStream.on('data', (chunk) => writeStream.write(chunk));
  };
  function getFile(folder) {
    fs.readdir(
      folder,
      { encoding: 'utf8', withFileTypes: true },
      (err, files) => {
        if (err) throw err;
        files.forEach((el) => {
          if (el.isFile()) {
            const ext = path.extname(el.name);

            if (ext === '.css') appendInfo(path.join(styleFolder, el.name));
          } else getFile(path.join(folder, el.name));
        });
      }
    );
  }
  getFile(styleFolder);
};

const assets = path.join(__dirname, 'project-dist');

//---------html------//
const reg = /[{]{2}[a-zA-Z0-9]+[}]{2}/g;

const indexFile = async () => {
  const htmlSrc = path.join(__dirname, 'template.html');
  const htmlDes = path.join(__dirname, 'project-dist', 'index.html');
  const writeStream = fs.createWriteStream(htmlDes, 'utf-8');
  const readableStream = fs.createReadStream(htmlSrc, 'utf-8');
  let html = '';
  readableStream.on('data', (chunk) => {
    html += chunk;
  });
  readableStream.on('end', () => {
    const components = html.match(reg);

    for (let i = 0; i < components.length; i++) {
      const name = components[i].slice(2, -2);
      const file = path.join(__dirname, 'components', `${name}.html`);

      const st = fs.createReadStream(file, 'utf-8');
      st.on('error', () => {
        console.log('err!!!!!!!!!');
      });
      let data = '';
      st.on('data', (chunk) => {
        data += chunk;
      });
      st.on('end', () => {
        html = html.replace(components[i], data);
        if (i === components.length - 1) {
          writeStream.write(html);
          writeStream.close();
        }
      });
    }
  });
};
const start = async () => {
  await delDir(assets);
  await copyDir(path.join(__dirname, 'assets'), path.join(assets, 'assets'));
  await style();
  await indexFile();
};

start();
